import React, { useState, useEffect } from 'react';
import './DatePickerWithAvailability.css';

const DatePickerWithAvailability = ({ 
  homestayId, 
  checkin, 
  checkout, 
  onCheckinChange, 
  onCheckoutChange 
}) => {
  const [blockedDates, setBlockedDates] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (homestayId) {
      fetchBlockedDates();
    }
  }, [homestayId]);

  const fetchBlockedDates = async () => {
    setLoading(true);
    try {
      const today = new Date();
      const threeMonthsLater = new Date();
      threeMonthsLater.setMonth(today.getMonth() + 3);

      const response = await fetch(
        `http://localhost:8000/api/availability/blocked-dates/${homestayId}?` +
        `start_date=${today.toISOString().split('T')[0]}&` +
        `end_date=${threeMonthsLater.toISOString().split('T')[0]}`
      );
      const data = await response.json();
      
      if (data.blocked_dates) {
        const dates = data.blocked_dates.map(item => item.date);
        setBlockedDates(dates);
      }
    } catch (error) {
      console.error('Error fetching blocked dates:', error);
    } finally {
      setLoading(false);
    }
  };

  const isDateBlocked = (dateString) => {
    return blockedDates.includes(dateString);
  };

  const getMinCheckoutDate = () => {
    if (!checkin) return new Date().toISOString().split('T')[0];
    
    const checkinDate = new Date(checkin);
    checkinDate.setDate(checkinDate.getDate() + 1);
    return checkinDate.toISOString().split('T')[0];
  };

  const handleCheckinChange = (e) => {
    const selectedDate = e.target.value;
    
    if (isDateBlocked(selectedDate)) {
      alert('Ngày này đã bị chặn hoặc đã được đặt. Vui lòng chọn ngày khác.');
      return;
    }
    
    onCheckinChange(selectedDate);
    
    // Reset checkout nếu nó nhỏ hơn hoặc bằng checkin mới
    if (checkout && new Date(checkout) <= new Date(selectedDate)) {
      onCheckoutChange('');
    }
  };

  const handleCheckoutChange = (e) => {
    const selectedDate = e.target.value;
    
    // Kiểm tra xem có ngày nào bị chặn giữa checkin và checkout không
    if (checkin) {
      const start = new Date(checkin);
      const end = new Date(selectedDate);
      let current = new Date(start);
      
      while (current < end) {
        const dateStr = current.toISOString().split('T')[0];
        if (isDateBlocked(dateStr)) {
          alert(`Ngày ${new Date(dateStr).toLocaleDateString('vi-VN')} trong khoảng thời gian bạn chọn đã bị chặn hoặc đã được đặt. Vui lòng chọn khoảng thời gian khác.`);
          return;
        }
        current.setDate(current.getDate() + 1);
      }
    }
    
    onCheckoutChange(selectedDate);
  };

  return (
    <div className="date-picker-with-availability">
      <div className="date-input-group">
        <div className="date-input-wrapper">
          <label>Ngày nhận phòng</label>
          <input
            type="date"
            value={checkin}
            onChange={handleCheckinChange}
            min={new Date().toISOString().split('T')[0]}
            className="date-input"
          />
        </div>
        
        <div className="date-input-wrapper">
          <label>Ngày trả phòng</label>
          <input
            type="date"
            value={checkout}
            onChange={handleCheckoutChange}
            min={getMinCheckoutDate()}
            disabled={!checkin}
            className="date-input"
          />
        </div>
      </div>
      
      {loading && (
        <div className="availability-info">
          <span className="info-icon">⏳</span>
          <span>Đang kiểm tra lịch trống...</span>
        </div>
      )}
      
      {!loading && blockedDates.length > 0 && (
        <div className="availability-info">
          <span className="info-icon">ℹ️</span>
          <span>Một số ngày có thể không khả dụng do đã được đặt hoặc bị chặn</span>
        </div>
      )}
    </div>
  );
};

export default DatePickerWithAvailability;
