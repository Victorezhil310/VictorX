"""
VictorX 1.0.0 FastAPI Backend Engine
Unified multi-modal API server for Chat, Image, Video, Code, and GPU Telemetry.
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routers import chat, image, video, code, system
from backend.db.database import Base, engine

# Create Database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="VictorX AI Platform API",
    description="Production-grade API for VictorX Chat, Image AI, Video AI, Code AI & PyTorch Sparse MoE Engine",
    version="1.0.0"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Router Modules
app.include_router(chat.router)
app.include_router(image.router)
app.include_router(video.router)
app.include_router(code.router)
app.include_router(system.router)

@app.get("/")
async def root():
    return {
        "platform": "VictorX AI Platform",
        "version": "1.0.0",
        "status": "online",
        "docs_url": "/docs"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "fastapi": True,
        "pytorch_engine": "active",
        "moe_routing": "sparse_top2",
        "quantization": "int4_awq"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=8000, reload=True)
