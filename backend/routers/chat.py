"""
VictorX Chat Router — Transformer Inference, Tool Calling & Streaming Endpoints
"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from backend.core.pytorch_engine import engine

router = APIRouter(prefix="/api/v1/chat", tags=["Chat AI"])

class ChatRequest(BaseModel):
    prompt: str
    model: str = "victorx-3b-moe"
    system_prompt: Optional[str] = "You are VictorX 10x Smart AI."
    tool_calling: bool = True
    hide_cot: bool = True
    context_tokens: int = 32768

@router.post("/completions")
async def chat_completions(req: ChatRequest):
    try:
        res = engine.generate_chat(prompt=req.prompt, model=req.model)
        return {
            "status": "success",
            "model": res["model"],
            "response": res["text"],
            "cot_reasoning": res["cot_reasoning"] if not req.hide_cot else None,
            "metrics": res["metrics"]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/tools")
async def list_tools():
    return {
        "tools": [
            {"name": "web_search", "desc": "Live web search aggregator"},
            {"name": "python_interpreter", "desc": "Isolated Python 3.11 execution runtime"},
            {"name": "math_engine", "desc": "SymPy symbolic math solver"},
            {"name": "memory_store", "desc": "Encrypted vector memory retriever"}
        ]
    }
