#!/usr/bin/env python3
"""
Script test API availability
"""

import requests
import json
from datetime import date, timedelta

BASE_URL = "http://localhost:8000"
HOMESTAY_ID = 8

def test_get_availability():
    """Test lấy dữ liệu availability"""
    print("🔍 Test GET availability...")
    
    url = f"{BASE_URL}/api/availability/quick/{HOMESTAY_ID}"
    params = {
        "month": 11,
        "year": 2024
    }
    
    response = requests.get(url, params=params)
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"✅ Có {len(data.get('availability', {}))} ngày trong tháng 11")
        
        # Hiển thị 5 ngày đầu
        for i, (date_str, info) in enumerate(list(data.get('availability', {}).items())[:5]):
            print(f"  {date_str}: {info['status']} - {info['tooltip']}")
    else:
        print(f"❌ Lỗi: {response.text}")

def test_block_dates():
    """Test chặn ngày"""
    print("\n🚫 Test block dates...")
    
    # Chặn 3 ngày trong tháng 11
    dates_to_block = [
        "2024-11-15",
        "2024-11-16", 
        "2024-11-17"
    ]
    
    url = f"{BASE_URL}/api/availability/block-dates/{HOMESTAY_ID}"
    data = {
        "dates": dates_to_block,
        "room_ids": None
    }
    
    response = requests.post(url, json=data)
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print(f"✅ {result['message']}")
    else:
        print(f"❌ Lỗi: {response.text}")

def test_unblock_dates():
    """Test bỏ chặn ngày"""
    print("\n✅ Test unblock dates...")
    
    dates_to_unblock = [
        "2024-11-15",
        "2024-11-16"
    ]
    
    url = f"{BASE_URL}/api/availability/unblock-dates/{HOMESTAY_ID}"
    data = {
        "dates": dates_to_unblock,
        "room_ids": None
    }
    
    response = requests.post(url, json=data)
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print(f"✅ {result['message']}")
    else:
        print(f"❌ Lỗi: {response.text}")

def main():
    """Hàm chính"""
    print("Test API Availability\n")
    
    # Test các API
    test_get_availability()
    test_block_dates()
    test_get_availability()  # Kiểm tra lại sau khi block
    test_unblock_dates()
    test_get_availability()  # Kiểm tra lại sau khi unblock
    
    print("\nHoan thanh test!")

if __name__ == "__main__":
    main()