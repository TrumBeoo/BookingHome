import React from 'react';
import { Chip } from '@mui/material';

const DiscountBadge = ({ discount, position = 'top-right' }) => {
  if (!discount) return null;

  const positionStyles = {
    'top-right': { position: 'absolute', top: 8, right: 8 },
    'top-left': { position: 'absolute', top: 8, left: 8 },
    'inline': { position: 'relative' }
  };

  return (
    <Chip
      label={`🔥 Giảm ${discount}%`}
      sx={{
        ...positionStyles[position],
        bgcolor: '#ff5722',
        color: 'white',
        fontWeight: 'bold',
        zIndex: 2
      }}
    />
  );
};

export default DiscountBadge;