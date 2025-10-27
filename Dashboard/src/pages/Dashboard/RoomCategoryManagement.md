# Room Category Management - Quản lý loại phòng

## Tổng quan

Giao diện quản lý loại phòng được thiết kế hiện đại với đầy đủ tính năng để quản lý các loại phòng trong hệ thống homestay.

## Tính năng chính

### 1. Dashboard Tổng quan
- **Thống kê tổng quan**: Hiển thị số lượng loại phòng, giá trung bình, loại phổ biến nhất
- **Cards thống kê**: Với icon và màu sắc phân biệt
- **Responsive design**: Tự động điều chỉnh theo kích thước màn hình

### 2. Quản lý danh sách loại phòng
- **Grid layout hiện đại**: Hiển thị dạng card với hình ảnh
- **Tìm kiếm**: Tìm theo tên và mô tả
- **Bộ lọc nâng cao**: Lọc theo view, ban công, bếp riêng
- **Phân trang**: Hỗ trợ phân trang cho danh sách lớn

### 3. Form tạo/chỉnh sửa loại phòng
- **Accordion layout**: Tổ chức thông tin theo nhóm
- **Validation**: Kiểm tra dữ liệu đầu vào
- **Switch controls**: Cho các tính năng đặc biệt
- **Tag management**: Quản lý tags với màu sắc

### 4. Quản lý hình ảnh
- **Upload multiple files**: Tải lên nhiều hình cùng lúc
- **Drag & drop**: Kéo thả file để upload
- **Preview**: Xem trước hình ảnh
- **Delete**: Xóa hình ảnh không cần thiết

### 5. Quản lý Tags
- **Tạo tag mới**: Với tên, màu sắc và mô tả
- **Color picker**: Chọn màu cho tag
- **Visual display**: Hiển thị tags với màu sắc

## Cấu trúc Component

```
RoomCategoryManagement/
├── RoomCategoryManagement.jsx     # Component chính
├── RoomCategoryManagement.css     # Styles tùy chỉnh
└── components/
    └── RoomManagement/
        └── ImageManagement.jsx    # Component quản lý hình ảnh
```

## API Endpoints

### Room Categories
- `GET /api/room-categories` - Lấy danh sách loại phòng
- `POST /api/admin/room-categories` - Tạo loại phòng mới
- `PUT /api/admin/room-categories/:id` - Cập nhật loại phòng
- `DELETE /api/admin/room-categories/:id` - Xóa loại phòng
- `GET /api/admin/room-categories/statistics` - Lấy thống kê

### Tags
- `GET /api/room-categories/tags` - Lấy danh sách tags
- `POST /api/admin/room-categories/tags` - Tạo tag mới
- `PUT /api/admin/room-categories/tags/:id` - Cập nhật tag
- `DELETE /api/admin/room-categories/tags/:id` - Xóa tag

### Images
- `POST /api/admin/room-categories/:id/images` - Upload hình ảnh
- `DELETE /api/admin/room-categories/:id/images/:imageId` - Xóa hình ảnh

## State Management

### Main States
```javascript
const [categories, setCategories] = useState([]);
const [tags, setTags] = useState([]);
const [statistics, setStatistics] = useState({});
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);
const [success, setSuccess] = useState('');
```

### UI States
```javascript
const [currentTab, setCurrentTab] = useState(0);
const [viewMode, setViewMode] = useState('grid');
const [dialogOpen, setDialogOpen] = useState(false);
const [imageDialogOpen, setImageDialogOpen] = useState(false);
const [tagDialogOpen, setTagDialogOpen] = useState(false);
```

### Filter & Search
```javascript
const [searchTerm, setSearchTerm] = useState('');
const [filterOptions, setFilterOptions] = useState({
  view_type: '',
  has_balcony: null,
  has_kitchen: null,
  is_pet_friendly: null,
  price_range: [0, 10000000],
  tags: []
});
```

## Responsive Design

### Breakpoints
- **Desktop**: >= 1200px - Grid 3 columns
- **Tablet**: 768px - 1199px - Grid 2 columns
- **Mobile**: < 768px - Grid 1 column

### Mobile Optimizations
- Compact form layouts
- Touch-friendly buttons
- Simplified navigation
- Optimized image sizes

## Performance Features

### Lazy Loading
- Images được load khi cần thiết
- Pagination để giảm tải dữ liệu

### Caching
- Cache API responses
- Optimistic updates

### Animations
- Smooth transitions
- Loading skeletons
- Hover effects

## Accessibility

### ARIA Labels
- Screen reader support
- Keyboard navigation
- Focus management

### Color Contrast
- WCAG 2.1 compliant
- High contrast mode support

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Development

### Prerequisites
```bash
npm install @mui/material @emotion/react @emotion/styled
npm install @mui/icons-material
```

### Running
```bash
cd Dashboard
npm run dev
```

### Building
```bash
npm run build
```

## Customization

### Themes
Sử dụng Material-UI theme system để tùy chỉnh màu sắc và typography.

### CSS Variables
```css
:root {
  --primary-color: #1976d2;
  --secondary-color: #dc004e;
  --success-color: #4caf50;
  --warning-color: #ff9800;
  --error-color: #f44336;
}
```

### Component Props
Các component có thể được tùy chỉnh thông qua props:

```javascript
<RoomCategoryManagement
  itemsPerPage={12}
  enableImageUpload={true}
  enableTagManagement={true}
  showStatistics={true}
/>
```

## Testing

### Unit Tests
```bash
npm run test
```

### E2E Tests
```bash
npm run test:e2e
```

## Deployment

### Environment Variables
```env
VITE_API_URL=http://localhost:8000
VITE_UPLOAD_MAX_SIZE=5242880
VITE_SUPPORTED_FORMATS=jpg,jpeg,png,gif
```

### Build Optimization
- Code splitting
- Tree shaking
- Asset optimization
- Gzip compression

## Troubleshooting

### Common Issues

1. **Images not loading**
   - Check API endpoint
   - Verify file permissions
   - Check CORS settings

2. **Form validation errors**
   - Verify required fields
   - Check data types
   - Validate file formats

3. **Performance issues**
   - Enable pagination
   - Optimize images
   - Use lazy loading

### Debug Mode
```javascript
localStorage.setItem('debug', 'true');
```

## Contributing

1. Fork the repository
2. Create feature branch
3. Make changes
4. Add tests
5. Submit pull request

## License

MIT License - see LICENSE file for details.