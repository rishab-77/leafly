from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from api.predict import load_model, predict_image

# Global model variables
model       = None
class_names = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load model once when API starts."""
    global model, class_names
    print("🌱 Starting Leafly API...")
    model, class_names = load_model()
    yield
    print("🛑 Shutting down Leafly API...")


# Create app
app = FastAPI(
    title="Leafly — Plant Disease Detection API",
    description="Upload a leaf image to detect plant disease.",
    version="1.0.0",
    lifespan=lifespan
)

# Allow frontend to call API
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "🌱 Leafly API is running!",
        "docs": "/docs"
    }


@app.get("/health")
def health():
    return {
        "status": "healthy",
        "model_loaded": model is not None,
        "num_classes": len(class_names) if class_names else 0
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # Validate file type
    if file.content_type not in ["image/jpeg", "image/png", "image/jpg"]:
        raise HTTPException(
            status_code=400,
            detail="Only JPEG and PNG images are supported."
        )

    # Read image bytes
    image_bytes = await file.read()

    # Run prediction
    try:
        disease, confidence = predict_image(image_bytes, model, class_names)
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )

    return {
        "disease":    disease,
        "confidence": confidence,
        "unit":       "%"
    }