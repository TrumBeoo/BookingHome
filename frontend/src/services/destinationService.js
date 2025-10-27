import api from '../utils/api';

const destinationService = {
  // Get all destinations with filters
  getDestinations: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.request(`/destinations/${queryString ? `?${queryString}` : ''}`);
      return response;
    } catch (error) {
      console.error('Error fetching destinations:', error);
      throw error;
    }
  },

  // Get featured destinations for homepage
  getFeaturedDestinations: async (limit = 6) => {
    try {
      const response = await api.request(`/destinations/featured?limit=${limit}`);
      return response;
    } catch (error) {
      console.error('Error fetching featured destinations:', error);
      throw error;
    }
  },

  // Get destination detail by slug
  getDestinationDetail: async (slug) => {
    try {
      const response = await api.request(`/destinations/${slug}`);
      return response;
    } catch (error) {
      console.error('Error fetching destination detail:', error);
      throw error;
    }
  },

  // Get homestays in a destination
  getDestinationHomestays: async (destinationId, params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const response = await api.request(`/destinations/${destinationId}/homestays${queryString ? `?${queryString}` : ''}`);
      return response;
    } catch (error) {
      console.error('Error fetching destination homestays:', error);
      throw error;
    }
  },

  // Get destination types
  getDestinationTypes: async () => {
    try {
      const response = await api.request('/destinations/types/list');
      return response;
    } catch (error) {
      console.error('Error fetching destination types:', error);
      throw error;
    }
  },

  // Get destination provinces
  getDestinationProvinces: async () => {
    try {
      const response = await api.request('/destinations/provinces/list');
      return response;
    } catch (error) {
      console.error('Error fetching destination provinces:', error);
      throw error;
    }
  },

  // Create destination review
  createDestinationReview: async (destinationId, reviewData) => {
    try {
      const response = await api.request(`/destinations/${destinationId}/reviews`, {
        method: 'POST',
        body: JSON.stringify(reviewData)
      });
      return response;
    } catch (error) {
      console.error('Error creating destination review:', error);
      throw error;
    }
  },

  // Toggle destination wishlist
  toggleDestinationWishlist: async (destinationId, userId) => {
    try {
      const response = await api.request(`/destinations/${destinationId}/wishlist`, {
        method: 'POST',
        body: JSON.stringify({ user_id: userId })
      });
      return response;
    } catch (error) {
      console.error('Error toggling destination wishlist:', error);
      throw error;
    }
  }
};

export default destinationService;