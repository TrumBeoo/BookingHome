#!/usr/bin/env python3
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "mysql+pymysql://root:123456@localhost:3306/homestay_booking"

def simple_check():
    try:
        engine = create_engine(DATABASE_URL)
        Session = sessionmaker(bind=engine)
        session = Session()
        
        print("CHECKING PROMOTIONS IN DATABASE")
        print("=" * 40)
        
        # Count total promotions
        total_query = text("SELECT COUNT(*) as total FROM promotions")
        total_result = session.execute(total_query).fetchone()
        print(f"Total promotions: {total_result.total}")
        
        # Count active promotions
        active_query = text("""
            SELECT COUNT(*) as active_count 
            FROM promotions 
            WHERE is_active = 1 
            AND start_date <= NOW() 
            AND end_date >= NOW()
        """)
        active_result = session.execute(active_query).fetchone()
        print(f"Active promotions: {active_result.active_count}")
        
        # Get promotion details (basic info only)
        detail_query = text("""
            SELECT id, code, discount_value, is_active
            FROM promotions 
            WHERE is_active = 1 
            AND start_date <= NOW() 
            AND end_date >= NOW()
            ORDER BY discount_value DESC
        """)
        
        promotions = session.execute(detail_query).fetchall()
        
        print("\nACTIVE PROMOTIONS:")
        print("-" * 30)
        
        for i, promo in enumerate(promotions, 1):
            print(f"{i}. ID: {promo.id}, Code: {promo.code}, Discount: {promo.discount_value}%")
        
        session.close()
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    simple_check()