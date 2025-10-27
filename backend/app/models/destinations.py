from sqlalchemy import Column, BigInteger, String, Text, DateTime, Boolean, Integer, Float, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db import Base

class Destination(Base):
    __tablename__ = "destinations"
    
    id = Column(BigInteger, primary_key=True, index=True)
    name = Column(String(255), nullable=False, index=True)
    slug = Column(String(255), nullable=False, unique=True, index=True)
    description = Column(Text)
    short_description = Column(String(500))
    
    # Location info
    province = Column(String(100), nullable=False, index=True)
    city = Column(String(100))
    latitude = Column(Float)
    longitude = Column(Float)
    
    # Destination type
    destination_type = Column(String(50), index=True)  # Biển, Núi, Văn hóa, Lịch sử, Sinh thái
    season = Column(String(50))  # Hè, Đông, Xuân, Tất cả mùa
    
    # Media
    banner_image = Column(String(500))
    gallery_images = Column(Text)  # JSON string of image paths
    video_url = Column(String(500))
    
    # Content
    introduction = Column(Text)
    climate_info = Column(Text)
    culture_info = Column(Text)
    special_features = Column(Text)
    
    # Food & Activities (JSON strings)
    food_recommendations = Column(Text)  # JSON: [{"name": "Phở", "description": "...", "image": "..."}]
    activities = Column(Text)  # JSON: [{"name": "Trekking", "description": "...", "price": 100000}]
    
    # Stats
    view_count = Column(Integer, default=0)
    avg_rating = Column(Float, default=0.0)
    review_count = Column(Integer, default=0)
    
    # Status
    is_featured = Column(Boolean, default=False)
    is_active = Column(Boolean, default=True)
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    
    # Relationships
    homestays = relationship("Homestay", back_populates="destination")
    reviews = relationship("DestinationReview", back_populates="destination")
    wishlists = relationship("DestinationWishlist", back_populates="destination")

class DestinationReview(Base):
    __tablename__ = "destination_reviews"
    
    id = Column(BigInteger, primary_key=True, index=True)
    destination_id = Column(BigInteger, ForeignKey("destinations.id"), nullable=False)
    user_id = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    
    rating = Column(Integer, nullable=False)  # 1-5 stars
    title = Column(String(255))
    comment = Column(Text)
    
    # Helpful votes
    helpful_count = Column(Integer, default=0)
    
    # Status
    is_approved = Column(Boolean, default=False)
    
    # Timestamps
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    
    # Relationships
    destination = relationship("Destination", back_populates="reviews")
    user = relationship("User")

class DestinationWishlist(Base):
    __tablename__ = "destination_wishlists"
    
    id = Column(BigInteger, primary_key=True, index=True)
    user_id = Column(BigInteger, ForeignKey("users.id"), nullable=False)
    destination_id = Column(BigInteger, ForeignKey("destinations.id"), nullable=False)
    
    created_at = Column(DateTime, server_default=func.now())
    
    # Relationships
    user = relationship("User")
    destination = relationship("Destination", back_populates="wishlists")