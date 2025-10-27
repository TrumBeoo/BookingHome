/**
 * Utility functions for handling API errors and responses
 */

export const handleApiError = (error, defaultMessage = 'Có lỗi xảy ra') => {
  console.error('API Error:', error);
  
  if (error.response) {
    // Server responded with error status
    const status = error.response.status;
    const message = error.response.data?.message || error.response.data?.error;
    
    switch (status) {
      case 400:
        return message || 'Dữ liệu không hợp lệ';
      case 401:
        return 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.';
      case 403:
        return 'Bạn không có quyền thực hiện hành động này';
      case 404:
        return 'Không tìm thấy dữ liệu';
      case 500:
        return 'Lỗi server. Vui lòng thử lại sau.';
      default:
        return message || defaultMessage;
    }
  } else if (error.request) {
    // Network error
    return 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.';
  } else {
    // Other error
    return error.message || defaultMessage;
  }
};

export const handleApiResponse = (response, dataKey = null) => {
  if (!response) {
    throw new Error('Không nhận được phản hồi từ server');
  }
  
  // Handle different response formats
  if (dataKey) {
    return response[dataKey] || response.data?.[dataKey] || response;
  }
  
  return response.data || response;
};

export const validateRequired = (data, requiredFields) => {
  const errors = {};
  
  requiredFields.forEach(field => {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      errors[field] = `${field} là bắt buộc`;
    }
  });
  
  return errors;
};

export const formatPrice = (price) => {
  if (!price || isNaN(price)) return '0';
  return new Intl.NumberFormat('vi-VN').format(price);
};

export const formatDate = (date) => {
  if (!date) return '';
  return new Date(date).toLocaleDateString('vi-VN');
};

export const getStatusColor = (status) => {
  switch (status) {
    case 'active':
      return 'success';
    case 'pending':
      return 'warning';
    case 'inactive':
    case 'blocked':
      return 'error';
    case 'draft':
      return 'info';
    default:
      return 'default';
  }
};

export const getStatusText = (status) => {
  switch (status) {
    case 'active':
      return 'Hoạt động';
    case 'pending':
      return 'Chờ duyệt';
    case 'inactive':
      return 'Không hoạt động';
    case 'blocked':
      return 'Bị chặn';
    case 'draft':
      return 'Bản nháp';
    default:
      return status || 'Không xác định';
  }
};