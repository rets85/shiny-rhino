"""
Shiny Rhino - Location Page Generator
Generates static HTML location pages using 3-part parallel GPT content generation.
Based on the US Turf Direct generator architecture.

Usage:
  python generate_locations.py                    # Generate all states
  python generate_locations.py --states Texas     # Single state
  python generate_locations.py --test             # Test mode (3 pages)
"""

import os
import re
import csv
import json
import time
import argparse
from datetime import datetime
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed
from threading import Lock
from openai import OpenAI

# ==================================
# CONFIGURATION
# ==================================
PAGE_WORKERS = 50          # Concurrent pages being generated
BATCH_SIZE = 100           # Pages per batch
RESUME_MODE = True         # Skip already-completed pages
TESTMODE = False           # True = 3 test pages only

# Paths
BASE_DIR = Path(__file__).parent
OUTPUT_DIR = BASE_DIR.parent / "public" / "locations"
LOCATIONS_CSV = BASE_DIR / "locations.csv"
TEMPLATE_FILE = BASE_DIR / "location-template.html"
PROGRESS_FILE = BASE_DIR / "generation_progress.json"
PROMPT_DIR = BASE_DIR / "prompts"

# Site
SITE_URL = "https://myshinyrhino.com"

# OpenAI
client = OpenAI()  # Uses OPENAI_API_KEY env var
MODEL = "gpt-5"
MAX_TOKENS = 4000

# ==================================
# PROGRESS TRACKING
# ==================================
progress_lock = Lock()

def load_progress():
    if PROGRESS_FILE.exists():
        return json.loads(PROGRESS_FILE.read_text(encoding="utf-8"))
    return {"completed": {}, "failed": {}, "last_updated": ""}

def save_progress(progress):
    progress["last_updated"] = datetime.now().isoformat()
    PROGRESS_FILE.write_text(json.dumps(progress, indent=2), encoding="utf-8")

def mark_completed(progress, state_slug, city_slug):
    with progress_lock:
        if state_slug not in progress["completed"]:
            progress["completed"][state_slug] = []
        if city_slug not in progress["completed"][state_slug]:
            progress["completed"][state_slug].append(city_slug)
        save_progress(progress)

def mark_failed(progress, state_slug, city_slug, error):
    with progress_lock:
        if state_slug not in progress["failed"]:
            progress["failed"][state_slug] = []
        progress["failed"][state_slug].append({"city": city_slug, "error": str(error)[:200]})
        save_progress(progress)

def is_completed(progress, state_slug, city_slug):
    return city_slug in progress.get("completed", {}).get(state_slug, [])

# ==================================
# SLUG HELPERS
# ==================================
def slugify(text):
    """Convert text to URL-friendly slug."""
    slug = text.lower().strip()
    slug = re.sub(r"['\u2019]", "", slug)  # Remove apostrophes
    slug = re.sub(r"[^a-z0-9]+", "-", slug)
    slug = re.sub(r"-+", "-", slug).strip("-")
    # Handle reserved names
    if slug in ("index", "config", "template", "templates"):
        slug = slug + "-city"
    return slug

