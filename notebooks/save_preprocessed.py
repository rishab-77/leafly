"""
save_preprocessed.py
--------------------
Run this script (or paste it as a notebook cell) to save
the segmented and CLAHE-enhanced versions of every image
in data/train/, data/val/, and data/test/ to:

    data/segmented/<split>/<class>/
    data/clahe/<split>/<class>/

The script is idempotent: already-saved files are skipped.
"""

import os
import sys
import cv2
import numpy as np
from PIL import Image

# ── Make sure the notebook's repo root is on sys.path ──────────────────────
repo_root = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, repo_root)

# ── Paths (mirror the notebook's Cell 3 setup) ─────────────────────────────
DATA_ROOT = os.path.join(repo_root, "data")
TRAIN_DIR = os.path.join(DATA_ROOT, "train")
VAL_DIR   = os.path.join(DATA_ROOT, "val")
TEST_DIR  = os.path.join(DATA_ROOT, "test")

SEG_ROOT   = os.path.join(DATA_ROOT, "segmented")
CLAHE_ROOT = os.path.join(DATA_ROOT, "clahe")


# ── Preprocessing classes (copied from the notebook's Cell 4) ──────────────

class LeafSegmentation:
    """Segment leaf from background using HSV colour space."""

    def __call__(self, img: Image.Image) -> Image.Image:
        img_cv = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
        hsv    = cv2.cvtColor(img_cv, cv2.COLOR_BGR2HSV)

        lower_green1 = np.array([25,  30,  30])
        upper_green1 = np.array([95, 255, 255])
        mask = cv2.inRange(hsv, lower_green1, upper_green1)

        kernel_close = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15))
        kernel_open  = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5,  5))

        mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel_close, iterations=3)
        mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN,  kernel_open,  iterations=1)
        mask = self._keep_largest_contour(mask)
        mask = self._fill_holes(mask)

        mask_blur = cv2.GaussianBlur(mask, (7, 7), 0)
        _, mask_clean = cv2.threshold(mask_blur, 127, 255, cv2.THRESH_BINARY)

        result = img_cv.copy()
        result[mask_clean == 0] = [255, 255, 255]

        return Image.fromarray(cv2.cvtColor(result, cv2.COLOR_BGR2RGB))

    @staticmethod
    def _keep_largest_contour(mask: np.ndarray) -> np.ndarray:
        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL,
                                       cv2.CHAIN_APPROX_SIMPLE)
        if not contours:
            return mask
        new_mask = np.zeros_like(mask)
        largest  = max(contours, key=cv2.contourArea)
        cv2.drawContours(new_mask, [largest], -1, 255, thickness=cv2.FILLED)
        return new_mask

    @staticmethod
    def _fill_holes(mask: np.ndarray) -> np.ndarray:
        flood      = mask.copy()
        h, w       = flood.shape
        flood_mask = np.zeros((h + 2, w + 2), dtype=np.uint8)
        cv2.floodFill(flood, flood_mask, (0, 0), 255)
        holes = cv2.bitwise_not(flood)
        return cv2.bitwise_or(mask, holes)


class CLAHETransform:
    """CLAHE on the LAB L-channel only."""

    def __init__(self, clip_limit: float = 2.0, tile_grid_size: tuple = (8, 8)):
        self.clahe = cv2.createCLAHE(clipLimit=clip_limit,
                                     tileGridSize=tile_grid_size)

    def __call__(self, img: Image.Image) -> Image.Image:
        img_bgr = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
        img_lab = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2LAB)
        l, a, b  = cv2.split(img_lab)
        l_clahe  = self.clahe.apply(l)
        img_lab_clahe = cv2.merge((l_clahe, a, b))
        img_bgr_clahe = cv2.cvtColor(img_lab_clahe, cv2.COLOR_LAB2BGR)
        img_rgb_clahe = cv2.cvtColor(img_bgr_clahe, cv2.COLOR_BGR2RGB)
        return Image.fromarray(img_rgb_clahe)


# ── Main saving routine ─────────────────────────────────────────────────────

def save_preprocessed(split_name: str, src_dir: str,
                       seg_root: str, clahe_root: str) -> None:
    """Walk every class folder, apply segmentation + CLAHE, save results."""
    segmenter = LeafSegmentation()
    claher    = CLAHETransform()

    for class_name in sorted(os.listdir(src_dir)):
        class_src = os.path.join(src_dir, class_name)
        if not os.path.isdir(class_src):
            continue

        seg_dst   = os.path.join(seg_root,   split_name, class_name)
        clahe_dst = os.path.join(clahe_root, split_name, class_name)
        os.makedirs(seg_dst,   exist_ok=True)
        os.makedirs(clahe_dst, exist_ok=True)

        images = [f for f in os.listdir(class_src)
                  if f.lower().endswith((".jpg", ".jpeg", ".png"))]

        for idx, fname in enumerate(images, 1):
            src_path = os.path.join(class_src, fname)
            base, _  = os.path.splitext(fname)

            # Progress indicator (every 50 images)
            if idx % 50 == 0 or idx == len(images):
                print(f"    [{split_name}/{class_name}] {idx}/{len(images)}", end="\r")

            img_pil = Image.open(src_path).convert("RGB")

            # Step 1: Segmented image
            seg_img  = segmenter(img_pil)
            seg_path = os.path.join(seg_dst, base + ".png")
            if not os.path.exists(seg_path):
                seg_img.save(seg_path)

            # Step 2: CLAHE image (applied on top of segmented image)
            clahe_img  = claher(seg_img)
            clahe_path = os.path.join(clahe_dst, base + ".png")
            if not os.path.exists(clahe_path):
                clahe_img.save(clahe_path)

        print()  # newline after the class progress line


def main():
    print("💾 Saving preprocessed images to disk...")
    for split_name, src_dir in [
        ("train", TRAIN_DIR),
        ("val",   VAL_DIR),
        ("test",  TEST_DIR),
    ]:
        if not os.path.isdir(src_dir):
            print(f"  ⚠️  Skipping '{split_name}' — folder not found: {src_dir}")
            continue
        print(f"  Processing split: {split_name}")
        save_preprocessed(split_name, src_dir, SEG_ROOT, CLAHE_ROOT)

    print(f"\n✅ Done!")
    print(f"   Segmented  → {SEG_ROOT}")
    print(f"   CLAHE      → {CLAHE_ROOT}")


if __name__ == "__main__":
    main()
