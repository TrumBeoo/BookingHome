from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict
from app.db import get_db
from app.models.room_categories import RoomAvailability, HomestayRoom
from app.models.bookings import Booking
from app.models.homestays import Homestay
from pydantic import BaseModel
from datetime import datetime, date, timedelta
from typing import List
import calendar

router = APIRouter(prefix="/availability", tags=["Availability"])

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
    
    # Kiểm tra homestay tồn tại
    homestay = db.query(Homestay).filter(Homestay.id == homestay_id).first()
    if not homestay:
        raise HTTPException(status_code=404, detail="Không tìm thấy homestay")
    
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
    
    # Nếu homestay không có phòng, kiểm tra booking trực tiếp
    if not rooms:
        current_date = check_in
        while current_date < check_out:
            existing_booking = db.query(Booking).filter(
                Booking.homestay_id == homestay_id,
                Booking.check_in <= current_date,
                Booking.check_out > current_date,
                Booking.status.in_(["confirmed", "pending", "blocked"])
            ).first()
            
            if existing_booking:
                return {
                    "available": False,
                    "message": f"Ngày {current_date.strftime('%d/%m/%Y')} đã {'bị chặn' if existing_booking.status == 'blocked' else 'được đặt'}. Vui lòng chọn ngày khác.",
                    "blocked_date": current_date.isoformat()
                }
            current_date += timedelta(days=1)
        
        # Tính giá cho homestay không có phòng
        nights = (check_out - check_in).days
        total_price = float(homestay.price_per_night) * nights
        
        return {
            "available": True,
            "message": "Homestay khả dụng",
            "total_price": total_price,
            "avg_price_per_night": float(homestay.price_per_night),
            "nights": nights
        }
    
    # Homestay có phòng - kiểm tra từng phòng
    available_rooms = []
    
    for room in rooms:
        # Kiểm tra từng ngày trong khoảng thời gian
        is_room_available = True
        total_price = 0
        current_date = check_in
        blocked_reason = None
        
        while current_date < check_out and is_room_available:
            # Kiểm tra availability - Nếu có record và is_available = False thì bị chặn
            availability = db.query(RoomAvailability).filter(
                RoomAvailability.room_id == room.id,
                RoomAvailability.date == current_date
            ).first()
            
            if availability and not availability.is_available:
                is_room_available = False
                blocked_reason = f"Ngày {current_date.strftime('%d/%m/%Y')} bị chặn"
                break
            
            # Kiểm tra booking trùng lịch (bao gồm cả blocked)
            existing_booking = db.query(Booking).filter(
                Booking.homestay_id == homestay_id,
                Booking.check_in <= current_date,
                Booking.check_out > current_date,
                Booking.status.in_(["confirmed", "pending", "blocked"])
            ).first()
            
            if existing_booking:
                is_room_available = False
                blocked_reason = f"Ngày {current_date.strftime('%d/%m/%Y')} đã {'bị chặn' if existing_booking.status == 'blocked' else 'được đặt'}"
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
    
    if len(available_rooms) == 0:
        return {
            "available": False,
            "message": "Không có phòng trống trong khoảng thời gian này. Vui lòng chọn ngày khác."
        }
    
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
    
    # Kiểm tra homestay tồn tại
    homestay = db.query(Homestay).filter(Homestay.id == homestay_id).first()
    if not homestay:
        raise HTTPException(status_code=404, detail="Không tìm thấy homestay")
    
    blocked_dates_dict = {}  # Sử dụng dict để tránh trùng lặp
    
    # Lấy tất cả phòng của homestay
    rooms = db.query(HomestayRoom).filter(
        HomestayRoom.homestay_id == homestay_id,
        HomestayRoom.is_available == True
    ).all()
    
    if rooms:
        # Homestay có phòng - kiểm tra availability
        blocked_availability = db.query(RoomAvailability).join(HomestayRoom).filter(
            HomestayRoom.homestay_id == homestay_id,
            RoomAvailability.date >= start_date,
            RoomAvailability.date <= end_date,
            RoomAvailability.is_available == False
        ).all()
        
        for availability in blocked_availability:
            date_key = availability.date.isoformat()
            if date_key not in blocked_dates_dict:
                blocked_dates_dict[date_key] = {
                    "date": date_key,
                    "reason": "Bị chặn bởi chủ nhà",
                    "type": "blocked",
                    "room_id": availability.room_id
                }
    
    # Lấy ngày đã được đặt (bao gồm cả blocked bookings)
    bookings = db.query(Booking).filter(
        Booking.homestay_id == homestay_id,
        Booking.status.in_(["confirmed", "pending", "blocked"]),
        Booking.check_in <= end_date,
        Booking.check_out >= start_date
    ).all()
    
    for booking in bookings:
        current_date = max(booking.check_in, start_date)
        end_booking = min(booking.check_out, end_date)
        
        while current_date < end_booking:
            date_key = current_date.isoformat()
            if date_key not in blocked_dates_dict:
                if booking.status == "blocked":
                    blocked_dates_dict[date_key] = {
                        "date": date_key,
                        "reason": "Bị chặn bởi chủ nhà",
                        "type": "blocked",
                        "booking_id": booking.id
                    }
                else:
                    blocked_dates_dict[date_key] = {
                        "date": date_key,
                        "reason": f"Đã đặt - {booking.booking_code}",
                        "type": "booked",
                        "booking_id": booking.id,
                        "status": booking.status
                    }
            current_date += timedelta(days=1)
    
    # Chuyển dict thành list và sắp xếp theo ngày
    blocked_dates = sorted(blocked_dates_dict.values(), key=lambda x: x["date"])
    
    return {
        "blocked_dates": blocked_dates,
        "total": len(blocked_dates),
        "start_date": start_date.isoformat(),
        "end_date": end_date.isoformat()
    }

