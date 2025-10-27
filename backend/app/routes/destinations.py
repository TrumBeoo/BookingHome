from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, and_, or_
from typing import List, Optional
import json
from app.db import get_db
from app.models import Destination, DestinationReview, DestinationWishlist, Homestay, User

router = APIRouter(prefix="/destinations", tags=["destinations"])

@router.get("/")
async def get_destinations(
    page: int = Query(1, ge=1),
    limit: int = Query(12, ge=1, le=50),
    province: Optional[str] = None,
    destination_type: Optional[str] = None,
    season: Optional[str] = None,
    search: Optional[str] = None,
    sort_by: Optional[str] = Query("featured", description="featured, popular, newest, rating"),
    db: Session = Depends(get_db)
):
    """Lấy danh sách điểm đến với bộ lọc và tìm kiếm"""
    
    query = db.query(Destination).filter(Destination.is_active == True)
    
    # Apply filters
    if province:
        query = query.filter(Destination.province.ilike(f"%{province}%"))
    
    if destination_type:
        query = query.filter(Destination.destination_type == destination_type)
    
    if season:
        query = query.filter(
            or_(
                Destination.season == season,
                Destination.season == "Tất cả mùa"
            )
        )
    
    if search:
        query = query.filter(
            or_(
                Destination.name.ilike(f"%{search}%"),
                Destination.description.ilike(f"%{search}%"),
                Destination.province.ilike(f"%{search}%"),
                Destination.city.ilike(f"%{search}%")
            )
        )
    
    # Apply sorting
    if sort_by == "featured":
        query = query.order_by(desc(Destination.is_featured), desc(Destination.view_count))
    elif sort_by == "popular":
        query = query.order_by(desc(Destination.view_count))
    elif sort_by == "newest":
        query = query.order_by(desc(Destination.created_at))
    elif sort_by == "rating":
        query = query.order_by(desc(Destination.avg_rating))
    
    total = query.count()
    destinations = query.offset((page - 1) * limit).limit(limit).all()
    
    # Enrich destinations with homestay count
    enriched_destinations = []
    for destination in destinations:
        homestay_count = db.query(Homestay).filter(
            and_(
                Homestay.destination_id == destination.id,
                Homestay.status == 'active',
                Homestay.is_active == True
            )
        ).count()
        
        destination_data = {
            "id": destination.id,
            "name": destination.name,
            "slug": destination.slug,
            "short_description": destination.short_description,
            "province": destination.province,
            "city": destination.city,
            "destination_type": destination.destination_type,
            "season": destination.season,
            "banner_image": destination.banner_image,
            "is_featured": destination.is_featured,
            "view_count": destination.view_count,
            "avg_rating": destination.avg_rating,
            "review_count": destination.review_count,
            "homestay_count": homestay_count,
            "created_at": destination.created_at.isoformat() if destination.created_at else None
        }
        enriched_destinations.append(destination_data)
    
    return {
        "destinations": enriched_destinations,
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": (total + limit - 1) // limit
    }

@router.get("/featured")
async def get_featured_destinations(
    limit: int = Query(6, ge=1, le=20),
    db: Session = Depends(get_db)
):
    """Lấy danh sách điểm đến nổi bật cho trang chủ"""
    
    # Lấy destinations featured trước
    featured_destinations = db.query(Destination).filter(
        and_(
            Destination.is_active == True,
            Destination.is_featured == True
        )
    ).order_by(desc(Destination.view_count)).limit(limit).all()
    
    # Nếu không đủ featured, lấy thêm destinations phổ biến khác
    if len(featured_destinations) < limit:
        featured_ids = [d.id for d in featured_destinations]
        additional_destinations = db.query(Destination).filter(
            and_(
                Destination.is_active == True,
                ~Destination.id.in_(featured_ids)
            )
        ).order_by(desc(Destination.view_count)).limit(limit - len(featured_destinations)).all()
        
        destinations = featured_destinations + additional_destinations
    else:
        destinations = featured_destinations
    
    # Enrich with homestay count
    enriched_destinations = []
    for destination in destinations:
        homestay_count = db.query(Homestay).filter(
            and_(
                Homestay.destination_id == destination.id,
                Homestay.status == 'active',
                Homestay.is_active == True
            )
        ).count()
        
        destination_data = {
            "id": destination.id,
            "name": destination.name,
            "slug": destination.slug,
            "short_description": destination.short_description,
            "province": destination.province,
            "banner_image": destination.banner_image,
            "is_featured": destination.is_featured,
            "view_count": destination.view_count,
            "avg_rating": destination.avg_rating,
            "homestay_count": homestay_count
        }
        enriched_destinations.append(destination_data)
    
    return {"destinations": enriched_destinations}

