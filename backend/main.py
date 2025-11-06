from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy import text
import logging
import traceback
import os
from app.db import engine, Base, SessionLocal
from app.routes import auth, dashboard, homestays, destinations, admin, admin_auth, bookings, homestay_management, payments, room_categories, availability, seo, admin_room_categories, promotions, banners, admin_banners
from app.middleware import rate_limit_middleware, security_headers_middleware

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Test database connection
try:
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))
    logger.info("✅ Database connection successful")
except Exception as e:
    logger.error(f"❌ Database connection failed: {e}")
    raise

# Create tables
Base.metadata.create_all(bind=engine)

def create_app() -> FastAPI:
    app = FastAPI(
        title="Homestay Hub API",
        version="1.0.0",
        description="API for homestay booking system with enhanced authentication",
        docs_url="/docs",
        redoc_url="/redoc"
    )
    
    # Global exception handler
    @app.exception_handler(Exception)
    async def global_exception_handler(request: Request, exc: Exception):
        logger.error(f"Global exception: {str(exc)}")
        logger.error(f"Traceback: {traceback.format_exc()}")
        return JSONResponse(
            status_code=500,
            content={"detail": "Đã xảy ra lỗi hệ thống. Vui lòng thử lại sau."}
        )
    
    # Validation exception handler
    @app.exception_handler(422)
    async def validation_exception_handler(request: Request, exc):
        return JSONResponse(
            status_code=422,
            content={"detail": "Dữ liệu không hợp lệ. Vui lòng kiểm tra lại thông tin."}
        )
    
    # CORS middleware - MUST be added first
    app.add_middleware(
        CORSMiddleware,
        allow_origins=[
            "http://localhost:5173", 
            "http://127.0.0.1:5173",
            "http://localhost:5174", 
            "http://127.0.0.1:5174",
            "http://localhost:3000",
            "http://127.0.0.1:3000"
        ],
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
        allow_headers=["*"],
        expose_headers=["*"]
    )
    
    # Security middleware - added after CORS
    app.middleware("http")(rate_limit_middleware)
    app.middleware("http")(security_headers_middleware)
    
    # Include routers
    app.include_router(auth.router)
    app.include_router(admin_auth.router)
    app.include_router(dashboard.router)
    app.include_router(homestays.router)
    app.include_router(destinations.router)
    app.include_router(bookings.router, prefix="/api/bookings")
    app.include_router(promotions.router, prefix="/api/promotions")
    app.include_router(availability.router, prefix="/api")
    app.include_router(payments.router, prefix="/api")
    app.include_router(admin.router)
    app.include_router(homestay_management.router)
    app.include_router(room_categories.router)
    app.include_router(admin_room_categories.router)

    app.include_router(seo.router)
    app.include_router(banners.router)
    app.include_router(admin_banners.router)
    
    # Mount static files for serving uploaded images
    uploads_dir = os.path.join(os.path.dirname(__file__), "uploads")
    if not os.path.exists(uploads_dir):
        os.makedirs(uploads_dir, exist_ok=True)
    
    # Tạo thư mục con cho room_categories
    room_categories_dir = os.path.join(uploads_dir, "room_categories")
    if not os.path.exists(room_categories_dir):
        os.makedirs(room_categories_dir, exist_ok=True)
    
    app.mount("/uploads", StaticFiles(directory=uploads_dir), name="uploads")
    
    return app

app = create_app()

@app.get("/", tags=["root"])
async def root():
    return {
        "message": "Homestay Hub API", 
        "status": "running",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health", tags=["health"])
async def health_check():
    try:
        db = SessionLocal()
        db.execute(text("SELECT 1"))
        db.close()
        return {
            "status": "healthy", 
            "database": "connected",
            "timestamp": "2024-01-01T00:00:00Z"
        }
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        raise HTTPException(
            status_code=503, 
            detail=f"Dịch vụ tạm thời không khả dụng: {str(e)}"
        )

@app.options("/{path:path}")
async def options_handler(path: str):
    return {"message": "OK"}