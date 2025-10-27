from fastapi import APIRouter, Depends, HTTPException, Query, UploadFile, File, Form, Response
from sqlalchemy.orm import Session
from sqlalchemy import func, desc, and_, or_, text
from typing import List, Optional
from datetime import datetime, timedelta
from pydantic import BaseModel
import os
import uuid
import shutil
from app.db import get_db
from app.models import User, Homestay, Booking, Payment, Review, Category, BlogPost, SiteSettings, HomestayImage
from app.auth import get_current_user, require_admin_or_host

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

# Pydantic models for homestay operations
class HomestayCreate(BaseModel):
    name: str
    description: Optional[str] = None
    price_per_night: float
    max_guests: int
    location_id: Optional[int] = None
    category_id: Optional[int] = None
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    contact_info: Optional[dict] = None
    rules: Optional[str] = None
    check_in_out_times: Optional[dict] = None
    status: str = 'active'
    discount_percent: int = 0
    featured: bool = False

class HomestayUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    price_per_night: Optional[float] = None
    max_guests: Optional[int] = None
    location_id: Optional[int] = None
    category_id: Optional[int] = None
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    contact_info: Optional[dict] = None
    rules: Optional[str] = None
    check_in_out_times: Optional[dict] = None
    status: Optional[str] = None
    discount_percent: Optional[int] = None
    featured: Optional[bool] = None

