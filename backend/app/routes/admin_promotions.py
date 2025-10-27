from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional
from app.db import get_db
from app.models.promotions import Promotion, PromotionUsage, ComboPackage, SeasonalPricing, DiscountType, PromotionType
from app.models.users import User
from app.auth import get_current_admin_user
from pydantic import BaseModel
from datetime import datetime, date
from decimal import Decimal

router = APIRouter(prefix="/api/admin", tags=["Admin Promotions"])

# Pydantic models for requests
class PromotionCreate(BaseModel):
    name: str
    description: Optional[str]
    code: Optional[str]
    type: str
    discount_type: str
    discount_value: float
    max_discount: Optional[float]
    min_order_value: Optional[float]
    max_uses: Optional[int]
    max_uses_per_user: int = 1
    start_date: datetime
    end_date: datetime
    is_active: bool = True

class PromotionUpdate(BaseModel):
    name: Optional[str]
    description: Optional[str]
    code: Optional[str]
    type: Optional[str]
    discount_type: Optional[str]
    discount_value: Optional[float]
    max_discount: Optional[float]
    min_order_value: Optional[float]
    max_uses: Optional[int]
    max_uses_per_user: Optional[int]
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    is_active: Optional[bool]

class ComboCreate(BaseModel):
    name: str
    description: Optional[str]
    original_price: float
    combo_price: float
    savings: Optional[float]
    min_nights: int = 2
    includes_breakfast: bool = False
    includes_transport: bool = False
    includes_tour: bool = False
    valid_from: datetime
    valid_until: datetime
    is_active: bool = True

class ComboUpdate(BaseModel):
    name: Optional[str]
    description: Optional[str]
    original_price: Optional[float]
    combo_price: Optional[float]
    savings: Optional[float]
    min_nights: Optional[int]
    includes_breakfast: Optional[bool]
    includes_transport: Optional[bool]
    includes_tour: Optional[bool]
    valid_from: Optional[datetime]
    valid_until: Optional[datetime]
    is_active: Optional[bool]

class SeasonalPricingCreate(BaseModel):
    name: str
    description: Optional[str]
    start_date: datetime
    end_date: datetime
    price_multiplier: float = 1.0
    fixed_surcharge: Optional[float]
    applies_to_weekends: bool = False
    applies_to_holidays: bool = False
    is_active: bool = True

class SeasonalPricingUpdate(BaseModel):
    name: Optional[str]
    description: Optional[str]
    start_date: Optional[datetime]
    end_date: Optional[datetime]
    price_multiplier: Optional[float]
    fixed_surcharge: Optional[float]
    applies_to_weekends: Optional[bool]
    applies_to_holidays: Optional[bool]
    is_active: Optional[bool]

