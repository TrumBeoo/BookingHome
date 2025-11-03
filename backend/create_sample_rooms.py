#!/usr/bin/env python3
"""
Script để tạo phòng mẫu cho các homestay hiện có
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from app.db import get_db
from app.models.homestays import Homestay
from app.models.room_categories import RoomCategory, HomestayRoom
from sqlalchemy.orm import Session

def create_sample_rooms():
    """Tạo phòng mẫu cho các homestay"""
    
    db = next(get_db())
    
    try:
        # Lấy tất cả homestay
        homestays = db.query(Homestay).all()
        print(f"Found {len(homestays)} homestays")
        
        # Lấy hoặc tạo room category mặc định
        default_category = db.query(RoomCategory).first()
        if not default_category:
            default_category = RoomCategory(
                name="Phòng tiêu chuẩn",
                slug="phong-tieu-chuan",
                description="Phòng tiêu chuẩn với đầy đủ tiện nghi",
                base_price=500000,
                max_guests=2,
                room_size=25.0,
                bed_type="Giường đôi",
                view_type="Thành phố",
                has_balcony=False,
                has_kitchen=True,
                is_pet_friendly=False,
                amenities=["Wifi", "TV", "Điều hòa"],
                is_active=True
            )
            db.add(default_category)
            db.commit()
            db.refresh(default_category)
            print(f"Created default room category: {default_category.name}")
        
        # Tạo phòng cho mỗi homestay
        rooms_created = 0
        for homestay in homestays:
            # Kiểm tra xem homestay đã có phòng chưa
            existing_rooms = db.query(HomestayRoom).filter(
                HomestayRoom.homestay_id == homestay.id
            ).count()
            
            if existing_rooms == 0:
                # Tạo 2-3 phòng cho mỗi homestay
                num_rooms = 2 if homestay.max_guests <= 4 else 3
                
                for i in range(1, num_rooms + 1):
                    room = HomestayRoom(
                        homestay_id=homestay.id,
                        room_category_id=default_category.id,
                        room_number=f"P{i:02d}",
                        custom_name=f"Phòng {i} - {homestay.name}",
                        price_per_night=homestay.price_per_night,
                        is_available=True,
                        special_features={}
                    )
                    db.add(room)
                    rooms_created += 1
                
                print(f"Created {num_rooms} rooms for homestay: {homestay.name}")
            else:
                print(f"Homestay {homestay.name} already has {existing_rooms} rooms")
        
        db.commit()
        print(f"\nCompleted! Created {rooms_created} new rooms")
        
        # Kiểm tra kết quả
        total_rooms = db.query(HomestayRoom).count()
        print(f"Total rooms in system: {total_rooms}")
        
    except Exception as e:
        print(f"Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_sample_rooms()