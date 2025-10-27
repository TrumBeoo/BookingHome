from sqlalchemy import Column, Integer, BigInteger, String, Text, Float, DateTime, ForeignKey, Enum, DECIMAL, Date, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db import Base
import enum

class BookingStatus(enum.Enum):
    PENDING = "pending"
    CONFIRMED = "confirmed"
    CANCELLED = "cancelled"
    COMPLETED = "completed"

class PaymentStatus(enum.Enum):
    UNPAID = "unpaid"
    PAID = "paid"
    REFUNDED = "refunded"
    PARTIAL_REFUND = "partial_refund"

class Booking(Base):
    __tablename__ = "bookings"
    
    id = Column(BigInteger, primary_key=True, index=True)
    booking_code = Column(String(255), unique=True, nullable=False)
    user_id = Column(BigInteger, ForeignKey("users.id"))
    homestay_id = Column(BigInteger, ForeignKey("homestays.id"))
    check_in = Column(Date, nullable=False)
    check_out = Column(Date, nullable=False)
    guests = Column(Integer, nullable=False)
    total_price = Column(DECIMAL(10, 2), nullable=False)
    status = Column(String(50), default='pending')
    notes = Column(Text)
    guest_details = Column(JSON)
    guest_info = Column(JSON)
    payment_method = Column(String(255))
    special_requests = Column(Text)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    
    # Relationships
    homestay = relationship("Homestay", back_populates="bookings")
    user = relationship("User", back_populates="bookings")
    payments = relationship("Payment", back_populates="booking")

class Payment(Base):
    __tablename__ = "payments"
    
    id = Column(BigInteger, primary_key=True, index=True)
    booking_id = Column(BigInteger, ForeignKey("bookings.id"))
    payment_method = Column(String(255))
    amount = Column(DECIMAL(10, 2), nullable=False)
    status = Column(String(50), default='unpaid')
    transaction_id = Column(String(255))
    payment_details = Column(JSON)
    paid_at = Column(DateTime)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    
    # Relationships
    booking = relationship("Booking", back_populates="payments")