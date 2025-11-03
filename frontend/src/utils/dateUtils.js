// frontend/src/utils/dateUtils.js
export const dateUtils = {
  // Format date to YYYY-MM-DD without timezone issues
  formatDateForAPI: (date) => {
    if (!date) return null;
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  // Parse YYYY-MM-DD string to Date object in local timezone
  parseAPIDate: (dateString) => {
    if (!dateString) return null;
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  },

  // Get date range between two dates
  getDateRange: (startDate, endDate) => {
    const dates = [];
    const current = new Date(startDate);
    const end = new Date(endDate);
    
    while (current <= end) {
      dates.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return dates;
  },

  // Check if date is weekend
  isWeekend: (date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  },

  // Check if date is holiday (Vietnam)
  isHoliday: (date, holidays = []) => {
    const dateStr = dateUtils.formatDateForAPI(date);
    return holidays.some(h => h.date === dateStr);
  }
};