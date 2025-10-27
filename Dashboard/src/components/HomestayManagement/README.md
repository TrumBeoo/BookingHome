# Homestay Management System

## 🏠 Tổng quan
Hệ thống quản lý homestay hoàn chỉnh với các chức năng:
- Quản lý tiện ích (amenities)
- Quản lý danh mục (categories) 
- Quản lý hình ảnh (images)
- Quản lý lịch trống (availability)

## 🚀 Cách sử dụng

### 1. Truy cập
- URL: `/dashboard/homestays/manage`
- Yêu cầu: Đăng nhập với quyền admin

### 2. Chọn Homestay
- Chọn homestay từ danh sách hiển thị
- Homestay được chọn sẽ có viền xanh

### 3. Quản lý Tiện ích
- **Thêm tiện ích mới**: Nhập tên và icon (emoji)
- **Gán cho homestay**: Tick checkbox bên cạnh tiện ích
- **Chỉnh sửa**: Click icon Edit
- **Xóa**: Click icon Delete (có xác nhận)

### 4. Quản lý Danh mục
- **Tạo danh mục**: Nhập tên, slug tự động tạo
- **Gán cho homestay**: Chọn từ dropdown
- **Chỉnh sửa**: Click Edit trong danh sách
- **Xóa**: Chỉ xóa được nếu không có homestay nào sử dụng

### 5. Quản lý Hình ảnh
- **Upload**: Kéo thả hoặc click "Upload hình ảnh"
- **Đặt ảnh chính**: Click icon Star
- **Chỉnh sửa**: Click Edit để sửa alt text và thứ tự
- **Xóa**: Click Delete (có xác nhận)

### 6. Quản lý Lịch trống
- **Thêm ngày**: Chọn ngày và trạng thái có sẵn
- **Giá đặc biệt**: Nhập giá khác với giá gốc
- **Cập nhật hàng loạt**: Chọn khoảng thời gian
- **Thống kê**: Xem số ngày có sẵn/không có sẵn

## 🔧 Setup Backend

### 1. Tạo bảng availability
```bash
cd backend
python create_availability_table.py
```

### 2. Khởi động server
```bash
python main.py
```

## 📝 API Endpoints

### Amenities
- `GET /dashboard/amenities` - Lấy danh sách
- `POST /dashboard/amenities` - Tạo mới
- `PUT /dashboard/amenities/{id}` - Cập nhật
- `DELETE /dashboard/amenities/{id}` - Xóa

### Categories  
- `GET /dashboard/categories` - Lấy danh sách
- `POST /dashboard/categories` - Tạo mới
- `PUT /dashboard/categories/{id}` - Cập nhật
- `DELETE /dashboard/categories/{id}` - Xóa

### Images
- `GET /dashboard/homestays/{id}/images` - Lấy ảnh homestay
- `POST /dashboard/homestays/{id}/upload-images` - Upload ảnh
- `PATCH /dashboard/homestays/{id}/images/{image_id}/primary` - Đặt ảnh chính
- `DELETE /dashboard/images/{id}` - Xóa ảnh

### Availability
- `GET /dashboard/homestays/{id}/availability` - Lấy lịch
- `POST /dashboard/availability` - Tạo lịch
- `PUT /dashboard/availability/{id}` - Cập nhật
- `DELETE /dashboard/availability/{id}` - Xóa
- `POST /dashboard/availability/bulk` - Cập nhật hàng loạt

## 🐛 Troubleshooting

### Lỗi "process is not defined"
- ✅ Đã sửa: Dùng `import.meta.env.VITE_API_URL` thay vì `process.env`

### Lỗi DatePicker
- ✅ Đã sửa: Cập nhật API DatePicker MUI v6

### Lỗi API không hoạt động
- Kiểm tra server backend đang chạy
- Kiểm tra CORS settings
- Xem console để debug

## 📱 Responsive Design
- Desktop: Grid layout đầy đủ
- Tablet: 2 cột
- Mobile: 1 cột, stack vertical

## 🎨 Styling
- Material-UI components
- Custom CSS trong `HomestayManagement.css`
- Hover effects và transitions
- Loading states và empty states