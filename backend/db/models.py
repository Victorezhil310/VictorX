"""
VictorX Database Models (SQLAlchemy ORM)
Defines User, ChatSession, ChatMessage, and MediaAsset tables.
"""

import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from backend.db.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True)
    email = Column(String(100), unique=True, index=True)
    hashed_password = Column(String(200))
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    sessions = relationship("ChatSession", back_populates="owner")

class ChatSession(Base):
    __tablename__ = "chat_sessions"

    id = Column(String(64), primary_key=True, index=True)
    title = Column(String(200), default="New AI Session")
    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    model_name = Column(String(100), default="victorx-3b-moe")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)

    owner = relationship("User", back_populates="sessions")
    messages = relationship("ChatMessage", back_populates="session", cascade="all, delete-orphan")

class ChatMessage(Base):
    __tablename__ = "chat_messages"

    id = Column(Integer, primary_key=True, index=True)
    session_id = Column(String(64), ForeignKey("chat_sessions.id"))
    role = Column(String(20)) # "user" or "assistant"
    content = Column(Text) # Encrypted message content
    reasoning_stream = Column(Text, nullable=True)
    timestamp = Column(DateTime, default=datetime.datetime.utcnow)

    session = relationship("ChatSession", back_populates="messages")

class MediaAsset(Base):
    __tablename__ = "media_assets"

    id = Column(String(64), primary_key=True, index=True)
    media_type = Column(String(20)) # "image" or "video"
    prompt = Column(Text)
    file_path = Column(String(300))
    style_preset = Column(String(50), default="photorealistic")
    created_at = Column(DateTime, default=datetime.datetime.utcnow)