@router.get("/quick/{homestay_id}")
def get_quick_availability(
    homestay_id: int,
    month: int = Query(...),
    year: int = Query(...),
    db: Session = Depends(get_db)
):
    """API nhanh để frontend hiển thị availability"""
    
    # Tạo range ngày trong tháng
    start_date = date(year, month, 1)
    if month == 12:
        end_date = date(year + 1, 1, 1) - timedelta(days=1)
    else:
        end_date = date(year, month + 1, 1) - timedelta(days=1)
    
    # Lấy tất cả phòng
    rooms = db.query(HomestayRoom).filter(
        HomestayRoom.homestay_id == homestay_id,
        HomestayRoom.is_available == True
    ).all()
    
    # Lấy tất cả bookings trong tháng (bao gồm cả blocked)
    bookings = db.query(Booking).filter(
        Booking.homestay_id == homestay_id,
        Booking.status.in_(["confirmed", "pending", "blocked"]),
        Booking.check_in <= end_date,
        Booking.check_out >= start_date
    ).all()
    
    availability_data = {}
    current_date = start_date
    
    while current_date <= end_date:
        available_count = 0
        booked_count = 0
        pending_count = 0
        min_price = None
        
        for room in rooms:
            # Kiểm tra availability
            availability = db.query(RoomAvailability).filter(
                RoomAvailability.room_id == room.id,
                RoomAvailability.date == current_date
            ).first()
            
            # Chỉ coi là available nếu có record availability và is_available = True
            # Hoặc nếu không có record availability nào thì coi như chưa được thiết lập
            is_available = False
            if availability:
                is_available = availability.is_available
            
            # Kiểm tra booking
            booking = next((
                b for b in bookings 
                if b.check_in <= current_date < b.check_out
            ), None)
            
            if booking:
                if booking.status == "confirmed":
                    booked_count += 1
                elif booking.status == "pending":
                    pending_count += 1
                # Nếu status là "blocked" thì không tăng counter nào, sẽ xử lý ở logic sau
            elif is_available:
                available_count += 1
                room_price = availability.price_override if availability and availability.price_override else (room.price_per_night or room.room_category.base_price)
                if min_price is None or room_price < min_price:
                    min_price = float(room_price)
        
        # Xác định màu sắc và trạng thái
        # Kiểm tra xem có bất kỳ availability record nào cho ngày này không
        has_availability_data = db.query(RoomAvailability).join(HomestayRoom).filter(
            HomestayRoom.homestay_id == homestay_id,
            RoomAvailability.date == current_date
        ).first() is not None
        
        # Kiểm tra có booking blocked không
        blocked_booking = next((
            b for b in bookings 
            if b.check_in <= current_date < b.check_out and b.status == "blocked"
        ), None)
        
        if available_count > 0:
            color = "#4caf50"  # Xanh lá - trống
            status = "available"
        elif blocked_booking or (has_availability_data and available_count == 0 and booked_count == 0 and pending_count == 0):
            color = "#9e9e9e"  # Xám - bị chặn
            status = "blocked"
        elif pending_count > 0:
            color = "#ff9800"  # Vàng - chờ xác nhận  
            status = "pending"
        elif booked_count > 0:
            color = "#f44336"  # Đỏ - đã đặt
            status = "booked"
        else:
            # Chưa có dữ liệu availability được thiết lập
            color = "#e0e0e0"  # Xám nhạt - chưa thiết lập
            status = "not_set"
        
        availability_data[current_date.isoformat()] = {
            "status": status,
            "color": color,
            "available_rooms": available_count,
            "booked_rooms": booked_count,
            "pending_rooms": pending_count,
            "min_price": min_price,
            "tooltip": f"Trống: {available_count}, Đặt: {booked_count}, Chờ: {pending_count}" if has_availability_data else "Chưa thiết lập lịch trống"
        }
        
        current_date += timedelta(days=1)
    
    return {
        "month": month,
        "year": year,
        "availability": availability_data,
        "total_rooms": len(rooms)
    }

