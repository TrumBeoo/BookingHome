import { getToken, removeToken, isTokenExpired } from './tokenUtils';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = getToken();
    
    if (token && isTokenExpired(token)) {
      removeToken();
      const authPages = ['/login', '/register'];
      if (!authPages.includes(window.location.pathname)) {
        sessionStorage.setItem('redirectPath', window.location.pathname);
        window.location.href = '/login';
      }
      throw new Error('Token đã hết hạn');
    }
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        if (response.status === 401) {
          removeToken();
          const authPages = ['/login', '/register'];
          if (!authPages.includes(window.location.pathname)) {
            sessionStorage.setItem('redirectPath', window.location.pathname);
            window.location.href = '/login';
          }
        }
        
        throw new Error(errorData.detail || errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      if (!error.message.includes('HTTP error')) {
        error.message = 'Không thể kết nối đến máy chủ';
      }
      throw error;
    }
  }

  // Homestay methods
  async getHomestays(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/homestays/${queryString ? `?${queryString}` : ''}`);
  }

  async getFeaturedHomestays(limit = 6) {
    return this.request(`/homestays/featured/list?limit=${limit}`);
  }

  async getHomestay(id) {
    return this.request(`/homestays/${id}`);
  }

  // Booking methods
  async createBooking(bookingData) {
    return this.request('/bookings', {
      method: 'POST',
      body: JSON.stringify(bookingData),
    });
  }

  async getUserBookings() {
    return this.request('/bookings/user');
  }

  // Payment methods
  async createMoMoPayment(bookingId) {
    return this.request('/payments/momo/create', {
      method: 'POST',
      body: JSON.stringify({ booking_id: bookingId }),
    });
  }

  async checkMoMoPaymentStatus(paymentId) {
    return this.request(`/payments/momo/status/${paymentId}`);
  }

  async getPaymentMethods() {
    return this.request('/payments/methods');
  }

  // Location methods
  async getLocations() {
    return this.request('/locations');
  }
}

export default new ApiService();
export { API_BASE_URL };