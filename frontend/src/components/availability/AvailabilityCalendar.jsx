import React, { useState, useEffect } from 'react';
import { Calendar, Badge, Card, Spin, Alert, Tooltip, Button, Select } from 'antd';
import { CalendarOutlined, CheckCircleOutlined, CloseCircleOutlined, UserOutlined } from '@ant-design/icons';
import moment from 'moment';
import 'moment/locale/vi';
import './AvailabilityCalendar.css';

moment.locale('vi');

const { Option } = Select;

const AvailabilityCalendar = ({ homestayId, roomId = null }) => {
  const [loading, setLoading] = useState(false);
  const [calendarData, setCalendarData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(moment());
  const [currentMonth, setCurrentMonth] = useState(moment());

  useEffect(() => {
    if (homestayId) {
      fetchCalendarData(currentMonth.year(), currentMonth.month() + 1);
    }
  }, [homestayId, roomId, currentMonth]);

  const fetchCalendarData = async (year, month) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        year: year.toString(),
        month: month.toString()
      });
      
      if (roomId) {
        params.append('room_id', roomId.toString());
      }

      const response = await fetch(`http://localhost:8000/api/availability/calendar/${homestayId}?${params}`);
      const data = await response.json();
      setCalendarData(data);
    } catch (error) {
      console.error('Error fetching calendar data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getDateData = (date) => {
    if (!calendarData || !calendarData.days) return null;
    
    const dateStr = date.format('YYYY-MM-DD');
    return calendarData.days.find(day => day.date === dateStr);
  };

  const dateCellRender = (date) => {
    const dateData = getDateData(date);
    if (!dateData) return null;

    const { status, price, booking_info } = dateData;
    
    let badgeStatus = 'default';
    let badgeText = '';
    let badgeColor = '';

    switch (status) {
      case 'available':
        badgeStatus = 'success';
        badgeText = 'Trống';
        badgeColor = '#52c41a';
        break;
      case 'booked':
        badgeStatus = 'error';
        badgeText = 'Đã đặt';
        badgeColor = '#ff4d4f';
        break;
      case 'blocked':
        badgeStatus = 'default';
        badgeText = 'Chặn';
        badgeColor = '#d9d9d9';
        break;
      case 'pending':
        badgeStatus = 'warning';
        badgeText = 'Chờ';
        badgeColor = '#faad14';
        break;
      case 'not_set':
        badgeStatus = 'default';
        badgeText = 'Chưa đặt';
        badgeColor = '#e0e0e0';
        break;
      default:
        return null;
    }

    const content = (
      <div className="calendar-cell-content">
        <Badge 
          status={badgeStatus} 
          text={badgeText}
          style={{ color: badgeColor }}
        />
        {price && (
          <div className="price-info">
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
              minimumFractionDigits: 0
            }).format(price)}
          </div>
        )}
        {booking_info && (
          <div className="booking-info">
            <UserOutlined /> {booking_info.guest_name}
          </div>
        )}
      </div>
    );

    if (booking_info) {
      return (
        <Tooltip 
          title={
            <div>
              <div><strong>Mã đặt:</strong> {booking_info.booking_code}</div>
              <div><strong>Khách:</strong> {booking_info.guest_name}</div>
              <div><strong>Số người:</strong> {booking_info.guests}</div>
            </div>
          }
        >
          {content}
        </Tooltip>
      );
    }

    return content;
  };

  const onPanelChange = (date) => {
    setCurrentMonth(date);
  };

  const onSelect = (date) => {
    setSelectedDate(date);
  };

  const getCalendarStats = () => {
    if (!calendarData) return { available: 0, booked: 0, total: 0 };
    
    return {
      available: calendarData.total_available || 0,
      booked: calendarData.total_booked || 0,
      total: calendarData.days ? calendarData.days.length : 0
    };
  };

  const stats = getCalendarStats();

  return (
    <Card 
      title={
        <div className="calendar-header">
          <CalendarOutlined />
          <span>Lịch trống/đã đặt</span>
          {roomId && <span className="room-indicator">Phòng #{roomId}</span>}
        </div>
      }
      className="availability-calendar-card"
    >
      {/* Statistics */}
      <div className="calendar-stats">
        <div className="stat-item available">
          <CheckCircleOutlined />
          <span>Trống: {stats.available} ngày</span>
        </div>
        <div className="stat-item booked">
          <CloseCircleOutlined />
          <span>Đã đặt: {stats.booked} ngày</span>
        </div>
      </div>

      {/* Calendar */}
      <Spin spinning={loading}>
        {calendarData ? (
          <Calendar
            dateCellRender={dateCellRender}
            onPanelChange={onPanelChange}
            onSelect={onSelect}
            value={selectedDate}
            className="custom-calendar"
          />
        ) : (
          <Alert
            message="Chưa có dữ liệu"
            description="Vui lòng chọn homestay để xem lịch trống"
            type="info"
            showIcon
          />
        )}
      </Spin>

      {/* Legend */}
      <div className="calendar-legend">
        <div className="legend-item">
          <Badge status="success" text="Phòng trống" />
        </div>
        <div className="legend-item">
          <Badge status="error" text="Đã được đặt" />
        </div>
        <div className="legend-item">
          <Badge status="default" text="Bị chặn" />
        </div>
        <div className="legend-item">
          <Badge status="warning" text="Chờ xác nhận" />
        </div>
        <div className="legend-item">
          <Badge status="default" text="Chưa thiết lập" style={{ color: '#e0e0e0' }} />
        </div>
      </div>
    </Card>
  );
};

export default AvailabilityCalendar;