@router.post("/block-dates/{homestay_id}")
def block_dates(
    homestay_id: int,
    dates: List[str],
    room_ids: Optional[List[int]] = None,
    db: Session = Depends(get_db)
):
    """Chặn ngày cụ thể cho phòng"""
    
    # Kiểm tra homestay tồn tại
    homestay = db.query(Homestay).filter(Homestay.id == homestay_id).first()
    if not homestay:
        raise HTTPException(status_code=404, detail="Homestay không tồn tại")
    
    # Lấy danh sách phòng cần block
    if room_ids:
        rooms = db.query(HomestayRoom).filter(
            HomestayRoom.homestay_id == homestay_id,
            HomestayRoom.id.in_(room_ids)
        ).all()
    else:
        rooms = db.query(HomestayRoom).filter(
            HomestayRoom.homestay_id == homestay_id,
            HomestayRoom.is_available == True
        ).all()
    
    if not rooms:
        # Homestay không có phòng - tạo booking giả để chặn ngày
        blocked_count = 0
        for date_str in dates:
            try:
                block_date = datetime.strptime(date_str, "%Y-%m-%d").date()
            except ValueError:
                block_date = datetime.fromisoformat(date_str.replace('Z', '+00:00')).date()
            
            # Kiểm tra xem đã có booking chặn chưa
            existing = db.query(Booking).filter(
                Booking.homestay_id == homestay_id,
                Booking.check_in == block_date,
                Booking.status == "blocked"
            ).first()
            
            if not existing:
                # Tạo booking với status "blocked"
                blocked_booking = Booking(
                    booking_code=f"BLOCKED_{homestay_id}_{block_date.strftime('%Y%m%d')}",
                    homestay_id=homestay_id,
                    check_in=block_date,
                    check_out=block_date + timedelta(days=1),
                    guests=0,
                    total_price=0,
                    status="blocked",
                    guest_details={"reason": "Blocked by host"},
                    payment_method="none"
                )
                db.add(blocked_booking)
                blocked_count += 1
        
        db.commit()
        return {
            "message": f"Đã chặn {blocked_count} ngày cho homestay",
            "blocked_dates": dates,
            "affected_rooms": 0
        }
    
    blocked_count = 0
    
    for date_str in dates:
        # Parse date and ensure it's a date object
        try:
            block_date = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            # Try parsing as datetime if it includes time
            block_date = datetime.fromisoformat(date_str.replace('Z', '+00:00')).date()
        
        print(f"Processing block date: {date_str} -> {block_date}")
        
        for room in rooms:
            # Kiểm tra xem đã có availability record chưa
            existing = db.query(RoomAvailability).filter(
                RoomAvailability.room_id == room.id,
                RoomAvailability.date == block_date
            ).first()
            
            if existing:
                existing.is_available = False
            else:
                availability = RoomAvailability(
                    room_id=room.id,
                    date=block_date,
                    is_available=False
                )
                db.add(availability)
            
            blocked_count += 1
    
    db.commit()
    
    return {
        "message": f"Đã chặn {blocked_count} ngày cho {len(rooms)} phòng",
        "blocked_dates": dates,
        "affected_rooms": len(rooms)
    }

@router.post("/unblock-dates/{homestay_id}")
def unblock_dates(
    homestay_id: int,
    dates: List[str],
    room_ids: Optional[List[int]] = None,
    db: Session = Depends(get_db)
):
    """Bỏ chặn ngày cụ thể cho phòng"""
    
    # Lấy danh sách phòng cần unblock
    if room_ids:
        rooms = db.query(HomestayRoom).filter(
            HomestayRoom.homestay_id == homestay_id,
            HomestayRoom.id.in_(room_ids)
        ).all()
    else:
        rooms = db.query(HomestayRoom).filter(
            HomestayRoom.homestay_id == homestay_id,
            HomestayRoom.is_available == True
        ).all()
    
    unblocked_count = 0
    
    for date_str in dates:
        # Parse date and ensure it's a date object
        try:
            unblock_date = datetime.strptime(date_str, "%Y-%m-%d").date()
        except ValueError:
            # Try parsing as datetime if it includes time
            unblock_date = datetime.fromisoformat(date_str.replace('Z', '+00:00')).date()
        
        print(f"Processing unblock date: {date_str} -> {unblock_date}")
        
        for room in rooms:
            availability = db.query(RoomAvailability).filter(
                RoomAvailability.room_id == room.id,
                RoomAvailability.date == unblock_date
            ).first()
            
            if availability:
                availability.is_available = True
                unblocked_count += 1
    
    db.commit()
    
    return {
        "message": f"Đã bỏ chặn {unblocked_count} ngày",
        "unblocked_dates": dates,
        "affected_rooms": len(rooms)
    }