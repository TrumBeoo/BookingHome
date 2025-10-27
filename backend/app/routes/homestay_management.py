from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import desc, and_, or_, func
from typing import Optional, List
from datetime import datetime, date, timedelta
from pydantic import BaseModel
import os
import shutil
from pathlib import Path

from app.db import get_db
from app.models import User, Homestay, Category, Amenity, HomestayImage, amenity_homestay, HomestayAvailability
from app.auth import require_admin

router = APIRouter(prefix="/dashboard", tags=["homestay_management"])

# Pydantic models
class AmenityCreate(BaseModel):
    name: str
    icon: Optional[str] = None

class AmenityUpdate(BaseModel):
    name: Optional[str] = None
    icon: Optional[str] = None

class CategoryCreate(BaseModel):
    name: str
    slug: Optional[str] = None

class CategoryUpdate(BaseModel):
    name: Optional[str] = None
    slug: Optional[str] = None

class ImageUpdate(BaseModel):
    alt_text: Optional[str] = None
    sort_order: Optional[int] = None

class AvailabilityCreate(BaseModel):
    homestay_id: int
    date: date
    is_available: bool = True
    price_override: Optional[float] = None

class AvailabilityUpdate(BaseModel):
    is_available: Optional[bool] = None
    price_override: Optional[float] = None

class BulkAvailabilityUpdate(BaseModel):
    homestay_id: int
    start_date: date
    end_date: date
    is_available: bool = True
    price_override: Optional[float] = None

