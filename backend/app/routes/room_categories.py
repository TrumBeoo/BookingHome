from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_, func
from typing import List, Optional
from app.db import get_db
from app.models.room_categories import RoomCategory, Tag, HomestayRoom, RoomAvailability, room_category_tags
from app.models.homestays import Homestay
from app.schemas import RoomCategoryResponse, TagResponse, RoomAvailabilityResponse, FilterOptionsResponse
from datetime import datetime, date

router = APIRouter(prefix="/api/room-categories", tags=["Room Categories"])



@router.get("/", response_model=List[RoomCategoryResponse])
def get_room_categories(
    view_type: Optional[str] = Query(None, description="Lọc theo loại view: Biển, Núi, Thành phố"),
    has_balcony: Optional[bool] = Query(None, description="Có ban công"),
    has_kitchen: Optional[bool] = Query(None, description="Có bếp riêng"),
    is_pet_friendly: Optional[bool] = Query(None, description="Thân thiện với thú cưng"),
    max_guests: Optional[int] = Query(None, description="Số khách tối đa"),
    min_price: Optional[float] = Query(None, description="Giá tối thiểu"),
    max_price: Optional[float] = Query(None, description="Giá tối đa"),
    tags: Optional[str] = Query(None, description="Tags cách nhau bởi dấu phẩy"),
    sort_by: Optional[str] = Query("name", description="Sắp xếp: name, price_asc, price_desc, size_asc, size_desc, guests_asc, guests_desc"),
    search: Optional[str] = Query(None, description="Tìm kiếm theo tên hoặc mô tả"),
    homestay_id: Optional[int] = Query(None, description="Lọc theo homestay cụ thể"),
    db: Session = Depends(get_db)
):
    """Lấy danh sách loại phòng với bộ lọc nâng cao"""
    query = db.query(RoomCategory).filter(RoomCategory.is_active == True)
    
    # Bộ lọc cơ bản
    if view_type:
        query = query.filter(RoomCategory.view_type.ilike(f"%{view_type}%"))
    if has_balcony is not None:
        query = query.filter(RoomCategory.has_balcony == has_balcony)
    if has_kitchen is not None:
        query = query.filter(RoomCategory.has_kitchen == has_kitchen)
    if is_pet_friendly is not None:
        query = query.filter(RoomCategory.is_pet_friendly == is_pet_friendly)
    if max_guests:
        query = query.filter(RoomCategory.max_guests >= max_guests)
    if min_price:
        query = query.filter(RoomCategory.base_price >= min_price)
    if max_price:
        query = query.filter(RoomCategory.base_price <= max_price)
    
    # Lọc theo tags
    if tags:
        tag_list = [tag.strip() for tag in tags.split(",")]
        query = query.join(RoomCategory.tags).filter(Tag.name.in_(tag_list))
    
    # Tìm kiếm
    if search:
        search_term = f"%{search}%"
        query = query.filter(
            or_(
                RoomCategory.name.ilike(search_term),
                RoomCategory.description.ilike(search_term),
                RoomCategory.bed_type.ilike(search_term)
            )
        )
    
    # Sắp xếp
    if sort_by == "price_asc":
        query = query.order_by(RoomCategory.base_price.asc())
    elif sort_by == "price_desc":
        query = query.order_by(RoomCategory.base_price.desc())
    elif sort_by == "size_asc":
        query = query.order_by(RoomCategory.room_size.asc())
    elif sort_by == "size_desc":
        query = query.order_by(RoomCategory.room_size.desc())
    elif sort_by == "guests_asc":
        query = query.order_by(RoomCategory.max_guests.asc())
    elif sort_by == "guests_desc":
        query = query.order_by(RoomCategory.max_guests.desc())
    else:  # name
        query = query.order_by(RoomCategory.name.asc())
    
    categories = query.all()
    
    result = []
    for category in categories:
        # Đếm số phòng có sẵn nếu có homestay_id
        available_rooms_count = 0
        if homestay_id:
            available_rooms_count = db.query(HomestayRoom).filter(
                HomestayRoom.room_category_id == category.id,
                HomestayRoom.homestay_id == homestay_id,
                HomestayRoom.is_available == True
            ).count()
        
        # Chuyển đổi tags
        tag_responses = []
        for tag in category.tags:
            tag_responses.append(TagResponse(
                id=tag.id,
                name=tag.name,
                slug=tag.slug,
                color=tag.color,
                icon=tag.icon
            ))
        
        result.append(RoomCategoryResponse(
            id=category.id,
            name=category.name,
            slug=category.slug,
            description=category.description,
            base_price=float(category.base_price) if category.base_price else None,
            max_guests=category.max_guests,
            room_size=float(category.room_size) if category.room_size else None,
            bed_type=category.bed_type,
            view_type=category.view_type,
            has_balcony=category.has_balcony,
            has_kitchen=category.has_kitchen,
            is_pet_friendly=category.is_pet_friendly,
            amenities=category.amenities or [],
            images=category.images or [],
            tags=tag_responses,
            available_rooms_count=available_rooms_count
        ))
    
    return result

