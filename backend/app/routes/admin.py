from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import desc, and_, or_, func
from typing import Optional
from datetime import datetime, timedelta

from app.db import get_db
from app.models import User, Homestay, Booking, Payment, Review
from app.auth import require_admin

router = APIRouter(prefix="/admin", tags=["admin"])

@router.get("/homestays/pending")
async def get_pending_homestays(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Lấy danh sách homestay chờ duyệt (chỉ admin)"""
    
    query = db.query(Homestay).filter(Homestay.status == 'pending')
    
    total = query.count()
    homestays = query.order_by(desc(Homestay.created_at)).offset((page - 1) * limit).limit(limit).all()
    
    return {
        "homestays": homestays,
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": (total + limit - 1) // limit
    }

@router.patch("/homestays/{homestay_id}/approve")
async def approve_homestay(
    homestay_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Duyệt homestay (chỉ admin)"""
    
    homestay = db.query(Homestay).filter(Homestay.id == homestay_id).first()
    
    if not homestay:
        raise HTTPException(status_code=404, detail="Không tìm thấy homestay")
    
    if homestay.status != 'pending':
        raise HTTPException(status_code=400, detail=f"Homestay không ở trạng thái chờ duyệt (hiện tại: {homestay.status})")
    
    homestay.status = 'active'
    db.commit()
    
    return {
        "message": f"Homestay '{homestay.name}' đã được duyệt thành công",
        "homestay": homestay
    }

@router.patch("/homestays/{homestay_id}/reject")
async def reject_homestay(
    homestay_id: int,
    reason: Optional[str] = None,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Từ chối homestay (chỉ admin)"""
    
    homestay = db.query(Homestay).filter(Homestay.id == homestay_id).first()
    
    if not homestay:
        raise HTTPException(status_code=404, detail="Không tìm thấy homestay")
    
    if homestay.status != 'pending':
        raise HTTPException(status_code=400, detail=f"Homestay không ở trạng thái chờ duyệt (hiện tại: {homestay.status})")
    
    homestay.status = 'rejected'
    if reason:
        homestay.rejection_reason = reason
    db.commit()
    
    return {
        "message": f"Homestay '{homestay.name}' đã bị từ chối",
        "homestay": homestay,
        "reason": reason
    }

@router.get("/stats")
async def get_admin_stats(
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Thống kê tổng quan cho admin"""
    
    # Đếm homestay theo trạng thái
    homestay_stats = {
        'total': db.query(Homestay).count(),
        'active': db.query(Homestay).filter(Homestay.status == 'active').count(),
        'pending': db.query(Homestay).filter(Homestay.status == 'pending').count(),
        'rejected': db.query(Homestay).filter(Homestay.status == 'rejected').count(),
        'inactive': db.query(Homestay).filter(Homestay.status == 'inactive').count()
    }
    
    # Đếm user theo role
    user_stats = {
        'total': db.query(User).count(),
        'admin': db.query(User).filter(User.role == 'admin').count(),
        'host': db.query(User).filter(User.role == 'host').count(),
        'guest': db.query(User).filter(User.role == 'guest').count()
    }
    
    # Đếm booking theo trạng thái
    booking_stats = {
        'total': db.query(Booking).count(),
        'pending': db.query(Booking).filter(Booking.status == 'pending').count(),
        'confirmed': db.query(Booking).filter(Booking.status == 'confirmed').count(),
        'cancelled': db.query(Booking).filter(Booking.status == 'cancelled').count(),
        'completed': db.query(Booking).filter(Booking.status == 'completed').count()
    }
    
    return {
        "homestays": homestay_stats,
        "users": user_stats,
        "bookings": booking_stats
    }