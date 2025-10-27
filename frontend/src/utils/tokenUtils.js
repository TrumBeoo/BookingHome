export const getToken = () => {
  return localStorage.getItem('access_token');
};

export const setToken = (token) => {
  localStorage.setItem('access_token', token);
  localStorage.setItem('isAuthenticated', 'true');
};

export const removeToken = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('isAuthenticated');
};

export const isTokenExpired = (token) => {
  if (!token) return true;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return payload.exp < currentTime;
  } catch (error) {
    console.warn('Cannot decode token, assuming valid:', error);
    return false;
  }
};

export const shouldRefreshToken = (token) => {
  if (!token) return false;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    return (payload.exp - currentTime) < 300;
  } catch (error) {
    return false;
  }
};