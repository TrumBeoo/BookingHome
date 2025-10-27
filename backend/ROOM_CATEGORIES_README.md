# 🏠 Room Categories - Hệ thống phân loại phòng

## 📋 Tổng quan

Hệ thống phân loại phòng cho phép:
- **Phân loại phòng** theo nhiều tiêu chí: đơn, đôi, tập thể, view biển, view núi...
- **Gắn tags** cho phòng: "phù hợp cho cặp đôi", "có bếp riêng", "pet-friendly"
- **Lọc & sắp xếp** theo giá, đánh giá, diện tích, số khách
- **Tìm kiếm** và **gợi ý** thông minh
- **Quản lý availability** theo từng loại phòng

## 🚀 Cài đặt và chạy

### 1. Tạo dữ liệu mẫu
```bash
cd backend
python create_sample_data.py
```

### 2. Chạy server
```bash
python main.py
```

### 3. Test API
```bash
python test_room_categories.py
```

## 📡 API Endpoints

### 1. Lấy danh sách loại phòng
```
GET /api/room-categories/
```

**Query Parameters:**
- `view_type`: Lọc theo view (Biển, Núi, Thành phố)
- `has_balcony`: Có ban công (true/false)
- `has_kitchen`: Có bếp riêng (true/false)
- `is_pet_friendly`: Thân thiện với thú cưng (true/false)
- `max_guests`: Số khách tối đa
- `min_price`, `max_price`: Khoảng giá
- `tags`: Tags cách nhau bởi dấu phẩy
- `sort_by`: Sắp xếp (name, price_asc, price_desc, size_asc, size_desc, guests_asc, guests_desc)
- `search`: Tìm kiếm theo tên hoặc mô tả
- `homestay_id`: Lọc theo homestay cụ thể

**Ví dụ:**
```
GET /api/room-categories/?view_type=Biển&has_balcony=true&sort_by=price_asc
```

### 2. Tìm kiếm loại phòng
```
GET /api/room-categories/search?q=romantic&limit=10
```

### 3. Gợi ý loại phòng
```
GET /api/room-categories/suggestions
```

**Query Parameters:**
- `guest_count`: Số khách
- `budget`: Ngân sách tối đa
- `preferences`: Sở thích (romantic, family, budget, luxury)

**Ví dụ:**
```
GET /api/room-categories/suggestions?guest_count=2&preferences=romantic&budget=800000
```

### 4. Lấy chi tiết loại phòng
```
GET /api/room-categories/{category_id}?homestay_id=1
```

### 5. Kiểm tra tình trạng phòng
```
GET /api/room-categories/{category_id}/availability?homestay_id=1&start_date=2024-01-01&end_date=2024-01-07
```

### 6. Lấy danh sách tags
```
GET /api/room-categories/tags
```

### 7. Lấy filter options
```
GET /api/room-categories/filters
```

## 🏷️ Tags hệ thống

| Tag | Slug | Màu | Icon | Mô tả |
|-----|------|-----|------|-------|
| Phù hợp cho cặp đôi | couple-friendly | #ff69b4 | heart | Phòng lãng mạn cho cặp đôi |
| Có bếp riêng | private-kitchen | #ffa500 | utensils | Phòng có bếp nấu ăn |
| Thân thiện với thú cưng | pet-friendly | #32cd32 | paw | Cho phép mang thú cưng |
| View biển | sea-view | #1e90ff | water | Phòng nhìn ra biển |
| View núi | mountain-view | #228b22 | mountain | Phòng nhìn ra núi |
| Có ban công | balcony | #daa520 | home | Phòng có ban công |
| Phòng tập thể | dormitory | #8a2be2 | users | Phòng ngủ chung |

## 📊 Dữ liệu mẫu

### Loại phòng có sẵn:
1. **Phòng đơn tiêu chuẩn** - 300,000đ/đêm
   - 1 khách, 15m², giường đơn
   - View thành phố, không có ban công

2. **Phòng đôi romantic** - 500,000đ/đêm
   - 2 khách, 25m², giường đôi
   - View biển, có ban công
   - Tags: Phù hợp cho cặp đôi, View biển, Có ban công

3. **Phòng gia đình có bếp** - 800,000đ/đêm
   - 4 khách, 40m², 2 giường đôi
   - View núi, có ban công, có bếp
   - Tags: Có bếp riêng, View núi, Có ban công, Thân thiện với thú cưng

