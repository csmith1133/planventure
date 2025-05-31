import axios from 'axios';

const API_URL = 'http://127.0.0.1:5000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  }
});

export interface AuthResponse {
  message: string;
  access_token: string;
  refresh_token: string;
  user: {
    id: number;
    email: string;
  };
}

export const setAuthTokens = (accessToken: string, refreshToken: string) => {
  console.log('Setting auth tokens...');
  localStorage.setItem('access_token', accessToken);
  localStorage.setItem('refresh_token', refreshToken);
  // Set default auth header
  axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
};

export const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  };
};

export const login = async (email: string, password: string, rememberMe: boolean = false): Promise<AuthResponse> => {
  console.log('Attempting login...');
  const response = await api.post<AuthResponse>('/auth/login', {
    email,
    password,
    remember_me: rememberMe
  });
  console.log('Login response:', response.data);

  if (response.data.access_token) {
    setAuthTokens(response.data.access_token, response.data.refresh_token);
  }

  return response.data;
};

export const checkStoredAuth = () => {
  const token = localStorage.getItem('access_token');
  console.log('Checking stored auth token:', !!token);
  return { token };
};

export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export const register = async (email: string, password: string) => {
  const response = await api.post('/auth/register', {
    email,
    password
  });

  if (response.data.access_token) {
    localStorage.setItem('token', response.data.access_token);
    if (response.data.refresh_token) {
      localStorage.setItem('refresh_token', response.data.refresh_token);
    }
  }

  return response.data;
};

export const forgotPassword = async (email: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/forgot-password', { email });
  return response.data;
};

export const resetPassword = async (token: string, password: string): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/auth/reset-password', {
    token,
    password
  });
  return response.data;
};

export interface AuthError {
  response?: {
    data?: {
      message?: string;
    };
  };
  message: string;
}

export const getGoogleAuthUrl = async () => {
  const response = await api.get('/auth/google/login');
  return response.data;
};

export const handleGoogleCallback = async (code: string) => {
  const response = await api.get(`/auth/google/login/callback?code=${code}`);
  if (response.data.access_token) {
    localStorage.setItem('token', response.data.access_token);
  }
  return response.data;
};
