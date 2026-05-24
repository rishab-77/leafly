# ==========================================
# STAGE 1: Build the React Frontend
# ==========================================
FROM node:20-slim AS frontend-builder
WORKDIR /build

# Copy frontend configuration files first (for caching)
COPY frontend/package*.json ./
RUN npm install

# Copy the rest of the frontend source code and build it
COPY frontend/ ./
RUN npm run build


# ==========================================
# STAGE 2: Set up Python & Serve the App
# ==========================================
FROM python:3.10-slim
WORKDIR /app

# Install backend dependencies
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy all the backend Python code and Machine Learning models
COPY api/ ./api
COPY model/ ./model
COPY saved_models/ ./saved_models

# Bring the compiled HTML/JS over from Stage 1 and put it in a folder called 'static'
COPY --from=frontend-builder /build/dist ./static

# Hugging Face explicitly listens on port 7860
EXPOSE 7860

# Start the server
CMD ["uvicorn", "api.main:app", "--host", "0.0.0.0", "--port", "7860"]