// Dashboard/src/utils/dateUtils.js
export const dateUtils = {
  formatDateForAPI: (date) => {
    if (!date) return null;
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  },

  parseAPIDate: (dateString) => {
    if (!dateString) return null;
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day);
  },

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

  isWeekend: (date) => {
    const day = date.getDay();
    return day === 0 || day === 6;
  },

  isHoliday: (date, holidays = []) => {
    const dateStr = dateUtils.formatDateForAPI(date);
    return holidays.some(h => h.date === dateStr);
  }
};