@router.get("/{destination_slug}")
async def get_destination_detail(
    destination_slug: str,
    db: Session = Depends(get_db)
):
    """Lấy chi tiết điểm đến"""
    
    destination = db.query(Destination).filter(
        and_(
            Destination.slug == destination_slug,
            Destination.is_active == True
        )
    ).first()
    
    if not destination:
        raise HTTPException(status_code=404, detail="Không tìm thấy điểm đến")
    
    # Increment view count
    destination.view_count += 1
    db.commit()
    
    # Get homestays in this destination
    homestays = db.query(Homestay).filter(
        and_(
            Homestay.destination_id == destination.id,
            Homestay.status == 'active',
            Homestay.is_active == True
        )
    ).order_by(desc(Homestay.featured), desc(Homestay.created_at)).limit(12).all()
    
    # Get recent reviews
    reviews = db.query(DestinationReview).filter(
        and_(
            DestinationReview.destination_id == destination.id,
            DestinationReview.is_approved == True
        )
    ).order_by(desc(DestinationReview.created_at)).limit(10).all()
    
    # Parse JSON fields
    gallery_images = []
    if destination.gallery_images:
        try:
            gallery_images = json.loads(destination.gallery_images)
        except:
            gallery_images = []
    
    food_recommendations = []
    if destination.food_recommendations:
        try:
            food_recommendations = json.loads(destination.food_recommendations)
        except:
            food_recommendations = []
    
    activities = []
    if destination.activities:
        try:
            activities = json.loads(destination.activities)
        except:
            activities = []
    
    # Format homestays
    homestay_list = []
    for homestay in homestays:
        homestay_data = {
            "id": homestay.id,
            "name": homestay.name,
            "price_per_night": float(homestay.price_per_night),
            "max_guests": homestay.max_guests,
            "address": homestay.address,
            "featured": homestay.featured,
            "discount_percent": homestay.discount_percent,
            "images": [img.image_path for img in homestay.images[:1]] if homestay.images else []
        }
        homestay_list.append(homestay_data)
    
    # Format reviews
    review_list = []
    for review in reviews:
        review_data = {
            "id": review.id,
            "rating": review.rating,
            "title": review.title,
            "comment": review.comment,
            "user_name": review.user.name if review.user else "Anonymous",
            "helpful_count": review.helpful_count,
            "created_at": review.created_at.isoformat() if review.created_at else None
        }
        review_list.append(review_data)
    
    return {
        "destination": {
            "id": destination.id,
            "name": destination.name,
            "slug": destination.slug,
            "description": destination.description,
            "short_description": destination.short_description,
            "province": destination.province,
            "city": destination.city,
            "latitude": destination.latitude,
            "longitude": destination.longitude,
            "destination_type": destination.destination_type,
            "season": destination.season,
            "banner_image": destination.banner_image,
            "gallery_images": gallery_images,
            "video_url": destination.video_url,
            "introduction": destination.introduction,
            "climate_info": destination.climate_info,
            "culture_info": destination.culture_info,
            "special_features": destination.special_features,
            "food_recommendations": food_recommendations,
            "activities": activities,
            "view_count": destination.view_count,
            "avg_rating": destination.avg_rating,
            "review_count": destination.review_count,
            "is_featured": destination.is_featured,
            "homestays": homestay_list,
            "reviews": review_list,
            "created_at": destination.created_at.isoformat() if destination.created_at else None
        }
    }

@router.get("/{destination_id}/homestays")
async def get_destination_homestays(
    destination_id: int,
    page: int = Query(1, ge=1),
    limit: int = Query(12, ge=1, le=50),
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    category_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """Lấy danh sách homestay trong điểm đến"""
    
    # Check if destination exists
    destination = db.query(Destination).filter(
        and_(
            Destination.id == destination_id,
            Destination.is_active == True
        )
    ).first()
    
    if not destination:
        raise HTTPException(status_code=404, detail="Không tìm thấy điểm đến")
    
    query = db.query(Homestay).filter(
        and_(
            Homestay.destination_id == destination_id,
            Homestay.status == 'active',
            Homestay.is_active == True
        )
    )
    
    # Apply filters
    if min_price:
        query = query.filter(Homestay.price_per_night >= min_price)
    
    if max_price:
        query = query.filter(Homestay.price_per_night <= max_price)
    
    if category_id:
        query = query.filter(Homestay.category_id == category_id)
    
    total = query.count()
    homestays = query.order_by(desc(Homestay.featured), desc(Homestay.created_at)).offset((page - 1) * limit).limit(limit).all()
    
    # Format homestays (reuse logic from homestays.py)
    enriched_homestays = []
    for homestay in homestays:
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
        "destination": {
            "id": destination.id,
            "name": destination.name,
            "slug": destination.slug
        },
        "homestays": enriched_homestays,
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": (total + limit - 1) // limit
    }

