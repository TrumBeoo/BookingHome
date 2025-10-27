# THÔNG TIN ĐĂNG NHẬP

## Vấn đề đã được giải quyết ✅

**Nguyên nhân**: Password của các user trong database không khớp với password mong đợi.

**Giải pháp**: Đã cập nhật lại password cho tất cả users.

## Thông tin đăng nhập hiện tại:

### 👤 Customer Users:
- **Email**: nva@gmail.com  
  **Password**: 123456789

- **Email**: nvb@gmail.com  
  **Password**: 123456789

- **Email**: test@example.com  
  **Password**: 123456789

- **Email**: demo@gmail.com  
  **Password**: 123456789

### 👨‍💼 Admin User:
- **Email**: admin@homestay.com  
  **Password**: admin123  
  **Role**: super_admin

## Cách test:

### 1. Test qua API:
```bash
curl -X POST "http://localhost:8000/auth/login" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=nva@gmail.com&password=123456789"
```

### 2. Test qua Frontend:
- Mở http://localhost:3000/login
- Nhập email và password từ danh sách trên
- Đăng nhập thành công

### 3. Test qua Dashboard (Admin):
- Mở http://localhost:3001/login  
- Sử dụng admin@homestay.com / admin123

## Lưu ý:
- Backend API: http://localhost:8000
- Frontend: http://localhost:3000  
- Dashboard: http://localhost:3001
- Tất cả endpoints đều hoạt động bình thường