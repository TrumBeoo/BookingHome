# 🏠 Homestay Hub - Các Chức Năng Mới

## 📋 Tổng Quan

Hệ thống đã được hoàn thiện với 6 chức năng chính theo yêu cầu:

1. **🏨 Phân loại phòng (Room Categorization)**
2. **🔍 SEO (Search Engine Optimization)**
3. **🎁 Khuyến mãi (Promotions)**
4. **📅 Đặt phòng ngày lễ/cuối tuần/combo**
5. **🏨 Tình trạng phòng/Phòng đã đặt/Lịch trống**
6. **📆 Quản lý availability**

---

## 🚀 Cài Đặt và Chạy

### 1. Cài đặt Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### 2. Tạo Database và Dữ Liệu Mẫu

```bash
# Tạo dữ liệu mẫu cho các chức năng mới
python create_sample_data.py
```

### 3. Chạy Backend Server

```bash
python main.py
```

### 4. Test API

```bash
# Test tất cả các API mới
python test_new_features.py
```

---

## 🏨 1. Phân Loại Phòng (Room Categories)

### ✨ Tính Năng

- **Phân loại theo loại phòng**: Đơn, đôi, tập thể, gia đình
- **Tags tiện ích**: "Phù hợp cặp đôi", "Có bếp riêng", "Pet-friendly"
- **Lọc theo**: View (biển/núi), giá, số khách, tiện nghi
- **Sắp xếp**: Theo giá, đánh giá, diện tích

### 🔧 API Endpoints

```
GET /api/room-categories/                    # Lấy danh sách loại phòng
GET /api/room-categories/filters             # Lấy tùy chọn filter
GET /api/room-categories/tags                # Lấy danh sách tags
GET /api/room-categories/{id}/availability   # Kiểm tra availability
```

### 📱 Frontend Components

- `RoomCategoryFilter.jsx` - Bộ lọc phòng
- `RoomCategoryFilter.css` - Styling

### 💾 Database Models

- `RoomCategory` - Loại phòng
- `Tag` - Tags tiện ích
- `HomestayRoom` - Phòng cụ thể
- `RoomAvailability` - Tình trạng phòng

---

## 🔍 2. SEO (Search Engine Optimization)

### ✨ Tính Năng

- **URL thân thiện**: `/homestay/da-lat-romantic-view` thay vì `/homestay?id=12`
- **Meta tags**: Title, description, keywords cho mỗi homestay
- **Open Graph**: Tối ưu chia sẻ social media
- **Schema.org markup**: Structured data cho Google
- **Sitemap tự động**: XML sitemap cho search engines

### 🔧 API Endpoints

```
GET /api/seo/metadata/{type}/{id}           # Lấy SEO metadata
GET /api/seo/sitemap                        # Tạo sitemap
GET /api/seo/generate-slugs                 # Tạo URL slugs
GET /api/seo/schema-markup/{type}/{id}      # Lấy schema markup
```

### 💾 Database Models

- `SEOMetadata` - Meta tags và SEO data
- `URLSlug` - URL thân thiện
- `SitemapEntry` - Sitemap entries

---

## 🎁 3. Khuyến Mãi (Promotions)

### ✨ Tính Năng

- **Mã giảm giá (Coupon)**:
  - Giảm theo % hoặc số tiền cố định
  - Giới hạn số lần sử dụng
  - Điều kiện đơn hàng tối thiểu
  
- **Combo Packages**:
  - Gói 3N2Đ với ăn sáng + tour
  - Tiết kiệm khi đặt nhiều đêm
  - Bao gồm dịch vụ thêm

- **Giá theo mùa**:
  - Tăng giá cuối tuần
  - Giá đặc biệt ngày lễ
  - Hệ số nhân giá linh hoạt

### 🔧 API Endpoints

```
GET /api/promotions/                        # Lấy khuyến mãi active
POST /api/promotions/validate-coupon        # Validate mã giảm giá
GET /api/promotions/combos                  # Lấy combo packages
GET /api/promotions/seasonal-pricing        # Giá theo mùa
GET /api/promotions/holiday-pricing         # Giá ngày lễ
```

### 📱 Frontend Components

- `PromotionBanner.jsx` - Hiển thị khuyến mãi
- `PromotionBanner.css` - Styling

### 💾 Database Models

- `Promotion` - Khuyến mãi chung
- `PromotionUsage` - Lịch sử sử dụng
- `ComboPackage` - Gói combo
- `SeasonalPricing` - Giá theo mùa

---

## 📅 4. Đặt Phòng Ngày Lễ/Cuối Tuần/Combo

### ✨ Tính Năng

- **Dynamic Pricing**:
  - Tự động tăng giá cuối tuần (x1.5)
  - Giá đặc biệt ngày lễ (x2.0-2.5)
  - Phụ thu cố định cho dịp đặc biệt

- **Combo Booking**:
  - Đặt trọn gói phòng + dịch vụ
  - Ăn sáng + xe đưa đón + tour
  - Giá ưu đãi khi đặt combo

### 🔧 Tích Hợp

- Tích hợp với `SeasonalPricing` model
- Tự động áp dụng giá theo ngày
- Kiểm tra combo availability

---

## 🏨 5. Tình Trạng Phòng/Lịch Trống