# Promotion CRUD
@router.post("/promotions")
def create_promotion(
    promotion: PromotionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Tạo khuyến mãi mới"""
    
    # Check if code already exists
    if promotion.code:
        existing = db.query(Promotion).filter(Promotion.code == promotion.code).first()
        if existing:
            raise HTTPException(status_code=400, detail="Mã giảm giá đã tồn tại")
    
    db_promotion = Promotion(
        name=promotion.name,
        description=promotion.description,
        code=promotion.code,
        type=PromotionType(promotion.type),
        discount_type=DiscountType(promotion.discount_type),
        discount_value=Decimal(str(promotion.discount_value)),
        max_discount=Decimal(str(promotion.max_discount)) if promotion.max_discount else None,
        min_order_value=Decimal(str(promotion.min_order_value)) if promotion.min_order_value else None,
        max_uses=promotion.max_uses,
        max_uses_per_user=promotion.max_uses_per_user,
        start_date=promotion.start_date,
        end_date=promotion.end_date,
        is_active=promotion.is_active
    )
    
    db.add(db_promotion)
    db.commit()
    db.refresh(db_promotion)
    
    return {"message": "Tạo khuyến mãi thành công", "promotion": db_promotion}

@router.put("/promotions/{promotion_id}")
def update_promotion(
    promotion_id: int,
    promotion: PromotionUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Cập nhật khuyến mãi"""
    
    db_promotion = db.query(Promotion).filter(Promotion.id == promotion_id).first()
    if not db_promotion:
        raise HTTPException(status_code=404, detail="Không tìm thấy khuyến mãi")
    
    # Check if code already exists (excluding current promotion)
    if promotion.code and promotion.code != db_promotion.code:
        existing = db.query(Promotion).filter(
            Promotion.code == promotion.code,
            Promotion.id != promotion_id
        ).first()
        if existing:
            raise HTTPException(status_code=400, detail="Mã giảm giá đã tồn tại")
    
    # Update fields
    for field, value in promotion.dict(exclude_unset=True).items():
        if field in ['discount_value', 'max_discount', 'min_order_value'] and value is not None:
            value = Decimal(str(value))
        elif field in ['type', 'discount_type']:
            value = PromotionType(value) if field == 'type' else DiscountType(value)
        setattr(db_promotion, field, value)
    
    db.commit()
    db.refresh(db_promotion)
    
    return {"message": "Cập nhật khuyến mãi thành công", "promotion": db_promotion}

@router.delete("/promotions/{promotion_id}")
def delete_promotion(
    promotion_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Xóa khuyến mãi"""
    
    db_promotion = db.query(Promotion).filter(Promotion.id == promotion_id).first()
    if not db_promotion:
        raise HTTPException(status_code=404, detail="Không tìm thấy khuyến mãi")
    
    db.delete(db_promotion)
    db.commit()
    
    return {"message": "Xóa khuyến mãi thành công"}

# Combo CRUD
@router.post("/combos")
def create_combo(
    combo: ComboCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Tạo combo package mới"""
    
    db_combo = ComboPackage(
        name=combo.name,
        description=combo.description,
        original_price=Decimal(str(combo.original_price)),
        combo_price=Decimal(str(combo.combo_price)),
        savings=Decimal(str(combo.savings)) if combo.savings else None,
        min_nights=combo.min_nights,
        includes_breakfast=combo.includes_breakfast,
        includes_transport=combo.includes_transport,
        includes_tour=combo.includes_tour,
        valid_from=combo.valid_from,
        valid_until=combo.valid_until,
        is_active=combo.is_active
    )
    
    db.add(db_combo)
    db.commit()
    db.refresh(db_combo)
    
    return {"message": "Tạo combo thành công", "combo": db_combo}

@router.put("/combos/{combo_id}")
def update_combo(
    combo_id: int,
    combo: ComboUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Cập nhật combo package"""
    
    db_combo = db.query(ComboPackage).filter(ComboPackage.id == combo_id).first()
    if not db_combo:
        raise HTTPException(status_code=404, detail="Không tìm thấy combo")
    
    # Update fields
    for field, value in combo.dict(exclude_unset=True).items():
        if field in ['original_price', 'combo_price', 'savings'] and value is not None:
            value = Decimal(str(value))
        setattr(db_combo, field, value)
    
    db.commit()
    db.refresh(db_combo)
    
    return {"message": "Cập nhật combo thành công", "combo": db_combo}

@router.delete("/combos/{combo_id}")
def delete_combo(
    combo_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Xóa combo package"""
    
    db_combo = db.query(ComboPackage).filter(ComboPackage.id == combo_id).first()
    if not db_combo:
        raise HTTPException(status_code=404, detail="Không tìm thấy combo")
    
    db.delete(db_combo)
    db.commit()
    
    return {"message": "Xóa combo thành công"}

# Seasonal Pricing CRUD
@router.get("/seasonal-pricing")
def get_seasonal_pricing(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Lấy danh sách giá theo mùa"""
    
    seasonal_pricing = db.query(SeasonalPricing).all()
    
    return [
        {
            "id": sp.id,
            "name": sp.name,
            "description": sp.description,
            "start_date": sp.start_date,
            "end_date": sp.end_date,
            "price_multiplier": float(sp.price_multiplier),
            "fixed_surcharge": float(sp.fixed_surcharge) if sp.fixed_surcharge else None,
            "applies_to_weekends": sp.applies_to_weekends,
            "applies_to_holidays": sp.applies_to_holidays,
            "is_active": sp.is_active
        } for sp in seasonal_pricing
    ]

@router.post("/seasonal-pricing")
def create_seasonal_pricing(
    pricing: SeasonalPricingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Tạo giá theo mùa mới"""
    
    db_pricing = SeasonalPricing(
        name=pricing.name,
        description=pricing.description,
        start_date=pricing.start_date,
        end_date=pricing.end_date,
        price_multiplier=Decimal(str(pricing.price_multiplier)),
        fixed_surcharge=Decimal(str(pricing.fixed_surcharge)) if pricing.fixed_surcharge else None,
        applies_to_weekends=pricing.applies_to_weekends,
        applies_to_holidays=pricing.applies_to_holidays,
        is_active=pricing.is_active
    )
    
    db.add(db_pricing)
    db.commit()
    db.refresh(db_pricing)
    
    return {"message": "Tạo giá theo mùa thành công", "pricing": db_pricing}

@router.put("/seasonal-pricing/{pricing_id}")
def update_seasonal_pricing(
    pricing_id: int,
    pricing: SeasonalPricingUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Cập nhật giá theo mùa"""
    
    db_pricing = db.query(SeasonalPricing).filter(SeasonalPricing.id == pricing_id).first()
    if not db_pricing:
        raise HTTPException(status_code=404, detail="Không tìm thấy giá theo mùa")
    
    # Update fields
    for field, value in pricing.dict(exclude_unset=True).items():
        if field in ['price_multiplier', 'fixed_surcharge'] and value is not None:
            value = Decimal(str(value))
        setattr(db_pricing, field, value)
    
    db.commit()
    db.refresh(db_pricing)
    
    return {"message": "Cập nhật giá theo mùa thành công", "pricing": db_pricing}

@router.delete("/seasonal-pricing/{pricing_id}")
def delete_seasonal_pricing(
    pricing_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Xóa giá theo mùa"""
    
    db_pricing = db.query(SeasonalPricing).filter(SeasonalPricing.id == pricing_id).first()
    if not db_pricing:
        raise HTTPException(status_code=404, detail="Không tìm thấy giá theo mùa")
    
    db.delete(db_pricing)
    db.commit()
    
    return {"message": "Xóa giá theo mùa thành công"}

# Statistics
@router.get("/promotions/stats")
def get_promotion_stats(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_admin_user)
):
    """Thống kê khuyến mãi"""
    
    total_promotions = db.query(Promotion).count()
    active_promotions = db.query(Promotion).filter(Promotion.is_active == True).count()
    total_usage = db.query(PromotionUsage).count()
    
    # Top used promotions
    top_promotions = db.query(Promotion).join(PromotionUsage).group_by(Promotion.id).order_by(
        db.func.count(PromotionUsage.id).desc()
    ).limit(5).all()
    
    return {
        "total_promotions": total_promotions,
        "active_promotions": active_promotions,
        "total_usage": total_usage,
        "top_promotions": [
            {
                "id": p.id,
                "name": p.name,
                "code": p.code,
                "usage_count": p.used_count
            } for p in top_promotions
        ]
    }