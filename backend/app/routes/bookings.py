from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.db import get_db
from app.auth import get_current_user
from app.models import Booking, Homestay, User

router = APIRouter(tags=["bookings"])

class BookingCreate(BaseModel):
    homestay_id: int
    check_in: str
    check_out: str
    guests: int
    total_price: float
    guest_info: dict
    payment_method: str
    special_requests: Optional[str] = None

@router.post("")
async def create_booking(
    booking_data: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Tạo booking mới"""
    
    # Kiểm tra homestay tồn tại
    homestay = db.query(Homestay).filter(Homestay.id == booking_data.homestay_id).first()
    if not homestay:
        raise HTTPException(status_code=404, detail="Homestay không tồn tại")
    
    # Tạo booking code
    import time
    booking_code = f"BK{int(time.time())}{current_user.id}"
    
    # Tạo booking
    booking = Booking(
        booking_code=booking_code,
        user_id=current_user.id,
        homestay_id=booking_data.homestay_id,
        check_in=datetime.fromisoformat(booking_data.check_in),
        check_out=datetime.fromisoformat(booking_data.check_out),
        guests=booking_data.guests,
        total_price=booking_data.total_price,
        status='pending',
        guest_info=booking_data.guest_info,
        payment_method=booking_data.payment_method,
        special_requests=booking_data.special_requests
    )
    
    db.add(booking)
    db.commit()
    db.refresh(booking)
    
    return {
        "message": "Đặt phòng thành công",
        "booking": {
            "id": booking.id,
            "booking_code": booking.booking_code,
            "status": booking.status,
            "check_in": booking.check_in.isoformat(),
            "check_out": booking.check_out.isoformat(),
            "total_price": float(booking.total_price)
        }
    }

@router.get("/user")
async def get_user_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Lấy danh sách booking của user"""
    
    bookings = db.query(Booking).filter(Booking.user_id == current_user.id).all()
    
    return {
        "bookings": [
            {
                "id": booking.id,
                "homestay_name": booking.homestay.name,
                "check_in": booking.check_in.isoformat(),
                "check_out": booking.check_out.isoformat(),
                "guests": booking.guests,
                "total_price": float(booking.total_price),
                "status": booking.status,
                "created_at": booking.created_at.isoformat()
            }
            for booking in bookings
        ]
    }