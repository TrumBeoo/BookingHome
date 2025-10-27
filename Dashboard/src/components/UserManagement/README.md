# Quản lý Khách hàng - Customer Management

## Tổng quan
Hệ thống quản lý khách hàng đã được refactor hoàn toàn với đầy đủ các chức năng theo yêu cầu, bao gồm:

## 🔹 1. Danh sách khách hàng (CustomersList.jsx)

### Hiển thị bảng thông tin:
- **STT**: Tự động tăng theo pagination
- **Họ tên**: Hiển thị với avatar và ID
- **Email & Số điện thoại**: Với icon minh họa
- **Địa điểm**: Hiển thị địa chỉ khách hàng
- **Ngày đăng ký**: Format theo chuẩn Việt Nam
- **Tổng lượt đặt**: Hiển thị với chip màu theo mức độ
- **Tổng chi tiêu**: Format tiền tệ VNĐ
- **Trạng thái**: Chip màu (Hoạt động/Bị khóa/Không hoạt động)

### Chức năng tìm kiếm & lọc:
- **Tìm kiếm**: Theo tên, email, số điện thoại (real-time search với debounce)
- **Lọc theo thời gian đăng ký**: 7 ngày, 30 ngày, 90 ngày gần nhất
- **Lọc theo số lượt đặt phòng**: Chưa đặt, 1-3 lần, trên 10 lần
- **Lọc theo trạng thái**: Hoạt động, bị khóa, không hoạt động
- **Sắp xếp**: Theo ngày đăng ký, tên, tổng lượt đặt, tổng chi tiêu

### Thống kê tổng quan:
- **Cards thống kê**: Tổng khách hàng, đang hoạt động, bị khóa, tổng chi tiêu
- **Biểu đồ**: Tích hợp component CustomerAnalytics

## 🔹 2. Xem chi tiết khách hàng (Customer Detail Modal)

### Tabs thông tin:
1. **Thông tin cá nhân**: Họ tên, email, SĐT, giới tính, địa chỉ, ngày tham gia
2. **Lịch sử đặt phòng**: Danh sách homestay đã đặt, số lần hủy, thống kê
3. **Đánh giá & Phản hồi**: Rating trung bình, lịch sử đánh giá
4. **Thống kê hành vi**: Tổng chi tiêu, chi tiêu trung bình, tần suất đặt phòng

## 🔹 3. Thêm / Cập nhật / Xóa khách hàng

### Thêm khách hàng (AddCustomerDialog.jsx):
- **Form đầy đủ**: Họ tên, email, SĐT, mật khẩu, giới tính, địa chỉ
- **Validation**: Email format, mật khẩu strength, số điện thoại
- **Vai trò**: Customer/Host
- **Trạng thái**: Active/Inactive

### Cập nhật khách hàng (EditCustomerDialog.jsx):
- **Chỉnh sửa thông tin**: Tất cả thông tin cá nhân
- **Thay đổi vai trò**: Customer/Host/Admin
- **Cập nhật trạng thái**: Active/Inactive/Blocked
- **Hiển thị thống kê**: Tổng đặt phòng, chi tiêu, ngày tham gia

### Xóa khách hàng:
- **Soft delete**: Chuyển về trạng thái "đã xóa"
- **Confirmation dialog**: Xác nhận trước khi xóa
- **Bảo toàn dữ liệu**: Giữ lại lịch sử đặt phòng

## 🔹 4. Phân quyền & trạng thái tài khoản (PermissionsManagement.jsx)

### Quản lý vai trò:
- **Admin**: Toàn quyền hệ thống
- **Host**: Quản lý homestay và booking
- **Customer**: Quyền cơ bản của khách hàng

### Phân quyền chi tiết:
- **Dashboard**: View, Manage
- **Users**: View, Create, Edit, Delete, Block
- **Homestays**: View, Create, Edit, Delete, Approve
- **Bookings**: View, Manage, Cancel
- **Payments**: View, Manage, Refund
- **Reviews**: View, Moderate, Delete
- **Analytics**: View, Export
- **Settings**: View, Manage

### Khóa/Mở khóa tài khoản:
- **Block user**: Với lý do cụ thể
- **Unblock user**: Khôi phục quyền truy cập
- **Status tracking**: Theo dõi trạng thái thay đổi

## 🔹 5. Thống kê & Báo cáo (CustomerAnalytics.jsx)

### Biểu đồ thống kê:
- **Tăng trưởng khách hàng**: Theo tháng
- **Top khách hàng VIP**: Theo tổng chi tiêu
- **Phân bố địa lý**: Theo tỉnh/thành phố
- **Phân khúc khách hàng**: VIP, Thường xuyên, Bình thường, Mới

### Metrics chính:
- **Tổng khách hàng**: Với % tăng trưởng
- **Khách hàng mới**: Trong tháng
- **Tỷ lệ khách quay lại**: Repeat customer rate
- **Đánh giá trung bình**: Customer satisfaction

### Phân tích hành vi:
- **Số đặt phòng trung bình/khách hàng**
- **Chi tiêu trung bình/khách hàng**
- **Tỷ lệ khách hàng quay lại**
- **Mức độ hài lòng trung bình**

## 🔹 6. Quản lý phản hồi & Email