### ✨ Tính Năng

- **Calendar View**:
  - Hiển thị lịch theo tháng
  - Màu sắc phân biệt: Xanh (trống), Đỏ (đã đặt), Xám (chặn)
  - Tooltip hiển thị thông tin booking

- **Real-time Status**:
  - Tự động chặn trùng lịch
  - Cập nhật tức thì khi có booking mới
  - Sync với Google Calendar (tùy chọn)

### 🔧 API Endpoints

```
GET /api/availability/calendar/{homestay_id}    # Lịch theo tháng
GET /api/availability/check/{homestay_id}       # Kiểm tra availability
GET /api/availability/blocked-dates/{homestay_id} # Ngày bị chặn
```

### 📱 Frontend Components

- `AvailabilityCalendar.jsx` - Calendar component
- `AvailabilityCalendar.css` - Styling

---

## 📆 6. Quản Lý Availability

### ✨ Tính Năng

- **Flexible Management**:
  - Chặn/mở phòng theo ngày
  - Override giá cho ngày cụ thể
  - Minimum nights requirement

- **Booking Conflict Prevention**:
  - Tự động kiểm tra trùng lịch
  - Prevent double booking
  - Real-time availability check

### 💾 Database Models

- `RoomAvailability` - Availability từng ngày
- `RoomBooking` - Booking chi tiết theo phòng

---

## 🎯 Các Cải Tiến Đã Thực Hiện

### 1. **Phân Loại Phòng Nâng Cao**
- ✅ Tags thông minh: "Couple-friendly", "Pet-friendly"
- ✅ Filter đa chiều: View, giá, tiện nghi
- ✅ Responsive design cho mobile

### 2. **SEO Toàn Diện**
- ✅ URL slugs tự động từ tiếng Việt
- ✅ Meta tags động
- ✅ Schema.org markup
- ✅ Sitemap XML tự động

### 3. **Hệ Thống Khuyến Mãi Mạnh Mẽ**
- ✅ Validation mã giảm giá real-time
- ✅ Combo packages với nhiều dịch vụ
- ✅ Seasonal pricing linh hoạt
- ✅ UI/UX hấp dẫn với carousel

### 4. **Calendar Management Chuyên Nghiệp**
- ✅ Calendar view trực quan
- ✅ Color coding rõ ràng
- ✅ Tooltip thông tin chi tiết
- ✅ Mobile responsive

### 5. **Dynamic Pricing Thông Minh**
- ✅ Tự động tăng giá cuối tuần
- ✅ Giá đặc biệt ngày lễ Việt Nam
- ✅ Hệ số nhân linh hoạt

---

## 🔧 Cách Sử Dụng

### 1. **Quản Lý Loại Phòng**

```javascript
// Lấy danh sách loại phòng với filter
const categories = await fetch('/api/room-categories/?has_balcony=true&min_price=300000');

// Kiểm tra availability
const availability = await fetch('/api/room-categories/1/availability?homestay_id=1&start_date=2024-01-01&end_date=2024-01-03');
```

### 2. **Áp Dụng Khuyến Mãi**

```javascript
// Validate coupon
const couponResult = await fetch('/api/promotions/validate-coupon', {
  method: 'POST',
  body: JSON.stringify({
    code: 'WELCOME20',
    total_amount: 1000000,
    user_id: 1
  })
});
```

### 3. **Hiển thị Calendar**

```jsx
import AvailabilityCalendar from './components/availability/AvailabilityCalendar';

<AvailabilityCalendar 
  homestayId={1} 
  roomId={null} // null = tất cả phòng
/>
```

---

## 📊 Database Schema

### Room Categories
```sql
CREATE TABLE room_categories (
  id BIGINT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE,
  base_price DECIMAL(10,2),
  max_guests INT,
  view_type VARCHAR(100),
  has_balcony BOOLEAN,
  has_kitchen BOOLEAN,
  is_pet_friendly BOOLEAN
);
```

### Promotions
```sql
CREATE TABLE promotions (
  id BIGINT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  code VARCHAR(50) UNIQUE,
  discount_type ENUM('percentage', 'fixed_amount'),
  discount_value DECIMAL(10,2),
  max_uses INT,
  start_date DATETIME,
  end_date DATETIME
);
```

### SEO Metadata
```sql
CREATE TABLE seo_metadata (
  id BIGINT PRIMARY KEY,
  entity_type VARCHAR(50),
  entity_id BIGINT,
  meta_title VARCHAR(255),
  meta_description TEXT,
  canonical_url VARCHAR(500)
);
```

---

## 🚀 Next Steps

1. **Tích hợp Payment Gateway** cho combo packages
2. **Push Notifications** cho availability changes
3. **Analytics Dashboard** cho promotion performance
4. **Mobile App** với calendar sync
5. **AI-powered Pricing** dựa trên demand

---

## 📞 Support

Nếu có vấn đề hoặc cần hỗ trợ:

1. Kiểm tra logs trong console
2. Chạy `python test_new_features.py` để test API
3. Xem documentation tại `/docs` endpoint
4. Check database connection với `python check_database.py`

---

**🎉 Chúc mừng! Hệ thống Homestay Hub đã hoàn thiện với đầy đủ tính năng theo yêu cầu!**