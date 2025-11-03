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

def debug_date_issue():
    """Debug date handling issue"""
    db = SessionLocal()
    
    try:
        print("=== Debug Date Issue ===")
        
        # Check recent availability records
        recent_records = db.query(RoomAvailability).join(HomestayRoom).filter(
            HomestayRoom.homestay_id == 8
        ).order_by(RoomAvailability.date.desc()).limit(10).all()
        
        print(f"Recent availability records:")
        for record in recent_records:
            print(f"  Date: {record.date} ({type(record.date)}), Room: {record.room_id}, Available: {record.is_available}")
        
        # Test date parsing
        test_dates = ['2025-10-06', '2025-10-07']
        
        for date_str in test_dates:
            print(f"\nTesting date: {date_str}")
            
            # Parse date
            parsed_date = datetime.strptime(date_str, "%Y-%m-%d").date()
            print(f"  Parsed as: {parsed_date} ({type(parsed_date)})")
            
            # Check database
            records = db.query(RoomAvailability).join(HomestayRoom).filter(
                HomestayRoom.homestay_id == 8,
                RoomAvailability.date == parsed_date
            ).all()
            
            print(f"  Found {len(records)} records in DB")
            for record in records:
                print(f"    Room {record.room_id}: {record.is_available}")
        
    except Exception as e:
        print(f"Error: {e}")
        import traceback
        traceback.print_exc()
    finally:
        db.close()

if __name__ == "__main__":
    debug_date_issue()