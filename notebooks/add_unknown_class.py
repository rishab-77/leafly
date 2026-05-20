import os
import random
import shutil
from pathlib import Path

# Paths
EXTRA_DIR  = Path("data/extra/train")   # source of unknown images
OUTPUT_DIR = Path("data")

# How many total unknown images to use
TOTAL = 600
SPLITS = {"train": 0.70, "val": 0.15, "test": 0.15}

random.seed(42)

# Collect all images from ALL extra species folders
all_images = []
for species_folder in sorted(EXTRA_DIR.iterdir()):
    if not species_folder.is_dir():
        continue
    imgs = list(species_folder.glob("*.jpg")) + \
           list(species_folder.glob("*.JPG")) + \
           list(species_folder.glob("*.png"))
    all_images.extend(imgs)
    print(f"  {species_folder.name}: {len(imgs)} images")

print(f"\nTotal available: {len(all_images)} images")

# Randomly sample TOTAL images
random.shuffle(all_images)
selected = all_images[:TOTAL]
print(f"Selecting: {len(selected)} images for unknown_other class")

# Split
n_train = int(TOTAL * SPLITS["train"])
n_val   = int(TOTAL * SPLITS["val"])

splits = {
    "train": selected[:n_train],
    "val":   selected[n_train:n_train + n_val],
    "test":  selected[n_train + n_val:]
}

# Copy to data/
for split, files in splits.items():
    dest = OUTPUT_DIR / split / "unknown_other"
    dest.mkdir(parents=True, exist_ok=True)
    for f in files:
        shutil.copy(f, dest / f.name)
    print(f"  {split}: {len(files)} images → {dest}")

print("\n✅ unknown_other class added successfully!")
print(f"Total classes now: 16 (15 diseases + unknown_other)")