import apiService from './api';

class UserService {
  // Get all users with filtering and pagination
  async getUsers(params = {}) {
    try {
      const response = await apiService.getUsers(params);
      return response;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  // Get customers only
  async getCustomers(params = {}) {
    try {
      const response = await apiService.getUsers({ 
        ...params, 
        role: 'customer' 
      });
      return response;
    } catch (error) {
      console.error('Error fetching customers:', error);
      throw error;
    }
  }

  // Get hosts only
  async getHosts(params = {}) {
    try {
      const response = await apiService.getUsers({ 
        ...params, 
        role: 'host' 
      });
      return response;
    } catch (error) {
      console.error('Error fetching hosts:', error);
      throw error;
    }
  }

  // Get user by ID
  async getUserById(userId) {
    try {
      const response = await apiService.request(`/dashboard/users/${userId}`);
      return response;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  // Update user
  async updateUser(userId, userData) {
    try {
      const response = await apiService.request(`/dashboard/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify(userData),
      });
      return response;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  // Block/Unblock user
  async updateUserStatus(userId, status) {
    try {
      const response = await apiService.request(`/dashboard/users/${userId}/status`, {
        method: 'PATCH',
        body: JSON.stringify({ status }),
      });
      return response;
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  }

  // Delete user
  async deleteUser(userId) {
    try {
      const response = await apiService.request(`/dashboard/users/${userId}`, {
        method: 'DELETE',
      });
      return response;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  // Get user statistics
  async getUserStats() {
    try {
      const response = await apiService.request('/dashboard/users/stats');
      return response;
    } catch (error) {
      console.error('Error fetching user stats:', error);
      throw error;
    }
  }

  // Send email to user
  async sendEmailToUser(userId, emailData) {
    try {
      const response = await apiService.request(`/dashboard/users/${userId}/send-email`, {
        method: 'POST',
        body: JSON.stringify(emailData),
      });
      return response;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  }

  // Send bulk email
  async sendBulkEmail(userIds, emailData) {
    try {
      const response = await apiService.request('/dashboard/users/bulk-email', {
        method: 'POST',
        body: JSON.stringify({
          user_ids: userIds,
          ...emailData,
        }),
      });
      return response;
    } catch (error) {
      console.error('Error sending bulk email:', error);
      throw error;
    }
  }

  // Get user bookings
  async getUserBookings(userId, params = {}) {
    try {
      const response = await apiService.request(`/dashboard/users/${userId}/bookings`, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      console.error('Error fetching user bookings:', error);
      throw error;
    }
  }

  // Get host properties
  async getHostProperties(userId, params = {}) {
    try {
      const response = await apiService.request(`/dashboard/users/${userId}/properties`, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      console.error('Error fetching host properties:', error);
      throw error;
    }
  }

  // Update user permissions
  async updateUserPermissions(userId, permissions) {
    try {
      const response = await apiService.request(`/dashboard/users/${userId}/permissions`, {
        method: 'PUT',
        body: JSON.stringify({ permissions }),
      });
      return response;
    } catch (error) {
      console.error('Error updating user permissions:', error);
      throw error;
    }
  }

  // Get blocked users
  async getBlockedUsers(params = {}) {
    try {
      const response = await apiService.getUsers({ 
        ...params, 
        status: 'blocked' 
      });
      return response;
    } catch (error) {
      console.error('Error fetching blocked users:', error);
      throw error;
    }
  }

  // Create new user (for admin)
  async createUser(userData) {
    try {
      const response = await apiService.request('/dashboard/users', {
        method: 'POST',
        body: JSON.stringify(userData),
      });
      return response;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  // Export users data
  async exportUsers(params = {}) {
    try {
      const response = await apiService.request('/dashboard/users/export', {
        method: 'GET',
        ...params,
      });
      return response;
    } catch (error) {
      console.error('Error exporting users:', error);
      throw error;
    }
  }

  // Get user activity log
  async getUserActivityLog(userId, params = {}) {
    try {
      const response = await apiService.request(`/dashboard/users/${userId}/activity`, {
        method: 'GET',
      });
      return response;
    } catch (error) {
      console.error('Error fetching user activity log:', error);
      throw error;
    }
  }

  // Block user with reason
  async blockUser(userId, reason) {
    try {
      const response = await apiService.request(`/dashboard/users/${userId}/block`, {
        method: 'POST',
        body: JSON.stringify({ reason }),
      });
      return response;
    } catch (error) {
      console.error('Error blocking user:', error);
      throw error;
    }
  }

  // Unblock user
  async unblockUser(userId) {
    try {
      const response = await apiService.request(`/dashboard/users/${userId}/unblock`, {
        method: 'POST',
      });
      return response;
    } catch (error) {
      console.error('Error unblocking user:', error);
      throw error;
    }
  }
}

export default new UserService();