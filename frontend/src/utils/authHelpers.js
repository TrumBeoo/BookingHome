import { getToken, isTokenExpired } from './tokenUtils';

/**
 * Kiểm tra xem user có được authenticate không
 */
export const checkAuthStatus = () => {
  const token = getToken();
  return token && !isTokenExpired(token);
};

/**
 * Lấy thông tin user từ token (nếu có)
 */
export const getUserFromToken = () => {
  const token = getToken();
  
  if (!token || isTokenExpired(token)) {
    return null;
  }
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.user_id,
      email: payload.sub,
      role: payload.role,
      exp: payload.exp
    };
  } catch (error) {
    console.error('Error parsing token:', error);
    return null;
  }
};

/**
 * Kiểm tra role của user
 */
export const hasRole = (requiredRole) => {
  const user = getUserFromToken();
  return user && user.role === requiredRole;
};

/**
 * Kiểm tra xem user có phải admin không
 */
export const isAdmin = () => {
  const user = getUserFromToken();
  return user && ['admin', 'super_admin'].includes(user.role);
};

/**
 * Format error message từ API response
 */
export const formatAuthError = (error) => {
  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }
  
  if (error.message) {
    return error.message;
  }
  
  return 'Đã xảy ra lỗi. Vui lòng thử lại.';
};