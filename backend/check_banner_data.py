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

query = text("SELECT id, title, position, is_active, priority FROM banners ORDER BY position, priority DESC")
result = session.execute(query)
banners = result.fetchall()

print("DANH SÁCH BANNER:")
print("-" * 100)
print(f"{'ID':<5} {'Title':<40} {'Position':<20} {'Active':<10} {'Priority':<10}")
print("-" * 100)
for b in banners:
    print(f"{b[0]:<5} {b[1]:<40} {b[2]:<20} {b[3]:<10} {b[4]:<10}")

session.close()
