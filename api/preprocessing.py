"""
Unified preprocessing pipeline for both training and inference.
Ensures consistency: Segmentation → Resize → CLAHE → Normalize
"""

import cv2
import numpy as np
from PIL import Image
from torchvision import transforms


class LeafSegmentation:
    """
    Segment leaf from background using HSV color space.
    Handles green, yellow-green, and brownish/diseased leaves.
    """

    def __call__(self, img):
        """
        Args:
            img: PIL Image in RGB mode
        Returns:
            PIL Image with leaf segmented (background removed)
        """
        img_cv = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
        hsv   = cv2.cvtColor(img_cv, cv2.COLOR_BGR2HSV)

        # ── 1. Build mask: wider green + yellow-green range ──────────────
        lower_green1 = np.array([25,  30,  30])   # yellow-green
        upper_green1 = np.array([95, 255, 255])   # cyan-green
        mask = cv2.inRange(hsv, lower_green1, upper_green1)

        # ── 2. Morphological clean-up ─────────────────────────────────────
        kernel_close = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (15, 15))
        kernel_open  = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (5,  5))

        mask = cv2.morphologyEx(mask, cv2.MORPH_CLOSE, kernel_close, iterations=3)
        mask = cv2.morphologyEx(mask, cv2.MORPH_OPEN,  kernel_open,  iterations=1)

        # ── 3. Keep only the largest contour (the leaf itself) ────────────
        mask = self._keep_largest_contour(mask)

        # ── 4. Fill interior holes (pale veins, bright spots) ────────────
        mask = self._fill_holes(mask)

        # ── 5. Smooth / feather edges ─────────────────────────────────────
        mask_blur = cv2.GaussianBlur(mask, (7, 7), 0)
        _, mask_clean = cv2.threshold(mask_blur, 127, 255, cv2.THRESH_BINARY)

        # ── 6. Compose result on white background ─────────────────────────
        result = img_cv.copy()
        result[mask_clean == 0] = [255, 255, 255]

        return Image.fromarray(cv2.cvtColor(result, cv2.COLOR_BGR2RGB))

    @staticmethod
    def _keep_largest_contour(mask):
        """Zero-out everything except the largest connected region."""
        contours, _ = cv2.findContours(mask, cv2.RETR_EXTERNAL,
                                       cv2.CHAIN_APPROX_SIMPLE)
        if not contours:
            return mask
        new_mask = np.zeros_like(mask)
        largest  = max(contours, key=cv2.contourArea)
        cv2.drawContours(new_mask, [largest], -1, 255, thickness=cv2.FILLED)
        return new_mask

    @staticmethod
    def _fill_holes(mask):
        """Flood-fill from border to find background, then invert."""
        flood = mask.copy()
        h, w  = flood.shape
        flood_mask = np.zeros((h + 2, w + 2), dtype=np.uint8)
        cv2.floodFill(flood, flood_mask, (0, 0), 255)
        holes = cv2.bitwise_not(flood)
        return cv2.bitwise_or(mask, holes)


class CLAHETransform:
    """
    Contrast Limited Adaptive Histogram Equalization.
    Applies CLAHE only to the L (lightness) channel in LAB color space,
    preserving full color information.
    """

    def __init__(self, clip_limit=2.0, tile_grid_size=(8, 8)):
        self.clahe = cv2.createCLAHE(clipLimit=clip_limit, tileGridSize=tile_grid_size)

    def __call__(self, img):
        """Apply CLAHE via LAB L-channel to preserve color."""
        # ── 1. Convert PIL → BGR → LAB ────────────────────────────────────
        img_bgr = cv2.cvtColor(np.array(img), cv2.COLOR_RGB2BGR)
        img_lab = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2LAB)

        # ── 2. Split channels, apply CLAHE only to L (lightness) ─────────
        l, a, b = cv2.split(img_lab)
        l_clahe = self.clahe.apply(l)

        # ── 3. Merge back and convert to RGB ──────────────────────────────
        img_lab_clahe = cv2.merge((l_clahe, a, b))
        img_bgr_clahe = cv2.cvtColor(img_lab_clahe, cv2.COLOR_LAB2BGR)
        img_rgb_clahe = cv2.cvtColor(img_bgr_clahe, cv2.COLOR_BGR2RGB)

        return Image.fromarray(img_rgb_clahe)


def get_train_transforms(img_size=224):
    """Get training transforms with segmentation, CLAHE, and augmentation."""
    return transforms.Compose([
        LeafSegmentation(),           # Step 1: Remove background
        transforms.Resize((img_size, img_size)),  # Step 2: Resize
        CLAHETransform(),             # Step 3: Enhance contrast
        transforms.RandomHorizontalFlip(),        # Augmentation
        transforms.RandomRotation(15),            # Augmentation
        transforms.ColorJitter(brightness=0.3, contrast=0.3),  # Augmentation
        transforms.ToTensor(),
        transforms.Normalize(
            mean=[0.485, 0.456, 0.406],
            std=[0.229, 0.224, 0.225]
        )
    ])


def get_inference_transforms(img_size=224):
    """Get inference transforms (no augmentation, same preprocessing as training)."""
    return transforms.Compose([
        LeafSegmentation(),           # Step 1: Remove background
        transforms.Resize((img_size, img_size)),  # Step 2: Resize
        CLAHETransform(),             # Step 3: Enhance contrast
        transforms.ToTensor(),
        transforms.Normalize(
            mean=[0.485, 0.456, 0.406],
            std=[0.229, 0.224, 0.225]
        )
    ])
