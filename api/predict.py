import torch
import torch.nn as nn
from PIL import Image
import timm
import json
import io
from pathlib import Path
from preprocessing import get_inference_transforms

# Paths
BASE_DIR        = Path(__file__).parent.parent
MODEL_PATH      = BASE_DIR / "saved_models" / "leafly_model.pth"
CLASS_NAMES_PATH = BASE_DIR / "saved_models" / "class_names.json"

# Device
DEVICE = torch.device("cpu")  # Mac runs on CPU

# Image transform — includes segmentation, CLAHE, resize, normalize
transform = get_inference_transforms(img_size=224)


def load_model():
    """Load model once at startup."""
    # Load class names
    with open(CLASS_NAMES_PATH, "r") as f:
        class_names = json.load(f)

    num_classes = len(class_names)

    # Rebuild exact same architecture as training
    model = timm.create_model("efficientnet_b3", pretrained=False)
    in_features = model.classifier.in_features
    model.classifier = nn.Sequential(
        nn.Dropout(p=0.3),
        nn.Linear(in_features, 256),
        nn.ReLU(),
        nn.Dropout(p=0.2),
        nn.Linear(256, num_classes)
    )

    # Load trained weights
    model.load_state_dict(
        torch.load(MODEL_PATH, map_location=DEVICE)
    )
    model.eval()

    print(f"✅ Model loaded | {num_classes} classes | Device: {DEVICE}")
    return model, class_names


def predict_image(image_bytes: bytes, model, class_names):
    """Run inference on image bytes."""
    # Open image
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")

    # Preprocess
    tensor = transform(image).unsqueeze(0).to(DEVICE)

    # Inference
    with torch.no_grad():
        outputs = model(tensor)
        probabilities = torch.softmax(outputs, dim=1)
        confidence, predicted_idx = probabilities.max(1)

    disease    = class_names[predicted_idx.item()]
    confidence = round(confidence.item() * 100, 2)

    return disease, confidence