@router.get("/{category_id}/availability")
def get_room_availability(
    category_id: int,
    homestay_id: int,
    start_date: date = Query(...),
    end_date: date = Query(...),
    db: Session = Depends(get_db)
):
    """Kiểm tra tình trạng phòng trống theo loại phòng và homestay"""
    
    # Lấy các phòng thuộc loại này trong homestay
    rooms = db.query(HomestayRoom).filter(
        HomestayRoom.room_category_id == category_id,
        HomestayRoom.homestay_id == homestay_id,
        HomestayRoom.is_available == True
    ).all()
    
    if not rooms:
        raise HTTPException(status_code=404, detail="Không tìm thấy phòng phù hợp")
    
    # Kiểm tra availability cho từng ngày
    availability_data = []
    current_date = start_date
    
    while current_date <= end_date:
        available_rooms = 0
        min_price = None
        
        for room in rooms:
            # Kiểm tra availability
            availability = db.query(RoomAvailability).filter(
                RoomAvailability.room_id == room.id,
                RoomAvailability.date == current_date
            ).first()
            
            if availability and availability.is_available:
                available_rooms += 1
                price = availability.price_override or room.price_per_night or room.room_category.base_price
                if min_price is None or price < min_price:
                    min_price = float(price)
            elif not availability:  # Nếu không có record thì mặc định available
                available_rooms += 1
                price = room.price_per_night or room.room_category.base_price
                if min_price is None or price < min_price:
                    min_price = float(price)
        
        availability_data.append({
            "date": current_date.isoformat(),
            "available_rooms": available_rooms,
            "is_available": available_rooms > 0,
            "min_price": min_price
        })
        
        current_date = current_date.replace(day=current_date.day + 1)
    
    return availability_data

@router.get("/search")
def search_room_categories(
    q: str = Query(..., description="Từ khóa tìm kiếm"),
    limit: int = Query(10, description="Số kết quả trả về"),
    db: Session = Depends(get_db)
):
    """Tìm kiếm loại phòng theo từ khóa"""
    search_term = f"%{q}%"
    
    categories = db.query(RoomCategory).filter(
        and_(
            RoomCategory.is_active == True,
            or_(
                RoomCategory.name.ilike(search_term),
                RoomCategory.description.ilike(search_term),
                RoomCategory.bed_type.ilike(search_term),
                RoomCategory.view_type.ilike(search_term)
            )
        )
    ).limit(limit).all()
    
    return [{
        "id": cat.id,
        "name": cat.name,
        "slug": cat.slug,
        "description": cat.description,
        "base_price": float(cat.base_price) if cat.base_price else None,
        "view_type": cat.view_type,
        "max_guests": cat.max_guests
    } for cat in categories]

@router.get("/suggestions")
def get_room_suggestions(
    guest_count: Optional[int] = Query(None, description="Số khách"),
    budget: Optional[float] = Query(None, description="Ngân sách tối đa"),
    preferences: Optional[str] = Query(None, description="Sở thích: romantic, family, budget, luxury"),
    db: Session = Depends(get_db)
):
    """Gợi ý loại phòng phù hợp"""
    query = db.query(RoomCategory).filter(RoomCategory.is_active == True)
    
    # Lọc theo số khách
    if guest_count:
        query = query.filter(RoomCategory.max_guests >= guest_count)
    
    # Lọc theo ngân sách
    if budget:
        query = query.filter(RoomCategory.base_price <= budget)
    
    # Gợi ý theo sở thích
    if preferences:
        if preferences == "romantic":
            query = query.join(RoomCategory.tags).filter(
                or_(
                    Tag.slug == "couple-friendly",
                    RoomCategory.view_type.ilike("%biển%"),
                    RoomCategory.has_balcony == True
                )
            )
        elif preferences == "family":
            query = query.filter(
                and_(
                    RoomCategory.max_guests >= 3,
                    or_(
                        RoomCategory.has_kitchen == True,
                        RoomCategory.room_size >= 30
                    )
                )
            )
        elif preferences == "budget":
            query = query.order_by(RoomCategory.base_price.asc())
        elif preferences == "luxury":
            query = query.filter(
                and_(
                    RoomCategory.room_size >= 25,
                    or_(
                        RoomCategory.view_type.ilike("%biển%"),
                        RoomCategory.has_balcony == True
                    )
                )
            ).order_by(RoomCategory.base_price.desc())
    
    categories = query.limit(5).all()
    
    suggestions = []
    for cat in categories:
        reason = []
        if preferences == "romantic":
            reason.append("Phù hợp cho cặp đôi")
        elif preferences == "family":
            reason.append("Phù hợp cho gia đình")
        elif preferences == "budget":
            reason.append("Giá cả hợp lý")
        elif preferences == "luxury":
            reason.append("Sang trọng, tiện nghi")
        
        if cat.has_kitchen:
            reason.append("Có bếp riêng")
        if cat.has_balcony:
            reason.append("Có ban công")
        if cat.view_type and "biển" in cat.view_type.lower():
            reason.append("View biển đẹp")
        
        suggestions.append({
            "id": cat.id,
            "name": cat.name,
            "slug": cat.slug,
            "base_price": float(cat.base_price) if cat.base_price else None,
            "max_guests": cat.max_guests,
            "room_size": float(cat.room_size) if cat.room_size else None,
            "view_type": cat.view_type,
            "reasons": reason,
            "tags": [tag.name for tag in cat.tags]
        })
    
    return {
        "suggestions": suggestions,
        "total": len(suggestions),
        "criteria": {
            "guest_count": guest_count,
            "budget": budget,
            "preferences": preferences
        }
    }

