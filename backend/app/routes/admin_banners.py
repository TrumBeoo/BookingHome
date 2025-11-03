from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc
from typing import List
from app.db import get_db
from app.models import Banner, User
from app.schemas import BannerCreate, BannerUpdate, BannerResponse
from app.auth import get_current_user

router = APIRouter(prefix="/api/admin/banners", tags=["admin-banners"])

def require_admin(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Chỉ admin mới có quyền truy cập")
    return current_user

@router.get("")
async def get_all_banners(
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=100),
    position: str = Query(None),
    is_active: bool = Query(None),
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Lấy danh sách tất cả banner (admin)"""
    
    query = db.query(Banner)
    
    if position:
        query = query.filter(Banner.position == position)
    if is_active is not None:
        query = query.filter(Banner.is_active == is_active)
    
    total = query.count()
    banners = query.order_by(desc(Banner.priority), desc(Banner.created_at)).offset((page - 1) * limit).limit(limit).all()
    
    return {
        "banners": [BannerResponse.model_validate(banner) for banner in banners],
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": (total + limit - 1) // limit
    }

@router.get("/{banner_id}")
async def get_banner(
    banner_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Lấy chi tiết banner (admin)"""
    
    banner = db.query(Banner).filter(Banner.id == banner_id).first()
    if not banner:
        raise HTTPException(status_code=404, detail="Không tìm thấy banner")
    
    return {"banner": BannerResponse.model_validate(banner)}

@router.post("")
async def create_banner(
    banner_data: BannerCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Tạo banner mới (admin)"""
    
    banner = Banner(**banner_data.model_dump())
    db.add(banner)
    db.commit()
    db.refresh(banner)
    
    return {"message": "Tạo banner thành công", "banner": BannerResponse.model_validate(banner)}

@router.put("/{banner_id}")
async def update_banner(
    banner_id: int,
    banner_data: BannerUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Cập nhật banner (admin)"""
    
    banner = db.query(Banner).filter(Banner.id == banner_id).first()
    if not banner:
        raise HTTPException(status_code=404, detail="Không tìm thấy banner")
    
    for key, value in banner_data.model_dump(exclude_unset=True).items():
        setattr(banner, key, value)
    
    db.commit()
    db.refresh(banner)
    
    return {"message": "Cập nhật banner thành công", "banner": BannerResponse.model_validate(banner)}

@router.delete("/{banner_id}")
async def delete_banner(
    banner_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Xóa banner (admin)"""
    
    banner = db.query(Banner).filter(Banner.id == banner_id).first()
    if not banner:
        raise HTTPException(status_code=404, detail="Không tìm thấy banner")
    
    db.delete(banner)
    db.commit()
    
    return {"message": "Xóa banner thành công"}

@router.patch("/{banner_id}/toggle")
async def toggle_banner_status(
    banner_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_admin)
):
    """Bật/tắt banner (admin)"""
    
    banner = db.query(Banner).filter(Banner.id == banner_id).first()
    if not banner:
        raise HTTPException(status_code=404, detail="Không tìm thấy banner")
    
    banner.is_active = not banner.is_active
    db.commit()
    db.refresh(banner)
    
    return {"message": f"Banner đã {'bật' if banner.is_active else 'tắt'}", "banner": BannerResponse.model_validate(banner)}