@router.get("/stats")
async def get_dashboard_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Lấy thống kê tổng quan dashboard"""
    
    # Kiểm tra quyền
    if current_user.role not in ['admin', 'super_admin', 'host']:
        raise HTTPException(status_code=403, detail="Không có quyền truy cập")
    
    # Thống kê cơ bản
    total_users = db.query(User).filter(User.role == 'customer').count()
    total_hosts = db.query(User).filter(User.role == 'host').count()
    total_homestays = db.query(Homestay).filter(Homestay.is_active == True).count()
    total_bookings = db.query(Booking).count()
    
    # Doanh thu tổng
    total_revenue = db.query(func.sum(Payment.amount)).filter(
        Payment.status == 'paid'
    ).scalar() or 0
    
    # Thống kê theo tháng hiện tại
    current_month = datetime.now().replace(day=1)
    monthly_bookings = db.query(Booking).filter(
        Booking.created_at >= current_month
    ).count()
    
    monthly_revenue = db.query(func.sum(Payment.amount)).filter(
        and_(
            Payment.status == 'paid',
            Payment.created_at >= current_month
        )
    ).scalar() or 0
    
    return {
        "total_users": total_users,
        "total_hosts": total_hosts,
        "total_homestays": total_homestays,
        "total_bookings": total_bookings,
        "total_revenue": total_revenue,
        "monthly_bookings": monthly_bookings,
        "monthly_revenue": monthly_revenue
    }

@router.get("/users")
async def get_users(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    role: Optional[str] = None,
    search: Optional[str] = None,
    current_user: User = Depends(require_admin_or_host),
    db: Session = Depends(get_db)
):
    """Lấy danh sách người dùng"""
    
    query = db.query(User)
    
    if role:
        query = query.filter(User.role == role)
    
    if search:
        query = query.filter(
            or_(
                User.name.ilike(f"%{search}%"),
                User.email.ilike(f"%{search}%"),
                User.phone.ilike(f"%{search}%")
            )
        )
    
    total = query.count()
    users = query.offset((page - 1) * limit).limit(limit).all()
    
    return {
        "users": users,
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": (total + limit - 1) // limit
    }

@router.get("/homestays")
async def get_homestays(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    category_id: Optional[int] = None,
    search: Optional[str] = None,
    current_user: User = Depends(require_admin_or_host),
    db: Session = Depends(get_db)
):
    """Lấy danh sách homestay"""
    
    query = db.query(Homestay)
    
    if current_user.role == 'host':
        query = query.filter(Homestay.host_id == current_user.id)
    
    if category_id:
        query = query.filter(Homestay.category_id == category_id)
    
    if search:
        query = query.filter(
            or_(
                Homestay.name.ilike(f"%{search}%"),
                Homestay.address.ilike(f"%{search}%"),
                Homestay.city.ilike(f"%{search}%")
            )
        )
    
    total = query.count()
    homestays = query.order_by(desc(Homestay.created_at)).offset((page - 1) * limit).limit(limit).all()
    
    return {
        "homestays": homestays,
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": (total + limit - 1) // limit
    }

@router.get("/bookings")
async def get_bookings(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    status: Optional[str] = None,
    search: Optional[str] = None,
    current_user: User = Depends(require_admin_or_host),
    db: Session = Depends(get_db)
):
    """Lấy danh sách đặt phòng"""
    
    query = db.query(Booking).join(Homestay).join(User)
    
    if current_user.role == 'host':
        query = query.filter(Homestay.host_id == current_user.id)
    
    if status:
        query = query.filter(Booking.status == status)
    
    if search:
        query = query.filter(
            or_(
                Booking.booking_code.ilike(f"%{search}%"),
                User.name.ilike(f"%{search}%"),
                Homestay.name.ilike(f"%{search}%")
            )
        )
    
    total = query.count()
    bookings = query.order_by(desc(Booking.created_at)).offset((page - 1) * limit).limit(limit).all()
    
    return {
        "bookings": bookings,
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": (total + limit - 1) // limit
    }

@router.get("/payments")
async def get_payments(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    status: Optional[str] = None,
    current_user: User = Depends(require_admin_or_host),
    db: Session = Depends(get_db)
):
    """Lấy danh sách thanh toán"""
    
    query = db.query(Payment).join(Booking).join(Homestay)
    
    if current_user.role == 'host':
        query = query.filter(Homestay.host_id == current_user.id)
    
    if status:
        query = query.filter(Payment.status == status)
    
    total = query.count()
    payments = query.order_by(desc(Payment.created_at)).offset((page - 1) * limit).limit(limit).all()
    
    return {
        "payments": payments,
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": (total + limit - 1) // limit
    }

@router.get("/reviews")
async def get_reviews(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    is_approved: Optional[bool] = None,
    current_user: User = Depends(require_admin_or_host),
    db: Session = Depends(get_db)
):
    """Lấy danh sách đánh giá"""
    
    query = db.query(Review).join(Homestay)
    
    if current_user.role == 'host':
        query = query.filter(Homestay.host_id == current_user.id)
    
    if is_approved is not None:
        query = query.filter(Review.is_approved == is_approved)
    
    total = query.count()
    reviews = query.order_by(desc(Review.created_at)).offset((page - 1) * limit).limit(limit).all()
    
    return {
        "reviews": reviews,
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": (total + limit - 1) // limit
    }

@router.get("/revenue-chart")
async def get_revenue_chart(
    period: str = Query("month", regex="^(week|month|year)$"),
    current_user: User = Depends(require_admin_or_host),
    db: Session = Depends(get_db)
):
    """Lấy dữ liệu biểu đồ doanh thu"""
    
    if period == "month":
        # Doanh thu 12 tháng gần nhất
        months_data = []
        for i in range(12):
            month_start = datetime.now().replace(day=1) - timedelta(days=30 * i)
            month_end = (month_start + timedelta(days=32)).replace(day=1)
            
            query = db.query(func.sum(Payment.amount)).filter(
                and_(
                    Payment.status == 'paid',
                    Payment.created_at >= month_start,
                    Payment.created_at < month_end
                )
            )
            
            if current_user.role == 'host':
                query = query.join(Booking).join(Homestay).filter(Homestay.host_id == current_user.id)
            
            revenue = query.scalar() or 0
            months_data.append({
                "period": month_start.strftime("%m/%Y"),
                "revenue": revenue
            })
        
        return {"data": list(reversed(months_data))}
    
    return {"data": []}

@router.get("/homestays/pending")
async def get_pending_homestays(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    current_user: User = Depends(require_admin_or_host),
    db: Session = Depends(get_db)
):
    """Lấy danh sách homestay chờ duyệt"""
    
    query = db.query(Homestay).filter(Homestay.status == 'pending')
    
    # Nếu là host thì chỉ xem homestay của mình
    if current_user.role == 'host':
        query = query.filter(Homestay.host_id == current_user.id)
    
    total = query.count()
    homestays = query.order_by(desc(Homestay.created_at)).offset((page - 1) * limit).limit(limit).all()
    
    return {
        "homestays": homestays,
        "total": total,
        "page": page,
        "limit": limit,
        "total_pages": (total + limit - 1) // limit
    }

@router.patch("/homestays/{homestay_id}/approve")
async def approve_homestay(
    homestay_id: int,
    current_user: User = Depends(require_admin_or_host),
    db: Session = Depends(get_db)
):
    """Duyệt homestay"""
    
    homestay = db.query(Homestay).filter(Homestay.id == homestay_id).first()
    
    if not homestay:
        raise HTTPException(status_code=404, detail="Không tìm thấy homestay")
    
    # Chỉ admin mới có thể duyệt homestay
    if current_user.role != 'admin':
        raise HTTPException(status_code=403, detail="Chỉ admin mới có thể duyệt homestay")
    
    homestay.status = 'active'
    db.commit()
    
    return {
        "message": "Homestay đã được duyệt thành công",
        "homestay": homestay
    }

@router.patch("/homestays/{homestay_id}/reject")
async def reject_homestay(
    homestay_id: int,
    reason: str = None,
    current_user: User = Depends(require_admin_or_host),
    db: Session = Depends(get_db)
):
    """Từ chối homestay"""
    
    homestay = db.query(Homestay).filter(Homestay.id == homestay_id).first()
    
    if not homestay:
        raise HTTPException(status_code=404, detail="Không tìm thấy homestay")
    
    # Chỉ admin mới có thể từ chối homestay
    if current_user.role != 'admin':
        raise HTTPException(status_code=403, detail="Chỉ admin mới có thể từ chối homestay")
    
    homestay.status = 'rejected'
    if reason:
        homestay.rejection_reason = reason
    db.commit()
    
    return {
        "message": "Homestay đã bị từ chối",
        "homestay": homestay
    }

@router.patch("/homestays/{homestay_id}/status")
async def update_homestay_status(
    homestay_id: int,
    status: str,
    current_user: User = Depends(require_admin_or_host),
    db: Session = Depends(get_db)
):
    """Cập nhật trạng thái homestay"""
    
    if status not in ['active', 'inactive', 'pending', 'rejected']:
        raise HTTPException(status_code=400, detail="Trạng thái không hợp lệ")
    
    homestay = db.query(Homestay).filter(Homestay.id == homestay_id).first()
    
    if not homestay:
        raise HTTPException(status_code=404, detail="Không tìm thấy homestay")
    
    # Kiểm tra quyền truy cập nếu là host
    if current_user.role == 'host' and homestay.host_id != current_user.id:
        raise HTTPException(status_code=403, detail="Không có quyền cập nhật homestay này")
    
    homestay.status = status
    db.commit()
    
    return {
        "message": f"Trạng thái homestay đã được cập nhật thành {status}",
        "homestay": homestay
    }

@router.get("/categories")
async def get_categories(
    current_user: User = Depends(require_admin_or_host),
    db: Session = Depends(get_db)
):
    """Lấy danh sách danh mục"""
    categories = db.query(Category).all()
    return {"categories": categories}

# HOMESTAY CRUD OPERATIONS
@router.post("/homestays")
async def create_homestay(
    homestay_data: HomestayCreate,
    current_user: User = Depends(require_admin_or_host),
    db: Session = Depends(get_db)
):
    """Tạo homestay mới"""
    
    # Tạo homestay mới
    new_homestay = Homestay(
        name=homestay_data.name,
        description=homestay_data.description,
        price_per_night=homestay_data.price_per_night,
        max_guests=homestay_data.max_guests,
        host_id=current_user.id,
        location_id=homestay_data.location_id,
        category_id=homestay_data.category_id,
        address=homestay_data.address,
        latitude=homestay_data.latitude,
        longitude=homestay_data.longitude,
        contact_info=homestay_data.contact_info,
        rules=homestay_data.rules,
        check_in_out_times=homestay_data.check_in_out_times,
        status=homestay_data.status,
        discount_percent=homestay_data.discount_percent,
        featured=homestay_data.featured,
        is_active=True
    )
    
    db.add(new_homestay)
    db.commit()
    db.refresh(new_homestay)
    
    return {
        "message": "Homestay đã được tạo thành công",
        "homestay": new_homestay
    }

@router.post("/homestays/{homestay_id}/upload-images")
async def upload_homestay_images(
    homestay_id: int,
    files: List[UploadFile] = File(...),
    current_user: User = Depends(require_admin_or_host),
    db: Session = Depends(get_db)
):
    """Upload ảnh cho homestay"""
    
    # Kiểm tra homestay tồn tại
    homestay = db.query(Homestay).filter(Homestay.id == homestay_id).first()
    if not homestay:
        raise HTTPException(status_code=404, detail="Không tìm thấy homestay")
    
    # Kiểm tra quyền truy cập nếu là host
    if current_user.role == 'host' and homestay.host_id != current_user.id:
        raise HTTPException(status_code=403, detail="Không có quyền upload ảnh cho homestay này")
    
    # Tạo thư mục upload nếu chưa có
    upload_dir = f"uploads/homestays/{homestay_id}"
    os.makedirs(upload_dir, exist_ok=True)
    
    uploaded_images = []
    
    for file in files:
        # Kiểm tra định dạng file
        if not file.content_type.startswith('image/'):
            raise HTTPException(status_code=400, detail=f"File {file.filename} không phải là ảnh")
        
        # Tạo tên file unique
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(upload_dir, unique_filename)
        
        # Lưu file
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        # Tạo URL path cho ảnh (relative path để serve qua web)
        web_path = f"/uploads/homestays/{homestay_id}/{unique_filename}"
        
        # Lưu thông tin ảnh vào database
        homestay_image = HomestayImage(
            homestay_id=homestay_id,
            image_path=web_path,  # Lưu web path thay vì file system path
            alt_text=f"Ảnh {homestay.name}",
            is_primary=len(uploaded_images) == 0,  # Ảnh đầu tiên là primary
            sort_order=len(uploaded_images)
        )
        
        db.add(homestay_image)
        uploaded_images.append({
            "filename": unique_filename,
            "path": web_path,
            "is_primary": homestay_image.is_primary
        })
    
    db.commit()
    
    return {
        "message": f"Đã upload {len(uploaded_images)} ảnh thành công",
        "images": uploaded_images
    }

@router.get("/homestays/{homestay_id}")
async def get_homestay(
    homestay_id: int,
    current_user: User = Depends(require_admin_or_host),
    db: Session = Depends(get_db)
):
    """Lấy thông tin chi tiết homestay"""
    
    homestay = db.query(Homestay).filter(Homestay.id == homestay_id).first()
    
    if not homestay:
        raise HTTPException(status_code=404, detail="Không tìm thấy homestay")
    
    # Kiểm tra quyền truy cập nếu là host
    if current_user.role == 'host' and homestay.host_id != current_user.id:
        raise HTTPException(status_code=403, detail="Không có quyền truy cập homestay này")
    
    return {"homestay": homestay}

@router.put("/homestays/{homestay_id}")
async def update_homestay(
    homestay_id: int,
    homestay_data: HomestayUpdate,
    current_user: User = Depends(require_admin_or_host),
    db: Session = Depends(get_db)
):
    """Cập nhật thông tin homestay"""
    
    homestay = db.query(Homestay).filter(Homestay.id == homestay_id).first()
    
    if not homestay:
        raise HTTPException(status_code=404, detail="Không tìm thấy homestay")
    
    # Kiểm tra quyền truy cập nếu là host
    if current_user.role == 'host' and homestay.host_id != current_user.id:
        raise HTTPException(status_code=403, detail="Không có quyền cập nhật homestay này")
    
    # Cập nhật các trường được cung cấp
    update_data = homestay_data.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(homestay, field, value)
    
    db.commit()
    db.refresh(homestay)
    
    return {
        "message": "Homestay đã được cập nhật thành công",
        "homestay": homestay
    }

@router.options("/homestays/{homestay_id}")
async def options_homestay(homestay_id: int):
    """Handle OPTIONS request for homestay operations"""
    response = Response()
    response.headers["Access-Control-Allow-Origin"] = "http://localhost:3000"
    response.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS"
    response.headers["Access-Control-Allow-Headers"] = "*"
    response.headers["Access-Control-Allow-Credentials"] = "true"
    return response

@router.delete("/homestays/{homestay_id}")
async def delete_homestay(
    homestay_id: int,
    current_user: User = Depends(require_admin_or_host),
    db: Session = Depends(get_db)
):
    """Xóa homestay và dữ liệu liên quan"""
    
    try:
        # Xóa theo thứ tự để tránh foreign key constraint
        
        # 1. Xóa homestay_images trước
        db.execute(
            text("DELETE FROM homestay_images WHERE homestay_id = :homestay_id"),
            {"homestay_id": homestay_id}
        )
        
        # 2. Xóa reviews
        db.execute(
            text("DELETE FROM reviews WHERE homestay_id = :homestay_id"),
            {"homestay_id": homestay_id}
        )
        
        # 3. Xóa payments liên quan đến bookings
        db.execute(
            text("DELETE p FROM payments p INNER JOIN bookings b ON p.booking_id = b.id WHERE b.homestay_id = :homestay_id"),
            {"homestay_id": homestay_id}
        )
        
        # 4. Xóa bookings
        db.execute(
            text("DELETE FROM bookings WHERE homestay_id = :homestay_id"),
            {"homestay_id": homestay_id}
        )
        
        # 5. Cuối cùng xóa homestay
        result = db.execute(
            text("DELETE FROM homestays WHERE id = :homestay_id"),
            {"homestay_id": homestay_id}
        )
        
        if result.rowcount == 0:
            raise HTTPException(status_code=404, detail="Không tìm thấy homestay")
        
        db.commit()
        
        return {"message": "Homestay đã được xóa thành công"}
        
    except Exception as e:
        db.rollback()
        print(f"Lỗi khi xóa homestay: {e}")
        raise HTTPException(
            status_code=500, 
            detail=f"Có lỗi xảy ra: {str(e)}"
        )

@router.delete("/homestays/{homestay_id}/images/{image_id}")
async def delete_homestay_image(
    homestay_id: int,
    image_id: int,
    current_user: User = Depends(require_admin_or_host),
    db: Session = Depends(get_db)
):
    """Xóa ảnh homestay"""
    
    # Kiểm tra homestay tồn tại
    homestay = db.query(Homestay).filter(Homestay.id == homestay_id).first()
    if not homestay:
        raise HTTPException(status_code=404, detail="Không tìm thấy homestay")
    
    # Kiểm tra quyền truy cập nếu là host
    if current_user.role == 'host' and homestay.host_id != current_user.id:
        raise HTTPException(status_code=403, detail="Không có quyền xóa ảnh cho homestay này")
    
    # Tìm ảnh
    image = db.query(HomestayImage).filter(
        and_(
            HomestayImage.id == image_id,
            HomestayImage.homestay_id == homestay_id
        )
    ).first()
    
    if not image:
        raise HTTPException(status_code=404, detail="Không tìm thấy ảnh")
    
    # Xóa file vật lý
    try:
        # Xây dựng đường dẫn file hệ thống từ web path một cách an toàn
        # Giả định thư mục 'uploads' nằm ở gốc của project
        relative_path = image.image_path.lstrip('/')
        file_path = os.path.join(os.getcwd(), relative_path) # os.getcwd() có thể cần điều chỉnh tùy thuộc vào cấu trúc dự án
        if os.path.exists(file_path) and os.path.isfile(file_path):
            os.remove(file_path)
    except Exception as e:
        print(f"Warning: Could not delete file {image.image_path}: {e}")
    
    # Xóa record trong database
    db.delete(image)
    db.commit()
    
    return {"message": "Đã xóa ảnh thành công"}

@router.patch("/homestays/{homestay_id}/images/{image_id}/primary")
async def set_primary_image(
    homestay_id: int,
    image_id: int,
    current_user: User = Depends(require_admin_or_host),
    db: Session = Depends(get_db)
):
    """Đặt ảnh làm ảnh chính"""
    
    # Kiểm tra homestay tồn tại
    homestay = db.query(Homestay).filter(Homestay.id == homestay_id).first()
    if not homestay:
        raise HTTPException(status_code=404, detail="Không tìm thấy homestay")
    
    # Kiểm tra quyền truy cập nếu là host
    if current_user.role == 'host' and homestay.host_id != current_user.id:
        raise HTTPException(status_code=403, detail="Không có quyền cập nhật ảnh cho homestay này")
    
    # Tìm ảnh
    image = db.query(HomestayImage).filter(
        and_(
            HomestayImage.id == image_id,
            HomestayImage.homestay_id == homestay_id
        )
    ).first()
    
    if not image:
        raise HTTPException(status_code=404, detail="Không tìm thấy ảnh")
    
    # Bỏ primary của tất cả ảnh khác
    db.query(HomestayImage).filter(HomestayImage.homestay_id == homestay_id).update(
        {"is_primary": False}
    )
    
    # Đặt ảnh này làm primary
    image.is_primary = True
    db.commit()
    
    return {"message": "Đã đặt làm ảnh chính thành công"}