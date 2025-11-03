import axios from 'axios';

const API_URL = 'http://localhost:8000/api/availability';

// Create axios instance with base URL and headers
const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true
});

const availabilityService = {
  // Get calendar view for a specific homestay
  async getCalendar(homestayId, year, month, roomId = null) {
    const response = await api.get(`/api/availability/calendar/${homestayId}`, {
      params: { year, month, room_id: roomId }
    });
    return response.data;
  },

  // Quick check availability for displaying in calendar UI
  async getQuickAvailability(homestayId, year, month) {
    try {
      console.log('Calling API with:', { homestayId, year, month });
      const response = await api.get(`/api/availability/quick/${homestayId}`, {
        params: { year, month }
      });
      console.log('Raw API response:', response);
      return response.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // Check availability for specific dates
  async checkAvailability(homestayId, checkIn, checkOut, guests, roomCategoryId = null) {
    const response = await api.get(`/api/availability/check/${homestayId}`, {
      params: {
        check_in: checkIn,
        check_out: checkOut,
        guests,
        room_category_id: roomCategoryId
      }
    });
    return response.data;
  },

  // Get blocked dates
  async getBlockedDates(homestayId, startDate, endDate) {
    const response = await api.get(`/api/availability/blocked-dates/${homestayId}`, {
      params: { start_date: startDate, end_date: endDate }
    });
    return response.data;
  }
};

export default availabilityService;