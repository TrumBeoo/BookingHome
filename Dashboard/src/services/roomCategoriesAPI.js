const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token') || localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    ...(token && { 'Authorization': `Bearer ${token}` })
  };
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(errorData.detail || `HTTP ${response.status}`);
  }
  return response.json();
};

export const roomCategoriesAPI = {
  // Lấy danh sách room categories
  async getCategories(params = {}) {
    try {
      // Clean up params - remove empty values
      const cleanParams = Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== null && value !== undefined && value !== '') {
          acc[key] = value;
        }
        return acc;
      }, {});
      
      const queryString = new URLSearchParams(cleanParams).toString();
      const url = `${API_BASE_URL}/api/room-categories/${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching categories:', error);
      throw error;
    }
  },

  // Lấy danh sách tags
  async getTags() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/room-categories/tags`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching tags:', error);
      throw error;
    }
  },

  // Tạo room category mới
  async createCategory(data) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/room-categories`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error creating category:', error);
      throw error;
    }
  },

  // Cập nhật room category
  async updateCategory(id, data) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/room-categories/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error updating category:', error);
      throw error;
    }
  },

  // Xóa room category
  async deleteCategory(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/room-categories/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error deleting category:', error);
      throw error;
    }
  },

  // Lấy thống kê
  async getStatistics() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/room-categories/statistics`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error fetching statistics:', error);
      // Return empty stats if not authenticated or error
      return {
        total_categories: 0,
        average_price: 0,
        most_popular: 'N/A'
      };
    }
  },

  // Tạo tag mới
  async createTag(data) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/room-categories/tags`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error creating tag:', error);
      throw error;
    }
  },

  // Cập nhật tag
  async updateTag(id, data) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/room-categories/tags/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(data)
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error updating tag:', error);
      throw error;
    }
  },

  // Xóa tag
  async deleteTag(id) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/room-categories/tags/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error deleting tag:', error);
      throw error;
    }
  },

  // Upload hình ảnh cho category
  async uploadCategoryImages(categoryId, files) {
    try {
      const formData = new FormData();
      files.forEach(file => {
        formData.append('images', file);
      });

      const token = localStorage.getItem('access_token') || localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}/api/admin/room-categories/${categoryId}/images`, {
        method: 'POST',
        headers: {
          ...(token && { 'Authorization': `Bearer ${token}` })
          // Don't set Content-Type for FormData, let browser set it with boundary
        },
        body: formData
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error uploading images:', error);
      throw error;
    }
  },

  // Xóa hình ảnh
  async deleteCategoryImage(categoryId, imageIndex) {
    try {
      const response = await fetch(`${API_BASE_URL}/api/admin/room-categories/${categoryId}/images/${imageIndex}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      return await handleResponse(response);
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  }
};