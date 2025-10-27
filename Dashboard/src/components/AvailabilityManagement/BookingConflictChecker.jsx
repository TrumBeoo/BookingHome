import React, { useState, useEffect } from 'react';
import {
  Box,
  Alert,
  AlertTitle,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Chip
} from '@mui/material';
import {
  Warning,
  Error,
  CheckCircle,
  Block,
  Schedule
} from '@mui/icons-material';
import { format, parseISO, isWithinInterval } from 'date-fns';
import { vi } from 'date-fns/locale';

const BookingConflictChecker = ({ 
  newBooking, 
  existingBookings, 
  onConflictResolved, 
  onCancel 
}) => {
  const [conflicts, setConflicts] = useState([]);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (newBooking) {
      checkConflicts();
    }
  }, [newBooking, existingBookings]);

  const checkConflicts = () => {
    if (!newBooking || !newBooking.check_in || !newBooking.check_out) {
      setConflicts([]);
      return;
    }

    const newCheckIn = parseISO(newBooking.check_in);
    const newCheckOut = parseISO(newBooking.check_out);

    const foundConflicts = existingBookings.filter(booking => {
      // Chỉ kiểm tra booking cùng phòng và không bị hủy
      if (booking.room_id !== newBooking.room_id || booking.status === 'cancelled') {
        return false;
      }

      const existingCheckIn = parseISO(booking.check_in);
      const existingCheckOut = parseISO(booking.check_out);

      // Kiểm tra trùng lịch
      return (
        isWithinInterval(newCheckIn, { start: existingCheckIn, end: existingCheckOut }) ||
        isWithinInterval(newCheckOut, { start: existingCheckIn, end: existingCheckOut }) ||
        isWithinInterval(existingCheckIn, { start: newCheckIn, end: newCheckOut }) ||
        isWithinInterval(existingCheckOut, { start: newCheckIn, end: newCheckOut })
      );
    });

    setConflicts(foundConflicts);
  };

  const getConflictSeverity = (conflict) => {
    if (conflict.status === 'confirmed') {
      return { level: 'error', icon: <Error />, label: 'Xung đột nghiêm trọng' };
    } else if (conflict.status === 'pending') {
      return { level: 'warning', icon: <Warning />, label: 'Xung đột tiềm ẩn' };
    }
    return { level: 'info', icon: <Schedule />, label: 'Cần xem xét' };
  };

  const getStatusChip = (status) => {
    const statusMap = {
      confirmed: { color: 'error', label: 'Đã xác nhận' },
      pending: { color: 'warning', label: 'Chờ xác nhận' },
      cancelled: { color: 'default', label: 'Đã hủy' }
    };
    
    const config = statusMap[status] || { color: 'default', label: status };
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const handleForceBook = () => {
    // Cho phép đặt phòng bất chấp xung đột (với cảnh báo)
    if (onConflictResolved) {
      onConflictResolved('force', conflicts);
    }
  };

  const handleAutoResolve = () => {
    // Tự động giải quyết bằng cách hủy các booking pending
    const pendingConflicts = conflicts.filter(c => c.status === 'pending');
    if (onConflictResolved) {
      onConflictResolved('auto', pendingConflicts);
    }
  };

  if (!newBooking || conflicts.length === 0) {
    return (
      <Alert severity="success" sx={{ mb: 2 }}>
        <AlertTitle>Không có xung đột</AlertTitle>
        Lịch đặt phòng này không xung đột với bất kỳ đặt phòng nào khác.
      </Alert>
    );
  }

  const hasConfirmedConflicts = conflicts.some(c => c.status === 'confirmed');
  const hasPendingConflicts = conflicts.some(c => c.status === 'pending');

  return (
    <Box>
      <Alert 
        severity={hasConfirmedConflicts ? 'error' : 'warning'} 
        sx={{ mb: 2 }}
        action={
          <Button 
            color="inherit" 
            size="small" 
            onClick={() => setShowDetails(true)}
          >
            Chi tiết
          </Button>
        }
      >
        <AlertTitle>
          {hasConfirmedConflicts ? 'Xung đột nghiêm trọng' : 'Phát hiện xung đột'}
        </AlertTitle>
        Tìm thấy {conflicts.length} xung đột lịch đặt phòng. 
        {hasConfirmedConflicts && ' Có booking đã được xác nhận trong khoảng thời gian này.'}
      </Alert>

      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        {!hasConfirmedConflicts && hasPendingConflicts && (
          <Button
            variant="outlined"
            color="warning"
            onClick={handleAutoResolve}
          >
            Tự động giải quyết
          </Button>
        )}
        
        <Button
          variant="outlined"
          color="error"
          onClick={handleForceBook}
        >
          Đặt phòng bất chấp xung đột
        </Button>
        
        <Button
          variant="contained"
          onClick={onCancel}
        >
          Hủy đặt phòng
        </Button>
      </Box>

      {/* Conflict Details Dialog */}
      <Dialog
        open={showDetails}
        onClose={() => setShowDetails(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          Chi tiết xung đột lịch đặt phòng
        </DialogTitle>
        <DialogContent>
          <Typography variant="h6" gutterBottom>
            Đặt phòng mới:
          </Typography>
          <Box sx={{ mb: 3, p: 2, bgcolor: 'grey.100', borderRadius: 1 }}>
            <Typography>
              Phòng: {newBooking.room_name}
            </Typography>
            <Typography>
              Từ: {format(parseISO(newBooking.check_in), 'dd/MM/yyyy', { locale: vi })}
            </Typography>
            <Typography>
              Đến: {format(parseISO(newBooking.check_out), 'dd/MM/yyyy', { locale: vi })}
            </Typography>
          </Box>

          <Typography variant="h6" gutterBottom>
            Các đặt phòng xung đột:
          </Typography>
          <List>
            {conflicts.map((conflict, index) => {
              const severity = getConflictSeverity(conflict);
              return (
                <ListItem key={index} sx={{ border: 1, borderColor: 'grey.300', mb: 1, borderRadius: 1 }}>
                  <ListItemIcon>
                    {severity.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle1">
                          Booking #{conflict.id}
                        </Typography>
                        {getStatusChip(conflict.status)}
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2">
                          Khách: {conflict.customer_name}
                        </Typography>
                        <Typography variant="body2">
                          Từ: {format(parseISO(conflict.check_in), 'dd/MM/yyyy', { locale: vi })} - 
                          Đến: {format(parseISO(conflict.check_out), 'dd/MM/yyyy', { locale: vi })}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {severity.label}
                        </Typography>
                      </Box>
                    }
                  />
                </ListItem>
              );
            })}
          </List>

          <Alert severity="info" sx={{ mt: 2 }}>
            <AlertTitle>Gợi ý giải quyết:</AlertTitle>
            <ul>
              <li>Tự động giải quyết: Hủy các booking "Chờ xác nhận" để tạo chỗ cho booking mới</li>
              <li>Đặt phòng bất chấp: Tạo booking mới và để admin xử lý xung đột sau</li>
              <li>Hủy đặt phòng: Không tạo booking mới và chọn thời gian khác</li>
            </ul>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDetails(false)}>
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default BookingConflictChecker;