# Amenities endpoints
@router.get("/amenities")
async def get_amenities(
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Lấy danh sách tất cả tiện ích"""
    amenities = db.query(Amenity).order_by(Amenity.name).all()
    return {"amenities": amenities}

@router.post("/amenities")
async def create_amenity(
    amenity_data: AmenityCreate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Tạo tiện ích mới"""
    # Kiểm tra trùng tên
    existing = db.query(Amenity).filter(Amenity.name == amenity_data.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Tiện ích đã tồn tại")
    
    amenity = Amenity(**amenity_data.dict())
    db.add(amenity)
    db.commit()
    db.refresh(amenity)
    
    return {"message": "Tạo tiện ích thành công", "amenity": amenity}

@router.put("/amenities/{amenity_id}")
async def update_amenity(
    amenity_id: int,
    amenity_data: AmenityUpdate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Cập nhật tiện ích"""
    amenity = db.query(Amenity).filter(Amenity.id == amenity_id).first()
    if not amenity:
        raise HTTPException(status_code=404, detail="Không tìm thấy tiện ích")
    
    for field, value in amenity_data.dict(exclude_unset=True).items():
        setattr(amenity, field, value)
    
    db.commit()
    db.refresh(amenity)
    
    return {"message": "Cập nhật tiện ích thành công", "amenity": amenity}

@router.delete("/amenities/{amenity_id}")
async def delete_amenity(
    amenity_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Xóa tiện ích"""
    amenity = db.query(Amenity).filter(Amenity.id == amenity_id).first()
    if not amenity:
        raise HTTPException(status_code=404, detail="Không tìm thấy tiện ích")
    
    db.delete(amenity)
    db.commit()
    
    return {"message": "Xóa tiện ích thành công"}

# Homestay amenities endpoints
@router.get("/homestays/{homestay_id}/amenities")
async def get_homestay_amenities(
    homestay_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Lấy danh sách tiện ích của homestay"""
    homestay = db.query(Homestay).options(joinedload(Homestay.amenities)).filter(Homestay.id == homestay_id).first()
    if not homestay:
        raise HTTPException(status_code=404, detail="Không tìm thấy homestay")
    
    return {"amenities": homestay.amenities}

@router.post("/homestays/{homestay_id}/amenities/{amenity_id}")
async def add_homestay_amenity(
    homestay_id: int,
    amenity_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Thêm tiện ích cho homestay"""
    homestay = db.query(Homestay).filter(Homestay.id == homestay_id).first()
    if not homestay:
        raise HTTPException(status_code=404, detail="Không tìm thấy homestay")
    
    amenity = db.query(Amenity).filter(Amenity.id == amenity_id).first()
    if not amenity:
        raise HTTPException(status_code=404, detail="Không tìm thấy tiện ích")
    
    if amenity not in homestay.amenities:
        homestay.amenities.append(amenity)
        db.commit()
    
    return {"message": "Thêm tiện ích thành công"}

@router.delete("/homestays/{homestay_id}/amenities/{amenity_id}")
async def remove_homestay_amenity(
    homestay_id: int,
    amenity_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Xóa tiện ích khỏi homestay"""
    homestay = db.query(Homestay).filter(Homestay.id == homestay_id).first()
    if not homestay:
        raise HTTPException(status_code=404, detail="Không tìm thấy homestay")
    
    amenity = db.query(Amenity).filter(Amenity.id == amenity_id).first()
    if not amenity:
        raise HTTPException(status_code=404, detail="Không tìm thấy tiện ích")
    
    if amenity in homestay.amenities:
        homestay.amenities.remove(amenity)
        db.commit()
    
    return {"message": "Xóa tiện ích thành công"}

# Categories endpoints
@router.post("/categories")
async def create_category(
    category_data: CategoryCreate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Tạo danh mục mới"""
    # Kiểm tra trùng tên
    existing = db.query(Category).filter(Category.name == category_data.name).first()
    if existing:
        raise HTTPException(status_code=400, detail="Danh mục đã tồn tại")
    
    category = Category(**category_data.dict())
    db.add(category)
    db.commit()
    db.refresh(category)
    
    return {"message": "Tạo danh mục thành công", "category": category}

@router.put("/categories/{category_id}")
async def update_category(
    category_id: int,
    category_data: CategoryUpdate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Cập nhật danh mục"""
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Không tìm thấy danh mục")
    
    for field, value in category_data.dict(exclude_unset=True).items():
        setattr(category, field, value)
    
    db.commit()
    db.refresh(category)
    
    return {"message": "Cập nhật danh mục thành công", "category": category}

@router.delete("/categories/{category_id}")
async def delete_category(
    category_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Xóa danh mục"""
    category = db.query(Category).filter(Category.id == category_id).first()
    if not category:
        raise HTTPException(status_code=404, detail="Không tìm thấy danh mục")
    
    # Kiểm tra xem có homestay nào đang sử dụng danh mục này không
    homestays_count = db.query(Homestay).filter(Homestay.category_id == category_id).count()
    if homestays_count > 0:
        raise HTTPException(status_code=400, detail=f"Không thể xóa danh mục vì có {homestays_count} homestay đang sử dụng")
    
    db.delete(category)
    db.commit()
    
    return {"message": "Xóa danh mục thành công"}

# Images endpoints
@router.get("/homestays/{homestay_id}/images")
async def get_homestay_images(
    homestay_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Lấy danh sách hình ảnh của homestay"""
    homestay = db.query(Homestay).filter(Homestay.id == homestay_id).first()
    if not homestay:
        raise HTTPException(status_code=404, detail="Không tìm thấy homestay")
    
    images = db.query(HomestayImage).filter(HomestayImage.homestay_id == homestay_id).order_by(HomestayImage.sort_order).all()
    return {"images": images}

@router.patch("/homestays/{homestay_id}/images/{image_id}/primary")
async def set_primary_image(
    homestay_id: int,
    image_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Đặt ảnh làm ảnh chính"""
    # Kiểm tra homestay tồn tại
    homestay = db.query(Homestay).filter(Homestay.id == homestay_id).first()
    if not homestay:
        raise HTTPException(status_code=404, detail="Không tìm thấy homestay")
    
    # Kiểm tra ảnh tồn tại và thuộc homestay này
    image = db.query(HomestayImage).filter(
        HomestayImage.id == image_id,
        HomestayImage.homestay_id == homestay_id
    ).first()
    if not image:
        raise HTTPException(status_code=404, detail="Không tìm thấy hình ảnh")
    
    # Bỏ primary của tất cả ảnh khác
    db.query(HomestayImage).filter(HomestayImage.homestay_id == homestay_id).update({"is_primary": False})
    
    # Đặt ảnh này làm primary
    image.is_primary = True
    db.commit()
    
    return {"message": "Đã đặt làm ảnh chính"}

@router.put("/images/{image_id}")
async def update_image_info(
    image_id: int,
    image_data: ImageUpdate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Cập nhật thông tin ảnh"""
    image = db.query(HomestayImage).filter(HomestayImage.id == image_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Không tìm thấy hình ảnh")
    
    for field, value in image_data.dict(exclude_unset=True).items():
        setattr(image, field, value)
    
    db.commit()
    db.refresh(image)
    
    return {"message": "Cập nhật thông tin ảnh thành công", "image": image}

@router.delete("/images/{image_id}")
async def delete_image(
    image_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Xóa hình ảnh"""
    image = db.query(HomestayImage).filter(HomestayImage.id == image_id).first()
    if not image:
        raise HTTPException(status_code=404, detail="Không tìm thấy hình ảnh")
    
    # Xóa file vật lý
    try:
        file_path = Path("uploads") / "homestays" / image.image_path
        if file_path.exists():
            file_path.unlink()
    except Exception as e:
        print(f"Error deleting file: {e}")
    
    db.delete(image)
    db.commit()
    
    return {"message": "Xóa hình ảnh thành công"}

# Availability endpoints
@router.get("/homestays/{homestay_id}/availability")
async def get_homestay_availability(
    homestay_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Lấy lịch trống của homestay"""
    homestay = db.query(Homestay).filter(Homestay.id == homestay_id).first()
    if not homestay:
        raise HTTPException(status_code=404, detail="Không tìm thấy homestay")
    
    availability = db.query(HomestayAvailability).filter(
        HomestayAvailability.homestay_id == homestay_id
    ).order_by(desc(HomestayAvailability.date)).all()
    
    return {"availability": availability}

@router.post("/availability")
async def create_availability(
    availability_data: AvailabilityCreate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Tạo lịch trống mới"""
    # Kiểm tra homestay tồn tại
    homestay = db.query(Homestay).filter(Homestay.id == availability_data.homestay_id).first()
    if not homestay:
        raise HTTPException(status_code=404, detail="Không tìm thấy homestay")
    
    # Kiểm tra trùng lặp
    existing = db.query(HomestayAvailability).filter(
        HomestayAvailability.homestay_id == availability_data.homestay_id,
        HomestayAvailability.date == availability_data.date
    ).first()
    
    if existing:
        # Cập nhật nếu đã tồn tại
        existing.is_available = availability_data.is_available
        existing.price_override = availability_data.price_override
        db.commit()
        db.refresh(existing)
        return {"message": "Cập nhật lịch trống thành công", "availability": existing}
    else:
        # Tạo mới
        availability = HomestayAvailability(**availability_data.dict())
        db.add(availability)
        db.commit()
        db.refresh(availability)
        return {"message": "Tạo lịch trống thành công", "availability": availability}

@router.put("/availability/{availability_id}")
async def update_availability(
    availability_id: int,
    availability_data: AvailabilityUpdate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Cập nhật lịch trống"""
    availability = db.query(HomestayAvailability).filter(HomestayAvailability.id == availability_id).first()
    if not availability:
        raise HTTPException(status_code=404, detail="Không tìm thấy lịch trống")
    
    for field, value in availability_data.dict(exclude_unset=True).items():
        setattr(availability, field, value)
    
    db.commit()
    db.refresh(availability)
    
    return {"message": "Cập nhật lịch trống thành công", "availability": availability}

@router.delete("/availability/{availability_id}")
async def delete_availability(
    availability_id: int,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Xóa lịch trống"""
    availability = db.query(HomestayAvailability).filter(HomestayAvailability.id == availability_id).first()
    if not availability:
        raise HTTPException(status_code=404, detail="Không tìm thấy lịch trống")
    
    db.delete(availability)
    db.commit()
    
    return {"message": "Xóa lịch trống thành công"}

@router.post("/availability/bulk")
async def bulk_update_availability(
    bulk_data: BulkAvailabilityUpdate,
    current_user: User = Depends(require_admin),
    db: Session = Depends(get_db)
):
    """Cập nhật lịch trống hàng loạt"""
    # Kiểm tra homestay tồn tại
    homestay = db.query(Homestay).filter(Homestay.id == bulk_data.homestay_id).first()
    if not homestay:
        raise HTTPException(status_code=404, detail="Không tìm thấy homestay")
    
    # Tạo danh sách ngày
    current_date = bulk_data.start_date
    created_count = 0
    updated_count = 0
    
    while current_date <= bulk_data.end_date:
        # Kiểm tra đã tồn tại chưa
        existing = db.query(HomestayAvailability).filter(
            HomestayAvailability.homestay_id == bulk_data.homestay_id,
            HomestayAvailability.date == current_date
        ).first()
        
        if existing:
            # Cập nhật
            existing.is_available = bulk_data.is_available
            existing.price_override = bulk_data.price_override
            updated_count += 1
        else:
            # Tạo mới
            availability = HomestayAvailability(
                homestay_id=bulk_data.homestay_id,
                date=current_date,
                is_available=bulk_data.is_available,
                price_override=bulk_data.price_override
            )
            db.add(availability)
            created_count += 1
        
        # Chuyển sang ngày tiếp theo
        current_date = current_date + timedelta(days=1)
    
    db.commit()
    
    return {
        "message": f"Cập nhật hàng loạt thành công: {created_count} ngày mới, {updated_count} ngày cập nhật",
        "created": created_count,
        "updated": updated_count
    }