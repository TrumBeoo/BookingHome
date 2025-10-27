from sqlalchemy import Column, Integer, BigInteger, String, Text, Boolean, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db import Base

class SEOMetadata(Base):
    __tablename__ = "seo_metadata"
    
    id = Column(BigInteger, primary_key=True, index=True)
    entity_type = Column(String(50), nullable=False)  # homestay, destination, category
    entity_id = Column(BigInteger, nullable=False)
    meta_title = Column(String(255))
    meta_description = Column(Text)
    meta_keywords = Column(Text)
    og_title = Column(String(255))  # Open Graph title
    og_description = Column(Text)
    og_image = Column(String(500))
    canonical_url = Column(String(500))
    schema_markup = Column(JSON)  # Schema.org structured data
    robots_meta = Column(String(100), default="index,follow")
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())

class URLSlug(Base):
    __tablename__ = "url_slugs"
    
    id = Column(BigInteger, primary_key=True, index=True)
    entity_type = Column(String(50), nullable=False)
    entity_id = Column(BigInteger, nullable=False)
    slug = Column(String(255), unique=True, nullable=False)
    is_primary = Column(Boolean, default=True)
    redirect_to = Column(String(255))  # Redirect cũ về slug mới
    created_at = Column(DateTime, server_default=func.now())

class SitemapEntry(Base):
    __tablename__ = "sitemap_entries"
    
    id = Column(BigInteger, primary_key=True, index=True)
    url = Column(String(500), nullable=False)
    priority = Column(String(3), default="0.5")  # 0.0 - 1.0
    changefreq = Column(String(20), default="weekly")  # always, hourly, daily, weekly, monthly, yearly, never
    lastmod = Column(DateTime, server_default=func.now())
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, server_default=func.now())
    updated_at = Column(DateTime, onupdate=func.now())