"""
VictorX PostgreSQL Database Engine
"""
import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://victorx:victorx_secret@localhost:5432/victorx_db")

# Fallback sqlite engine if postgresql driver is unavailable during development
try:
    engine = create_engine(DATABASE_URL, pool_pre_ping=True)
except Exception:
    engine = create_engine("sqlite:///./victorx_local.db", connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
