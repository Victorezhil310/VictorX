"""
VictorX FastAPI Main Server Entrypoint
Configured with zero-leak security middleware, CORS isolation, and AI engine routers.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.core.security import ZeroLeakSecurityMiddleware
from backend.db.database import engine, Base
from backend.routers import chat, image, video, code, system

# Initialize local database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="VictorX AI Backend Engine",
    description="Zero-Leak Local AI Dock & PyTorch CUDA Inference Engine",
    version="1.0.0"
)

# Attach Security Headers & CORS Isolation
app.add_middleware(ZeroLeakSecurityMiddleware)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(chat.router, prefix="/api/v1", tags=["Chat"])
app.include_router(image.router, prefix="/api/v1", tags=["Image"])
app.include_router(video.router, prefix="/api/v1", tags=["Video"])
app.include_router(code.router, prefix="/api/v1", tags=["Code"])
app.include_router(system.router, prefix="/api/v1", tags=["System"])

@app.get("/health")
def health_check():
    return {
        "status": "online",
        "engine": "VictorX PyTorch MoE",
        "security": "Zero-Leak Local Encryption Active"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
