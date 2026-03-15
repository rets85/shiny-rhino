#!/usr/bin/env python3
"""
Generate location-specific banner images for Shiny Rhino carpet cleaning pages.
Uses a base carpet cleaning photo and overlays city/state text.
Optimized for SEO: resized to exact banner dimensions, compressed webp.
"""

from PIL import Image, ImageDraw, ImageFont
import os

# Configuration
BANNER_WIDTH = 800
BANNER_HEIGHT = 288  # 10% shorter than 320
FONT_SIZE = 36
OVERLAY_OPACITY = 102  # ~40% opacity dark overlay (0.4 * 255)
BASE_IMAGE = r"C:\Users\User\.openclaw\media\inbound\file_136---52d38ce9-1d11-4351-9713-7cb08dee8d7f.jpg"
OUTPUT_DIR = r"C:\Users\User\Dropbox\coding\Shiny Rhino\public\locations\images"
# Inter Bold font - bundled in location-generator folder
FONT_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "Inter-Bold.ttf")

LOCATIONS = [
    ("Los Angeles", "CA", "california", "los-angeles"),
    ("Denver",      "CO", "colorado",   "denver"),
    ("Miami",       "FL", "florida",    "miami"),
    ("Brooklyn",    "NY", "new-york",   "brooklyn"),
    ("Austin",      "TX", "texas",      "austin"),
]

os.makedirs(OUTPUT_DIR, exist_ok=True)


def get_font(size):
    try:
        return ImageFont.truetype(FONT_PATH, size)
    except OSError:
        return ImageFont.load_default()


def generate_image(city, state_abbrev, state_slug, city_slug):
    font = get_font(FONT_SIZE)

    img = Image.open(BASE_IMAGE).convert("RGB")

    # Resize to exact banner dimensions using cover crop
    # Scale to fill, then center-crop
    src_w, src_h = img.size
    scale = max(BANNER_WIDTH / src_w, BANNER_HEIGHT / src_h)
    new_w = int(src_w * scale)
    new_h = int(src_h * scale)
    img = img.resize((new_w, new_h), Image.LANCZOS)

    # Center crop to exact banner size
    left = (new_w - BANNER_WIDTH) // 2
    top = (new_h - BANNER_HEIGHT) // 2
    img = img.crop((left, top, left + BANNER_WIDTH, top + BANNER_HEIGHT))

    # Apply semi-transparent dark overlay for text readability
    overlay = Image.new("RGBA", (BANNER_WIDTH, BANNER_HEIGHT), (0, 0, 0, OVERLAY_OPACITY))
    img = img.convert("RGBA")
    img = Image.alpha_composite(img, overlay)
    img = img.convert("RGB")

    draw = ImageDraw.Draw(img)
    text = f"CARPET CLEANING IN {city.upper()}, {state_abbrev.upper()}"

    # Calculate text dimensions
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    # If text is too wide, reduce font size dynamically
    actual_font = font
    actual_size = FONT_SIZE
    while text_width > BANNER_WIDTH - 40 and actual_size > 20:
        actual_size -= 2
        actual_font = get_font(actual_size)
        bbox = draw.textbbox((0, 0), text, font=actual_font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]

    # Center text both horizontally and vertically
    x = (BANNER_WIDTH - text_width) // 2
    y = (BANNER_HEIGHT - text_height) // 2

    # Clean white text - no shadow/stroke needed thanks to dark overlay
    draw.text((x, y), text, fill="white", font=actual_font)

    filename = f"{state_slug}_{city_slug}_cleaning.webp"
    output_path = os.path.join(OUTPUT_DIR, filename)
    img.save(output_path, "WEBP", quality=80)
    size_kb = os.path.getsize(output_path) / 1024
    print(f"  OK {filename} ({BANNER_WIDTH}x{BANNER_HEIGHT}, font {actual_size}px, {size_kb:.0f}KB)")
    return filename


def main():
    print("=" * 60)
    print("  SHINY RHINO - Location Image Generator")
    print("=" * 60)

    for city, state_abbrev, state_slug, city_slug in LOCATIONS:
        generate_image(city, state_abbrev, state_slug, city_slug)

    print(f"\nDone! {len(LOCATIONS)} images generated.")


if __name__ == "__main__":
    main()
