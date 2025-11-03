import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.config import settings
from app.models.room_categories import HomestayRoom, RoomAvailability
from datetime import date, timedelta

# Create database connection
engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def add_test_availability():
    """Add test availability data for current month"""
    db = SessionLocal()
    
    try:
        print("=== Adding Test Availability Data ===")
        
        # Get rooms for homestay 8
        rooms = db.query(HomestayRoom).filter(
            HomestayRoom.homestay_id == 8,
            HomestayRoom.is_available == True
        ).all()
        
        print(f"Found {len(rooms)} rooms for homestay 8")
        
        # Add availability for current month (October 2025)
        start_date = date(2025, 10, 1)
        end_date = date(2025, 10, 31)
        
        current_date = start_date
        added_count = 0
        
        while current_date <= end_date:
            for room in rooms:
                # Check if availability already exists
                existing = db.query(RoomAvailability).filter(
                    RoomAvailability.room_id == room.id,
                    RoomAvailability.date == current_date
                ).first()
                
                if not existing:
                    # Create availability record
                    # Make some days available, some blocked for testing
                    is_available = True
                    if current_date.day % 7 == 0:  # Block every 7th day
                        is_available = False
                    
                    availability = RoomAvailability(
                        room_id=room.id,
                        date=current_date,
                        is_available=is_available,
                        price_override=None  # Use default room price
                    )
                    
                    db.add(availability)
                    added_count += 1
                    
                    status = "Available" if is_available else "Blocked"
                    print(f"  Added: Room {room.id}, Date {current_date}, Status: {status}")
            
            current_date += timedelta(days=1)
        
        db.commit()
        print(f"\n✓ Successfully added {added_count} availability records")
        
        # Verify the data
        print("\n=== Verification ===")
        test_dates = [date(2025, 10, 1), date(2025, 10, 15), date(2025, 10, 31)]
        
        for test_date in test_dates:
            print(f"\nDate: {test_date}")
            for room in rooms:
                availability = db.query(RoomAvailability).filter(
                    RoomAvailability.room_id == room.id,
                    RoomAvailability.date == test_date
                ).first()
                
                if availability:
                    status = "Available" if availability.is_available else "Blocked"
                    print(f"  Room {room.id}: {status}")
                else:
                    print(f"  Room {room.id}: No record")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    add_test_availability()