@router.get("/types/list")
async def get_destination_types(db: Session = Depends(get_db)):
    """Lấy danh sách loại điểm đến"""
    
    types = db.query(Destination.destination_type).filter(
        and_(
            Destination.is_active == True,
            Destination.destination_type.isnot(None)
        )
    ).distinct().all()
    
    return {
        "types": [t[0] for t in types if t[0]]
    }

@router.get("/provinces/list")
async def get_destination_provinces(db: Session = Depends(get_db)):
    """Lấy danh sách tỉnh/thành phố có điểm đến"""
    
    provinces = db.query(Destination.province).filter(
        and_(
            Destination.is_active == True,
            Destination.province.isnot(None)
        )
    ).distinct().all()
    
    return {
        "provinces": [p[0] for p in provinces if p[0]]
    }

@router.post("/{destination_id}/reviews")
async def create_destination_review(
    destination_id: int,
    rating: int = Query(..., ge=1, le=5),
    title: Optional[str] = None,
    comment: Optional[str] = None,
    user_id: int = Query(...),  # In real app, get from JWT token
    db: Session = Depends(get_db)
):
    """Tạo đánh giá cho điểm đến"""
    
    # Check if destination exists
    destination = db.query(Destination).filter(
        and_(
            Destination.id == destination_id,
            Destination.is_active == True
        )
    ).first()
    
    if not destination:
        raise HTTPException(status_code=404, detail="Không tìm thấy điểm đến")
    
    # Check if user already reviewed this destination
    existing_review = db.query(DestinationReview).filter(
        and_(
            DestinationReview.destination_id == destination_id,
            DestinationReview.user_id == user_id
        )
    ).first()
    
    if existing_review:
        raise HTTPException(status_code=400, detail="Bạn đã đánh giá điểm đến này rồi")
    
    # Create review
    review = DestinationReview(
        destination_id=destination_id,
        user_id=user_id,
        rating=rating,
        title=title,
        comment=comment,
        is_approved=True  # Auto approve for now
    )
    
    db.add(review)
    db.commit()
    db.refresh(review)
    
    # Update destination stats
    avg_rating = db.query(func.avg(DestinationReview.rating)).filter(
        and_(
            DestinationReview.destination_id == destination_id,
            DestinationReview.is_approved == True
        )
    ).scalar() or 0
    
    review_count = db.query(DestinationReview).filter(
        and_(
            DestinationReview.destination_id == destination_id,
            DestinationReview.is_approved == True
        )
    ).count()
    
    destination.avg_rating = round(float(avg_rating), 1)
    destination.review_count = review_count
    db.commit()
    
    return {
        "message": "Đánh giá đã được tạo thành công",
        "review": {
            "id": review.id,
            "rating": review.rating,
            "title": review.title,
            "comment": review.comment,
            "created_at": review.created_at.isoformat()
        }
    }

@router.post("/{destination_id}/wishlist")
async def toggle_destination_wishlist(
    destination_id: int,
    user_id: int = Query(...),  # In real app, get from JWT token
    db: Session = Depends(get_db)
):
    """Thêm/xóa điểm đến khỏi wishlist"""
    
    # Check if destination exists
    destination = db.query(Destination).filter(
        and_(
            Destination.id == destination_id,
            Destination.is_active == True
        )
    ).first()
    
    if not destination:
        raise HTTPException(status_code=404, detail="Không tìm thấy điểm đến")
    
    # Check if already in wishlist
    existing_wishlist = db.query(DestinationWishlist).filter(
        and_(
            DestinationWishlist.destination_id == destination_id,
            DestinationWishlist.user_id == user_id
        )
    ).first()
    
    if existing_wishlist:
        # Remove from wishlist
        db.delete(existing_wishlist)
        db.commit()
        return {"message": "Đã xóa khỏi danh sách yêu thích", "in_wishlist": False}
    else:
        # Add to wishlist
        wishlist = DestinationWishlist(
            destination_id=destination_id,
            user_id=user_id
        )
        db.add(wishlist)
        db.commit()
        return {"message": "Đã thêm vào danh sách yêu thích", "in_wishlist": True}