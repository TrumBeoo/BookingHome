from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime
from decimal import Decimal

class UserBase(BaseModel):
    email: EmailStr
    name: str  # Thay đổi từ full_name thành name để khớp với database
    phone: Optional[str] = None

class UserCreate(UserBase):
    password: str

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class UserResponse(UserBase):
    id: int
    role: str = "customer"
    avatar: Optional[str] = None
    date_of_birth: Optional[datetime] = None
    gender: Optional[str] = None
    email_verified_at: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

# Room Category Schemas
class TagResponse(BaseModel):
    id: int
    name: str
    slug: str
    color: str
    icon: Optional[str] = None
    
    class Config:
        from_attributes = True

class RoomCategoryResponse(BaseModel):
    id: int
    name: str
    slug: str
    description: Optional[str] = None
    base_price: Optional[float] = None
    max_guests: int
    room_size: Optional[float] = None
    bed_type: Optional[str] = None
    view_type: Optional[str] = None
    has_balcony: bool = False
    has_kitchen: bool = False
    is_pet_friendly: bool = False
    amenities: Optional[List[str]] = []
    images: Optional[List[str]] = []
    tags: List[TagResponse] = []
    available_rooms_count: Optional[int] = 0
    
    class Config:
        from_attributes = True

class RoomCategoryFilter(BaseModel):
    view_type: Optional[str] = None
    has_balcony: Optional[bool] = None
    has_kitchen: Optional[bool] = None
    is_pet_friendly: Optional[bool] = None
    max_guests: Optional[int] = None
    min_price: Optional[float] = None
    max_price: Optional[float] = None
    tags: Optional[List[str]] = []
    sort_by: Optional[str] = "name"  # name, price_asc, price_desc, size_asc, size_desc
    search: Optional[str] = None

class RoomAvailabilityResponse(BaseModel):
    date: str
    available_rooms: int
    is_available: bool
    min_price: Optional[float] = None
    max_price: Optional[float] = None

class FilterOptionsResponse(BaseModel):
    view_types: List[str]
    price_range: dict
    size_range: dict
    guest_range: dict
    amenities: List[dict]
    tags: List[TagResponse]