@router.get("/tags", response_model=List[TagResponse])
def get_tags(db: Session = Depends(get_db)):
    """Lấy danh sách tags cho phòng"""
    tags = db.query(Tag).all()
    return [TagResponse(
        id=tag.id,
        name=tag.name,
        slug=tag.slug,
        color=tag.color,
        icon=tag.icon
    ) for tag in tags]

@router.get("/filters", response_model=FilterOptionsResponse)
def get_filter_options(db: Session = Depends(get_db)):
    """Lấy các tùy chọn filter"""
    
    # Lấy các view types có sẵn
    view_types = db.query(RoomCategory.view_type).filter(
        RoomCategory.view_type.isnot(None),
        RoomCategory.is_active == True
    ).distinct().all()
    
    # Lấy range giá
    price_range = db.query(
        func.min(RoomCategory.base_price),
        func.max(RoomCategory.base_price)
    ).filter(RoomCategory.is_active == True).first()
    
    # Lấy range diện tích
    size_range = db.query(
        func.min(RoomCategory.room_size),
        func.max(RoomCategory.room_size)
    ).filter(
        RoomCategory.room_size.isnot(None),
        RoomCategory.is_active == True
    ).first()
    
    # Lấy range số khách
    guest_range = db.query(
        func.min(RoomCategory.max_guests),
        func.max(RoomCategory.max_guests)
    ).filter(RoomCategory.is_active == True).first()
    
    # Lấy tất cả tags
    tags = db.query(Tag).all()
    tag_responses = [TagResponse(
        id=tag.id,
        name=tag.name,
        slug=tag.slug,
        color=tag.color,
        icon=tag.icon
    ) for tag in tags]
    
    return FilterOptionsResponse(
        view_types=[vt[0] for vt in view_types if vt[0]],
        price_range={
            "min": float(price_range[0]) if price_range[0] else 0,
            "max": float(price_range[1]) if price_range[1] else 1000000
        },
        size_range={
            "min": float(size_range[0]) if size_range[0] else 0,
            "max": float(size_range[1]) if size_range[1] else 100
        },
        guest_range={
            "min": int(guest_range[0]) if guest_range[0] else 1,
            "max": int(guest_range[1]) if guest_range[1] else 10
        },
        amenities=[
            {"key": "has_balcony", "label": "Có ban công", "icon": "home"},
            {"key": "has_kitchen", "label": "Có bếp riêng", "icon": "utensils"},
            {"key": "is_pet_friendly", "label": "Thân thiện với thú cưng", "icon": "paw"}
        ],
        tags=tag_responses
    )

@router.get("/{category_id}", response_model=RoomCategoryResponse)
def get_room_category_detail(
    category_id: int,
    homestay_id: Optional[int] = Query(None, description="ID homestay để kiểm tra số phòng có sẵn"),
    db: Session = Depends(get_db)
):
    """Lấy thông tin chi tiết loại phòng"""
    category = db.query(RoomCategory).filter(
        RoomCategory.id == category_id,
        RoomCategory.is_active == True
    ).first()
    
    if not category:
        raise HTTPException(status_code=404, detail="Không tìm thấy loại phòng")
    
    # Đếm số phòng có sẵn
    available_rooms_count = 0
    if homestay_id:
        available_rooms_count = db.query(HomestayRoom).filter(
            HomestayRoom.room_category_id == category_id,
            HomestayRoom.homestay_id == homestay_id,
            HomestayRoom.is_available == True
        ).count()
    
    # Chuyển đổi tags
    tag_responses = []
    for tag in category.tags:
        tag_responses.append(TagResponse(
            id=tag.id,
            name=tag.name,
            slug=tag.slug,
            color=tag.color,
            icon=tag.icon
        ))
    
    return RoomCategoryResponse(
        id=category.id,
        name=category.name,
        slug=category.slug,
        description=category.description,
        base_price=float(category.base_price) if category.base_price else None,
        max_guests=category.max_guests,
        room_size=float(category.room_size) if category.room_size else None,
        bed_type=category.bed_type,
        view_type=category.view_type,
        has_balcony=category.has_balcony,
        has_kitchen=category.has_kitchen,
        is_pet_friendly=category.is_pet_friendly,
        amenities=category.amenities or [],
        images=category.images or [],
        tags=tag_responses,
        available_rooms_count=available_rooms_count
    )