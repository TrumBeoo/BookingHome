import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.config import settings
from app.models.room_categories import HomestayRoom, RoomAvailability
from datetime import date, datetime

# Create database connection
engine = create_engine(settings.DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def test_first_day_issue():
    """Test first day of month issue"""
    db = SessionLocal()
    
    try:
        print("=== Test First Day Issue ===")
        
        # Test multiple months first day
        test_dates = [
            date(2025, 10, 1),
            date(2025, 11, 1), 
            date(2025, 12, 1),
            date(2026, 1, 1)
        ]
        
        for test_date in test_dates:
            print(f"\nTesting {test_date}:")
            
            # Check availability records
            records = db.query(RoomAvailability).join(HomestayRoom).filter(
                HomestayRoom.homestay_id == 8,
                RoomAvailability.date == test_date
            ).all()
            
            print(f"  Found {len(records)} availability records")
            for record in records:
                print(f"    Room {record.room_id}: available={record.is_available}")
        
        # Check if there's a pattern with date creation
        print("\n=== Check Date Creation Pattern ===")
        
        # Simulate frontend date creation
        year = 2025
        month = 9  # October (0-based)
        day = 1
        
        # JavaScript style: new Date(year, month, day)
        js_date = datetime(year, month + 1, day)  # month is 0-based in JS
        print(f"JS-style date creation: {js_date}")
        
        # UTC style: new Date(Date.UTC(year, month, day))
        utc_date = datetime(year, month + 1, day)
        print(f"UTC-style date creation: {utc_date}")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    test_first_day_issue()