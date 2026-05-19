from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from api.predict import load_model, predict_image

# Global model variables
model       = None
class_names = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global model, class_names
    print("🌱 Starting Leafly API...")
    model, class_names = load_model()
    yield
    print("🛑 Shutting down Leafly API...")


app = FastAPI(
    title="Leafly — Plant Disease Detection API",
    description="Upload a leaf image to detect plant disease.",
    version="2.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {"message": "🌱 Leafly API is running!", "docs": "/docs"}


@app.get("/health")
def health():
    return {
        "status":       "healthy",
        "model_loaded": model is not None,
        "num_classes":  len(class_names) if class_names else 0
    }


@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if file.content_type not in ["image/jpeg", "image/png", "image/jpg"]:
        raise HTTPException(
            status_code=400,
            detail="Only JPEG and PNG images are supported."
        )

    image_bytes = await file.read()

    try:
        disease, confidence, breakdown, _, status = predict_image(
            image_bytes, model, class_names
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

    if status == "no_leaf":
        raise HTTPException(
            status_code=422,
            detail="No leaf detected. Please upload a clear close-up photo of a single plant leaf."
        )

    if status == "high_entropy":
        raise HTTPException(
            status_code=422,
            detail="This leaf doesn't appear to match any supported plant diseases. Leafly supports Pepper, Potato, and Tomato leaves only."
        )

    if status == "low_confidence":
        raise HTTPException(
            status_code=422,
            detail=f"Unable to classify with enough confidence ({confidence}%). Please upload a clearer, well-lit close-up of a single leaf."
        )

    return {
        "disease":    disease,
        "confidence": confidence,
        "breakdown":  breakdown,
        "unit":       "%"
    }