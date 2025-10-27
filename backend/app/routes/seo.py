from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db import get_db
from app.models.seo import SEOMetadata, URLSlug, SitemapEntry
from app.models.homestays import Homestay
from app.models.destinations import Destination
from pydantic import BaseModel
from datetime import datetime
import re

router = APIRouter(prefix="/api/seo", tags=["SEO"])

class SEOMetadataResponse(BaseModel):
    meta_title: Optional[str]
    meta_description: Optional[str]
    meta_keywords: Optional[str]
    og_title: Optional[str]
    og_description: Optional[str]
    og_image: Optional[str]
    canonical_url: Optional[str]

class SitemapEntryResponse(BaseModel):
    url: str
    priority: str
    changefreq: str
    lastmod: datetime

def generate_slug(text: str) -> str:
    """Tạo URL slug thân thiện"""
    # Chuyển về lowercase và loại bỏ dấu tiếng Việt
    slug = text.lower()
    
    # Bảng chuyển đổi dấu tiếng Việt
    vietnamese_map = {
        'à': 'a', 'á': 'a', 'ạ': 'a', 'ả': 'a', 'ã': 'a', 'â': 'a', 'ầ': 'a', 'ấ': 'a', 'ậ': 'a', 'ẩ': 'a', 'ẫ': 'a',
        'ă': 'a', 'ằ': 'a', 'ắ': 'a', 'ặ': 'a', 'ẳ': 'a', 'ẵ': 'a',
        'è': 'e', 'é': 'e', 'ẹ': 'e', 'ẻ': 'e', 'ẽ': 'e', 'ê': 'e', 'ề': 'e', 'ế': 'e', 'ệ': 'e', 'ể': 'e', 'ễ': 'e',
        'ì': 'i', 'í': 'i', 'ị': 'i', 'ỉ': 'i', 'ĩ': 'i',
        'ò': 'o', 'ó': 'o', 'ọ': 'o', 'ỏ': 'o', 'õ': 'o', 'ô': 'o', 'ồ': 'o', 'ố': 'o', 'ộ': 'o', 'ổ': 'o', 'ỗ': 'o',
        'ơ': 'o', 'ờ': 'o', 'ớ': 'o', 'ợ': 'o', 'ở': 'o', 'ỡ': 'o',
        'ù': 'u', 'ú': 'u', 'ụ': 'u', 'ủ': 'u', 'ũ': 'u', 'ư': 'u', 'ừ': 'u', 'ứ': 'u', 'ự': 'u', 'ử': 'u', 'ữ': 'u',
        'ỳ': 'y', 'ý': 'y', 'ỵ': 'y', 'ỷ': 'y', 'ỹ': 'y',
        'đ': 'd'
    }
    
    for vietnamese, english in vietnamese_map.items():
        slug = slug.replace(vietnamese, english)
    
    # Loại bỏ ký tự đặc biệt và thay thế bằng dấu gạch ngang
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'\s+', '-', slug)
    slug = re.sub(r'-+', '-', slug)
    slug = slug.strip('-')
    
    return slug

@router.get("/metadata/{entity_type}/{entity_id}")
def get_seo_metadata(
    entity_type: str,
    entity_id: int,
    db: Session = Depends(get_db)
):
    """Lấy SEO metadata cho entity"""
    
    # Kiểm tra entity tồn tại
    if entity_type == "homestay":
        entity = db.query(Homestay).filter(Homestay.id == entity_id).first()
    elif entity_type == "destination":
        entity = db.query(Destination).filter(Destination.id == entity_id).first()
    else:
        raise HTTPException(status_code=400, detail="Entity type không hợp lệ")
    
    if not entity:
        raise HTTPException(status_code=404, detail="Entity không tồn tại")
    
    # Lấy SEO metadata
    seo_data = db.query(SEOMetadata).filter(
        SEOMetadata.entity_type == entity_type,
        SEOMetadata.entity_id == entity_id
    ).first()
    
    if seo_data:
        return SEOMetadataResponse(
            meta_title=seo_data.meta_title,
            meta_description=seo_data.meta_description,
            meta_keywords=seo_data.meta_keywords,
            og_title=seo_data.og_title,
            og_description=seo_data.og_description,
            og_image=seo_data.og_image,
            canonical_url=seo_data.canonical_url
        )
    else:
        # Tạo SEO metadata mặc định
        if entity_type == "homestay":
            return SEOMetadataResponse(
                meta_title=f"{entity.name} - Homestay tại {entity.location.name if entity.location else 'Việt Nam'}",
                meta_description=f"Đặt phòng {entity.name} với giá {entity.price_per_night:,.0f}đ/đêm. {entity.description[:150] if entity.description else ''}",
                meta_keywords=f"homestay, {entity.name}, {entity.location.name if entity.location else ''}, đặt phòng",
                og_title=f"{entity.name} - Homestay",
                og_description=f"Homestay tuyệt vời tại {entity.location.name if entity.location else 'Việt Nam'}",
                canonical_url=f"/homestay/{generate_slug(entity.name)}-{entity.id}"
            )
        elif entity_type == "destination":
            return SEOMetadataResponse(
                meta_title=f"Du lịch {entity.name} - Homestay & Khách sạn tốt nhất",
                meta_description=f"Khám phá {entity.name} với những homestay và khách sạn tuyệt vời. Đặt ngay để có giá tốt nhất!",
                meta_keywords=f"du lịch, {entity.name}, homestay, khách sạn, đặt phòng",
                og_title=f"Du lịch {entity.name}",
                og_description=f"Điểm đến tuyệt vời cho kỳ nghỉ của bạn",
                canonical_url=f"/destination/{generate_slug(entity.name)}"
            )

