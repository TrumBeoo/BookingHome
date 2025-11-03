#!/usr/bin/env python3
import requests
import json

BASE_URL = "http://localhost:8000"
HOMESTAY_ID = 8

def test_get_availability():
    print("Test GET availability...")
    
    url = f"{BASE_URL}/api/availability/quick/{HOMESTAY_ID}"
    params = {"month": 11, "year": 2024}
    
    response = requests.get(url, params=params)
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        data = response.json()
        print(f"Co {len(data.get('availability', {}))} ngay trong thang 11")
        
        for i, (date_str, info) in enumerate(list(data.get('availability', {}).items())[:5]):
            print(f"  {date_str}: {info['status']} - {info['tooltip']}")
    else:
        print(f"Loi: {response.text}")

def test_block_dates():
    print("\nTest block dates...")
    
    dates_to_block = ["2024-11-15", "2024-11-16", "2024-11-17"]
    
    url = f"{BASE_URL}/api/availability/block-dates/{HOMESTAY_ID}"
    data = {"dates": dates_to_block, "room_ids": None}
    
    response = requests.post(url, json=data)
    print(f"Status: {response.status_code}")
    
    if response.status_code == 200:
        result = response.json()
        print(f"Success: {result['message']}")
    else:
        print(f"Loi: {response.text}")

if __name__ == "__main__":
    test_get_availability()
    test_block_dates()
    test_get_availability()