IMAGE UPLOAD GUIDE — EnergHer
================================

Place your image files in this folder. The website will automatically
use them when they're available. If missing, CSS placeholders will show.

REQUIRED IMAGES:
──────────────────
1. logo.png          — Brand logo for the navigation bar
                       (falls back to text "EnergHer" if missing)

2. can-her-front.png — EnergHer front label design
                       (used on hero, product page, carousel, orbits)

3. can-her-back.png  — EnergHer back label design
                       (for future 3D rotation feature)

4. can-him-front.png — EnergHim front label design
                       (used on product page, carousel, orbits)

5. can-him-back.png  — EnergHim back label design
                       (for future 3D rotation feature)

RECOMMENDED SPECS:
──────────────────
- Can images: PNG with transparent background, ~600x1200px or larger
- Logo: PNG with transparent background, ~400px wide
- Event photos: JPG/PNG, 1600x900px (16:9 ratio)

NOTES:
──────
- All can placeholders use CSS-drawn aluminum cans as fallback
- Images are referenced with onerror handlers — they silently
  fall back to CSS if the file doesn't exist
- No rebuild needed — just drop files here and refresh the page
