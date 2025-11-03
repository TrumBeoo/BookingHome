#!/usr/bin/env python3
import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.room_categories import RoomAvailability, HomestayRoom
from datetime import date, timedelta

DATABASE_URL = "mysql+pymysql://root:123456@127.0.0.1:3306/homestay_booking"

def fix_availability():
    engine = create_engine(DATABASE_URL)
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()
    
    try:
        # Lấy phòng của homestay 8
        rooms = db.query(HomestayRoom).filter(HomestayRoom.homestay_id == 8).all()
        print(f"Found {len(rooms)} rooms for homestay 8")
        
        # Tạo availability cho tháng 11/2024
        start_date = date(2024, 11, 1)
        end_date = date(2024, 11, 30)
        
        current_date = start_date
        created = 0
        
        while current_date <= end_date:
            for room in rooms:
                existing = db.query(RoomAvailability).filter(
                    RoomAvailability.room_id == room.id,
                    RoomAvailability.date == current_date
                ).first()
                
                if not existing:
                    availability = RoomAvailability(
                        room_id=room.id,
                        date=current_date,
                        is_available=True,  # Mặc định là available
                        price_override=None
                    )
                    db.add(availability)
                    created += 1
                    print(f"Created availability for room {room.id} on {current_date}")
            
            current_date += timedelta(days=1)
        
        db.commit()
        print(f"Created {created} availability records")
        
        # Kiểm tra lại
        total = db.query(RoomAvailability).join(HomestayRoom).filter(
            HomestayRoom.homestay_id == 8,
            RoomAvailability.date >= start_date,
            RoomAvailability.date <= end_date
        ).count()
        
        print(f"Total availability records for homestay 8 in Nov 2024: {total}")
        
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    fix_availability()