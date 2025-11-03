#!/usr/bin/env python3
"""
Script để tạo bảng availability và dữ liệu mẫu
"""

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.db import Base, get_db
from app.models.room_categories import RoomAvailability, HomestayRoom
from app.models.homestays import Homestay
from datetime import date, timedelta
import logging

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Database URL
DATABASE_URL = "mysql+pymysql://root:123456@127.0.0.1:3306/homestay_booking"

def create_tables():
    """Tạo bảng availability nếu chưa tồn tại"""
    try:
        engine = create_engine(DATABASE_URL)
        Base.metadata.create_all(bind=engine)
        logger.info("✅ Đã tạo bảng thành công")
        return engine
    except Exception as e:
        logger.error(f"❌ Lỗi tạo bảng: {e}")
        return None

def create_sample_availability(engine):
    """Tạo dữ liệu availability mẫu"""
    SessionLocal = sessionmaker(bind=engine)
    db = SessionLocal()
    
    try:
        # Lấy homestay đầu tiên
        homestay = db.query(Homestay).first()
        if not homestay:
            logger.error("❌ Không tìm thấy homestay nào")
            return
            
        # Lấy các phòng của homestay
        rooms = db.query(HomestayRoom).filter(
            HomestayRoom.homestay_id == homestay.id
        ).all()
        
        if not rooms:
            logger.error("❌ Không tìm thấy phòng nào")
            return
            
        logger.info(f"📍 Tạo availability cho homestay {homestay.id} với {len(rooms)} phòng")
        
        # Tạo availability cho 3 tháng tới
        start_date = date.today()
        end_date = start_date + timedelta(days=90)
        
        current_date = start_date
        created_count = 0
        
        while current_date <= end_date:
            for room in rooms:
                # Kiểm tra xem đã có availability chưa
                existing = db.query(RoomAvailability).filter(
                    RoomAvailability.room_id == room.id,
                    RoomAvailability.date == current_date
                ).first()
                
                if not existing:
                    # Tạo availability mới - mặc định là available
                    availability = RoomAvailability(
                        room_id=room.id,
                        date=current_date,
                        is_available=True,
                        price_override=None
                    )
                    db.add(availability)
                    created_count += 1
            
            current_date += timedelta(days=1)
        
        db.commit()
        logger.info(f"✅ Đã tạo {created_count} record availability")
        
    except Exception as e:
        logger.error(f"❌ Lỗi tạo dữ liệu: {e}")
        db.rollback()
    finally:
        db.close()

def main():
    """Hàm chính"""
    logger.info("🚀 Bắt đầu tạo bảng availability...")
    
    # Tạo bảng
    engine = create_tables()
    if not engine:
        return
    
    # Tạo dữ liệu mẫu
    create_sample_availability(engine)
    
    logger.info("🎉 Hoàn thành!")

if __name__ == "__main__":
    main()