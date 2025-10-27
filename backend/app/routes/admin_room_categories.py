from fastapi import APIRouter, Depends, HTTPException, UploadFile, File
from sqlalchemy.orm import Session
from typing import List
from app.db import get_db
from app.models.room_categories import RoomCategory, Tag, room_category_tags
from app.schemas import RoomCategoryResponse, TagResponse
from app.auth import require_admin
from pydantic import BaseModel
from decimal import Decimal
import os
import uuid
from pathlib import Path

router = APIRouter(prefix="/api/admin/room-categories", tags=["Admin Room Categories"])

class RoomCategoryCreate(BaseModel):
    name: str
    slug: str = None
    description: str = None
    base_price: float
    max_guests: int = 1
    room_size: float = None
    bed_type: str = None
    view_type: str = None
    has_balcony: bool = False
    has_kitchen: bool = False
    is_pet_friendly: bool = False
    amenities: List[str] = []
    tag_ids: List[int] = []

class TagCreate(BaseModel):
    name: str
    color: str = "#1976d2"
    description: str = None

@router.post("/", response_model=RoomCategoryResponse)
def create_room_category(
    category_data: RoomCategoryCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Tạo loại phòng mới"""
    
    # Tạo slug nếu không có
    if not category_data.slug:
        category_data.slug = category_data.name.lower().replace(" ", "-")
    
    # Kiểm tra slug unique
    existing = db.query(RoomCategory).filter(RoomCategory.slug == category_data.slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Slug đã tồn tại")
    
    # Tạo category
    category = RoomCategory(
        name=category_data.name,
        slug=category_data.slug,
        description=category_data.description,
        base_price=Decimal(str(category_data.base_price)),
        max_guests=category_data.max_guests,
        room_size=Decimal(str(category_data.room_size)) if category_data.room_size else None,
        bed_type=category_data.bed_type,
        view_type=category_data.view_type,
        has_balcony=category_data.has_balcony,
        has_kitchen=category_data.has_kitchen,
        is_pet_friendly=category_data.is_pet_friendly,
        amenities=category_data.amenities,
        images=[]
    )
    
    db.add(category)
    db.flush()
    
    # Thêm tags
    if category_data.tag_ids:
        tags = db.query(Tag).filter(Tag.id.in_(category_data.tag_ids)).all()
        category.tags.extend(tags)
    
    db.commit()
    db.refresh(category)
    
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
        tags=[TagResponse(
            id=tag.id,
            name=tag.name,
            slug=tag.slug,
            color=tag.color,
            icon=tag.icon
        ) for tag in category.tags]
    )

@router.put("/{category_id}", response_model=RoomCategoryResponse)
def update_room_category(
    category_id: int,
    category_data: RoomCategoryCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Cập nhật loại phòng"""
    
    category = db.query(RoomCategory).filter(RoomCategory.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Không tìm thấy loại phòng")
    
    # Tạo slug nếu không có
    if not category_data.slug:
        category_data.slug = category_data.name.lower().replace(" ", "-")
    
    # Kiểm tra slug unique (trừ chính nó)
    existing = db.query(RoomCategory).filter(
        RoomCategory.slug == category_data.slug,
        RoomCategory.id != category_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Slug đã tồn tại")
    
    # Cập nhật thông tin
    category.name = category_data.name
    category.slug = category_data.slug
    category.description = category_data.description
    category.base_price = Decimal(str(category_data.base_price))
    category.max_guests = category_data.max_guests
    category.room_size = Decimal(str(category_data.room_size)) if category_data.room_size else None
    category.bed_type = category_data.bed_type
    category.view_type = category_data.view_type
    category.has_balcony = category_data.has_balcony
    category.has_kitchen = category_data.has_kitchen
    category.is_pet_friendly = category_data.is_pet_friendly
    category.amenities = category_data.amenities
    
    # Cập nhật tags
    category.tags.clear()
    if category_data.tag_ids:
        tags = db.query(Tag).filter(Tag.id.in_(category_data.tag_ids)).all()
        category.tags.extend(tags)
    
    db.commit()
    db.refresh(category)
    
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
        tags=[TagResponse(
            id=tag.id,
            name=tag.name,
            slug=tag.slug,
            color=tag.color,
            icon=tag.icon
        ) for tag in category.tags]
    )

@router.delete("/{category_id}")
def delete_room_category(
    category_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Xóa loại phòng"""
    
    category = db.query(RoomCategory).filter(RoomCategory.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Không tìm thấy loại phòng")
    
    # Kiểm tra xem có homestay room nào đang sử dụng không
    from app.models.room_categories import HomestayRoom
    rooms_count = db.query(HomestayRoom).filter(HomestayRoom.room_category_id == category_id).count()
    if rooms_count > 0:
        raise HTTPException(
            status_code=400, 
            detail=f"Không thể xóa loại phòng này vì có {rooms_count} phòng đang sử dụng"
        )
    
    db.delete(category)
    db.commit()
    
    return {"message": "Đã xóa loại phòng thành công"}

@router.get("/statistics")
def get_room_category_statistics(
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Lấy thống kê loại phòng"""
    
    from app.models.room_categories import HomestayRoom
    from sqlalchemy import func
    
    # Tổng số loại phòng
    total_categories = db.query(RoomCategory).filter(RoomCategory.is_active == True).count()
    
    # Loại phòng phổ biến nhất
    popular_categories = db.query(
        RoomCategory.name,
        func.count(HomestayRoom.id).label('room_count')
    ).join(HomestayRoom).group_by(RoomCategory.id).order_by(
        func.count(HomestayRoom.id).desc()
    ).limit(5).all()
    
    # Thống kê theo view type
    view_stats = db.query(
        RoomCategory.view_type,
        func.count(RoomCategory.id).label('count')
    ).filter(RoomCategory.is_active == True).group_by(RoomCategory.view_type).all()
    
    # Thống kê giá
    price_stats = db.query(
        func.min(RoomCategory.base_price).label('min_price'),
        func.max(RoomCategory.base_price).label('max_price'),
        func.avg(RoomCategory.base_price).label('avg_price')
    ).filter(RoomCategory.is_active == True).first()
    
    return {
        "total_categories": total_categories,
        "average_price": float(price_stats[2]) if price_stats[2] else 0,
        "most_popular": popular_categories[0][0] if popular_categories else "N/A",
        "popular_categories": [
            {"name": cat[0], "room_count": cat[1]} for cat in popular_categories
        ],
        "view_stats": [
            {"view_type": stat[0], "count": stat[1]} for stat in view_stats
        ],
        "price_stats": {
            "min_price": float(price_stats[0]) if price_stats[0] else 0,
            "max_price": float(price_stats[1]) if price_stats[1] else 0,
            "avg_price": float(price_stats[2]) if price_stats[2] else 0
        }
    }

# Tag Management APIs
@router.post("/tags", response_model=TagResponse)
def create_tag(
    tag_data: TagCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Tạo tag mới"""
    
    # Tạo slug từ name
    slug = tag_data.name.lower().replace(" ", "-")
    
    # Kiểm tra slug unique
    existing = db.query(Tag).filter(Tag.slug == slug).first()
    if existing:
        raise HTTPException(status_code=400, detail="Tag đã tồn tại")
    
    tag = Tag(
        name=tag_data.name,
        slug=slug,
        color=tag_data.color
    )
    
    db.add(tag)
    db.commit()
    db.refresh(tag)
    
    return TagResponse(
        id=tag.id,
        name=tag.name,
        slug=tag.slug,
        color=tag.color,
        icon=tag.icon
    )

@router.put("/tags/{tag_id}", response_model=TagResponse)
def update_tag(
    tag_id: int,
    tag_data: TagCreate,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Cập nhật tag"""
    
    tag = db.query(Tag).filter(Tag.id == tag_id).first()
    if not tag:
        raise HTTPException(status_code=404, detail="Không tìm thấy tag")
    
    # Tạo slug từ name
    slug = tag_data.name.lower().replace(" ", "-")
    
    # Kiểm tra slug unique (trừ chính nó)
    existing = db.query(Tag).filter(
        Tag.slug == slug,
        Tag.id != tag_id
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Tag đã tồn tại")
    
    tag.name = tag_data.name
    tag.slug = slug
    tag.color = tag_data.color
    
    db.commit()
    db.refresh(tag)
    
    return TagResponse(
        id=tag.id,
        name=tag.name,
        slug=tag.slug,
        color=tag.color,
        icon=tag.icon
    )

@router.delete("/tags/{tag_id}")
def delete_tag(
    tag_id: int,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Xóa tag"""
    
    tag = db.query(Tag).filter(Tag.id == tag_id).first()
    if not tag:
        raise HTTPException(status_code=404, detail="Không tìm thấy tag")
    
    db.delete(tag)
    db.commit()
    
    return {"message": "Đã xóa tag thành công"}

# Image Management APIs
@router.post("/{category_id}/images")
async def upload_category_images(
    category_id: int,
    images: List[UploadFile] = File(...),
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Upload hình ảnh cho room category"""
    
    # Kiểm tra category tồn tại
    category = db.query(RoomCategory).filter(RoomCategory.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Không tìm thấy loại phòng")
    
    # Tạo thư mục upload nếu chưa có
    upload_dir = Path("uploads/room_categories")
    upload_dir.mkdir(parents=True, exist_ok=True)
    
    uploaded_images = []
    
    for image in images:
        # Kiểm tra file type
        if not image.content_type.startswith('image/'):
            continue
            
        # Tạo tên file unique
        file_extension = Path(image.filename).suffix
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = upload_dir / unique_filename
        
        # Lưu file
        with open(file_path, "wb") as buffer:
            content = await image.read()
            buffer.write(content)
        
        # Tạo URL cho file
        image_url = f"/uploads/room_categories/{unique_filename}"
        uploaded_images.append(image_url)
    
    # Cập nhật database
    current_images = category.images or []
    current_images.extend(uploaded_images)
    category.images = current_images
    
    db.commit()
    db.refresh(category)
    
    return {
        "message": f"Đã tải lên {len(uploaded_images)} hình ảnh",
        "images": uploaded_images,
        "total_images": len(category.images)
    }

@router.delete("/{category_id}/images/{image_index}")
def delete_category_image(
    category_id: int,
    image_index: int,
    db: Session = Depends(get_db),
    current_user = Depends(require_admin)
):
    """Xóa hình ảnh của room category"""
    
    # Kiểm tra category tồn tại
    category = db.query(RoomCategory).filter(RoomCategory.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Không tìm thấy loại phòng")
    
    if not category.images or image_index >= len(category.images):
        raise HTTPException(status_code=404, detail="Không tìm thấy hình ảnh")
    
    # Lấy đường dẫn file cần xóa
    image_url = category.images[image_index]
    
    # Xóa file khỏi hệ thống
    if image_url.startswith('/uploads/'):
        file_path = Path(image_url[1:])  # Bỏ dấu / đầu
        if file_path.exists():
            file_path.unlink()
    
    # Xóa khỏi database
    category.images.pop(image_index)
    db.commit()
    
    return {
        "message": "Đã xóa hình ảnh thành công",
        "remaining_images": len(category.images)
    }