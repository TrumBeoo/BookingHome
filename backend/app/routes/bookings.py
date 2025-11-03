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
    
    # Kiểm tra homestay tồn tại
    homestay = db.query(Homestay).filter(Homestay.id == booking_data.homestay_id).first()
    if not homestay:
        raise HTTPException(status_code=404, detail="Homestay không tồn tại")
    
    # Kiểm tra availability trước khi tạo booking
    from app.models.room_categories import HomestayRoom, RoomAvailability
    from datetime import datetime, timedelta
    
    check_in = datetime.fromisoformat(booking_data.check_in).date()
    check_out = datetime.fromisoformat(booking_data.check_out).date()
    
    # Lấy tất cả phòng của homestay
    rooms = db.query(HomestayRoom).filter(
        HomestayRoom.homestay_id == booking_data.homestay_id,
        HomestayRoom.is_available == True
    ).all()
    
    # Nếu homestay không có phòng, kiểm tra booking trực tiếp trên homestay
    if not rooms:
        # Kiểm tra từng ngày xem có booking nào không
        current_date = check_in
        while current_date < check_out:
            existing_booking = db.query(Booking).filter(
                Booking.homestay_id == booking_data.homestay_id,
                Booking.check_in <= current_date,
                Booking.check_out > current_date,
                Booking.status.in_(["confirmed", "pending", "blocked"])
            ).first()
            
            if existing_booking:
                if existing_booking.status == "blocked":
                    raise HTTPException(
                        status_code=400,
                        detail=f"Ngày {current_date.strftime('%d/%m/%Y')} đã bị chặn. Vui lòng chọn ngày khác."
                    )
                else:
                    raise HTTPException(
                        status_code=400,
                        detail=f"Ngày {current_date.strftime('%d/%m/%Y')} đã được đặt. Vui lòng chọn ngày khác."
                    )
            
            current_date += timedelta(days=1)
    else:
        # Homestay có phòng - kiểm tra availability và booking
        current_date = check_in
        
        while current_date < check_out:
            room_available_for_date = False
            
            for room in rooms:
                # Kiểm tra availability
                availability = db.query(RoomAvailability).filter(
                    RoomAvailability.room_id == room.id,
                    RoomAvailability.date == current_date
                ).first()
                
                # Nếu ngày bị chặn (is_available = False), không cho đặt
                if availability and not availability.is_available:
                    continue
                
                # Kiểm tra booking trùng lịch (bao gồm cả blocked)
                existing_booking = db.query(Booking).filter(
                    Booking.homestay_id == booking_data.homestay_id,
                    Booking.check_in <= current_date,
                    Booking.check_out > current_date,
                    Booking.status.in_(["confirmed", "pending", "blocked"])
                ).first()
                
                if not existing_booking:
                    room_available_for_date = True
                    break
            
            if not room_available_for_date:
                raise HTTPException(
                    status_code=400,
                    detail=f"Ngày {current_date.strftime('%d/%m/%Y')} không khả dụng. Vui lòng chọn ngày khác."
                )
            
            current_date += timedelta(days=1)
    
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
        check_in=datetime.fromisoformat(booking_data.check_in),
        check_out=datetime.fromisoformat(booking_data.check_out),
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