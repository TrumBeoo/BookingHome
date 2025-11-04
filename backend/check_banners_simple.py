# -*- coding: utf-8 -*-
"""
Script kiểm tra cấu trúc bảng banners
"""
import sys
import io
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker

# Fix encoding for Windows
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Import config
sys.path.append('.')
from app.config import settings

def check_table_structure():
    """Kiểm tra cấu trúc bảng banners"""
    
    engine = create_engine(settings.DATABASE_URL)
    Session = sessionmaker(bind=engine)
    session = Session()
    
    print("=" * 80)
    print("KIỂM TRA CẤU TRÚC BẢNG BANNERS")
    print("=" * 80)
    print()
    
    try:
        # Kiểm tra xem bảng có tồn tại không
        query = text("SHOW TABLES LIKE 'banners'")
        result = session.execute(query)
        tables = result.fetchall()
        
        if not tables:
            print("❌ BẢNG 'banners' KHÔNG TỒN TẠI!")
            print("   Vui lòng chạy migration: create_banners_table.sql")
            return
        
        print("✓ Bảng 'banners' tồn tại\n")
        
        # Lấy cấu trúc bảng
        query = text("DESCRIBE banners")
        result = session.execute(query)
        columns = result.fetchall()
        
        print("📋 CẤU TRÚC BẢNG:")
        print("-" * 80)
        print(f"{'Tên cột':<20} {'Kiểu dữ liệu':<30} {'Null':<10} {'Key':<10}")
        print("-" * 80)
        
        column_names = []
        for col in columns:
            column_names.append(col[0])
            print(f"{col[0]:<20} {col[1]:<30} {col[2]:<10} {col[3]:<10}")
        
        print("-" * 80)
        print()
        
        # Kiểm tra các cột cần thiết
        required_columns = {
            'id': 'ID banner',
            'title': 'Tiêu đề',
            'description': 'Mô tả',
            'image_url': 'URL hình ảnh',
            'link_url': 'URL liên kết',
            'position': 'Vị trí hiển thị',
            'button_text': 'Text nút bấm',
            'discount_text': 'Text giảm giá',
            'priority': 'Độ ưu tiên',
            'is_active': 'Trạng thái active',
            'start_date': 'Ngày bắt đầu',
            'end_date': 'Ngày kết thúc'
        }
        
        print("🔍 KIỂM TRA CÁC CỘT CẦN THIẾT:")
        print("-" * 80)
        
        missing_columns = []
        for col, desc in required_columns.items():
            if col in column_names:
                print(f"✓ {col:<20} - {desc}")
            else:
                print(f"❌ {col:<20} - {desc} (THIẾU)")
                missing_columns.append(col)
        
        print("-" * 80)
        print()
        
        if missing_columns:
            print("⚠️  CÁC CỘT BỊ THIẾU:")
            for col in missing_columns:
                print(f"   - {col}")
            print()
            print("💡 KHUYẾN NGHỊ:")
            print("   Chạy lại migration create_banners_table.sql để tạo đầy đủ các cột")
        else:
            print("✓ Tất cả các cột cần thiết đều có")
            
            # Đếm số banner
            query = text("SELECT COUNT(*) as count FROM banners")
            result = session.execute(query)
            count = result.fetchone()[0]
            
            print(f"\n📊 Số lượng banner trong database: {count}")
            
            if count == 0:
                print("\n⚠️  Chưa có banner nào. Chạy INSERT trong migration để thêm dữ liệu mẫu")
        
        print()
        
    except Exception as e:
        print(f"❌ LỖI: {str(e)}")
        import traceback
        traceback.print_exc()
    
    finally:
        session.close()

if __name__ == "__main__":
    check_table_structure()
