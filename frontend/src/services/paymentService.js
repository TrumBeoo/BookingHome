import api from '../utils/api';

export const paymentService = {
  // Tạo thanh toán MoMo
  createMoMoPayment: async (bookingId) => {
    try {
      const response = await api.post('/payments/momo/create', {
        booking_id: bookingId
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Lỗi tạo thanh toán MoMo');
    }
  },

  // Kiểm tra trạng thái thanh toán MoMo
  checkMoMoPaymentStatus: async (paymentId) => {
    try {
      const response = await api.get(`/payments/momo/status/${paymentId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Lỗi kiểm tra trạng thái thanh toán');
    }
  },

  // Lấy danh sách phương thức thanh toán
  getPaymentMethods: async () => {
    try {
      const response = await api.get('/payments/methods');
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Lỗi lấy phương thức thanh toán');
    }
  }
};