export const validationRules = {
  email: (value) => {
    if (!value) return 'Email là bắt buộc';
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return 'Email không hợp lệ';
    return '';
  },

  password: (value) => {
    if (!value) return 'Mật khẩu là bắt buộc';
    if (value.length < 8) return 'Mật khẩu phải có ít nhất 8 ký tự';
    return '';
  },

  confirmPassword: (value, allValues) => {
    if (!value) return 'Xác nhận mật khẩu là bắt buộc';
    if (value !== allValues.password) return 'Mật khẩu xác nhận không khớp';
    return '';
  },

  fullName: (value) => {
    if (!value || !value.trim()) return 'Họ tên là bắt buộc';
    if (value.trim().length < 2) return 'Họ tên phải có ít nhất 2 ký tự';
    return '';
  },

  name: (value) => {
    if (!value || !value.trim()) return 'Họ tên là bắt buộc';
    if (value.trim().length < 2) return 'Họ tên phải có ít nhất 2 ký tự';
    return '';
  },

  phone: (value) => {
    if (!value) return '';
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(value)) return 'Số điện thoại không hợp lệ';
    return '';
  }
};