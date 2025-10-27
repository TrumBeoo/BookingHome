from sqlalchemy import Column, Integer, BigInteger, String, Text, Boolean, DateTime, ForeignKey, JSON, DECIMAL, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db import Base
import enum

class DiscountType(enum.Enum):
    PERCENTAGE = "percentage"
    FIXED_AMOUNT = "fixed_amount"

class PromotionType(enum.Enum):
    COUPON = "coupon"
    AUTOMATIC = "automatic"
    COMBO = "combo"
    SEASONAL = "seasonal"

class Promotion(Base):
    __tablename__ = "promotions"
    
    id = Column(BigInteger, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    code = Column(String(50), unique=True)  # Mã giảm giá
    type = Column(Enum(PromotionType), default=PromotionType.COUPON)
    discount_type = Column(Enum(DiscountType), nullable=False)
    discount_value = Column(DECIMAL(10, 2), nullable=False)  # Giá trị giảm
    max_discount = Column(DECIMAL(10, 2))  # Giảm tối đa (cho %)
    min_order_value = Column(DECIMAL(10, 2))  # Giá trị đơn hàng tối thiểu
    max_uses = Column(Integer)  # Số lần sử dụng tối đa
    used_count = Column(Integer, default=0)  # Đã sử dụng bao nhiêu lần
    max_uses_per_user = Column(Integer, default=1)  # Tối đa mỗi user
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    is_active = Column(Boolean, default=True)
    conditions = Column(JSON)  # Điều kiện áp dụng
    applicable_homestays = Column(JSON)  # Homestay áp dụng
    applicable_categories = Column(JSON)  # Loại phòng áp dụng
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    
    # Relationships
    usage_history = relationship("PromotionUsage", back_populates="promotion")

class PromotionUsage(Base):
    __tablename__ = "promotion_usage"
    
    id = Column(BigInteger, primary_key=True, index=True)
    promotion_id = Column(BigInteger, ForeignKey("promotions.id"))
    user_id = Column(BigInteger, ForeignKey("users.id"))
    booking_id = Column(BigInteger, ForeignKey("bookings.id"))
    discount_amount = Column(DECIMAL(10, 2), nullable=False)
    used_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    promotion = relationship("Promotion", back_populates="usage_history")
    user = relationship("User")
    booking = relationship("Booking")

class ComboPackage(Base):
    __tablename__ = "combo_packages"
    
    id = Column(BigInteger, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    slug = Column(String(255), unique=True)
    original_price = Column(DECIMAL(10, 2), nullable=False)
    combo_price = Column(DECIMAL(10, 2), nullable=False)
    savings = Column(DECIMAL(10, 2))  # Tiết kiệm được
    min_nights = Column(Integer, default=2)
    max_nights = Column(Integer)
    includes_breakfast = Column(Boolean, default=False)
    includes_transport = Column(Boolean, default=False)
    includes_tour = Column(Boolean, default=False)
    additional_services = Column(JSON)  # Dịch vụ thêm
    terms_conditions = Column(Text)
    is_active = Column(Boolean, default=True)
    valid_from = Column(DateTime, nullable=False)
    valid_until = Column(DateTime, nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    
    # Relationships
    combo_homestays = relationship("ComboHomestay", back_populates="combo")

class ComboHomestay(Base):
    __tablename__ = "combo_homestays"
    
    id = Column(BigInteger, primary_key=True, index=True)
    combo_id = Column(BigInteger, ForeignKey("combo_packages.id"))
    homestay_id = Column(BigInteger, ForeignKey("homestays.id"))
    room_category_id = Column(BigInteger, ForeignKey("room_categories.id"))
    nights_included = Column(Integer, default=1)
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    combo = relationship("ComboPackage", back_populates="combo_homestays")
    homestay = relationship("Homestay")
    room_category = relationship("RoomCategory")

class SeasonalPricing(Base):
    __tablename__ = "seasonal_pricing"
    
    id = Column(BigInteger, primary_key=True, index=True)
    name = Column(String(255), nullable=False)  # Tên mùa (Lễ 30/4, Cuối tuần...)
    description = Column(Text)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime, nullable=False)
    price_multiplier = Column(DECIMAL(3, 2), default=1.0)  # Hệ số nhân giá
    fixed_surcharge = Column(DECIMAL(10, 2))  # Phụ thu cố định
    applies_to_weekends = Column(Boolean, default=False)
    applies_to_holidays = Column(Boolean, default=False)
    applicable_homestays = Column(JSON)  # Homestay áp dụng
    applicable_categories = Column(JSON)  # Loại phòng áp dụng
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())