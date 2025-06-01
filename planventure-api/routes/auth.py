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

export const forgotPassword = async (email: string) => {
  const response = await axios.post(`${API_URL}/auth/forgot-password`, {
    email
  });
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

export const getResetEmailTemplate = (resetLink: string) => {
  const planVentureLogo = `data:image/svg+xml;base64,${btoa(`
    <svg width="120" height="40" viewBox="0 0 120 40" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M20 10 C25 5, 30 5, 35 10 C40 15, 40 20, 35 25 C30 30, 25 30, 20 25 C15 20, 15 15, 20 10" fill="#96DC14"/>
      <text x="45" y="25" font-family="system-ui" font-size="16" font-weight="600" fill="#232323">PlanVenture</text>
    </svg>
  `)}`;

  return `
<!DOCTYPE html>
<html>
<head>
  <style>
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      padding: 20px;
    }
    .header {
      text-align: center;
      padding: 20px;
      background-color: #f8f9fa;
      border-radius: 8px 8px 0 0;
    }
    .logo {
      width: 120px;
      height: 40px;
      margin-bottom: 15px;
    }
    .content {
      padding: 30px;
      background: white;
      border: 1px solid #eee;
      border-radius: 0 0 8px 8px;
    }
    .button {
      display: inline-block;
      padding: 12px 24px;
      background-color: #96DC14;
      color: #232323;
      text-decoration: none;
      border-radius: 6px;
      font-weight: 600;
      margin: 20px 0;
    }
    .footer {
      text-align: center;
      color: #666;
      font-size: 12px;
      margin-top: 20px;
    }
  </style>
</head>
<body>
  <div class="email-container">
    <div class="header">
      <img src="${planVentureLogo}" alt="PlanVenture Logo" class="logo">
    </div>
    <div class="content">
      <h1>Reset Your Password</h1>
      <p>Hello,</p>
      <p>We received a request to reset your password. Click the button below to create a new password:</p>
      <a href="${resetLink}" class="button">Reset Password</a>
      <p>If you didn't request this change, you can safely ignore this email.</p>
      <p>This link will expire in 1 hour for security reasons.</p>
    </div>
    <div class="footer">
      <p>© ${new Date().getFullYear()} PlanVenture. All rights reserved.</p>
      <p>This is an automated message, please do not reply to this email.</p>
    </div>
  </div>
</body>
</html>`;
};

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    email = data.get('email')
    html_template = data.get('html_template')
    
    token = generate_reset_token(email)
    reset_link = f"{config.FRONTEND_URL}/reset-password?token={token}"
    
    # Pass HTML template to email function
    send_reset_email(email, reset_link, html_template)
    
    return jsonify({'message': 'Password reset email sent'})

from flask import jsonify
from utils.email_service import verify_reset_token

@app.route('/api/reset-password', methods=['POST'])
def reset_password():
    data = request.get_json()
    token = data.get('token')
    new_password = data.get('password')

    # First verify token and get email
    email, is_valid = verify_reset_token(token)
    
    if not is_valid:
        return jsonify({
            'error': 'Password reset link has expired or is invalid. Please request a new one.'
        }), 400

    # If token is valid, proceed with password update
    try {
        user = User.query.filter_by(email=email).first();
        if user:
            user.set_password(new_password);
            db.session.commit();
            return jsonify({'message': 'Password successfully reset'});
        return jsonify({'error': 'User not found'}), 404;
    } except Exception as e {
        db.session.rollback();
        return jsonify({'error': str(e)}), 500;
    }