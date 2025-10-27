from sqlalchemy import Column, Integer, BigInteger, String, Text, Float, Boolean, DateTime, ForeignKey, JSON, DECIMAL
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db import Base
from app.models.amenities import amenity_homestay

class Homestay(Base):
    __tablename__ = "homestays"
    
    id = Column(BigInteger, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    slug = Column(String(255))
    description = Column(Text)
    price_per_night = Column(DECIMAL(10, 2), nullable=False)
    max_guests = Column(Integer)
    host_id = Column(BigInteger, ForeignKey("users.id"))
    location_id = Column(BigInteger, ForeignKey("locations.id"))
    category_id = Column(BigInteger, ForeignKey("categories.id"))
    destination_id = Column(BigInteger, ForeignKey("destinations.id"))
    address = Column(String(255))
    latitude = Column(DECIMAL(10, 8))
    longitude = Column(DECIMAL(11, 8))
    contact_info = Column(JSON)
    rules = Column(Text)
    check_in_out_times = Column(JSON)
    status = Column(String(50), default='active')
    discount_percent = Column(Integer, default=0)
    featured = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    
    # Relationships
    host = relationship("User", foreign_keys=[host_id])
    location = relationship("Location", back_populates="homestays")
    category = relationship("Category", back_populates="homestays")
    destination = relationship("Destination", back_populates="homestays")
    bookings = relationship("Booking", back_populates="homestay")
    reviews = relationship("Review", back_populates="homestay")
    images = relationship("HomestayImage", back_populates="homestay")
    amenities = relationship("Amenity", secondary=amenity_homestay, back_populates="homestays")

class Category(Base):
    __tablename__ = "categories"
    
    id = Column(BigInteger, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    slug = Column(String(255))
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    
    # Relationships
    homestays = relationship("Homestay", back_populates="category")

# Use existing homestay_availability table instead
# class Availability(Base):
#     __tablename__ = "availability"
#     
#     id = Column(Integer, primary_key=True, index=True)
#     homestay_id = Column(Integer, ForeignKey("homestays.id"))
#     date = Column(DateTime, nullable=False)
#     is_available = Column(Boolean, default=True)
#     price_override = Column(Float)  # Special pricing for specific dates
#     
#     # Relationships
#     homestay = relationship("Homestay", back_populates="availability")