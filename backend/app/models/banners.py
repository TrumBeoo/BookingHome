from sqlalchemy import Column, Integer, BigInteger, String, Text, Boolean, DateTime, Enum
from sqlalchemy.sql import func
from app.db import Base
import enum

class BannerPosition(str, enum.Enum):
    HOME_HERO = "home_hero"  # Trang chủ - Hero section
    HOME_BELOW_SEARCH = "home_below_search"  # Trang chủ - Dưới thanh tìm kiếm
    LISTING_TOP = "listing_top"  # Trang danh sách - Trên cùng
    LISTING_SIDEBAR = "listing_sidebar"  # Trang danh sách - Sidebar
    DETAIL_TOP = "detail_top"  # Trang chi tiết - Trên cùng
    CHECKOUT_SIDEBAR = "checkout_sidebar"  # Trang thanh toán - Sidebar
    POPUP = "popup"  # Popup/floating banner

class Banner(Base):
    __tablename__ = "banners"
    
    id = Column(BigInteger, primary_key=True, index=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    image_url = Column(String(500))
    link_url = Column(String(500))
    position = Column(Enum(BannerPosition), nullable=False)
    button_text = Column(String(100))
    discount_text = Column(String(100))
    priority = Column(Integer, default=0)  # Thứ tự hiển thị
    is_active = Column(Boolean, default=True)
    start_date = Column(DateTime)
    end_date = Column(DateTime)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
