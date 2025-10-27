from sqlalchemy import Column, Integer, BigInteger, String, Text, Boolean, DateTime, ForeignKey, JSON, DECIMAL, Table
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db import Base

# Association table for room category tags
room_category_tags = Table(
    'room_category_tags',
    Base.metadata,
    Column('room_category_id', BigInteger, ForeignKey('room_categories.id')),
    Column('tag_id', BigInteger, ForeignKey('tags.id'))
)

class RoomCategory(Base):
    __tablename__ = "room_categories"
    
    id = Column(BigInteger, primary_key=True, index=True)
    name = Column(String(255), nullable=False)  # Phòng đơn, đôi, tập thể
    slug = Column(String(255), unique=True)
    description = Column(Text)
    base_price = Column(DECIMAL(10, 2))  # Giá cơ bản
    max_guests = Column(Integer, default=1)
    room_size = Column(DECIMAL(5, 2))  # Diện tích phòng (m²)
    bed_type = Column(String(100))  # Loại giường
    view_type = Column(String(100))  # View biển, núi, thành phố
    has_balcony = Column(Boolean, default=False)
    has_kitchen = Column(Boolean, default=False)
    is_pet_friendly = Column(Boolean, default=False)
    amenities = Column(JSON)  # Tiện nghi riêng của loại phòng
    images = Column(JSON)  # Hình ảnh mẫu
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    
    # Relationships
    homestay_rooms = relationship("HomestayRoom", back_populates="room_category")
    tags = relationship("Tag", secondary=room_category_tags, back_populates="room_categories")

class Tag(Base):
    __tablename__ = "tags"
    
    id = Column(BigInteger, primary_key=True, index=True)
    name = Column(String(100), nullable=False, unique=True)
    slug = Column(String(100), unique=True)
    color = Column(String(7), default="#007bff")  # Màu hiển thị tag
    icon = Column(String(50))  # Icon class
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    room_categories = relationship("RoomCategory", secondary=room_category_tags, back_populates="tags")

class HomestayRoom(Base):
    __tablename__ = "homestay_rooms"
    
    id = Column(BigInteger, primary_key=True, index=True)
    homestay_id = Column(BigInteger, ForeignKey("homestays.id"))
    room_category_id = Column(BigInteger, ForeignKey("room_categories.id"))
    room_number = Column(String(50))  # Số phòng
    custom_name = Column(String(255))  # Tên riêng của phòng
    price_per_night = Column(DECIMAL(10, 2))  # Giá riêng (override base price)
    is_available = Column(Boolean, default=True)
    special_features = Column(JSON)  # Tính năng đặc biệt riêng
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    
    # Relationships
    homestay = relationship("Homestay")
    room_category = relationship("RoomCategory", back_populates="homestay_rooms")
    availability = relationship("RoomAvailability", back_populates="room")
    bookings = relationship("RoomBooking", back_populates="room")

class RoomAvailability(Base):
    __tablename__ = "room_availability"
    
    id = Column(BigInteger, primary_key=True, index=True)
    room_id = Column(BigInteger, ForeignKey("homestay_rooms.id"))
    date = Column(DateTime, nullable=False)
    is_available = Column(Boolean, default=True)
    price_override = Column(DECIMAL(10, 2))  # Giá đặc biệt cho ngày cụ thể
    min_nights = Column(Integer, default=1)  # Số đêm tối thiểu
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    room = relationship("HomestayRoom", back_populates="availability")

class RoomBooking(Base):
    __tablename__ = "room_bookings"
    
    id = Column(BigInteger, primary_key=True, index=True)
    booking_id = Column(BigInteger, ForeignKey("bookings.id"))
    room_id = Column(BigInteger, ForeignKey("homestay_rooms.id"))
    check_in = Column(DateTime, nullable=False)
    check_out = Column(DateTime, nullable=False)
    guests = Column(Integer, nullable=False)
    room_price = Column(DECIMAL(10, 2), nullable=False)
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    booking = relationship("Booking")
    room = relationship("HomestayRoom", back_populates="bookings")