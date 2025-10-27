from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict
from app.db import get_db
from app.models.room_categories import RoomAvailability, HomestayRoom
from app.models.bookings import Booking
from app.models.homestays import Homestay
from pydantic import BaseModel
from datetime import datetime, date, timedelta
import calendar

router = APIRouter(prefix="/api/availability", tags=["Availability"])

class CalendarDay(BaseModel):
    date: str
    is_available: bool
    price: Optional[float]
    status: str  # available, booked, blocked
    booking_info: Optional[Dict] = None

class MonthlyCalendar(BaseModel):
    year: int
    month: int
    days: List[CalendarDay]
    total_available: int
    total_booked: int

@router.get("/calendar/{homestay_id}")
def get_availability_calendar(
    homestay_id: int,
    year: int = Query(...),
    month: int = Query(...),
    room_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    """Lấy lịch trống/đã đặt theo tháng cho homestay"""
    
    # Kiểm tra homestay tồn tại
    homestay = db.query(Homestay).filter(Homestay.id == homestay_id).first()
    if not homestay:
        raise HTTPException(status_code=404, detail="Homestay không tồn tại")
    
    # Tạo range ngày trong tháng
    start_date = date(year, month, 1)
    if month == 12:
        end_date = date(year + 1, 1, 1) - timedelta(days=1)
    else:
        end_date = date(year, month + 1, 1) - timedelta(days=1)
    
    calendar_days = []
    total_available = 0
    total_booked = 0
    
    current_date = start_date
    while current_date <= end_date:
        day_status = "available"
        booking_info = None
        price = None
        
        if room_id:
            # Kiểm tra phòng cụ thể
            room = db.query(HomestayRoom).filter(
                HomestayRoom.id == room_id,
                HomestayRoom.homestay_id == homestay_id
            ).first()
            
            if room:
                # Kiểm tra availability
                availability = db.query(RoomAvailability).filter(
                    RoomAvailability.room_id == room_id,
                    RoomAvailability.date == current_date
                ).first()
                
                if availability:
                    if not availability.is_available:
                        day_status = "blocked"
                    price = float(availability.price_override) if availability.price_override else float(room.price_per_night or room.room_category.base_price)
                else:
                    price = float(room.price_per_night or room.room_category.base_price)
                
                # Kiểm tra booking
                booking = db.query(Booking).filter(
                    Booking.homestay_id == homestay_id,
                    Booking.check_in <= current_date,
                    Booking.check_out > current_date,
                    Booking.status.in_(["confirmed", "pending"])
                ).first()
                
                if booking:
                    day_status = "booked"
                    booking_info = {
                        "booking_code": booking.booking_code,
                        "guest_name": booking.guest_details.get("name") if booking.guest_details else "Khách hàng",
                        "guests": booking.guests
                    }
        else:
            # Kiểm tra tất cả phòng trong homestay
            rooms = db.query(HomestayRoom).filter(
                HomestayRoom.homestay_id == homestay_id,
                HomestayRoom.is_available == True
            ).all()
            
            available_rooms = 0
            min_price = None
            
            for room in rooms:
                # Kiểm tra availability
                availability = db.query(RoomAvailability).filter(
                    RoomAvailability.room_id == room.id,
                    RoomAvailability.date == current_date
                ).first()
                
                room_available = True
                if availability and not availability.is_available:
                    room_available = False
                
                # Kiểm tra booking
                booking = db.query(Booking).filter(
                    Booking.homestay_id == homestay_id,
                    Booking.check_in <= current_date,
                    Booking.check_out > current_date,
                    Booking.status.in_(["confirmed", "pending"])
                ).first()
                
                if booking:
                    room_available = False
                    if not booking_info:  # Chỉ lấy thông tin booking đầu tiên
                        booking_info = {
                            "booking_code": booking.booking_code,
                            "guest_name": booking.guest_details.get("name") if booking.guest_details else "Khách hàng",
                            "guests": booking.guests
                        }
                
                if room_available:
                    available_rooms += 1
                    room_price = availability.price_override if availability and availability.price_override else (room.price_per_night or room.room_category.base_price)
                    if min_price is None or room_price < min_price:
                        min_price = float(room_price)
            
            if available_rooms == 0:
                day_status = "booked" if booking_info else "blocked"
            else:
                price = min_price
        
        is_available = day_status == "available"
        if is_available:
            total_available += 1
        else:
            total_booked += 1
        
        calendar_days.append(CalendarDay(
            date=current_date.isoformat(),
            is_available=is_available,
            price=price,
            status=day_status,
            booking_info=booking_info
        ))
        
        current_date += timedelta(days=1)
    
    return MonthlyCalendar(
        year=year,
        month=month,
        days=calendar_days,
        total_available=total_available,
        total_booked=total_booked
    )

@router.get("/check/{homestay_id}")
def check_availability(
    homestay_id: int,
    check_in: date = Query(...),
    check_out: date = Query(...),
    guests: int = Query(1),
    room_category_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    """Kiểm tra tình trạng phòng trống cho khoảng thời gian"""
    
    if check_in >= check_out:
        raise HTTPException(status_code=400, detail="Ngày check-out phải sau ngày check-in")
    
    # Lấy các phòng phù hợp
    query = db.query(HomestayRoom).filter(
        HomestayRoom.homestay_id == homestay_id,
        HomestayRoom.is_available == True
    )
    
    if room_category_id:
        query = query.filter(HomestayRoom.room_category_id == room_category_id)
    
    # Lọc theo số khách
    query = query.join(HomestayRoom.room_category).filter(
        HomestayRoom.room_category.has(max_guests__gte=guests)
    )
    
    rooms = query.all()
    
    if not rooms:
        return {"available": False, "message": "Không có phòng phù hợp"}
    
    available_rooms = []
    
    for room in rooms:
        # Kiểm tra từng ngày trong khoảng thời gian
        is_room_available = True
        total_price = 0
        current_date = check_in
        
        while current_date < check_out and is_room_available:
            # Kiểm tra availability
            availability = db.query(RoomAvailability).filter(
                RoomAvailability.room_id == room.id,
                RoomAvailability.date == current_date
            ).first()
            
            if availability and not availability.is_available:
                is_room_available = False
                break
            
            # Kiểm tra booking trùng lịch
            existing_booking = db.query(Booking).filter(
                Booking.homestay_id == homestay_id,
                Booking.check_in <= current_date,
                Booking.check_out > current_date,
                Booking.status.in_(["confirmed", "pending"])
            ).first()
            
            if existing_booking:
                is_room_available = False
                break
            
            # Tính giá
            day_price = availability.price_override if availability and availability.price_override else (room.price_per_night or room.room_category.base_price)
            total_price += float(day_price)
            
            current_date += timedelta(days=1)
        
        if is_room_available:
            available_rooms.append({
                "room_id": room.id,
                "room_number": room.room_number,
                "room_name": room.custom_name or room.room_category.name,
                "category": room.room_category.name,
                "max_guests": room.room_category.max_guests,
                "total_price": total_price,
                "avg_price_per_night": total_price / (check_out - check_in).days
            })
    
    return {
        "available": len(available_rooms) > 0,
        "available_rooms": available_rooms,
        "total_rooms": len(available_rooms)
    }

@router.get("/blocked-dates/{homestay_id}")
def get_blocked_dates(
    homestay_id: int,
    start_date: date = Query(...),
    end_date: date = Query(...),
    db: Session = Depends(get_db)
):
    """Lấy danh sách ngày bị chặn/không available"""
    
    blocked_dates = []
    
    # Lấy ngày bị block từ availability
    blocked_availability = db.query(RoomAvailability).join(HomestayRoom).filter(
        HomestayRoom.homestay_id == homestay_id,
        RoomAvailability.date >= start_date,
        RoomAvailability.date <= end_date,
        RoomAvailability.is_available == False
    ).all()
    
    for availability in blocked_availability:
        blocked_dates.append({
            "date": availability.date.isoformat(),
            "reason": "Bị chặn bởi chủ nhà",
            "room_id": availability.room_id
        })
    
    # Lấy ngày đã được đặt
    bookings = db.query(Booking).filter(
        Booking.homestay_id == homestay_id,
        Booking.status.in_(["confirmed", "pending"]),
        Booking.check_in <= end_date,
        Booking.check_out >= start_date
    ).all()
    
    for booking in bookings:
        current_date = max(booking.check_in, start_date)
        end_booking = min(booking.check_out, end_date)
        
        while current_date < end_booking:
            blocked_dates.append({
                "date": current_date.isoformat(),
                "reason": f"Đã đặt - {booking.booking_code}",
                "booking_id": booking.id
            })
            current_date += timedelta(days=1)
    
    return {"blocked_dates": blocked_dates}