@router.get("/sitemap")
def generate_sitemap(db: Session = Depends(get_db)):
    """Tạo sitemap cho website"""
    
    sitemap_entries = []
    
    # Thêm trang chủ
    sitemap_entries.append(SitemapEntryResponse(
        url="/",
        priority="1.0",
        changefreq="daily",
        lastmod=datetime.now()
    ))
    
    # Thêm các homestay
    homestays = db.query(Homestay).filter(
        Homestay.is_active == True,
        Homestay.status == "active"
    ).all()
    
    for homestay in homestays:
        slug = generate_slug(homestay.name)
        sitemap_entries.append(SitemapEntryResponse(
            url=f"/homestay/{slug}-{homestay.id}",
            priority="0.8",
            changefreq="weekly",
            lastmod=homestay.updated_at or homestay.created_at
        ))
    
    # Thêm các destination
    destinations = db.query(Destination).all()
    for destination in destinations:
        slug = generate_slug(destination.name)
        sitemap_entries.append(SitemapEntryResponse(
            url=f"/destination/{slug}",
            priority="0.7",
            changefreq="weekly",
            lastmod=destination.updated_at or destination.created_at
        ))
    
    # Thêm các trang tĩnh
    static_pages = [
        {"url": "/about", "priority": "0.5", "changefreq": "monthly"},
        {"url": "/contact", "priority": "0.5", "changefreq": "monthly"},
        {"url": "/terms", "priority": "0.3", "changefreq": "yearly"},
        {"url": "/privacy", "priority": "0.3", "changefreq": "yearly"},
    ]
    
    for page in static_pages:
        sitemap_entries.append(SitemapEntryResponse(
            url=page["url"],
            priority=page["priority"],
            changefreq=page["changefreq"],
            lastmod=datetime.now()
        ))
    
    return {"sitemap": sitemap_entries}

@router.get("/generate-slugs")
def generate_friendly_urls(db: Session = Depends(get_db)):
    """Tạo URL thân thiện cho tất cả entities"""
    
    results = {"created": 0, "updated": 0}
    
    # Tạo slug cho homestays
    homestays = db.query(Homestay).all()
    for homestay in homestays:
        slug = generate_slug(homestay.name)
        
        # Kiểm tra slug đã tồn tại chưa
        existing_slug = db.query(URLSlug).filter(
            URLSlug.entity_type == "homestay",
            URLSlug.entity_id == homestay.id
        ).first()
        
        if existing_slug:
            if existing_slug.slug != slug:
                existing_slug.slug = slug
                results["updated"] += 1
        else:
            new_slug = URLSlug(
                entity_type="homestay",
                entity_id=homestay.id,
                slug=slug,
                is_primary=True
            )
            db.add(new_slug)
            results["created"] += 1
    
    # Tạo slug cho destinations
    destinations = db.query(Destination).all()
    for destination in destinations:
        slug = generate_slug(destination.name)
        
        existing_slug = db.query(URLSlug).filter(
            URLSlug.entity_type == "destination",
            URLSlug.entity_id == destination.id
        ).first()
        
        if existing_slug:
            if existing_slug.slug != slug:
                existing_slug.slug = slug
                results["updated"] += 1
        else:
            new_slug = URLSlug(
                entity_type="destination",
                entity_id=destination.id,
                slug=slug,
                is_primary=True
            )
            db.add(new_slug)
            results["created"] += 1
    
    db.commit()
    return results

@router.get("/schema-markup/{entity_type}/{entity_id}")
def get_schema_markup(
    entity_type: str,
    entity_id: int,
    db: Session = Depends(get_db)
):
    """Tạo Schema.org markup cho SEO"""
    
    if entity_type == "homestay":
        homestay = db.query(Homestay).filter(Homestay.id == entity_id).first()
        if not homestay:
            raise HTTPException(status_code=404, detail="Homestay không tồn tại")
        
        schema = {
            "@context": "https://schema.org",
            "@type": "LodgingBusiness",
            "name": homestay.name,
            "description": homestay.description,
            "address": {
                "@type": "PostalAddress",
                "streetAddress": homestay.address,
                "addressLocality": homestay.location.name if homestay.location else "",
                "addressCountry": "VN"
            },
            "priceRange": f"${homestay.price_per_night}",
            "telephone": homestay.contact_info.get("phone") if homestay.contact_info else "",
            "url": f"/homestay/{generate_slug(homestay.name)}-{homestay.id}",
            "amenityFeature": [
                {"@type": "LocationFeatureSpecification", "name": amenity.name}
                for amenity in homestay.amenities
            ] if homestay.amenities else []
        }
        
        if homestay.latitude and homestay.longitude:
            schema["geo"] = {
                "@type": "GeoCoordinates",
                "latitude": float(homestay.latitude),
                "longitude": float(homestay.longitude)
            }
        
        return schema
    
    elif entity_type == "destination":
        destination = db.query(Destination).filter(Destination.id == entity_id).first()
        if not destination:
            raise HTTPException(status_code=404, detail="Destination không tồn tại")
        
        schema = {
            "@context": "https://schema.org",
            "@type": "TouristDestination",
            "name": destination.name,
            "description": destination.description,
            "url": f"/destination/{generate_slug(destination.name)}"
        }
        
        return schema
    
    else:
        raise HTTPException(status_code=400, detail="Entity type không hợp lệ")