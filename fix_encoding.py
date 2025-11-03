#!/usr/bin/env python3
import sys
import os
sys.path.append(os.path.join(os.path.dirname(__file__), 'backend'))

from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

DATABASE_URL = "mysql+pymysql://root:123456@localhost:3306/homestay_booking"

def fix_encoding():
    try:
        engine = create_engine(DATABASE_URL)
        Session = sessionmaker(bind=engine)
        session = Session()
        
        print("FIXING ENCODING ISSUES")
        print("=" * 30)
        
        # Update promotions with safe names and descriptions
        updates = [
            {
                'code': 'FAMILY400',
                'name': 'Giam gia gia dinh',
                'description': 'Uu dai dac biet cho gia dinh'
            },
            {
                'code': 'NEWCUSTOMER', 
                'name': 'Khach hang moi',
                'description': 'Chao mung khach hang moi'
            },
            {
                'code': 'TET2025',
                'name': 'Uu dai Tet 2025', 
                'description': 'Giam gia dac biet dip Tet Nguyen dan 2025'
            },
            {
                'code': 'EARLYBIRD30',
                'name': 'Dat som giam 30%',
                'description': 'Dat truoc 7 ngay giam 30%'
            },
            {
                'code': 'AUTUMN2024',
                'name': 'Mua thu 2024',
                'description': 'Uu dai mua thu'
            },
            {
                'code': 'WEEKEND15',
                'name': 'Cuoi tuan 15%',
                'description': 'Giam gia cuoi tuan'
            }
        ]
        
        for update in updates:
            update_query = text("""
                UPDATE promotions 
                SET name = :name, description = :description
                WHERE code = :code
            """)
            session.execute(update_query, update)
        
        session.commit()
        print("Updated all promotion names and descriptions")
        
        # Verify
        verify_query = text("SELECT code, name, description FROM promotions WHERE is_active = 1")
        results = session.execute(verify_query).fetchall()
        
        print("\nVERIFICATION:")
        for result in results:
            print(f"Code: {result.code}, Name: {result.name}")
        
        session.close()
        
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    fix_encoding()