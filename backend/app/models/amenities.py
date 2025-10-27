from sqlalchemy import Column, BigInteger, String, DateTime, Table, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db import Base

# Association table for many-to-many relationship
amenity_homestay = Table(
    'amenity_homestay',
    Base.metadata,
    Column('id', BigInteger, primary_key=True),
    Column('amenity_id', BigInteger, ForeignKey('amenities.id')),
    Column('homestay_id', BigInteger, ForeignKey('homestays.id')),
    Column('created_at', DateTime, server_default=func.now()),
    Column('updated_at', DateTime, onupdate=func.now())
)

class Amenity(Base):
    __tablename__ = "amenities"
    
    id = Column(BigInteger, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    icon = Column(String(255))
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())
    
    # Relationships
    homestays = relationship("Homestay", secondary=amenity_homestay)