### Email Management:
- **Gửi email cá nhân**: Cho từng khách hàng
- **Gửi email hàng loạt**: Cho tất cả hoặc nhóm đã lọc
- **Template email**: Tiêu đề và nội dung tùy chỉnh
- **Recipient options**: Selected, All, Filtered

### Feedback Management:
- **Xem đánh giá**: Trong customer detail modal
- **Lọc theo sao**: 1-5 sao
- **Moderate reviews**: Trong permissions system

## 🔹 7. Tài khoản bị khóa (BlockedAccountsList.jsx)

### Quản lý tài khoản khóa:
- **Danh sách chi tiết**: Lý do khóa, ngày khóa
- **Thống kê**: Tổng bị khóa, khóa trong tháng, đã mở khóa
- **Actions**: Xem chi tiết, mở khóa, xóa vĩnh viễn
- **Block reasons**: Vi phạm điều khoản, spam, gian lận, etc.

## 🔹 8. Tích hợp Marketing / CRM

### Export Data:
- **Xuất CSV/Excel**: Dữ liệu khách hàng để phân tích
- **Filter export**: Theo các tiêu chí đã lọc

### Customer Segmentation:
- **VIP**: Chi tiêu > 10M VNĐ
- **Thường xuyên**: 5+ đặt phòng/năm
- **Bình thường**: 2-4 đặt phòng/năm
- **Mới**: 1 đặt phòng hoặc chưa đặt

## 📁 Cấu trúc Files

```
src/components/UserManagement/
├── CustomersList.jsx           # Danh sách khách hàng chính
├── AddCustomerDialog.jsx       # Dialog thêm khách hàng
├── EditCustomerDialog.jsx      # Dialog chỉnh sửa khách hàng
├── CustomerAnalytics.jsx       # Thống kê & phân tích
├── BlockedAccountsList.jsx     # Quản lý tài khoản bị khóa
├── PermissionsManagement.jsx   # Phân quyền người dùng
├── HostsList.jsx              # Danh sách host (existing)
└── README.md                  # Tài liệu này
```

## 🔧 API Integration

### Endpoints được sử dụng:
- `GET /dashboard/users` - Lấy danh sách users với filter/search
- `GET /dashboard/users/:id` - Lấy thông tin chi tiết user
- `POST /dashboard/users` - Tạo user mới
- `PUT /dashboard/users/:id` - Cập nhật thông tin user
- `PATCH /dashboard/users/:id/status` - Cập nhật trạng thái
- `DELETE /dashboard/users/:id` - Xóa user
- `GET /dashboard/users/stats` - Lấy thống kê users
- `POST /dashboard/users/bulk-email` - Gửi email hàng loạt
- `GET /dashboard/users/:id/bookings` - Lịch sử đặt phòng
- `PUT /dashboard/users/:id/permissions` - Cập nhật quyền hạn

## 🎨 UI/UX Features

### Material-UI Components:
- **DataTable**: Với sorting, pagination, search
- **Cards**: Thống kê tổng quan
- **Dialogs**: Modal chi tiết và form
- **Chips**: Status và role indicators
- **Tabs**: Tổ chức thông tin chi tiết
- **Accordions**: Phân quyền chi tiết
- **Snackbar**: Thông báo thành công/lỗi

### Responsive Design:
- **Mobile-friendly**: Responsive grid system
- **Touch-friendly**: Buttons và interactions
- **Loading states**: Skeleton và progress indicators
- **Error handling**: User-friendly error messages

## 🚀 Performance Optimizations

### Tối ưu hóa:
- **Debounced search**: Giảm API calls
- **Pagination**: Server-side pagination
- **Memoization**: useMemo cho filtered data
- **Lazy loading**: Components và data
- **Caching**: API response caching

### Best Practices:
- **Error boundaries**: Xử lý lỗi graceful
- **Loading states**: UX tốt khi loading
- **Form validation**: Client-side validation
- **Accessibility**: ARIA labels và keyboard navigation

## 📱 Mobile Responsiveness

### Breakpoints:
- **xs (0px+)**: Mobile phones
- **sm (600px+)**: Tablets
- **md (900px+)**: Small laptops
- **lg (1200px+)**: Desktops
- **xl (1536px+)**: Large screens

### Mobile Adaptations:
- **Collapsible filters**: Trên mobile
- **Swipe actions**: Cho table rows
- **Bottom sheets**: Thay vì dialogs
- **Touch targets**: Minimum 44px

## 🔐 Security Features

### Permissions:
- **Role-based access**: Admin, Host, Customer
- **Granular permissions**: Module-level controls
- **Action restrictions**: Based on user role
- **Data filtering**: Users only see allowed data

### Data Protection:
- **Input sanitization**: XSS protection
- **CSRF protection**: Token-based
- **Rate limiting**: API call limits
- **Audit logging**: User action tracking

---

## 🎯 Kết luận

Hệ thống quản lý khách hàng đã được refactor hoàn toàn với:
- ✅ Đầy đủ 8 chức năng chính theo yêu cầu
- ✅ UI/UX hiện đại với Material-UI
- ✅ Responsive design cho mọi thiết bị
- ✅ Performance optimization
- ✅ Security best practices
- ✅ Scalable architecture
- ✅ Comprehensive error handling
- ✅ Real-time search và filtering
- ✅ Advanced analytics và reporting
- ✅ Complete CRUD operations

Hệ thống sẵn sàng cho production và có thể mở rộng thêm các tính năng nâng cao trong tương lai.