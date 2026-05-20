---
title: Leafly
emoji: 🍃
colorFrom: green
colorTo: lime
sdk: docker
app_port: 8000
---
# 🌱 Leafly - Plant Disease Detection

A modern, premium web application that uses deep transfer learning to detect plant diseases from leaf images. Upload a photo of a plant leaf and get an instant, laboratory-grade disease diagnosis with treatment recommendations.

Leafly is built as an undergraduate final-year project, achieving **98.84% test accuracy** across 15 different plant disease classes.

## ✨ Features

- **AI-Powered Detection**: Advanced `EfficientNetB3` deep learning model trained on the PlantVillage dataset (20,637 images).
- **Premium UI/UX**: A state-of-the-art dark mode interface featuring glassmorphism, animated mesh gradients, interactive 3D mockups, and "bento box" layouts.
- **Real-time Analysis**: Simulated laser-scanning animations during upload, delivering fast inference via a FastAPI backend.
- **Interactive Encyclopedia**: A beautifully animated, filterable database of all supported plant diseases.
- **Treatment Recommendations**: Actionable, vetted agricultural advice for identified diseases.

## 🛠️ Tech Stack

### Backend
- **FastAPI**: High-performance REST API for serving the model.
- **PyTorch 2.2**: Deep learning framework used for two-phase transfer learning and inference.
- **OpenCV & Albumentations**: Image preprocessing (HSV segmentation, CLAHE contrast enhancement).

### Frontend
- **React 18 + Vite**: Lightning-fast frontend framework and build tool.
- **Framer Motion**: Complex physics-based layout animations and interactive hover states.
- **React Dropzone**: Polished drag-and-drop file upload component.
- **Lucide React**: Beautiful, consistent iconography.

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/rishab-77/leafly.git
   cd leafly
   ```

2. **Install Dependencies**
   Open two terminals.
   
   **Terminal 1 (Backend):**
   ```bash
   pip install -r requirements.txt
   ```
   
   **Terminal 2 (Frontend):**
   ```bash
   cd frontend
   npm install
   ```

3. **Run the Application (Automated)**
   We have provided helper scripts to run both the FastAPI backend and the Vite frontend concurrently.
   
   **On Windows (PowerShell):**
   ```powershell
   .\start.ps1
   ```
   
   **On Linux/Mac (Bash):**
   ```bash
   chmod +x start.sh
   ./start.sh
   ```

   *The frontend will open at `http://localhost:5173` and the backend will run at `http://localhost:8000`.*

## 📖 Usage

1. Open your browser and navigate to `http://localhost:5173`.
2. Go to the **Analyze** page.
3. Drag and drop a clear, close-up image of a single leaf (Tomato, Potato, or Bell Pepper).
4. Watch the scanning animation and receive your instant diagnosis and recommended action!

## 🔧 ML Pipeline

1. **Preprocessing:** The user's image is stripped of its background using HSV masking, resized to 224x224, and enhanced using CLAHE on the LAB color space.
2. **Feature Extraction:** Passed through the 11 million parameters of the EfficientNetB3 backbone.
3. **Classification:** A custom classification head outputs Softmax probabilities across 15 distinct classes.

## 📁 Project Structure

```
leafly/
├── api/                    # FastAPI backend logic & preprocessing
│   ├── main.py            
│   └── predict.py         
├── frontend/              # React frontend
│   ├── src/
│   │   ├── components/    # Reusable UI (UploadSection, ResultCard)
│   │   ├── pages/         # Core Pages (Home, Analyze, Plants, About)
│   │   └── data/          # Hardcoded disease dictionary
├── notebooks/             # Jupyter notebooks for model training
├── saved_models/          # Trained PyTorch models (.pth)
├── start.ps1              # Windows startup script
├── start.sh               # Linux/Mac startup script
└── README.md              
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

Made with ❤️ for healthier plants and sustainable agriculture.
