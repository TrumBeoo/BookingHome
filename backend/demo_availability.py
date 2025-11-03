#!/usr/bin/env python3
"""
Script demo để tạo availability data và test block/unblock
"""

import sys
import os
from datetime import date, timedelta
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db import get_db
from app.models.room_categories import HomestayRoom, RoomAvailability
from sqlalchemy.orm import Session

def demo_availability():
    """Demo tạo availability data"""
    
    db = next(get_db())
    
    try:
        # Lấy phòng đầu tiên của homestay 8
        room = db.query(HomestayRoom).filter(
            HomestayRoom.homestay_id == 8
        ).first()
        
        if not room:
            print("No room found for homestay 8")
            return
        
        print(f"Working with room: {room.room_number} (ID: {room.id})")
        
        # Block một vài ngày trong tháng 12
        blocked_dates = [
            date(2024, 12, 15),
            date(2024, 12, 16),
            date(2024, 12, 17),
            date(2024, 12, 25),
            date(2024, 12, 26),
        ]
        
        for block_date in blocked_dates:
            # Kiểm tra xem đã có record chưa
            existing = db.query(RoomAvailability).filter(
                RoomAvailability.room_id == room.id,
                RoomAvailability.date == block_date
            ).first()
            
            if existing:
                existing.is_available = False
                print(f"Updated existing availability for {block_date}")
            else:
                availability = RoomAvailability(
                    room_id=room.id,
                    date=block_date,
                    is_available=False,
                    price_override=None
                )
                db.add(availability)
                print(f"Created blocked availability for {block_date}")
        
        # Tạo giá đặc biệt cho một vài ngày
        special_price_dates = [
            (date(2024, 12, 31), 1000000),  # Đêm giao thừa
            (date(2024, 12, 24), 800000),   # Đêm Noel
        ]
        
        for special_date, special_price in special_price_dates:
            existing = db.query(RoomAvailability).filter(
                RoomAvailability.room_id == room.id,
                RoomAvailability.date == special_date
            ).first()
            
            if existing:
                existing.price_override = special_price
                existing.is_available = True
            else:
                availability = RoomAvailability(
                    room_id=room.id,
                    date=special_date,
                    is_available=True,
                    price_override=special_price
                )
                db.add(availability)
            
            print(f"Set special price {special_price} for {special_date}")
        
        db.commit()
        print("\nDemo availability data created successfully!")
        
        # Hiển thị kết quả
        all_availability = db.query(RoomAvailability).filter(
            RoomAvailability.room_id == room.id
        ).order_by(RoomAvailability.date).all()
        
        print(f"\nAvailability records for room {room.room_number}:")
        for av in all_availability:
            status = "Available" if av.is_available else "Blocked"
            price = f" (Price: {av.price_override})" if av.price_override else ""
            print(f"  {av.date}: {status}{price}")
        
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    demo_availability()