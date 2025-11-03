import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from app.config import settings
from app.models.homestays import Homestay
from app.models.room_categories import HomestayRoom, RoomAvailability
from app.models.bookings import Booking

# Create database connection
engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def check_database():
    """Check database connection and data"""
    db = SessionLocal()
    
    try:
        print("=== Database Connection Test ===")
        result = db.execute(text("SELECT 1")).fetchone()
        print(f"Database connection successful: {result}")
        
        print("\n=== Homestay Data ===")
        homestays = db.query(Homestay).all()
        print(f"Total homestays: {len(homestays)}")
        for homestay in homestays[:5]:  # Show first 5
            print(f"  ID: {homestay.id}, Name: {homestay.name}")
        
        print("\n=== Room Data ===")
        rooms = db.query(HomestayRoom).filter(HomestayRoom.homestay_id == 8).all()
        print(f"Rooms for homestay 8: {len(rooms)}")
        for room in rooms:
            print(f"  Room ID: {room.id}, Number: {room.room_number}, Available: {room.is_available}")
        
        print("\n=== Availability Data ===")
        availability_records = db.query(RoomAvailability).join(HomestayRoom).filter(
            HomestayRoom.homestay_id == 8
        ).limit(10).all()
        print(f"Availability records for homestay 8: {len(availability_records)}")
        for record in availability_records:
            print(f"  Date: {record.date}, Room: {record.room_id}, Available: {record.is_available}")
        
        print("\n=== Booking Data ===")
        bookings = db.query(Booking).filter(Booking.homestay_id == 8).limit(5).all()
        print(f"Bookings for homestay 8: {len(bookings)}")
        for booking in bookings:
            print(f"  ID: {booking.id}, Check-in: {booking.check_in}, Check-out: {booking.check_out}, Status: {booking.status}")
        
        print("\n=== Test Quick Availability Logic ===")
        from datetime import date, timedelta
        
        test_date = date(2025, 10, 15)
        print(f"Testing date: {test_date}")
        
        # Check rooms
        rooms = db.query(HomestayRoom).filter(
            HomestayRoom.homestay_id == 8,
            HomestayRoom.is_available == True
        ).all()
        print(f"Available rooms: {len(rooms)}")
        
        for room in rooms:
            # Check availability
            availability = db.query(RoomAvailability).filter(
                RoomAvailability.room_id == room.id,
                RoomAvailability.date == test_date
            ).first()
            
            is_available = False
            if availability:
                is_available = availability.is_available
                print(f"  Room {room.id}: has availability record, is_available = {is_available}")
            else:
                print(f"  Room {room.id}: no availability record")
            
            # Check booking
            booking = db.query(Booking).filter(
                Booking.homestay_id == 8,
                Booking.check_in <= test_date,
                Booking.check_out > test_date,
                Booking.status.in_(["confirmed", "pending"])
            ).first()
            
            if booking:
                print(f"  Room {room.id}: has booking {booking.booking_code}")
            else:
                print(f"  Room {room.id}: no booking")
        
    except Exception as e:
        print(f"Database error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    check_database()