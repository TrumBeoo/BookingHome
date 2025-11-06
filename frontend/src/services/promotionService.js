import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const promotionService = {
  async validateCoupon(couponData) {
    try {
      const response = await axios.post(`${API_URL}/api/promotions/validate`, couponData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Mã khuyến mãi không hợp lệ');
    }
  },

  async getActivePromotions() {
    try {
      const response = await axios.get(`${API_URL}/api/promotions/active`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Không thể tải danh sách khuyến mãi');
    }
  },

  formatPrice(price) {
    return `${price.toLocaleString('vi-VN')}đ`;
  }
};

export default promotionService;
