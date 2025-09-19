from datetime import timedelta, datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import re
import logging

from ..db import get_db
from ..models.users import User
from ..schemas import UserCreate, Token, UserResponse
from ..auth import (
    verify_password, 
    get_password_hash, 
    create_access_token, 
    verify_token,
    ACCESS_TOKEN_EXPIRE_MINUTES
)

router = APIRouter(prefix="/auth", tags=["authentication"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/login")

def validate_password(password: str):
    if len(password) < 8:
        raise HTTPException(
            status_code=400,
            detail="Mật khẩu phải có ít nhất 8 ký tự"
        )
    if not re.search(r"[A-Za-z]", password):
        raise HTTPException(
            status_code=400,
            detail="Mật khẩu phải chứa ít nhất một chữ cái"
        )
    if not re.search(r"\d", password):
        raise HTTPException(
            status_code=400,
            detail="Mật khẩu phải chứa ít nhất một số"
        )

@router.post("/register", response_model=UserResponse)
async def register(user: UserCreate, db: Session = Depends(get_db)):
    """
    Register a new user account
    
    Args:
        user: User registration data
        db: Database session
        
    Returns:
        UserResponse: Created user data
        
    Raises:
        HTTPException: If email already exists or validation fails
    """
    try:
        # Check if user exists
        db_user = db.query(User).filter(User.email == user.email).first()
        if db_user:
            raise HTTPException(
                status_code=400,
                detail="Email đã được đăng ký"
            )
        
        # Validate password
        validate_password(user.password)
        
        # Create new user with timezone-aware timestamps
        hashed_password = get_password_hash(user.password)
        current_time = datetime.now(timezone.utc)
        
        db_user = User(
            email=user.email,
            password=hashed_password,
            name=user.name,
            phone=user.phone,
            role="customer",
            created_at=current_time,
            updated_at=current_time
        )
        
        db.add(db_user)
        db.commit()
        db.refresh(db_user)
        
        logging.info(f"New user registered: {user.email}")
        return db_user
        
    except HTTPException:
        raise
    except Exception as e:
        db.rollback()
        logging.error(f"Registration failed for {user.email}: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Đăng ký thất bại. Vui lòng thử lại."
        )

@router.post("/login", response_model=Token)
async def login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.password):  # Thay đổi từ hashed_password thành password
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email hoặc mật khẩu không chính xác",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@router.post("/refresh", response_model=Token)
async def refresh_token(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """
    Refresh access token
    
    Args:
        token: Current JWT access token
        db: Database session
        
    Returns:
        Token: New access token
        
    Raises:
        HTTPException: If token is invalid or user not found
    """
    try:
        email = verify_token(token)
        user = db.query(User).filter(User.email == email).first()
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Không tìm thấy người dùng"
            )
        
        # Create new access token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        access_token = create_access_token(
            data={"sub": user.email}, expires_delta=access_token_expires
        )
        
        return {"access_token": access_token, "token_type": "bearer"}
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Failed to refresh token: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Không thể làm mới token"
        )

@router.get("/me", response_model=UserResponse)
async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """
    Get current authenticated user information
    
    Args:
        token: JWT access token
        db: Database session
        
    Returns:
        UserResponse: Current user data
        
    Raises:
        HTTPException: If token is invalid or user not found
    """
    try:
        email = verify_token(token)
        user = db.query(User).filter(User.email == email).first()
        if user is None:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Không tìm thấy người dùng"
            )
        return user
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Failed to get current user: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Không thể xác thực thông tin đăng nhập"
        )