from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from datetime import datetime
from typing import List, Optional
from app.db import get_db
from app.models import Banner, BannerPosition
from app.schemas import BannerResponse

router = APIRouter(prefix="/api/banners", tags=["banners"])

@router.get("/position/{position}")
async def get_banners_by_position(
    position: str,
    db: Session = Depends(get_db)
):
    """Lấy banner theo vị trí hiển thị (cho khách hàng)"""
    
    now = datetime.now()
    
    banners = db.query(Banner).filter(
        and_(
            Banner.position == position,
            Banner.is_active == True,
            or_(
                Banner.start_date == None,
                Banner.start_date <= now
            ),
            or_(
                Banner.end_date == None,
                Banner.end_date >= now
            )
        )
    ).order_by(Banner.priority.desc()).all()
    
    return {
        "banners": [
            {
                "id": banner.id,
                "title": banner.title,
                "description": banner.description,
                "image_url": banner.image_url,
                "link_url": banner.link_url,
                "button_text": banner.button_text,
                "discount_text": banner.discount_text,
                "priority": banner.priority
            } for banner in banners
        ]
    }

@router.get("/active")
async def get_all_active_banners(db: Session = Depends(get_db)):
    """Lấy tất cả banner đang active (cho khách hàng)"""
    
    now = datetime.now()
    
    banners = db.query(Banner).filter(
        and_(
            Banner.is_active == True,
            or_(
                Banner.start_date == None,
                Banner.start_date <= now
            ),
            or_(
                Banner.end_date == None,
                Banner.end_date >= now
            )
        )
    ).order_by(Banner.position, Banner.priority.desc()).all()
    
    # Group by position
    result = {}
    for banner in banners:
        pos = banner.position.value
        if pos not in result:
            result[pos] = []
        result[pos].append({
            "id": banner.id,
            "title": banner.title,
            "description": banner.description,
            "image_url": banner.image_url,
            "link_url": banner.link_url,
            "button_text": banner.button_text,
            "discount_text": banner.discount_text,
            "priority": banner.priority
        })
    
    return {"banners": result}
