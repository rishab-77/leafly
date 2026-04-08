import os
import shutil
import random
from pathlib import Path

# If your classes are inside PlantVillage/PlantVillage/, set this:
SOURCE_DIR = Path("PlantVillage/PlantVillage")
# If they're directly in PlantVillage/, use this instead:
# SOURCE_DIR = Path("PlantVillage")

OUTPUT_DIR = Path("data")
SPLITS = {"train": 0.70, "val": 0.15, "test": 0.15}
random.seed(42)

for class_folder in sorted(SOURCE_DIR.iterdir()):
    if not class_folder.is_dir():
        continue
    images = list(class_folder.glob("*.jpg")) + list(class_folder.glob("*.JPG")) + list(class_folder.glob("*.png"))
    random.shuffle(images)
    n = len(images)
    n_train = int(n * SPLITS["train"])
    n_val = int(n * SPLITS["val"])

    splits = {
        "train": images[:n_train],
        "val": images[n_train:n_train + n_val],
        "test": images[n_train + n_val:]
    }

    for split, files in splits.items():
        dest = OUTPUT_DIR / split / class_folder.name
        dest.mkdir(parents=True, exist_ok=True)
        for f in files:
            shutil.copy(f, dest / f.name)

    print(f"{class_folder.name}: {n} images → train:{len(splits['train'])} val:{len(splits['val'])} test:{len(splits['test'])}")

print("\n✅ Split complete!")