4. **Phòng tập thể backpacker** - 150,000đ/đêm
   - 8 khách, 30m², 8 giường tầng
   - View thành phố, có bếp chung
   - Tags: Phòng tập thể, Có bếp riêng

## 🔍 Tính năng tìm kiếm và lọc

### Lọc cơ bản:
- **Theo view**: Biển, Núi, Thành phố
- **Theo tiện nghi**: Ban công, Bếp riêng, Pet-friendly
- **Theo số khách**: 1-10 người
- **Theo giá**: Khoảng giá tùy chỉnh
- **Theo diện tích**: m² phòng

### Sắp xếp:
- Theo tên (A-Z)
- Theo giá (thấp → cao, cao → thấp)
- Theo diện tích (nhỏ → lớn, lớn → nhỏ)
- Theo số khách (ít → nhiều, nhiều → ít)

### Tìm kiếm thông minh:
- Tìm theo tên loại phòng
- Tìm theo mô tả
- Tìm theo loại giường
- Tìm theo view

### Gợi ý thông minh:
- **Romantic**: Ưu tiên phòng có view biển, ban công, phù hợp cặp đôi
- **Family**: Ưu tiên phòng lớn, có bếp, nhiều giường
- **Budget**: Sắp xếp theo giá thấp nhất
- **Luxury**: Ưu tiên phòng lớn, view đẹp, tiện nghi cao cấp

## 📱 Response Format

### RoomCategoryResponse:
```json
{
  "id": 1,
  "name": "Phòng đôi romantic",
  "slug": "double-romantic",
  "description": "Phòng đôi lãng mạn với view đẹp",
  "base_price": 500000,
  "max_guests": 2,
  "room_size": 25.0,
  "bed_type": "Giường đôi",
  "view_type": "Biển",
  "has_balcony": true,
  "has_kitchen": false,
  "is_pet_friendly": false,
  "amenities": ["WiFi", "Điều hòa", "TV", "Tủ lạnh", "Ban công", "Bồn tắm"],
  "images": [],
  "tags": [
    {
      "id": 1,
      "name": "Phù hợp cho cặp đôi",
      "slug": "couple-friendly",
      "color": "#ff69b4",
      "icon": "heart"
    }
  ],
  "available_rooms_count": 3
}
```

## 🛠️ Cách sử dụng trong Frontend

### 1. Hiển thị danh sách với filter:
```javascript
// Lấy danh sách với filter
const response = await fetch('/api/room-categories/?view_type=Biển&sort_by=price_asc');
const categories = await response.json();

// Hiển thị tags với màu sắc
categories.forEach(cat => {
  cat.tags.forEach(tag => {
    console.log(`<span style="color: ${tag.color}">${tag.name}</span>`);
  });
});
```

### 2. Tìm kiếm real-time:
```javascript
const searchInput = document.getElementById('search');
searchInput.addEventListener('input', async (e) => {
  const query = e.target.value;
  if (query.length > 2) {
    const response = await fetch(`/api/room-categories/search?q=${query}`);
    const results = await response.json();
    displaySearchResults(results);
  }
});
```

### 3. Gợi ý thông minh:
```javascript
// Gợi ý cho cặp đôi với budget 800k
const response = await fetch('/api/room-categories/suggestions?guest_count=2&preferences=romantic&budget=800000');
const suggestions = await response.json();

suggestions.suggestions.forEach(suggestion => {
  console.log(`${suggestion.name}: ${suggestion.reasons.join(', ')}`);
});
```

## 🎯 Kết luận

Hệ thống Room Categories đã được hoàn thiện với đầy đủ tính năng:

✅ **Phân loại chi tiết**: Theo loại phòng, view, tiện nghi  
✅ **Tags linh hoạt**: Gắn nhãn đa dạng với màu sắc và icon  
✅ **Lọc nâng cao**: Nhiều tiêu chí lọc kết hợp  
✅ **Sắp xếp đa dạng**: Theo giá, diện tích, số khách  
✅ **Tìm kiếm thông minh**: Full-text search  
✅ **Gợi ý cá nhân hóa**: Dựa trên sở thích và ngân sách  
✅ **API đầy đủ**: RESTful với documentation chi tiết  

Hệ thống giúp khách hàng dễ dàng tìm kiếm và lựa chọn loại phòng phù hợp, đồng thời hỗ trợ chủ homestay quản lý linh hoạt các loại phòng với giá cả và tiện nghi khác nhau.