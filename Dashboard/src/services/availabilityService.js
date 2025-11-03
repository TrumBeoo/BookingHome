import axios from 'axios';

const API_URL = '/api/availability';

export const availabilityService = {
  // Get detailed calendar view for a specific homestay (admin view)
  async getCalendar(homestayId, year, month, roomId = null) {
    const response = await axios.get(`${API_URL}/calendar/${homestayId}`, {
      params: { year, month, room_id: roomId }
    });
    return response.data;
  },

  // Quick check availability for displaying in calendar UI
  async getQuickAvailability(homestayId, year, month) {
    const response = await axios.get(`${API_URL}/quick/${homestayId}`, {
      params: { year, month }
    });
    return response.data;
  },

  // Block specific dates for rooms
  async blockDates(homestayId, dates, roomIds = null) {
    const response = await axios.post(`${API_URL}/block-dates/${homestayId}`, {
      dates,
      room_ids: roomIds
    });
    return response.data;
  },

  // Unblock specific dates for rooms
  async unblockDates(homestayId, dates, roomIds = null) {
    const response = await axios.post(`${API_URL}/unblock-dates/${homestayId}`, {
      dates,
      room_ids: roomIds
    });
    return response.data;
  },

  // Get blocked dates for a date range
  async getBlockedDates(homestayId, startDate, endDate) {
    const response = await axios.get(`${API_URL}/blocked-dates/${homestayId}`, {
      params: { start_date: startDate, end_date: endDate }
    });
    return response.data;
  }
};

export default availabilityService;