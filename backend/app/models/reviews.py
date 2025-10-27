from sqlalchemy import Column, Integer, BigInteger, String, Text, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db import Base

class Review(Base):
    __tablename__ = "reviews"
    
    id = Column(BigInteger, primary_key=True, index=True)
    user_id = Column(BigInteger, ForeignKey("users.id"))
    homestay_id = Column(BigInteger, ForeignKey("homestays.id"))
    booking_id = Column(BigInteger, ForeignKey("bookings.id"))
    rating = Column(Integer, nullable=False)  # 1-5 stars
    comment = Column(Text)
    is_approved = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    
    # Relationships
    homestay = relationship("Homestay", back_populates="reviews")
    user = relationship("User", back_populates="reviews")
    booking = relationship("Booking")