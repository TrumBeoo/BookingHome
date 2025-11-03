const API_BASE_URL = 'http://localhost:8000';

export const bannerService = {
  // Lấy banner theo vị trí
  getBannersByPosition: async (position) => {
    const response = await fetch(`${API_BASE_URL}/api/banners/position/${position}`);
    if (!response.ok) throw new Error('Failed to fetch banners');
    return response.json();
  },

  // Lấy tất cả banner active
  getAllActiveBanners: async () => {
    const response = await fetch(`${API_BASE_URL}/api/banners/active`);
    if (!response.ok) throw new Error('Failed to fetch banners');
    return response.json();
  }
};