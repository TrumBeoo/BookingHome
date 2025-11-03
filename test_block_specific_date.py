import requests
import json
from datetime import datetime

# Test blocking specific date
API_BASE = "http://localhost:8000"
HOMESTAY_ID = 8

def test_block_specific_date():
    """Test blocking a specific date"""
    
    # Test blocking date 6
    test_date = "2025-10-06"
    
    print(f"Testing block date: {test_date}")
    
    try:
        # Block the date
        response = requests.post(
            f"{API_BASE}/api/availability/block-dates/{HOMESTAY_ID}",
            json={
                "dates": [test_date],
                "room_ids": None
            }
        )
        
        print(f"Block API Response: {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            print(f"Block response: {data}")
        else:
            print(f"Block error: {response.text}")
            return
        
        # Check availability after blocking
        print(f"\nChecking availability after blocking...")
        
        response = requests.get(
            f"{API_BASE}/api/availability/quick/{HOMESTAY_ID}",
            params={
                'month': 10,
                'year': 2025
            }
        )
        
        if response.status_code == 200:
            data = response.json()
            availability = data.get('availability', {})
            
            # Check dates around the blocked date
            check_dates = ['2025-10-05', '2025-10-06', '2025-10-07']
            
            for date_str in check_dates:
                if date_str in availability:
                    info = availability[date_str]
                    print(f"  {date_str}: status={info['status']}, available_rooms={info['available_rooms']}")
                else:
                    print(f"  {date_str}: No data")
        else:
            print(f"Quick availability error: {response.text}")
            
    except Exception as e:
        print(f"Test failed: {e}")

if __name__ == "__main__":
    test_block_specific_date()