const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class HomestayService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || 'API request failed');
    }

    return await response.json();
  }

  // Lấy danh sách homestay cho trang chính
  async getHomestays(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/homestays${queryString ? `?${queryString}` : ''}`);
  }

  // Lấy homestay nổi bật cho trang chính
  async getFeaturedHomestays(limit = 6) {
    return this.request(`/homestays/featured/list?limit=${limit}`);
  }

  // Lấy chi tiết homestay
  async getHomestayDetail(id) {
    return this.request(`/homestays/${id}`);
  }

  // Lấy danh sách categories
  async getCategories() {
    return this.request('/homestays/categories/list');
  }
}

export const homestayService = new HomestayService();