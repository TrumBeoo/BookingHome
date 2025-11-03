from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from decimal import Decimal
from app.db import get_db
from sqlalchemy import text

router = APIRouter(tags=["promotions"])

class ValidateCouponRequest(BaseModel):
    code: str
    total_amount: float
    homestay_id: Optional[int] = None
    user_id: Optional[int] = None

@router.post("/validate")
async def validate_coupon(request: ValidateCouponRequest, db: Session = Depends(get_db)):
    """Validate mã khuyến mãi"""
    
    result = db.execute(
        text("SELECT * FROM promotions WHERE code = :code AND is_active = TRUE"),
        {"code": request.code.upper()}
    ).fetchone()
    
    if not result:
        raise HTTPException(status_code=404, detail="Mã khuyến mãi không tồn tại")
    
    now = datetime.now()
    if now < result.start_date or now > result.end_date:
        raise HTTPException(status_code=400, detail="Mã khuyến mãi đã hết hạn")
    
    if result.max_uses and result.used_count >= result.max_uses:
        raise HTTPException(status_code=400, detail="Mã khuyến mãi đã hết lượt sử dụng")
    
    if result.min_order_value and request.total_amount < float(result.min_order_value):
        raise HTTPException(
            status_code=400, 
            detail=f"Đơn hàng tối thiểu {float(result.min_order_value):,.0f}đ để áp dụng mã này"
        )
    
    # Tính discount
    if result.discount_type == 'PERCENTAGE':
        discount = request.total_amount * (float(result.discount_value) / 100)
        if result.max_discount:
            discount = min(discount, float(result.max_discount))
    else:
        discount = float(result.discount_value)
    
    discount = min(discount, request.total_amount)
    
    return {
        "valid": True,
        "promotion_id": result.id,
        "code": result.code,
        "discount_amount": round(discount, 2),
        "final_amount": round(request.total_amount - discount, 2),
        "message": f"Giảm {discount:,.0f}đ"
    }

@router.get("/active")
async def get_active_promotions(db: Session = Depends(get_db)):
    """Lấy danh sách mã khuyến mãi đang hoạt động"""
    
    now = datetime.now()
    results = db.execute(
        text("SELECT * FROM promotions WHERE is_active = TRUE AND start_date <= :now AND end_date >= :now"),
        {"now": now}
    ).fetchall()
    
    return {
        "promotions": [
            {
                "id": p.id,
                "code": p.code,
                "title": p.name,
                "description": p.description,
                "discount_type": p.discount_type,
                "discount_value": float(p.discount_value),
                "min_amount": float(p.min_order_value) if p.min_order_value else 0,
                "max_discount": float(p.max_discount) if p.max_discount else None,
                "end_date": p.end_date.isoformat()
            }
            for p in results
        ]
    }
