import { getToken, setToken, removeToken, isTokenExpired } from '../utils/tokenUtils';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class AuthService {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const token = getToken();
    
    if (token && isTokenExpired(token)) {
      removeToken();
      throw new Error('Token đã hết hạn');
    }
    
    const config = {
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
      ...options,
    };

    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      if (response.status === 401) {
        removeToken();
      }
      throw new Error(errorData.detail || errorData.message || 'Đăng nhập thất bại');
    }

    return await response.json();
  }

  async login(email, password) {
    const formData = new FormData();
    formData.append('username', email);
    formData.append('password', password);

    const data = await this.request('/auth/login', {
      method: 'POST',
      headers: {},
      body: formData,
    });
    
    if (data.access_token) {
      setToken(data.access_token);
    }
    
    return data;
  }

  async register(userData) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async getCurrentUser() {
    return this.request('/auth/me');
  }

  logout() {
    removeToken();
  }

  isAuthenticated() {
    const token = getToken();
    return token && !isTokenExpired(token);
  }
}

export const authService = new AuthService();