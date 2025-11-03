import requests
import json
from datetime import datetime

# Test API availability
API_BASE = "http://localhost:8000"
HOMESTAY_ID = 8

def test_api_connection():
    """Test basic API connection"""
    try:
        response = requests.get(f"{API_BASE}/health")
        print(f"API Health Check: {response.status_code}")
        print(f"Response: {response.json()}")
        return True
    except Exception as e:
        print(f"API Connection Failed: {e}")
        return False

def test_quick_availability():
    """Test quick availability endpoint"""
    try:
        current_date = datetime.now()
        params = {
            'month': current_date.month,
            'year': current_date.year
        }
        
        response = requests.get(
            f"{API_BASE}/api/availability/quick/{HOMESTAY_ID}",
            params=params
        )
        
        print(f"Quick Availability API: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Month: {data.get('month')}, Year: {data.get('year')}")
            print(f"Total rooms: {data.get('total_rooms')}")
            
            availability = data.get('availability', {})
            print(f"Availability data count: {len(availability)}")
            
            # Show first few days
            for i, (date, info) in enumerate(list(availability.items())[:5]):
                print(f"  {date}: {info['status']} - {info['tooltip']}")
            
            return True
        else:
            print(f"Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"Quick Availability Test Failed: {e}")
        return False

def test_block_dates():
    """Test block dates functionality"""
    try:
        test_date = datetime.now().strftime('%Y-%m-%d')
        
        # Block a date
        response = requests.post(
            f"{API_BASE}/api/availability/block-dates/{HOMESTAY_ID}",
            json={
                "dates": [test_date],
                "room_ids": None
            }
        )
        
        print(f"Block Dates API: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Block response: {data}")
            return True
        else:
            print(f"Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"Block Dates Test Failed: {e}")
        return False

def test_unblock_dates():
    """Test unblock dates functionality"""
    try:
        test_date = datetime.now().strftime('%Y-%m-%d')
        
        # Unblock a date
        response = requests.post(
            f"{API_BASE}/api/availability/unblock-dates/{HOMESTAY_ID}",
            json={
                "dates": [test_date],
                "room_ids": None
            }
        )
        
        print(f"Unblock Dates API: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Unblock response: {data}")
            return True
        else:
            print(f"Error: {response.text}")
            return False
            
    except Exception as e:
        print(f"Unblock Dates Test Failed: {e}")
        return False

if __name__ == "__main__":
    print("Testing Availability API...")
    print("=" * 50)
    
    # Test API connection
    if not test_api_connection():
        print("Cannot connect to API. Make sure backend is running.")
        exit(1)
    
    print("\n" + "=" * 50)
    
    # Test quick availability
    test_quick_availability()
    
    print("\n" + "=" * 50)
    
    # Test block/unblock functionality
    test_block_dates()
    test_unblock_dates()
    
    print("\n" + "=" * 50)
    print("Test completed!")