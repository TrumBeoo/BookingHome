from sqlalchemy import Column, Integer, BigInteger, String, Text, Boolean, DateTime, Date, ForeignKey, DECIMAL
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db import Base

class HomestayAvailability(Base):
    __tablename__ = "homestay_availability"
    
    id = Column(BigInteger, primary_key=True, index=True)
    homestay_id = Column(BigInteger, ForeignKey("homestays.id"))
    date = Column(Date, nullable=False)
    is_available = Column(Boolean, default=True)
    price_override = Column(DECIMAL(10, 2))
    min_nights = Column(Integer, default=1)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    
    # Relationships
    homestay = relationship("Homestay")

class ContactMessage(Base):
    __tablename__ = "contact_messages"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    phone = Column(String(20))
    subject = Column(String(255))
    message = Column(Text, nullable=False)
    status = Column(String(50), default='new')
    admin_response = Column(Text)
    responded_by = Column(BigInteger, ForeignKey("users.id"))
    responded_at = Column(DateTime)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    
    # Relationships
    responder = relationship("User")

class Notification(Base):
    __tablename__ = "notifications"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(BigInteger, ForeignKey("users.id"))
    user_type = Column(String(20), default='user')
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    type = Column(String(50))
    related_type = Column(String(50))
    related_id = Column(Integer)
    is_read = Column(Boolean, default=False)
    read_at = Column(DateTime)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    
    # Relationships
    user = relationship("User")

class Wishlist(Base):
    __tablename__ = "wishlists"
    
    id = Column(BigInteger, primary_key=True, index=True)
    user_id = Column(BigInteger, ForeignKey("users.id"))
    homestay_id = Column(BigInteger, ForeignKey("homestays.id"))
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    
    # Relationships
    user = relationship("User")
    homestay = relationship("Homestay")

class PasswordReset(Base):
    __tablename__ = "password_resets"
    
    email = Column(String(255), primary_key=True)
    token = Column(String(255), nullable=False)
    created_at = Column(DateTime, server_default=func.now())