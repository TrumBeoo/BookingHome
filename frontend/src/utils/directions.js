export const openDirections = async (homestayId) => {
  try {
    const response = await fetch(`http://localhost:8000/api/homestays/${homestayId}/directions`);
    const data = await response.json();
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const url = `https://www.google.com/maps/dir/?api=1&origin=${latitude},${longitude}&destination=${data.latitude},${data.longitude}`;
          window.open(url, '_blank');
        },
        () => {
          // Nếu không lấy được vị trí, mở Google Maps không có origin
          window.open(data.google_maps_url, '_blank');
        }
      );
    } else {
      window.open(data.google_maps_url, '_blank');
    }
  } catch (error) {
    console.error('Lỗi khi lấy chỉ đường:', error);
    alert('Không thể lấy thông tin chỉ đường');
  }
};
