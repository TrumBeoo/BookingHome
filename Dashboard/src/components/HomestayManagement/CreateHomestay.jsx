import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import ApiService from '../../services/api';
import { getToken, isTokenExpired } from '../../utils/tokenUtils';
import './CreateHomestay.css';

const CreateHomestay = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [activeStep, setActiveStep] = useState(0);
  const [homestayData, setHomestayData] = useState({
    name: '',
    description: '',
    shortDescription: '',
    category: '',
    address: '',
    city: '',
    district: '',
    ward: '',
    latitude: '',
    longitude: '',
    propertyType: 'homestay',
    bedrooms: 1,
    bathrooms: 1,
    capacity: 2,
    area: '',
    basePrice: '',
    weekendPrice: '',
    monthlyDiscount: 0,
    weeklyDiscount: 0,
    cleaningFee: '',
    securityDeposit: '',
    amenities: [],
    checkInTime: '14:00',
    checkOutTime: '12:00',
    minStay: 1,
    maxStay: 30,
    allowPets: false,
    allowSmoking: false,
    allowParties: false,
    images: [],
    hostId: '',
    status: 'draft',
  });

  const [errors, setErrors] = useState({});
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const steps = [
    'Thông tin cơ bản',
    'Địa điểm',
    'Chi tiết homestay',
    'Giá cả',
    'Tiện ích',
    'Quy định',
    'Hình ảnh',
    'Xem lại'
  ];



  const propertyTypes = [
    { value: 'homestay', label: 'Homestay' },
    { value: 'villa', label: 'Villa' },
    { value: 'apartment', label: 'Căn hộ' },
    { value: 'house', label: 'Nhà riêng' },
    { value: 'bungalow', label: 'Bungalow' },
  ];

  const amenitiesList = [
    { id: 'wifi', label: 'WiFi miễn phí' },
    { id: 'pool', label: 'Hồ bơi' },
    { id: 'kitchen', label: 'Bếp' },
    { id: 'parking', label: 'Chỗ đậu xe' },
    { id: 'ac', label: 'Điều hòa' },
    { id: 'tv', label: 'TV' },
    { id: 'washing', label: 'Máy giặt' },
  ];

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      const response = await ApiService.getCategories();
      console.log('Categories response:', response);
      if (response && response.categories) {
        setCategories(response.categories);
      } else if (Array.isArray(response)) {
        setCategories(response);
      } else {
        throw new Error('Invalid categories response format');
      }
    } catch (error) {
      console.error('Failed to load categories:', error);
      // Fallback categories nếu API fail
      setCategories([
        { id: 1, name: 'Homestay cao cấp' },
        { id: 2, name: 'Homestay giá rẻ' },
        { id: 3, name: 'Homestay gần biển' },
        { id: 4, name: 'Homestay gần núi' },
        { id: 5, name: 'Homestay thành phố' },
        { id: 6, name: 'Homestay nông thôn' }
      ]);
    }
  };

  const handleInputChange = (field, value) => {
    setHomestayData(prev => ({
      ...prev,
      [field]: value
    }));
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleAmenityToggle = (amenityId) => {
    setHomestayData(prev => ({
      ...prev,
      amenities: prev.amenities.includes(amenityId)
        ? prev.amenities.filter(id => id !== amenityId)
        : [...prev.amenities, amenityId]
    }));
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      const maxSize = 10 * 1024 * 1024; // 10MB
      return validTypes.includes(file.type) && file.size <= maxSize;
    });

    if (validFiles.length !== files.length) {
      alert('Một số file không hợp lệ. Chỉ chấp nhận JPG, PNG, WebP và tối đa 10MB.');
    }

    const newImages = validFiles.map(file => ({
      file,
      preview: URL.createObjectURL(file),
      name: file.name
    }));

    setHomestayData(prev => ({
      ...prev,
      images: [...prev.images, ...newImages]
    }));
  };

  const handleRemoveImage = (index) => {
    setHomestayData(prev => {
      const newImages = [...prev.images];
      // Revoke object URL to prevent memory leaks
      if (newImages[index].preview) {
        URL.revokeObjectURL(newImages[index].preview);
      }
      newImages.splice(index, 1);
      return {
        ...prev,
        images: newImages
      };
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const files = Array.from(e.dataTransfer.files);
    const event = { target: { files } };
    handleImageUpload(event);
  };

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const validateStep = (step) => {
    const newErrors = {};
    
    switch (step) {
      case 0:
        if (!homestayData.name) newErrors.name = 'Tên homestay là bắt buộc';
        if (!homestayData.description) newErrors.description = 'Mô tả là bắt buộc';
        if (!homestayData.category) newErrors.category = 'Danh mục là bắt buộc';
        break;
      case 1:
        if (!homestayData.address) newErrors.address = 'Địa chỉ là bắt buộc';
        if (!homestayData.city) newErrors.city = 'Thành phố là bắt buộc';
        break;
      case 2:
        if (!homestayData.bedrooms || homestayData.bedrooms < 1) newErrors.bedrooms = 'Số phòng ngủ phải lớn hơn 0';
        if (!homestayData.capacity || homestayData.capacity < 1) newErrors.capacity = 'Sức chứa phải lớn hơn 0';
        break;
      case 3:
        if (!homestayData.basePrice) newErrors.basePrice = 'Giá cơ bản là bắt buộc';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (status = 'draft') => {
    setLoading(true);
    setSubmitError('');
    
    // Kiểm tra token trước khi gửi request
    const token = getToken();
    if (!token) {
      setSubmitError('Bạn chưa đăng nhập. Vui lòng đăng nhập lại.');
      setLoading(false);
      return;
    }
    
    if (isTokenExpired(token)) {
      setSubmitError('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      setLoading(false);
      return;
    }
    
    try {
      const dataToSave = {
        name: homestayData.name,
        description: homestayData.description,
        price_per_night: parseFloat(homestayData.basePrice) || 0,
        max_guests: homestayData.capacity,
        category_id: categories.find(c => c.name === homestayData.category)?.id || null,
        address: homestayData.address,
        latitude: parseFloat(homestayData.latitude) || null,
        longitude: parseFloat(homestayData.longitude) || null,
        contact_info: {
          checkInTime: homestayData.checkInTime,
          checkOutTime: homestayData.checkOutTime,
        },
        rules: `Số đêm tối thiểu: ${homestayData.minStay}, Số đêm tối đa: ${homestayData.maxStay}`,
        check_in_out_times: {
          checkIn: homestayData.checkInTime,
          checkOut: homestayData.checkOutTime,
        },
        status: status,
        discount_percent: homestayData.weeklyDiscount || 0,
        featured: false
      };
      
      const response = await ApiService.createHomestay(dataToSave);
      
      if (response.homestay) {
        const homestayId = response.homestay.id;
        
        // Upload ảnh nếu có
        if (homestayData.images.length > 0) {
          try {
            const imageFiles = homestayData.images.map(image => image.file);
            await ApiService.uploadHomestayImages(homestayId, imageFiles);
          } catch (imageError) {
            console.error('Failed to upload images:', imageError);
            // Vẫn thông báo thành công nhưng cảnh báo về ảnh
            alert('Homestay đã được tạo thành công! Tuy nhiên có lỗi khi upload ảnh, bạn có thể thêm ảnh sau.');
            navigate('/dashboard/homestays');
            return;
          }
        }
        
        alert('Homestay đã được tạo thành công!');
        navigate('/dashboard/homestays');
      }
    } catch (error) {
      console.error('Failed to save homestay:', error);
      console.error('Error details:', error.message);
      if (error.message.includes('Token')) {
        setSubmitError('Phiên đăng nhập không hợp lệ. Vui lòng đăng nhập lại.');
      } else if (error.message.includes('host_id')) {
        setSubmitError('Lỗi xác thực người dùng. Vui lòng đăng nhập lại.');
      } else {
        setSubmitError(error.message || 'Có lỗi xảy ra khi lưu homestay');
      }
    } finally {
      setLoading(false);
    }
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <div className="form-section">
            <div className="form-row">
              <div className="form-group full-width">
                <label htmlFor="name">Tên homestay *</label>
                <input
                  type="text"
                  id="name"
                  value={homestayData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={errors.name ? 'error' : ''}
                  placeholder="Nhập tên homestay"
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group full-width">
                <label htmlFor="shortDescription">Mô tả ngắn</label>
                <textarea
                  id="shortDescription"
                  value={homestayData.shortDescription}
                  onChange={(e) => handleInputChange('shortDescription', e.target.value)}
                  rows="2"
                  placeholder="Mô tả ngắn gọn về homestay"
                ></textarea>
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group full-width">
                <label htmlFor="description">Mô tả chi tiết *</label>
                <textarea
                  id="description"
                  value={homestayData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows="4"
                  className={errors.description ? 'error' : ''}
                  placeholder="Mô tả chi tiết về homestay, tiện ích, vị trí..."
                ></textarea>
                {errors.description && <span className="error-text">{errors.description}</span>}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="category">Danh mục *</label>
                <select
                  id="category"
                  value={homestayData.category}
                  onChange={(e) => handleInputChange('category', e.target.value)}
                  className={errors.category ? 'error' : ''}
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.name}>
                      {category.name}
                    </option>
                  ))}
                </select>
                {errors.category && <span className="error-text">{errors.category}</span>}
              </div>
              
              <div className="form-group half-width">
                <label htmlFor="propertyType">Loại hình</label>
                <select
                  id="propertyType"
                  value={homestayData.propertyType}
                  onChange={(e) => handleInputChange('propertyType', e.target.value)}
                >
                  {propertyTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 1:
        return (
          <div className="form-section">
            <div className="form-row">
              <div className="form-group full-width">
                <label htmlFor="address">📍 Địa chỉ *</label>
                <input
                  type="text"
                  id="address"
                  value={homestayData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className={errors.address ? 'error' : ''}
                  placeholder="Số nhà, tên đường, phường/xã"
                />
                {errors.address && <span className="error-text">{errors.address}</span>}
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="city">Thành phố *</label>
                <input
                  type="text"
                  id="city"
                  value={homestayData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className={errors.city ? 'error' : ''}
                  placeholder="Tên thành phố/tỉnh"
                />
                {errors.city && <span className="error-text">{errors.city}</span>}
              </div>
              
              <div className="form-group half-width">
                <label htmlFor="district">Quận/Huyện</label>
                <input
                  type="text"
                  id="district"
                  value={homestayData.district}
                  onChange={(e) => handleInputChange('district', e.target.value)}
                  placeholder="Tên quận/huyện"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="ward">Phường/Xã</label>
                <input
                  type="text"
                  id="ward"
                  value={homestayData.ward}
                  onChange={(e) => handleInputChange('ward', e.target.value)}
                  placeholder="Tên phường/xã"
                />
              </div>
              
              <div className="form-group half-width">
                <label htmlFor="area">Diện tích (m²)</label>
                <input
                  type="number"
                  id="area"
                  value={homestayData.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                  placeholder="Diện tích"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="latitude">Vĩ độ</label>
                <input
                  type="text"
                  id="latitude"
                  value={homestayData.latitude}
                  onChange={(e) => handleInputChange('latitude', e.target.value)}
                  placeholder="Ví dụ: 21.0285"
                />
              </div>
              
              <div className="form-group half-width">
                <label htmlFor="longitude">Kinh độ</label>
                <input
                  type="text"
                  id="longitude"
                  value={homestayData.longitude}
                  onChange={(e) => handleInputChange('longitude', e.target.value)}
                  placeholder="Ví dụ: 105.8542"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="form-section">
            <div className="form-row">
              <div className="form-group quarter-width">
                <label htmlFor="bedrooms">🛏️ Số phòng ngủ *</label>
                <input
                  type="number"
                  id="bedrooms"
                  value={homestayData.bedrooms}
                  onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value))}
                  className={errors.bedrooms ? 'error' : ''}
                  min="1"
                />
                {errors.bedrooms && <span className="error-text">{errors.bedrooms}</span>}
              </div>
              
              <div className="form-group quarter-width">
                <label htmlFor="bathrooms">🛿 Số phòng tắm *</label>
                <input
                  type="number"
                  id="bathrooms"
                  value={homestayData.bathrooms}
                  onChange={(e) => handleInputChange('bathrooms', parseInt(e.target.value))}
                  min="1"
                />
              </div>
              
              <div className="form-group quarter-width">
                <label htmlFor="capacity">👥 Sức chứa *</label>
                <input
                  type="number"
                  id="capacity"
                  value={homestayData.capacity}
                  onChange={(e) => handleInputChange('capacity', parseInt(e.target.value))}
                  className={errors.capacity ? 'error' : ''}
                  min="1"
                />
                {errors.capacity && <span className="error-text">{errors.capacity}</span>}
              </div>
              
              <div className="form-group quarter-width">
                <label htmlFor="area2">📐 Diện tích (m²)</label>
                <input
                  type="number"
                  id="area2"
                  value={homestayData.area}
                  onChange={(e) => handleInputChange('area', e.target.value)}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="form-section">
            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="basePrice">💰 Giá cơ bản/đêm (VNĐ) *</label>
                <input
                  type="number"
                  id="basePrice"
                  value={homestayData.basePrice}
                  onChange={(e) => handleInputChange('basePrice', e.target.value)}
                  className={errors.basePrice ? 'error' : ''}
                  placeholder="Ví dụ: 500000"
                />
                {errors.basePrice && <span className="error-text">{errors.basePrice}</span>}
              </div>
              
              <div className="form-group half-width">
                <label htmlFor="weekendPrice">🎉 Giá cuối tuần/đêm (VNĐ)</label>
                <input
                  type="number"
                  id="weekendPrice"
                  value={homestayData.weekendPrice}
                  onChange={(e) => handleInputChange('weekendPrice', e.target.value)}
                  placeholder="Ví dụ: 600000"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="cleaningFee">🧹 Phí dọn dẹp (VNĐ)</label>
                <input
                  type="number"
                  id="cleaningFee"
                  value={homestayData.cleaningFee}
                  onChange={(e) => handleInputChange('cleaningFee', e.target.value)}
                  placeholder="Ví dụ: 100000"
                />
              </div>
              
              <div className="form-group half-width">
                <label htmlFor="securityDeposit">🔒 Tiền đặt cọc (VNĐ)</label>
                <input
                  type="number"
                  id="securityDeposit"
                  value={homestayData.securityDeposit}
                  onChange={(e) => handleInputChange('securityDeposit', e.target.value)}
                  placeholder="Ví dụ: 1000000"
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="weeklyDiscount">📅 Giảm giá theo tuần (%)</label>
                <input
                  type="number"
                  id="weeklyDiscount"
                  value={homestayData.weeklyDiscount}
                  onChange={(e) => handleInputChange('weeklyDiscount', e.target.value)}
                  min="0"
                  max="50"
                  placeholder="Ví dụ: 10"
                />
              </div>
              
              <div className="form-group half-width">
                <label htmlFor="monthlyDiscount">📆 Giảm giá theo tháng (%)</label>
                <input
                  type="number"
                  id="monthlyDiscount"
                  value={homestayData.monthlyDiscount}
                  onChange={(e) => handleInputChange('monthlyDiscount', e.target.value)}
                  min="0"
                  max="50"
                  placeholder="Ví dụ: 20"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="form-section">
            <h3>🏠 Chọn tiện ích có sẵn</h3>
            <div className="amenities-grid">
              {amenitiesList.map((amenity) => (
                <div 
                  key={amenity.id}
                  className={`amenity-card ${homestayData.amenities.includes(amenity.id) ? 'selected' : ''}`}
                  onClick={() => handleAmenityToggle(amenity.id)}
                >
                  <div className="amenity-icon">{amenity.label.includes('WiFi') ? '📶' : amenity.label.includes('Hồ bơi') ? '🏊' : amenity.label.includes('Bếp') ? '🍳' : amenity.label.includes('xe') ? '🚗' : amenity.label.includes('Điều hòa') ? '❄️' : amenity.label.includes('TV') ? '📺' : '🧺'}</div>
                  <div className="amenity-label">{amenity.label}</div>
                </div>
              ))}
            </div>
            <div className="selected-amenities">
              <p>Đã chọn: {homestayData.amenities.length} tiện ích</p>
              <div className="amenity-tags">
                {homestayData.amenities.map((amenityId) => {
                  const amenity = amenitiesList.find(a => a.id === amenityId);
                  return (
                    <span 
                      key={amenityId} 
                      className="amenity-tag"
                      onClick={() => handleAmenityToggle(amenityId)}
                    >
                      {amenity?.label} ✕
                    </span>
                  );
                })}
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="form-section">
            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="checkInTime">🕐 Giờ check-in</label>
                <input
                  type="time"
                  id="checkInTime"
                  value={homestayData.checkInTime}
                  onChange={(e) => handleInputChange('checkInTime', e.target.value)}
                />
              </div>
              
              <div className="form-group half-width">
                <label htmlFor="checkOutTime">🕐 Giờ check-out</label>
                <input
                  type="time"
                  id="checkOutTime"
                  value={homestayData.checkOutTime}
                  onChange={(e) => handleInputChange('checkOutTime', e.target.value)}
                />
              </div>
            </div>
            
            <div className="form-row">
              <div className="form-group half-width">
                <label htmlFor="minStay">📅 Số đêm tối thiểu</label>
                <input
                  type="number"
                  id="minStay"
                  value={homestayData.minStay}
                  onChange={(e) => handleInputChange('minStay', parseInt(e.target.value))}
                  min="1"
                />
              </div>
              
              <div className="form-group half-width">
                <label htmlFor="maxStay">📅 Số đêm tối đa</label>
                <input
                  type="number"
                  id="maxStay"
                  value={homestayData.maxStay}
                  onChange={(e) => handleInputChange('maxStay', parseInt(e.target.value))}
                  min="1"
                />
              </div>
            </div>
            
            <div className="rules-section">
              <h3>📋 Quy định</h3>
              <div className="checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={homestayData.allowPets}
                    onChange={(e) => handleInputChange('allowPets', e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  🐕 Cho phép thú cưng
                </label>
                
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={homestayData.allowSmoking}
                    onChange={(e) => handleInputChange('allowSmoking', e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  🚬 Cho phép hút thuốc
                </label>
                
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={homestayData.allowParties}
                    onChange={(e) => handleInputChange('allowParties', e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  🎉 Cho phép tổ chức tiệc
                </label>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="form-section">
            <h3>📸 Hình ảnh homestay</h3>
            <div className="info-box">
              💡 Tải lên ít nhất 5 hình ảnh chất lượng cao để thu hút khách hàng
            </div>
            
            <div 
              className="upload-area"
              onDragOver={handleDragOver}
              onDrop={handleDrop}
            >
              <div className="upload-icon">📤</div>
              <h4>Kéo thả hình ảnh vào đây</h4>
              <p>hoặc</p>
              <input
                type="file"
                id="imageUpload"
                multiple
                accept="image/jpeg,image/jpg,image/png,image/webp"
                onChange={handleImageUpload}
                style={{ display: 'none' }}
              />
              <button 
                className="btn btn-primary" 
                type="button"
                onClick={() => document.getElementById('imageUpload').click()}
              >
                📁 Chọn hình ảnh
              </button>
              <p className="upload-note">
                Hỗ trợ: JPG, PNG, WebP. Tối đa 10MB mỗi file.
              </p>
            </div>

            {homestayData.images.length > 0 && (
              <div className="images-preview">
                <h4>Hình ảnh đã chọn ({homestayData.images.length})</h4>
                <div className="images-grid">
                  {homestayData.images.map((image, index) => (
                    <div key={index} className="image-preview-item">
                      <img 
                        src={image.preview} 
                        alt={`Preview ${index + 1}`}
                        className="preview-image"
                      />
                      <div className="image-overlay">
                        <button
                          type="button"
                          className="remove-image-btn"
                          onClick={() => handleRemoveImage(index)}
                        >
                          ✕
                        </button>
                        {index === 0 && (
                          <span className="primary-badge">Ảnh chính</span>
                        )}
                      </div>
                      <p className="image-name">{image.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );

      case 7:
        return (
          <div className="form-section">
            <h3>👀 Xem lại thông tin homestay</h3>
            <div className="review-grid">
              <div className="review-card">
                <h4>🏠 Thông tin cơ bản</h4>
                <div className="review-item"><strong>Tên:</strong> {homestayData.name}</div>
                <div className="review-item"><strong>Danh mục:</strong> {homestayData.category}</div>
                <div className="review-item"><strong>Loại hình:</strong> {propertyTypes.find(t => t.value === homestayData.propertyType)?.label}</div>
                <div className="review-item"><strong>Sức chứa:</strong> {homestayData.capacity} người</div>
                <div className="review-item"><strong>Phòng ngủ:</strong> {homestayData.bedrooms}</div>
                <div className="review-item"><strong>Phòng tắm:</strong> {homestayData.bathrooms}</div>
              </div>
              
              <div className="review-card">
                <h4>💰 Giá cả</h4>
                <div className="review-item"><strong>Giá cơ bản:</strong> {parseInt(homestayData.basePrice || 0).toLocaleString()} VNĐ/đêm</div>
                <div className="review-item"><strong>Giá cuối tuần:</strong> {parseInt(homestayData.weekendPrice || 0).toLocaleString()} VNĐ/đêm</div>
                <div className="review-item"><strong>Phí dọn dẹp:</strong> {parseInt(homestayData.cleaningFee || 0).toLocaleString()} VNĐ</div>
              </div>
              
              <div className="review-card full-width">
                <h4>📍 Địa điểm</h4>
                <div className="review-item">{homestayData.address}, {homestayData.ward}, {homestayData.district}, {homestayData.city}</div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="create-homestay-container">
      <div className="header">
        <h1>Thêm Homestay mới</h1>
        <div className="header-actions">
          {submitError && (
            <div className="error-alert">
              {submitError}
              {submitError.includes('đăng nhập') && (
                <button 
                  className="btn btn-secondary" 
                  style={{ marginLeft: '10px', padding: '5px 10px', fontSize: '0.8rem' }}
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                >
                  Đăng nhập lại
                </button>
              )}
            </div>
          )}
          <button 
            className="btn btn-outline"
            onClick={() => handleSave('draft')}
            disabled={loading}
          >
            {loading ? 'Đang lưu...' : '💾 Lưu nháp'}
          </button>
          <button 
            className="btn btn-primary"
            onClick={() => handleSave('pending')}
            disabled={loading}
          >
            {loading ? 'Đang gửi...' : '📤 Gửi duyệt'}
          </button>
        </div>
      </div>

      <div className="form-container">
        <div className="stepper">
          {steps.map((label, index) => (
            <div key={label} className={`step ${index <= activeStep ? 'active' : ''} ${index === activeStep ? 'current' : ''}`}>
              <div className="step-number">{index + 1}</div>
              <div className="step-label">{label}</div>
            </div>
          ))}
        </div>
        
        <div className="form-content">
          <div className="step-content">
            <h2>{steps[activeStep]}</h2>
            {renderStepContent(activeStep)}
          </div>
          
          <div className="form-navigation">
            <button
              className="btn btn-secondary"
              onClick={handleBack}
              disabled={activeStep === 0}
            >
              ← Quay lại
            </button>
            
            <button
              className="btn btn-primary"
              onClick={activeStep === steps.length - 1 ? () => handleSave('pending') : handleNext}
              disabled={loading}
            >
              {loading ? 'Đang xử lý...' : (activeStep === steps.length - 1 ? '✅ Hoàn thành' : 'Tiếp tục →')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateHomestay;