import { Alert, Box, Button, Checkbox, FormControlLabel, Link, Paper, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import logo from '../assets/hf_finfreshq_white.png';
import type { AuthError } from '../services/auth';
import * as authService from '../services/auth';
import '../styles/auth.css';

const GoogleLogo = () => (
  <svg viewBox="0 0 24 24" width="30" height="30" xmlns="http://www.w3.org/2000/svg">
    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
  </svg>
);

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Hide both navbar and footer
    document.body.classList.add('hide-nav', 'hide-footer');
    
    return () => {
      document.body.classList.remove('hide-nav', 'hide-footer');
    };
  }, []);

  useEffect(() => {
    const { token } = authService.checkStoredAuth();
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      await authService.login(email, password, rememberMe);
      navigate('/dashboard');
    } catch (err: unknown) {
      const authError = err as AuthError;
      setError(authError.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setError('');
    setIsGoogleLoading(true);
    try {
      const { auth_url } = await authService.getGoogleAuthUrl();
      window.location.href = auth_url;
    } catch (err: unknown) {
      const authError = err as AuthError;
      setError(authError.response?.data?.message || 'Google login failed');
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <Box className="auth-container">
      <div className="bg"></div>
      <div className="bg bg2"></div>
      <div className="bg bg3"></div>
      <Paper className="auth-card">
        <Box sx={{ textAlign: 'center', mb: 3 }}>
          <img src={logo} alt="Logo" style={{ height: 65, marginBottom: '1rem' }} />
          <Typography variant="h4" className="auth-title">
            Login
          </Typography>
        </Box>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} className="auth-form">
          <TextField
            required
            fullWidth
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            variant="standard"
            InputProps={{ disableUnderline: true }}
            InputLabelProps={{ shrink: false }}
          />
          <TextField
            required
            fullWidth
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="standard"
            InputProps={{ disableUnderline: true }}
            InputLabelProps={{ shrink: false }}
          />
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  sx={{
                    color: 'white',
                    '&.Mui-checked': {
                      color: 'white',
                    }
                  }}
                />
              }
              label="Remember Me"
              sx={{ color: 'white' }}
            />
            <Link 
              component={RouterLink} 
              to="/forgot-password" 
              sx={{ 
                color: 'white', 
                textDecoration: 'none',
                '&:hover': { 
                  color: 'white',
                  opacity: 0.8
                }
              }}
            >
              Forgot Password?
            </Link>
          </Box>
          <Box sx={{ display: 'flex', gap: 1, width: '100%' }}>
            <Button 
              type="submit" 
              variant="contained" 
              className="auth-button"
              disabled={isLoading}
              sx={{ flex: 3 }}
            >
              {isLoading ? 'Signing in...' : 'Sign In'}
            </Button>
            <Button
              onClick={handleGoogleLogin}
              variant="contained"
              className="auth-button"
              disabled={isGoogleLoading}
              sx={{ 
                flex: 1,
                backgroundColor: 'white',
                color: '#757575',
                '&:hover': {
                  backgroundColor: '#f5f5f5'
                },
                minWidth: '40px',
                padding: '0px 0px'
              }}
            >
              <GoogleLogo />
            </Button>
          </Box>
          <Box className="auth-link">
            <Link component={RouterLink} to="/register">
              Don't have an account? Sign up
            </Link>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
