from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db import get_db
from app.models.promotions import Promotion, PromotionUsage, ComboPackage, SeasonalPricing, DiscountType, PromotionType
from app.models.bookings import Booking
from app.models.users import User
from pydantic import BaseModel
from datetime import datetime, date
from decimal import Decimal

router = APIRouter(prefix="/api/promotions", tags=["Promotions"])

class PromotionResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    code: Optional[str]
    type: str
    discount_type: str
    discount_value: float
    max_discount: Optional[float]
    min_order_value: Optional[float]
    max_uses: Optional[int]
    used_count: int
    start_date: datetime
    end_date: datetime
    is_active: bool

class CouponValidationRequest(BaseModel):
    code: str
    homestay_id: Optional[int]
    total_amount: float
    user_id: Optional[int]

class ComboPackageResponse(BaseModel):
    id: int
    name: str
    description: Optional[str]
    original_price: float
    combo_price: float
    savings: Optional[float]
    min_nights: int
    includes_breakfast: bool
    includes_transport: bool
    includes_tour: bool

@router.get("/", response_model=List[PromotionResponse])
def get_active_promotions(
    type: Optional[str] = Query(None),
    db: Session = Depends(get_db)
):
    """Lấy danh sách khuyến mãi đang hoạt động"""
    query = db.query(Promotion).filter(
        Promotion.is_active == True,
        Promotion.start_date <= datetime.now(),
        Promotion.end_date >= datetime.now()
    )
    
    if type:
        query = query.filter(Promotion.type == type)
    
    promotions = query.all()
    
    return [
        PromotionResponse(
            id=p.id,
            name=p.name,
            description=p.description,
            code=p.code,
            type=p.type.value,
            discount_type=p.discount_type.value,
            discount_value=float(p.discount_value),
            max_discount=float(p.max_discount) if p.max_discount else None,
            min_order_value=float(p.min_order_value) if p.min_order_value else None,
            max_uses=p.max_uses,
            used_count=p.used_count,
            start_date=p.start_date,
            end_date=p.end_date,
            is_active=p.is_active
        ) for p in promotions
    ]

@router.post("/validate-coupon")
def validate_coupon(request: CouponValidationRequest, db: Session = Depends(get_db)):
    """Kiểm tra tính hợp lệ của mã giảm giá"""
    
    promotion = db.query(Promotion).filter(
        Promotion.code == request.code,
        Promotion.is_active == True,
        Promotion.start_date <= datetime.now(),
        Promotion.end_date >= datetime.now()
    ).first()
    
    if not promotion:
        raise HTTPException(status_code=404, detail="Mã giảm giá không tồn tại hoặc đã hết hạn")
    
    # Kiểm tra số lần sử dụng
    if promotion.max_uses and promotion.used_count >= promotion.max_uses:
        raise HTTPException(status_code=400, detail="Mã giảm giá đã hết lượt sử dụng")
    
    # Kiểm tra giá trị đơn hàng tối thiểu
    if promotion.min_order_value and request.total_amount < float(promotion.min_order_value):
        raise HTTPException(
            status_code=400, 
            detail=f"Đơn hàng tối thiểu {promotion.min_order_value:,.0f}đ để sử dụng mã này"
        )
    
    # Kiểm tra số lần sử dụng của user
    if request.user_id and promotion.max_uses_per_user:
        user_usage = db.query(PromotionUsage).filter(
            PromotionUsage.promotion_id == promotion.id,
            PromotionUsage.user_id == request.user_id
        ).count()
        
        if user_usage >= promotion.max_uses_per_user:
            raise HTTPException(status_code=400, detail="Bạn đã sử dụng hết lượt cho mã này")
    
    # Tính toán giảm giá
    if promotion.discount_type == DiscountType.PERCENTAGE:
        discount_amount = request.total_amount * (float(promotion.discount_value) / 100)
        if promotion.max_discount:
            discount_amount = min(discount_amount, float(promotion.max_discount))
    else:
        discount_amount = float(promotion.discount_value)
    
    discount_amount = min(discount_amount, request.total_amount)
    
    return {
        "valid": True,
        "promotion_id": promotion.id,
        "discount_amount": discount_amount,
        "final_amount": request.total_amount - discount_amount,
        "message": f"Giảm {discount_amount:,.0f}đ"
    }

