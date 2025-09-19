// Authentication related constants
export const AUTH_ROUTES = {
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  REFRESH: '/auth/refresh',
  ME: '/auth/me',
  LOGOUT: '/auth/logout'
};

export const AUTH_ERRORS = {
  INVALID_CREDENTIALS: 'Email hoặc mật khẩu không chính xác',
  EMAIL_EXISTS: 'Email đã được đăng ký',
  NETWORK_ERROR: 'Lỗi kết nối. Vui lòng thử lại.',
  TOKEN_EXPIRED: 'Phiên đăng nhập đã hết hạn',
  REGISTRATION_FAILED: 'Đăng ký thất bại. Vui lòng thử lại.',
  LOGIN_FAILED: 'Đăng nhập thất bại. Vui lòng thử lại.'
};

export const VALIDATION_MESSAGES = {
  EMAIL_REQUIRED: 'Email là bắt buộc',
  EMAIL_INVALID: 'Email không hợp lệ',
  PASSWORD_REQUIRED: 'Mật khẩu là bắt buộc',
  PASSWORD_MIN_LENGTH: 'Mật khẩu phải có ít nhất 8 ký tự',
  PASSWORD_MUST_CONTAIN_LETTER: 'Mật khẩu phải chứa ít nhất một chữ cái',
  PASSWORD_MUST_CONTAIN_NUMBER: 'Mật khẩu phải chứa ít nhất một số',
  CONFIRM_PASSWORD_REQUIRED: 'Xác nhận mật khẩu là bắt buộc',
  PASSWORDS_NOT_MATCH: 'Mật khẩu xác nhận không khớp',
  NAME_REQUIRED: 'Họ tên là bắt buộc',
  NAME_MIN_LENGTH: 'Họ tên phải có ít nhất 2 ký tự',
  PHONE_REQUIRED: 'Số điện thoại là bắt buộc',
  PHONE_INVALID: 'Số điện thoại không hợp lệ (VD: 0123456789)'
};

export const TOKEN_STORAGE_KEY = 'access_token';
export const REFRESH_TOKEN_STORAGE_KEY = 'refresh_token';

// Navigation routes
export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/signup',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile'
};