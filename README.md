# 🌱 Leafly - Plant Disease Detection

A modern web application that uses machine learning to detect plant diseases from leaf images. Upload a photo of a plant leaf and get instant disease diagnosis with treatment recommendations.

## ✨ Features

- **AI-Powered Detection**: Advanced deep learning model trained on extensive plant disease datasets
- **Real-time Analysis**: Instant disease detection and classification
- **User-Friendly Interface**: Clean, responsive React frontend with drag-and-drop upload
- **Comprehensive Database**: Supports multiple plant species and disease types
- **Treatment Recommendations**: Get actionable advice for identified diseases
- **FastAPI Backend**: High-performance REST API for reliable predictions

## 🛠️ Tech Stack

### Backend
- **FastAPI**: Modern, fast web framework for building APIs
- **PyTorch**: Deep learning framework for model inference
- **Timm**: PyTorch Image Models library
- **Pillow**: Image processing library

### Frontend
- **React 18**: Modern JavaScript library for building user interfaces
- **Vite**: Fast build tool and development server
- **Axios**: HTTP client for API communication
- **React Router**: Declarative routing for React
- **Framer Motion**: Animation library for smooth interactions
- **React Dropzone**: File upload component
- **Lucide React**: Beautiful icon library

### Machine Learning
- **Model**: Fine-tuned vision transformer (ViT) or ResNet architecture
- **Training**: Google Colab with GPU acceleration
- **Dataset**: Plant disease image dataset with multiple classes

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd leafly
   ```

2. **Backend Setup**
   ```bash
   # Install Python dependencies
   pip install -r requirements.txt

   # Start the API server
   cd api
   python main.py
   ```
   The API will be available at `http://localhost:8000`

3. **Frontend Setup**
   ```bash
   # Install Node dependencies
   cd frontend
   npm install

   # Start the development server
   npm run dev
   ```
   The frontend will be available at `http://localhost:5173`

## 📖 Usage

1. Open your browser and navigate to the frontend URL
2. Upload a clear image of a plant leaf (JPG, PNG formats supported)
3. Wait for the AI analysis to complete
4. View the disease diagnosis and treatment recommendations

## 🔧 API Documentation

### Endpoints

#### POST `/predict`
Upload an image for disease detection.

**Request:**
- Content-Type: `multipart/form-data`
- Body: `file` (image file)

**Response:**
```json
{
  "prediction": "Leaf Blight",
  "confidence": 0.92,
  "treatment": "Apply copper-based fungicide...",
  "prevention": "Ensure proper spacing between plants..."
}
```

#### GET `/health`
Check API health status.

**Response:**
```json
{
  "status": "healthy",
  "model_loaded": true
}
```

## 📁 Project Structure

```
leafly/
├── api/                    # FastAPI backend
│   ├── main.py            # API entry point
│   └── predict.py         # ML prediction logic
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Page components
│   │   └── data/          # Static data
│   └── public/            # Static assets
├── notebooks/             # Jupyter notebooks for training
├── saved_models/          # Trained ML models
├── requirements.txt       # Python dependencies
└── README.md             # This file
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Plant disease dataset providers
- PyTorch and Timm communities
- FastAPI and React communities
- Open source contributors

---

Made with ❤️ for healthier plants and sustainable agriculture.
