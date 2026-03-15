#!/usr/bin/env python3
"""
Generate location-specific banner images for Shiny Rhino carpet cleaning pages.
Uses a base carpet cleaning photo and overlays city/state text.
"""

from PIL import Image, ImageDraw, ImageFont
import os
import re

# Configuration
FONT_SIZE = 56
BASE_IMAGE = r"C:\Users\User\.openclaw\media\inbound\file_136---52d38ce9-1d11-4351-9713-7cb08dee8d7f.jpg"
OUTPUT_DIR = r"C:\Users\User\Dropbox\coding\Shiny Rhino\public\locations\images"
FONT_PATH = "C:/Windows/Fonts/arialbd.ttf"

# 5 test locations: (city_display, state_abbrev, state_slug, city_slug)
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
        print(f"Warning: Could not load {FONT_PATH}, using default font")
        return ImageFont.load_default()


def generate_image(city, state_abbrev, state_slug, city_slug):
    font = get_font(FONT_SIZE)

    img = Image.open(BASE_IMAGE).convert("RGB")
    draw = ImageDraw.Draw(img)

    text = f"CARPET CLEANING IN {city.upper()}, {state_abbrev.upper()}"

    # Calculate text dimensions
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]

    img_width, img_height = img.size

    # Center horizontally, upper third vertically
    x = (img_width - text_width) // 2
    y = img_height // 4 - text_height // 2

    # Shadow (dark, offset 3px)
    shadow_offset = 3
    draw.text((x + shadow_offset, y + shadow_offset), text, fill=(0, 0, 0, 200), font=font)
    # Extra shadow passes for bolder effect
    draw.text((x - shadow_offset, y + shadow_offset), text, fill=(0, 0, 0, 150), font=font)
    draw.text((x + shadow_offset, y - shadow_offset), text, fill=(0, 0, 0, 150), font=font)

    # White main text
    draw.text((x, y), text, fill="white", font=font)

    filename = f"{state_slug}_{city_slug}_cleaning.webp"
    output_path = os.path.join(OUTPUT_DIR, filename)
    img.save(output_path, "WEBP", quality=88)
    print(f"  OK {filename}")
    return filename


def main():
    print("=" * 60)
    print("  SHINY RHINO - Location Image Generator")
    print("=" * 60)
    print(f"Base image : {BASE_IMAGE}")
    print(f"Output dir : {OUTPUT_DIR}")
    print(f"Font size  : {FONT_SIZE}px")
    print()

    for city, state_abbrev, state_slug, city_slug in LOCATIONS:
        print(f"Generating: {city}, {state_abbrev}")
        generate_image(city, state_abbrev, state_slug, city_slug)

    print()
    print(f"Done! {len(LOCATIONS)} images saved to:")
    print(f"  {OUTPUT_DIR}")
    print("=" * 60)


if __name__ == "__main__":
    main()
