# -*- coding: utf-8 -*-
import sys
import io
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')
sys.path.append('.')
from app.config import settings

engine = create_engine(settings.DATABASE_URL)
Session = sessionmaker(bind=engine)
session = Session()

# Test query trực tiếp
query = text("""
    SELECT id, title, position, is_active 
    FROM banners 
    WHERE position = 'home_hero' AND is_active = 1
    ORDER BY priority DESC
""")

result = session.execute(query)
banners = result.fetchall()

print(f"Tìm thấy {len(banners)} banner:")
for b in banners:
    print(f"  - {b[1]} (ID: {b[0]})")

session.close()
