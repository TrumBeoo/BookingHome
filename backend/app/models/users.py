from sqlalchemy import Column, Integer, String, DateTime, Boolean, Enum, BigInteger
from sqlalchemy.sql import func
from ..db import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(BigInteger, primary_key=True, index=True)
    name = Column(String(255), nullable=False)  # Khớp với database
    email = Column(String(255), unique=True, index=True, nullable=False)
    phone = Column(String(255), nullable=True)
    role = Column(Enum('super_admin', 'admin', 'host', 'customer', name='user_role'), default='customer')
    avatar = Column(String(255), nullable=True)
    date_of_birth = Column(DateTime, nullable=True)
    gender = Column(Enum('male', 'female', 'other', name='user_gender'), nullable=True)
    email_verified_at = Column(DateTime, nullable=True)
    password = Column(String(255), nullable=False)  # Khớp với database
    remember_token = Column(String(100), nullable=True)
    created_at = Column(DateTime, nullable=True)
    updated_at = Column(DateTime, nullable=True)