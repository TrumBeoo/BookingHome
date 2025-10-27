const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export const roomCategoriesAPI = {
  // Lấy danh sách room categories với filter
  async getCategories(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = `${API_BASE_URL}/api/room-categories/${queryString ? `?${queryString}` : ''}`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch room categories');
    }
    return response.json();
  },

  // Lấy chi tiết room category
  async getCategoryDetail(id, homestayId = null) {
    const params = homestayId ? `?homestay_id=${homestayId}` : '';
    const response = await fetch(`${API_BASE_URL}/api/room-categories/${id}${params}`);
    if (!response.ok) {
      throw new Error('Failed to fetch category detail');
    }
    return response.json();
  },

  // Tìm kiếm room categories
  async searchCategories(query, limit = 10) {
    const response = await fetch(
      `${API_BASE_URL}/api/room-categories/search?q=${encodeURIComponent(query)}&limit=${limit}`
    );
    if (!response.ok) {
      throw new Error('Failed to search categories');
    }
    return response.json();
  },

  // Lấy gợi ý room categories
  async getSuggestions(params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const response = await fetch(
      `${API_BASE_URL}/api/room-categories/suggestions${queryString ? `?${queryString}` : ''}`
    );
    if (!response.ok) {
      throw new Error('Failed to get suggestions');
    }
    return response.json();
  },

  // Lấy filter options
  async getFilterOptions() {
    const response = await fetch(`${API_BASE_URL}/api/room-categories/filters`);
    if (!response.ok) {
      throw new Error('Failed to fetch filter options');
    }
    return response.json();
  },

  // Lấy danh sách tags
  async getTags() {
    const response = await fetch(`${API_BASE_URL}/api/room-categories/tags`);
    if (!response.ok) {
      throw new Error('Failed to fetch tags');
    }
    return response.json();
  },

  // Kiểm tra availability
  async checkAvailability(categoryId, homestayId, startDate, endDate) {
    const params = new URLSearchParams({
      homestay_id: homestayId,
      start_date: startDate,
      end_date: endDate
    });
    
    const response = await fetch(
      `${API_BASE_URL}/api/room-categories/${categoryId}/availability?${params}`
    );
    if (!response.ok) {
      throw new Error('Failed to check availability');
    }
    return response.json();
  },

  // Admin APIs
  async createCategory(data) {
    const response = await fetch(`${API_BASE_URL}/api/admin/room-categories`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error('Failed to create category');
    }
    return response.json();
  },

  async updateCategory(id, data) {
    const response = await fetch(`${API_BASE_URL}/api/admin/room-categories/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      throw new Error('Failed to update category');
    }
    return response.json();
  },

  async deleteCategory(id) {
    const response = await fetch(`${API_BASE_URL}/api/admin/room-categories/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (!response.ok) {
      throw new Error('Failed to delete category');
    }
    return response.json();
  }
};