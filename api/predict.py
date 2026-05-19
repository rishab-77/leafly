import torch
import torch.nn as nn
from PIL import Image
import timm
import json
import io
import numpy as np
from pathlib import Path
from api.preprocessing import get_inference_transforms

# Paths
BASE_DIR         = Path(__file__).parent.parent
MODEL_PATH       = BASE_DIR / "saved_models" / "leafly_model_v2.pth"
CLASS_NAMES_PATH = BASE_DIR / "saved_models" / "class_names_v2.json"

# Device
DEVICE = torch.device("cpu")

# Image transform — includes segmentation, CLAHE, resize, normalize
transform = get_inference_transforms(img_size=224)


def load_model():
    """Load model once at startup."""
    with open(CLASS_NAMES_PATH, "r") as f:
        class_names = json.load(f)

    num_classes = len(class_names)

    model = timm.create_model("efficientnet_b3", pretrained=False)
    in_features = model.classifier.in_features
    model.classifier = nn.Sequential(
        nn.Dropout(p=0.3),
        nn.Linear(in_features, 256),
        nn.ReLU(),
        nn.Dropout(p=0.2),
        nn.Linear(256, num_classes)
    )

    model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
    model.eval()

    print(f"✅ Model loaded | {num_classes} classes | Device: {DEVICE}")
    return model, class_names


def predict_image(image_bytes: bytes, model, class_names):
    """Run inference with leaf validation, OOD detection, and full breakdown."""

    # Open image
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    # ── Leaf validation ──────────────────────────────────────────
    img_array = np.array(image)
    r, g, b   = img_array[:,:,0], img_array[:,:,1], img_array[:,:,2]

    green_mask  = (g.astype(int) - r.astype(int) > 15) & \
                  (g.astype(int) - b.astype(int) > 10)
    yellow_mask = (r.astype(int) > 120) & \
                  (g.astype(int) > 100) & \
                  (b.astype(int) < 100)
    leaf_ratio  = (green_mask.sum() + yellow_mask.sum()) / green_mask.size

    if leaf_ratio < 0.08:
        return None, None, None, None, "no_leaf"
    # ─────────────────────────────────────────────────────────────

    # Preprocess
    tensor = transform(image).unsqueeze(0).to(DEVICE)

    # Inference
    with torch.no_grad():
        outputs       = model(tensor)
        probabilities = torch.softmax(outputs, dim=1)[0]
        confidence, predicted_idx = probabilities.max(0)

    confidence_val = confidence.item()
    disease        = class_names[predicted_idx.item()]
    confidence_pct = round(confidence_val * 100, 2)

    # ── Full breakdown for pie chart ─────────────────────────────
    breakdown = []
    for i, prob in enumerate(probabilities):
        name       = class_names[i]
        clean_name = name.split('·')[-1].strip() if '·' in name else name
        breakdown.append({
            "name":      clean_name,
            "full_name": name,
            "value":     round(prob.item() * 100, 2)
        })
    breakdown.sort(key=lambda x: x["value"], reverse=True)
    # ─────────────────────────────────────────────────────────────

    # ── Entropy check (OOD detection) ────────────────────────────
    probs_np      = probabilities.cpu().numpy()
    entropy       = -np.sum(probs_np * np.log(probs_np + 1e-10))
    max_entropy   = np.log(len(class_names))
    entropy_ratio = entropy / max_entropy

    if entropy_ratio > 0.6:
        return disease, confidence_pct, breakdown, entropy_ratio, "high_entropy"
    # ─────────────────────────────────────────────────────────────

    # ── Confidence threshold ─────────────────────────────────────
    if confidence_val < 0.75:
        return disease, confidence_pct, breakdown, entropy_ratio, "low_confidence"
    # ─────────────────────────────────────────────────────────────

    return disease, confidence_pct, breakdown, entropy_ratio, "ok"