# ==================================
# LOAD DATA
# ==================================
def load_locations(selected_states=None):
    """Load cities from CSV, optionally filtered by state."""
    locations = []
    with open(LOCATIONS_CSV, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            state = row["State"].strip()
            city = row["City"].strip()
            abbrev = row["ABB"].strip()
            if selected_states and state not in selected_states:
                continue
            if not city or not state:
                continue
            locations.append({
                "state": state,
                "state_abbrev": abbrev,
                "city": city,
                "state_slug": slugify(state),
                "city_slug": slugify(city),
            })
    return locations

def load_template():
    return TEMPLATE_FILE.read_text(encoding="utf-8")

def load_prompts():
    return {
        "part1": (PROMPT_DIR / "part1.md").read_text(encoding="utf-8"),
        "part2": (PROMPT_DIR / "part2.md").read_text(encoding="utf-8"),
        "part3": (PROMPT_DIR / "part3.md").read_text(encoding="utf-8"),
    }

# ==================================
# CONTENT GENERATION
# ==================================
def fill_prompt(prompt_template, loc):
    """Replace placeholders in prompt with location data."""
    return (prompt_template
        .replace("{city}", loc["city"])
        .replace("{state}", loc["state"])
        .replace("{state_abbrev}", loc["state_abbrev"])
        .replace("{city_slug}", loc["city_slug"])
        .replace("{state_slug}", loc["state_slug"])
    )

def generate_part(prompt_text, loc, part_name):
    """Call GPT to generate one content part."""
    filled = fill_prompt(prompt_text, loc)
    try:
        response = client.chat.completions.create(
            model=MODEL,
            messages=[{"role": "user", "content": filled}],
            max_tokens=MAX_TOKENS,
            temperature=0.7,
        )
        content = response.choices[0].message.content.strip()
        # Clean up markdown artifacts
        content = re.sub(r"^```html?\s*", "", content)
        content = re.sub(r"\s*```$", "", content)
        content = re.sub(r"<!DOCTYPE[^>]*>", "", content, flags=re.IGNORECASE)
        content = re.sub(r"</?html[^>]*>", "", content, flags=re.IGNORECASE)
        content = re.sub(r"</?head[^>]*>", "", content, flags=re.IGNORECASE)
        content = re.sub(r"</?body[^>]*>", "", content, flags=re.IGNORECASE)
        content = re.sub(r"<title[^>]*>.*?</title>", "", content, flags=re.IGNORECASE)
        return content
    except Exception as e:
        print(f"  [ERROR] {part_name} for {loc['city']}, {loc['state']}: {e}")
        return None

def generate_page_content(loc, prompts):
    """Generate all 3 parts in parallel for a single location."""
    parts = {}
    with ThreadPoolExecutor(max_workers=3) as executor:
        futures = {
            executor.submit(generate_part, prompts["part1"], loc, "part1"): "part1",
            executor.submit(generate_part, prompts["part2"], loc, "part2"): "part2",
            executor.submit(generate_part, prompts["part3"], loc, "part3"): "part3",
        }
        for future in as_completed(futures):
            part_name = futures[future]
            parts[part_name] = future.result()

    # Check all parts generated
    if any(v is None for v in parts.values()):
        return None

    # Combine content
    combined = parts["part1"] + "\n\n" + parts["part2"] + "\n\n" + parts["part3"]
    return combined

# ==================================
# PAGE ASSEMBLY
# ==================================
def extract_schemas(content):
    """Extract schema script blocks from generated content."""
    schemas = re.findall(r'<script type="application/ld\+json">.*?</script>', content, re.DOTALL)
    # Remove schemas from content
    clean_content = re.sub(r'<script type="application/ld\+json">.*?</script>', '', content, flags=re.DOTALL)
    return clean_content.strip(), "\n".join(schemas)

def build_location_links(loc, all_locations):
    """Generate HTML links to other cities in the same state."""
    same_state = [l for l in all_locations
                  if l["state_slug"] == loc["state_slug"] and l["city_slug"] != loc["city_slug"]]
    same_state.sort(key=lambda x: x["city"])
    links = []
    for city in same_state[:100]:  # Limit to 100 cities
        href = f"/locations/{city['state_slug']}/{city['city_slug']}"
        links.append(f'<a href="{href}">{city["city"]}</a>')
    return "\n".join(links)

def assemble_page(template, loc, content, location_links):
    """Fill template with content and metadata."""
    clean_content, schema_markup = extract_schemas(content)

    html = template
    html = html.replace("{{city_display}}", loc["city"])
    html = html.replace("{{state_display}}", loc["state"])
    html = html.replace("{{state_abbrev}}", loc["state_abbrev"])
    html = html.replace("{{city_slug}}", loc["city_slug"])
    html = html.replace("{{state_slug}}", loc["state_slug"])
    html = html.replace("{{generated_content}}", clean_content)
    html = html.replace("{{schema_markup}}", schema_markup)
    html = html.replace("{{location_links}}", location_links)

    return html

# ==================================
# VALIDATION
# ==================================
def validate_page(html, loc):
    """Validate generated page has required elements."""
    errors = []
    if "<h1" not in html.lower():
        errors.append("Missing H1 tag")
    if loc["city"].lower() not in html.lower():
        errors.append("City name not found in content")
    if "application/ld+json" not in html:
        errors.append("Missing schema markup")
    if 'href="/services/carpet"' not in html:
        errors.append("Missing carpet service link")
    return errors

# ==================================
# PAGE WORKER
# ==================================
def process_page(loc, template, prompts, all_locations, progress):
    """Generate and save a single location page."""
    city_label = f"{loc['city']}, {loc['state_abbrev']}"

    # Skip if already done
    if RESUME_MODE and is_completed(progress, loc["state_slug"], loc["city_slug"]):
        return ("skipped", city_label)

    try:
        # Generate content
        content = generate_page_content(loc, prompts)
        if not content:
            mark_failed(progress, loc["state_slug"], loc["city_slug"], "Content generation failed")
            return ("failed", city_label)

        # Build location links
        location_links = build_location_links(loc, all_locations)

        # Assemble final page
        html = assemble_page(template, loc, content, location_links)

        # Validate
        errors = validate_page(html, loc)
        if errors:
            print(f"  [WARN] {city_label}: {', '.join(errors)}")

        # Save
        output_dir = OUTPUT_DIR / loc["state_slug"]
        output_dir.mkdir(parents=True, exist_ok=True)
        output_file = output_dir / f"{loc['city_slug']}.html"
        output_file.write_text(html, encoding="utf-8")

        mark_completed(progress, loc["state_slug"], loc["city_slug"])
        return ("success", city_label)

    except Exception as e:
        mark_failed(progress, loc["state_slug"], loc["city_slug"], str(e))
        return ("failed", f"{city_label}: {e}")

# ==================================
# MAIN
# ==================================
def main():
    parser = argparse.ArgumentParser(description="Generate Shiny Rhino location pages")
    parser.add_argument("--states", nargs="+", help="Generate only these states")
    parser.add_argument("--test", action="store_true", help="Test mode (3 pages only)")
    parser.add_argument("--workers", type=int, default=PAGE_WORKERS, help="Concurrent page workers")
    parser.add_argument("--no-resume", action="store_true", help="Regenerate all pages")
    args = parser.parse_args()

    global TESTMODE, RESUME_MODE, PAGE_WORKERS
    if args.test:
        TESTMODE = True
    if args.no_resume:
        RESUME_MODE = False
    PAGE_WORKERS = args.workers

    print("=" * 60)
    print("SHINY RHINO - Location Page Generator")
    print("=" * 60)

    # Load data
    locations = load_locations(args.states)
    template = load_template()
    prompts = load_prompts()
    progress = load_progress()

    if TESTMODE:
        locations = locations[:3]

    total = len(locations)
    already_done = sum(1 for l in locations if is_completed(progress, l["state_slug"], l["city_slug"]))

    print(f"Total cities: {total}")
    print(f"Already completed: {already_done}")
    print(f"To generate: {total - already_done}")
    print(f"Workers: {PAGE_WORKERS}")
    print(f"Resume mode: {RESUME_MODE}")
    print(f"Model: {MODEL}")
    print(f"Output: {OUTPUT_DIR}")
    print()

    if total - already_done == 0:
        print("Nothing to generate. All pages complete!")
        return

    # Process in batches
    stats = {"success": 0, "failed": 0, "skipped": 0}
    start_time = time.time()

    for batch_start in range(0, len(locations), BATCH_SIZE):
        batch = locations[batch_start:batch_start + BATCH_SIZE]
        batch_num = batch_start // BATCH_SIZE + 1
        total_batches = (len(locations) + BATCH_SIZE - 1) // BATCH_SIZE
        print(f"--- Batch {batch_num}/{total_batches} ({len(batch)} cities) ---")

        with ThreadPoolExecutor(max_workers=PAGE_WORKERS) as executor:
            futures = {
                executor.submit(process_page, loc, template, prompts, locations, progress): loc
                for loc in batch
            }
            for future in as_completed(futures):
                status, label = future.result()
                stats[status] += 1
                if status == "success":
                    print(f"  [OK] {label}")
                elif status == "failed":
                    print(f"  [FAIL] {label}")

        elapsed = time.time() - start_time
        done = stats["success"] + stats["failed"]
        if done > 0:
            rate = elapsed / done
            remaining = (total - already_done - done) * rate
            print(f"  Progress: {done}/{total - already_done} | "
                  f"~{rate:.1f}s/page | "
                  f"~{remaining/60:.0f}m remaining")

    elapsed = time.time() - start_time
    print()
    print("=" * 60)
    print(f"COMPLETE in {elapsed/60:.1f} minutes")
    print(f"  Success: {stats['success']}")
    print(f"  Failed:  {stats['failed']}")
    print(f"  Skipped: {stats['skipped']}")
    print("=" * 60)

if __name__ == "__main__":
    main()
