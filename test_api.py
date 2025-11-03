#!/usr/bin/env python3
import requests
import json

def test_banner_api():
    try:
        print("TESTING BANNER API")
        print("=" * 25)
        
        # Test banner endpoint
        url = "http://localhost:8000/api/promotions/banner?limit=6"
        response = requests.get(url)
        
        print(f"Status Code: {response.status_code}")
        
        if response.status_code == 200:
            data = response.json()
            print(f"Number of promotions returned: {len(data)}")
            
            print("\nPROMOTIONS DATA:")
            print("-" * 40)
            
            for i, promo in enumerate(data, 1):
                print(f"{i}. {promo['name']} ({promo['code']})")
                print(f"   Discount: {promo['discount_value']} ({promo['discount_type']})")
                if promo.get('min_order_value'):
                    print(f"   Min order: {promo['min_order_value']:,.0f} VND")
                print()
        else:
            print(f"Error: {response.text}")
            
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    test_banner_api()