import { getToken, removeToken, isTokenExpired } from '../utils/tokenUtils';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = getToken();
    
    console.log('API Request:', {
      method: options.method || 'GET',
      endpoint,
      url,
      token: token ? 'Present' : 'Missing',
      hasBody: !!options.body
    });
    
    // Chỉ kiểm tra token expiration nếu là JWT
    if (token && token.includes('.') && isTokenExpired(token)) {
      console.log('JWT token expired, redirecting to login');
      removeToken();
      window.location.href = '/login';
      throw new Error('Token đã hết hạn, vui lòng đăng nhập lại');
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
        console.log('API Error:', response.status, response.statusText);
        const errorData = await response.json().catch(() => ({}));
        
        // Nếu lỗi 401, có thể token hết hạn
        if (response.status === 401) {
          console.log('401 Unauthorized - token issue:', errorData);
          console.log('Current token:', token);
          // Tạm thời không xóa token để debug
          // removeToken();
          // window.location.href = '/login';
        }
        
        throw new Error(errorData.detail || errorData.message || `HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Auth methods
  async login(credentials) {
    const formData = new FormData();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);

    return this.request('/auth/login', {
      method: 'POST',
      headers: {},
      body: formData,
    });
  }

  async logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  // Dashboard stats
  async getDashboardStats() {
    return this.request('/dashboard/stats');
  }

  // Homestay methods
  async getHomestays(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/dashboard/homestays${queryString ? `?${queryString}` : ''}`);
  }

  async getHomestay(id) {
    return this.request(`/dashboard/homestays/${id}`);
  }

  async createHomestay(homestayData) {
    return this.request('/dashboard/homestays', {
      method: 'POST',
      body: JSON.stringify(homestayData),
    });
  }

  async updateHomestay(id, homestayData) {
    return this.request(`/dashboard/homestays/${id}`, {
      method: 'PUT',
      body: JSON.stringify(homestayData),
    });
  }

  async deleteHomestay(id) {
    return this.request(`/dashboard/homestays/${id}`, {
      method: 'DELETE',
    });
  }

  async updateHomestayStatus(id, status) {
    return this.request(`/dashboard/homestays/${id}/status?status=${status}`, {
      method: 'PATCH',
    });
  }

  // Categories
  async getCategories() {
    return this.request('/dashboard/categories');
  }

  // Users
  async getUsers(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/dashboard/users${queryString ? `?${queryString}` : ''}`);
  }

  // Bookings
  async getBookings(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/dashboard/bookings${queryString ? `?${queryString}` : ''}`);
  }

  // Payments
  async getPayments(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/dashboard/payments${queryString ? `?${queryString}` : ''}`);
  }

  // Reviews
  async getReviews(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/dashboard/reviews${queryString ? `?${queryString}` : ''}`);
  }

  // Revenue chart
  async getRevenueChart(period = 'month') {
    return this.request(`/dashboard/revenue-chart?period=${period}`);
  }

  // Image upload methods
  async uploadHomestayImages(homestayId, files) {
    const formData = new FormData();
    files.forEach(file => {
      formData.append('files', file);
    });

    const token = getToken();
    const url = `${this.baseURL}/dashboard/homestays/${homestayId}/upload-images`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  }



  // Amenities methods
  async getAmenities() {
    return this.request('/dashboard/amenities');
  }

  async createAmenity(amenityData) {
    return this.request('/dashboard/amenities', {
      method: 'POST',
      body: JSON.stringify(amenityData),
    });
  }

  async updateAmenity(id, amenityData) {
    return this.request(`/dashboard/amenities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(amenityData),
    });
  }

  async deleteAmenity(id) {
    return this.request(`/dashboard/amenities/${id}`, {
      method: 'DELETE',
    });
  }

  async getHomestayAmenities(homestayId) {
    return this.request(`/dashboard/homestays/${homestayId}/amenities`);
  }

  async addHomestayAmenity(homestayId, amenityId) {
    return this.request(`/dashboard/homestays/${homestayId}/amenities/${amenityId}`, {
      method: 'POST',
    });
  }

  async removeHomestayAmenity(homestayId, amenityId) {
    return this.request(`/dashboard/homestays/${homestayId}/amenities/${amenityId}`, {
      method: 'DELETE',
    });
  }

  // Categories methods
  async createCategory(categoryData) {
    return this.request('/dashboard/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    });
  }

  async updateCategory(id, categoryData) {
    return this.request(`/dashboard/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(categoryData),
    });
  }

  async deleteCategory(id) {
    return this.request(`/dashboard/categories/${id}`, {
      method: 'DELETE',
    });
  }

  // Images methods
  async getHomestayImages(homestayId) {
    return this.request(`/dashboard/homestays/${homestayId}/images`);
  }

  async deleteHomestayImage(imageId) {
    return this.request(`/dashboard/images/${imageId}`, {
      method: 'DELETE',
    });
  }

  async setPrimaryImage(homestayId, imageId) {
    return this.request(`/dashboard/homestays/${homestayId}/images/${imageId}/primary`, {
      method: 'PATCH',
    });
  }

  async updateHomestayImage(imageId, imageData) {
    return this.request(`/dashboard/images/${imageId}`, {
      method: 'PUT',
      body: JSON.stringify(imageData),
    });
  }

  // Calendar/Availability methods
  async getHomestayAvailability(homestayId) {
    return this.request(`/dashboard/homestays/${homestayId}/availability`);
  }

  async createAvailability(availabilityData) {
    return this.request('/dashboard/availability', {
      method: 'POST',
      body: JSON.stringify(availabilityData),
    });
  }

  async updateAvailability(id, availabilityData) {
    return this.request(`/dashboard/availability/${id}`, {
      method: 'PUT',
      body: JSON.stringify(availabilityData),
    });
  }

  async deleteAvailability(id) {
    return this.request(`/dashboard/availability/${id}`, {
      method: 'DELETE',
    });
  }

  async bulkUpdateAvailability(bulkData) {
    return this.request('/dashboard/availability/bulk', {
      method: 'POST',
      body: JSON.stringify(bulkData),
    });
  }
}

export default new ApiService();
export { roomCategoriesAPI } from './roomCategoriesAPI';