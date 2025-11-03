from .users import User
from .homestays import Homestay, Category
from .destinations import Destination, DestinationReview, DestinationWishlist
from .bookings import Booking, Payment, BookingStatus, PaymentStatus
from .reviews import Review
from .content import BlogPost, StaticPage, SiteSettings
from .locations import Location
from .amenities import Amenity, amenity_homestay
from .images import HomestayImage
from .additional import HomestayAvailability, ContactMessage, Notification, Wishlist, PasswordReset, Promotion, PromotionUsage, DiscountType
from .room_categories import RoomCategory, Tag, HomestayRoom, RoomAvailability, RoomBooking

from .seo import SEOMetadata, URLSlug, SitemapEntry
from .banners import Banner, BannerPosition

# Aliases for backward compatibility
Availability = RoomAvailability
Room = HomestayRoom

__all__ = [
    "User",
    "Homestay", "Category", "Location", "Amenity", "HomestayImage",
    "Destination", "DestinationReview", "DestinationWishlist",
    "Booking", "Payment", "BookingStatus", "PaymentStatus",
    "Review",
    "BlogPost", "StaticPage", "SiteSettings",
    "HomestayAvailability", "ContactMessage", "Notification", "Wishlist", "PasswordReset", "Promotion", "PromotionUsage", "DiscountType",
    "RoomCategory", "Tag", "HomestayRoom", "RoomAvailability", "RoomBooking",
    "SEOMetadata", "URLSlug", "SitemapEntry",
    "Banner", "BannerPosition",
    "amenity_homestay",
    "Availability", "Room"
]