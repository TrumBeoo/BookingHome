from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.db import get_db
from app.auth import get_current_user
from app.models import Booking, Homestay, User
from sqlalchemy import text

router = APIRouter(tags=["bookings"])

class BookingCreate(BaseModel):
    homestay_id: int
    check_in: str
    check_out: str
    guests: int
    total_price: float
    original_price: Optional[float] = None
    discount_amount: Optional[float] = None
    coupon_code: Optional[str] = None
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
    
    try:
        # Kiểm tra homestay tồn tại
        homestay = db.query(Homestay).filter(Homestay.id == booking_data.homestay_id).first()
        if not homestay:
            raise HTTPException(status_code=404, detail="Homestay không tồn tại")
        
        # Parse dates
        try:
            check_in = datetime.fromisoformat(booking_data.check_in).date()
            check_out = datetime.fromisoformat(booking_data.check_out).date()
        except ValueError:
            from datetime import datetime as dt
            check_in = dt.strptime(booking_data.check_in, '%Y-%m-%d').date()
            check_out = dt.strptime(booking_data.check_out, '%Y-%m-%d').date()
        
        # Tạo booking code
        import time
        booking_code = f"BK{int(time.time())}{current_user.id}"
        
        # Validate coupon nếu có
        if booking_data.coupon_code:
            result = db.execute(
                text("SELECT * FROM promotions WHERE code = :code AND is_active = TRUE"),
                {"code": booking_data.coupon_code.upper()}
            ).fetchone()
            
            if result:
                now = datetime.now()
                if result.start_date <= now <= result.end_date:
                    if not result.max_uses or result.used_count < result.max_uses:
                        db.execute(
                            text("UPDATE promotions SET used_count = used_count + 1 WHERE id = :id"),
                            {"id": result.id}
                        )
        
        # Tạo booking
        booking = Booking(
            booking_code=booking_code,
            user_id=current_user.id,
            homestay_id=booking_data.homestay_id,
            check_in=check_in,
            check_out=check_out,
            guests=booking_data.guests,
            total_price=booking_data.total_price,
            original_price=booking_data.original_price,
            discount_amount=booking_data.discount_amount or 0,
            coupon_code=booking_data.coupon_code,
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
    except Exception as e:
        db.rollback()
        print(f"Booking error: {str(e)}")
        raise HTTPException(status_code=400, detail=f"Lỗi tạo booking: {str(e)}")

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