@router.get("/combos", response_model=List[ComboPackageResponse])
def get_combo_packages(
    min_nights: Optional[int] = Query(None),
    includes_breakfast: Optional[bool] = Query(None),
    db: Session = Depends(get_db)
):
    """Lấy danh sách combo packages"""
    query = db.query(ComboPackage).filter(
        ComboPackage.is_active == True,
        ComboPackage.valid_from <= datetime.now(),
        ComboPackage.valid_until >= datetime.now()
    )
    
    if min_nights:
        query = query.filter(ComboPackage.min_nights <= min_nights)
    if includes_breakfast is not None:
        query = query.filter(ComboPackage.includes_breakfast == includes_breakfast)
    
    combos = query.all()
    
    return [
        ComboPackageResponse(
            id=c.id,
            name=c.name,
            description=c.description,
            original_price=float(c.original_price),
            combo_price=float(c.combo_price),
            savings=float(c.savings) if c.savings else None,
            min_nights=c.min_nights,
            includes_breakfast=c.includes_breakfast,
            includes_transport=c.includes_transport,
            includes_tour=c.includes_tour
        ) for c in combos
    ]

@router.get("/seasonal-pricing")
def get_seasonal_pricing(
    check_date: date = Query(...),
    homestay_id: Optional[int] = Query(None),
    db: Session = Depends(get_db)
):
    """Lấy giá theo mùa cho ngày cụ thể"""
    
    query = db.query(SeasonalPricing).filter(
        SeasonalPricing.is_active == True,
        SeasonalPricing.start_date <= check_date,
        SeasonalPricing.end_date >= check_date
    )
    
    seasonal_pricing = query.all()
    
    applicable_pricing = []
    for pricing in seasonal_pricing:
        # Kiểm tra xem có áp dụng cho homestay này không
        if homestay_id and pricing.applicable_homestays:
            if homestay_id not in pricing.applicable_homestays:
                continue
        
        # Kiểm tra cuối tuần
        if pricing.applies_to_weekends and check_date.weekday() >= 5:  # Thứ 7, CN
            applicable_pricing.append({
                "id": pricing.id,
                "name": pricing.name,
                "description": pricing.description,
                "price_multiplier": float(pricing.price_multiplier),
                "fixed_surcharge": float(pricing.fixed_surcharge) if pricing.fixed_surcharge else 0
            })
        elif not pricing.applies_to_weekends:
            applicable_pricing.append({
                "id": pricing.id,
                "name": pricing.name,
                "description": pricing.description,
                "price_multiplier": float(pricing.price_multiplier),
                "fixed_surcharge": float(pricing.fixed_surcharge) if pricing.fixed_surcharge else 0
            })
    
    return applicable_pricing

@router.get("/holiday-pricing")
def get_holiday_pricing(
    year: int = Query(...),
    db: Session = Depends(get_db)
):
    """Lấy bảng giá ngày lễ trong năm"""
    
    # Định nghĩa các ngày lễ Việt Nam
    holidays = [
        {"name": "Tết Dương lịch", "date": f"{year}-01-01", "multiplier": 1.5},
        {"name": "Tết Nguyên đán", "date": f"{year}-02-10", "multiplier": 2.0},  # Ước tính
        {"name": "Giỗ tổ Hùng Vương", "date": f"{year}-04-18", "multiplier": 1.3},
        {"name": "30/4 - 1/5", "date": f"{year}-04-30", "multiplier": 1.8},
        {"name": "Quốc khánh", "date": f"{year}-09-02", "multiplier": 1.5},
    ]
    
    # Lấy seasonal pricing cho các ngày lễ
    seasonal_holidays = db.query(SeasonalPricing).filter(
        SeasonalPricing.is_active == True,
        SeasonalPricing.applies_to_holidays == True,
        db.extract('year', SeasonalPricing.start_date) == year
    ).all()
    
    for pricing in seasonal_holidays:
        holidays.append({
            "name": pricing.name,
            "date": pricing.start_date.strftime("%Y-%m-%d"),
            "multiplier": float(pricing.price_multiplier),
            "surcharge": float(pricing.fixed_surcharge) if pricing.fixed_surcharge else 0
        })
    
    return {"year": year, "holidays": holidays}