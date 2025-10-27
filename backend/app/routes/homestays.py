from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, and_, or_
from typing import List, Optional
from app.db import get_db
from app.models import Homestay, Category, Review, User, Destination

router = APIRouter(prefix="/homestays", tags=["homestays"])

@router.get("/")
async def get_homestays(
    page: int = Query(1, ge=1),
    limit: int = Query(12, ge=1, le=50),
    category_id: Optional[int] = None,
    city: Optional[str] = None,
    location: Optional[str] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """Lấy danh sách homestay cho frontend"""
    
    query = db.query(Homestay).filter(
        and_(
            Homestay.status == 'active',
            Homestay.is_active == True
        )
    )
    
    if category_id:
        query = query.filter(Homestay.category_id == category_id)
    
    if city:
        query = query.filter(Homestay.address.ilike(f"%{city}%"))
    
    if location:
        # Filter by destination name
        destination = db.query(Destination).filter(
            Destination.name.ilike(f"%{location}%")
        ).first()
        if destination:
            query = query.filter(Homestay.destination_id == destination.id)
    
    if min_price:
        query = query.filter(Homestay.price_per_night >= min_price)
    
    if max_price:
        query = query.filter(Homestay.price_per_night <= max_price)
    
    if search:
        query = query.filter(
            or_(
                Homestay.name.ilike(f"%{search}%"),
                Homestay.description.ilike(f"%{search}%"),
                Homestay.address.ilike(f"%{search}%")
            )
        )
    
    total = query.count()
    homestays = query.order_by(desc(Homestay.featured), desc(Homestay.created_at)).offset((page - 1) * limit).limit(limit).all()
    
    # Enrich homestays with additional data
    enriched_homestays = []
    for homestay in homestays:
        # Calculate average rating
        avg_rating = db.query(func.avg(Review.rating)).filter(
            and_(
                Review.homestay_id == homestay.id,
                Review.is_approved == True
            )
        ).scalar() or 0
        
        # Count reviews
        review_count = db.query(Review).filter(
            and_(
                Review.homestay_id == homestay.id,
                Review.is_approved == True
            )
        ).count()
        
        # Get host info
        host = db.query(User).filter(User.id == homestay.host_id).first()
        
        homestay_data = {
            "id": homestay.id,
            "name": homestay.name,
            "description": homestay.description,
            "price_per_night": float(homestay.price_per_night),
            "max_guests": homestay.max_guests,
            "address": homestay.address,
            "latitude": float(homestay.latitude) if homestay.latitude else None,
            "longitude": float(homestay.longitude) if homestay.longitude else None,
            "featured": homestay.featured,
            "discount_percent": homestay.discount_percent,
            "avg_rating": round(float(avg_rating), 1),
            "review_count": review_count,
            "host_name": host.name if host else "Unknown",
            "category": homestay.category.name if homestay.category else None,
            "images": [img.image_path for img in homestay.images] if homestay.images else [],
            "amenities": [
                {
                    "id": amenity.id,
                    "name": amenity.name,
                    "icon": amenity.icon
                } for amenity in homestay.amenities
            ] if homestay.amenities else [],
            "created_at": homestay.created_at.isoformat() if homestay.created_at else None
        }
        enriched_homestays.append(homestay_data)
    
    return {
        "homestays": enriched_homestays,
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": (total + limit - 1) // limit
    }

@router.get("/{homestay_id}")
async def get_homestay_detail(
    homestay_id: int,
    db: Session = Depends(get_db)
):
    """Lấy chi tiết homestay"""
    
    homestay = db.query(Homestay).filter(
        and_(
            Homestay.id == homestay_id,
            Homestay.status == 'active',
            Homestay.is_active == True
        )
    ).first()
    
    if not homestay:
        raise HTTPException(status_code=404, detail="Không tìm thấy homestay")
    
    # Calculate average rating
    avg_rating = db.query(func.avg(Review.rating)).filter(
        and_(
            Review.homestay_id == homestay.id,
            Review.is_approved == True
        )
    ).scalar() or 0
    
    # Count reviews
    review_count = db.query(Review).filter(
        and_(
            Review.homestay_id == homestay.id,
            Review.is_approved == True
        )
    ).count()
    
    # Get reviews
    reviews = db.query(Review).filter(
        and_(
            Review.homestay_id == homestay.id,
            Review.is_approved == True
        )
    ).order_by(desc(Review.created_at)).limit(10).all()
    
    # Get host info
    host = db.query(User).filter(User.id == homestay.host_id).first()
    
    return {
        "homestay": {
            "id": homestay.id,
            "name": homestay.name,
            "description": homestay.description,
            "price_per_night": float(homestay.price_per_night),
            "max_guests": homestay.max_guests,
            "address": homestay.address,
            "latitude": float(homestay.latitude) if homestay.latitude else None,
            "longitude": float(homestay.longitude) if homestay.longitude else None,
            "contact_info": homestay.contact_info,
            "rules": homestay.rules,
            "check_in_out_times": homestay.check_in_out_times,
            "featured": homestay.featured,
            "discount_percent": homestay.discount_percent,
            "avg_rating": round(float(avg_rating), 1),
            "review_count": review_count,
            "host": {
                "id": host.id if host else None,
                "name": host.name if host else "Unknown",
                "email": host.email if host else None,
                "phone": host.phone if host else None
            },
            "category": {
                "id": homestay.category.id if homestay.category else None,
                "name": homestay.category.name if homestay.category else None
            },
            "images": [
                {
                    "id": img.id,
                    "image_path": img.image_path,
                    "is_primary": img.is_primary
                } for img in homestay.images
            ] if homestay.images else [],
            "amenities": [
                {
                    "id": amenity.id,
                    "name": amenity.name,
                    "icon": amenity.icon
                } for amenity in homestay.amenities
            ] if homestay.amenities else [],
            "reviews": [
                {
                    "id": review.id,
                    "rating": review.rating,
                    "comment": review.comment,
                    "user_name": review.user.name if review.user else "Anonymous",
                    "created_at": review.created_at.isoformat() if review.created_at else None
                } for review in reviews
            ],
            "created_at": homestay.created_at.isoformat() if homestay.created_at else None
        }
    }

@router.get("/featured/list")
async def get_featured_homestays(
    limit: int = Query(6, ge=1, le=20),
    db: Session = Depends(get_db)
):
    """Lấy danh sách homestay nổi bật"""
    
    # Lấy homestay featured trước
    featured_homestays = db.query(Homestay).filter(
        and_(
            Homestay.status == 'active',
            Homestay.is_active == True,
            Homestay.featured == True
        )
    ).order_by(desc(Homestay.created_at)).limit(limit).all()
    
    # Nếu không đủ featured, lấy thêm homestay active khác
    if len(featured_homestays) < limit:
        featured_ids = [h.id for h in featured_homestays]
        additional_homestays = db.query(Homestay).filter(
            and_(
                Homestay.status == 'active',
                Homestay.is_active == True,
                ~Homestay.id.in_(featured_ids)
            )
        ).order_by(desc(Homestay.created_at)).limit(limit - len(featured_homestays)).all()
        
        homestays = featured_homestays + additional_homestays
    else:
        homestays = featured_homestays
    
    # Enrich homestays with additional data
    enriched_homestays = []
    for homestay in homestays:
        # Calculate average rating
        avg_rating = db.query(func.avg(Review.rating)).filter(
            and_(
                Review.homestay_id == homestay.id,
                Review.is_approved == True
            )
        ).scalar() or 0
        
        # Count reviews
        review_count = db.query(Review).filter(
            and_(
                Review.homestay_id == homestay.id,
                Review.is_approved == True
            )
        ).count()
        
        homestay_data = {
            "id": homestay.id,
            "name": homestay.name,
            "description": homestay.description,
            "price_per_night": float(homestay.price_per_night),
            "max_guests": homestay.max_guests,
            "address": homestay.address,
            "featured": homestay.featured,
            "discount_percent": homestay.discount_percent,
            "avg_rating": round(float(avg_rating), 1),
            "review_count": review_count,
            "category": homestay.category.name if homestay.category else None,
            "images": [img.image_path for img in homestay.images] if homestay.images else [],
            "amenities": [
                {
                    "id": amenity.id,
                    "name": amenity.name,
                    "icon": amenity.icon
                } for amenity in homestay.amenities
            ] if homestay.amenities else [],
            "created_at": homestay.created_at.isoformat() if homestay.created_at else None
        }
        enriched_homestays.append(homestay_data)
    
    return {"homestays": enriched_homestays}

@router.get("/categories/list")
async def get_categories(db: Session = Depends(get_db)):
    """Lấy danh sách categories"""
    
    categories = db.query(Category).all()
    
    return {
        "categories": [
            {
                "id": cat.id,
                "name": cat.name,
                "slug": cat.slug
            } for cat in categories
        ]
    }