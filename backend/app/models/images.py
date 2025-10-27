from sqlalchemy import Column, BigInteger, String, Integer, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db import Base

class HomestayImage(Base):
    __tablename__ = "homestay_images"
    
    id = Column(BigInteger, primary_key=True, index=True)
    homestay_id = Column(BigInteger, ForeignKey("homestays.id"), nullable=False)
    image_path = Column(String(255), nullable=False)
    alt_text = Column(String(255))
    is_primary = Column(Boolean, default=False)
    sort_order = Column(Integer, default=0)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    
    # Relationships
    homestay = relationship("Homestay", back_populates="images")