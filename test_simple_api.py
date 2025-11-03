#!/usr/bin/env python3
import requests
import json

def test_simple():
    try:
        print("TESTING SIMPLE API")
        print("=" * 25)
        
        # Test simple promotions endpoint
        url = "http://localhost:8000/api/promotions/"
        response = requests.get(url)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Number of promotions: {len(data)}")
            
            for promo in data[:3]:  # Show first 3
                print(f"- {promo.get('name', 'N/A')} ({promo.get('code', 'N/A')})")
        else:
            print(f"Error: {response.text}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_simple()