from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
import logging

from ..db import get_db
from ..models.users import User
from ..schemas import Token, UserResponse
from ..auth import verify_password, verify_token, create_access_token

router = APIRouter(prefix="/admin", tags=["admin-authentication"])

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="admin/login")

@router.post("/login", response_model=Token)
async def admin_login(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_db)):
    try:
        email = form_data.username.lower().strip()
        logging.info(f"Admin login attempt for: {email}")
        
        user = db.query(User).filter(User.email == email).first()
        
        if not user or not verify_password(form_data.password, user.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Email hoặc mật khẩu không chính xác"
            )
        
        if user.role not in ['admin', 'super_admin']:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Bạn không có quyền truy cập Dashboard"
            )
        
        access_token_expires = timedelta(hours=8)
        access_token = create_access_token(
            data={"sub": user.email, "user_id": user.id, "role": user.role},
            expires_delta=access_token_expires
        )
        
        logging.info(f"Admin login successful: {email}")
        return {"access_token": access_token, "token_type": "bearer"}
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Admin login error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Đăng nhập thất bại"
        )

@router.get("/verify", response_model=UserResponse)
async def verify_admin_token(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        user_id = verify_token(token)
        user = db.query(User).filter(User.id == user_id).first()
        
        if not user or user.role not in ['admin', 'super_admin']:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token không hợp lệ"
            )
        
        return user
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Admin token verification error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token không hợp lệ"
        )

@router.get("/me", response_model=UserResponse)
async def get_current_admin(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    try:
        user_id = verify_token(token)
        user = db.query(User).filter(User.id == user_id).first()
        
        if not user or user.role not in ['admin', 'super_admin']:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Không tìm thấy người dùng"
            )
        
        return user
        
    except HTTPException:
        raise
    except Exception as e:
        logging.error(f"Failed to get current admin: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Không thể xác thực thông tin đăng nhập"
        )