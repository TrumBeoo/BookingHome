# -*- coding: utf-8 -*-
"""
Script kiểm tra banner trong database và so sánh với frontend
"""
import sys
import io
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import json

# Fix encoding for Windows
sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

# Import config
sys.path.append('.')
from app.config import settings

def check_banners():
    """Kiểm tra tất cả banner trong database"""
    
    # Kết nối database
    engine = create_engine(settings.DATABASE_URL)
    Session = sessionmaker(bind=engine)
    session = Session()
    
    print("=" * 80)
    print("KIỂM TRA BANNER TRONG DATABASE")
    print("=" * 80)
    print()
    
    try:
        # Lấy tất cả banner
        query = text("""
            SELECT 
                id, title, description, image_url, link_url, 
                position, button_text, discount_text, priority, 
                is_active, start_date, end_date
            FROM banners
            ORDER BY position, priority DESC
        """)
        
        result = session.execute(query)
        banners = result.fetchall()
        
        if not banners:
            print("⚠️  KHÔNG TÌM THẤY BANNER NÀO TRONG DATABASE!")
            print("   Vui lòng chạy migration: create_banners_table.sql")
            return
        
        print(f"✓ Tìm thấy {len(banners)} banner trong database\n")
        
        # Nhóm theo position
        positions = {}
        active_count = 0
        inactive_count = 0
        expired_count = 0
        
        now = datetime.now()
        
        for banner in banners:
            pos = banner.position
            if pos not in positions:
                positions[pos] = []
            
            # Kiểm tra trạng thái
            is_active = banner.is_active
            is_expired = False
            
            if banner.end_date and banner.end_date < now:
                is_expired = True
                expired_count += 1
            
            if is_active:
                active_count += 1
            else:
                inactive_count += 1
            
            positions[pos].append({
                'id': banner.id,
                'title': banner.title,
                'description': banner.description,
                'image_url': banner.image_url,
                'link_url': banner.link_url,
                'button_text': banner.button_text,
                'discount_text': banner.discount_text,
                'priority': banner.priority,
                'is_active': is_active,
                'is_expired': is_expired,
                'start_date': banner.start_date,
                'end_date': banner.end_date
            })
        
        # Hiển thị thống kê
        print("📊 THỐNG KÊ:")
        print(f"   - Tổng số banner: {len(banners)}")
        print(f"   - Đang active: {active_count}")
        print(f"   - Không active: {inactive_count}")
        print(f"   - Đã hết hạn: {expired_count}")
        print()
        
        # Hiển thị theo position
        print("📍 BANNER THEO VỊ TRÍ:")
        print()
        
        position_names = {
            'home_hero': 'Trang chủ - Hero Section',
            'home_below_search': 'Trang chủ - Dưới thanh tìm kiếm',
            'listing_top': 'Trang danh sách - Trên cùng',
            'listing_sidebar': 'Trang danh sách - Sidebar',
            'detail_top': 'Trang chi tiết - Trên cùng',
            'checkout_sidebar': 'Trang thanh toán - Sidebar',
            'popup': 'Popup/Floating banner'
        }
        
        for pos, pos_name in position_names.items():
            print(f"\n{'=' * 80}")
            print(f"📌 {pos_name} ({pos})")
            print('=' * 80)
            
            if pos in positions:
                for banner in positions[pos]:
                    status = "✓ ACTIVE" if banner['is_active'] else "✗ INACTIVE"
                    if banner['is_expired']:
                        status += " (HẾT HẠN)"
                    
                    print(f"\n  ID: {banner['id']} | Priority: {banner['priority']} | {status}")
                    print(f"  Tiêu đề: {banner['title']}")
                    print(f"  Mô tả: {banner['description'][:80]}..." if banner['description'] and len(banner['description']) > 80 else f"  Mô tả: {banner['description']}")
                    print(f"  Hình ảnh: {banner['image_url']}")
                    print(f"  Link: {banner['link_url']}")
                    print(f"  Button: {banner['button_text']}")
                    print(f"  Discount: {banner['discount_text']}")
                    
                    if banner['start_date']:
                        print(f"  Bắt đầu: {banner['start_date']}")
                    if banner['end_date']:
                        print(f"  Kết thúc: {banner['end_date']}")
            else:
                print("  ⚠️  KHÔNG CÓ BANNER NÀO")
        
        print("\n" + "=" * 80)
        print("⚠️  VẤN ĐỀ CẦN KIỂM TRA:")
        print("=" * 80)
        
        # Kiểm tra các vấn đề
        issues = []
        
        # 1. Kiểm tra position không có banner
        for pos, pos_name in position_names.items():
            if pos not in positions:
                issues.append(f"❌ {pos_name} ({pos}): Không có banner nào")
        
        # 2. Kiểm tra banner hết hạn
        if expired_count > 0:
            issues.append(f"⚠️  Có {expired_count} banner đã hết hạn nhưng vẫn active")
        
        # 3. Kiểm tra image_url
        for pos, banners_list in positions.items():
            for banner in banners_list:
                if not banner['image_url']:
                    issues.append(f"⚠️  Banner ID {banner['id']} ({banner['title']}): Thiếu hình ảnh")
        
        if issues:
            for issue in issues:
                print(f"\n  {issue}")
        else:
            print("\n  ✓ Không phát hiện vấn đề nào")
        
        print("\n" + "=" * 80)
        print("🔍 SO SÁNH VỚI FRONTEND:")
        print("=" * 80)
        
        frontend_issues = [
            "\n1. BannerCarousel.jsx:",
            "   - Fallback data: 'Giảm 30%' (Database có: 'Giảm 20%')",
            "   - Cần cập nhật fallback data hoặc xóa bỏ",
            
            "\n2. PromoBanner.jsx:",
            "   - Fallback data: 'WELCOME20' (Database có: '🎉 Giảm 20%')",
            "   - Cần đồng bộ với database",
            
            "\n3. FloatingPromo.jsx:",
            "   - ❌ KHÔNG KẾT NỐI DATABASE",
            "   - Sử dụng dữ liệu hardcoded: 'Giảm 15%'",
            "   - CẦN SỬA NGAY: Thêm API call để lấy banner position='popup'",
            
            "\n4. HeroSection.jsx:",
            "   - Sử dụng background image tĩnh",
            "   - Không sử dụng BannerCarousel cho home_hero",
            "   - Cần thêm BannerCarousel component",
        ]
        
        # Kiểm tra position nào được sử dụng
        used_positions = ['home_below_search']  # Chỉ có PromoBanner
        unused_positions = [pos for pos in position_names.keys() if pos not in used_positions]
        
        if unused_positions:
            frontend_issues.append(f"\n5. Các position chưa được implement:")
            for pos in unused_positions:
                frontend_issues.append(f"   - {pos}: {position_names[pos]}")
        
        for issue in frontend_issues:
            print(issue)
        
        print("\n" + "=" * 80)
        
    except Exception as e:
        print(f"❌ LỖI: {str(e)}")
        import traceback
        traceback.print_exc()
    
    finally:
        session.close()

if __name__ == "__main__":
    check_banners()
