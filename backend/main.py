from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import text
from app.db import engine, Base, SessionLocal
from app.routes import auth
from app.middleware import rate_limit_middleware, security_headers_middleware

# Test database connection
try:
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))
    print("✅ Database connection successful")
except Exception as e:
    print(f"❌ Database connection failed: {e}")
    raise

# Create tables
Base.metadata.create_all(bind=engine)

def create_app() -> FastAPI:
    app = FastAPI(
        title="Homestay Booking API",
        version="1.0.0",
        description="API for homestay booking system"
    )
    
    # Security middleware
    app.middleware("http")(rate_limit_middleware)
    app.middleware("http")(security_headers_middleware)
    
    # CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        allow_headers=["*"],
    )
    
    # Include routers
    app.include_router(auth.router)
    
    return app

app = create_app()

@app.get("/", tags=["root"])
async def root():
    return {"message": "Homestay Booking API", "status": "running"}

@app.get("/health", tags=["health"])
async def health_check():
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        return {"status": "healthy", "database": "connected"}
    except Exception as e:
        raise HTTPException(status_code=503, detail=f"Database connection failed: {str(e)}")