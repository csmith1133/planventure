import { Alert, Box, Button, Paper, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import type { AuthError } from '../services/auth';
import * as authService from '../services/auth';
import '../styles/auth.css';

export default function ResetPassword() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get('token');

  useEffect(() => {
    // Hide both navbar and footer
    document.body.classList.add('hide-nav', 'hide-footer');
    
    return () => {
      document.body.classList.remove('hide-nav', 'hide-footer');
    };
  }, []);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) {
      setError('Invalid reset token');
      return;
    }
    
    setIsSubmitting(true);
    setError('');
    
    try {
      await authService.resetPassword(token, password);
      navigate('/login', { 
        state: { message: 'Password has been reset successfully. Please login with your new password.' }
      });
    } catch (err: unknown) {
      const authError = err as AuthError;
      setError(authError.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!token) {
    return (
      <Box className="auth-container">
        <Paper className="auth-card">
          <Typography variant="h4" className="auth-title">
            Invalid Reset Link
          </Typography>
          <Alert severity="error">This password reset link is invalid or has expired.</Alert>
        </Paper>
      </Box>
    );
  }

  return (
    <Box className="auth-container">
      <div className="bg"></div>
      <div className="bg bg2"></div>
      <div className="bg bg3"></div>
      <Paper className="auth-card">
        <Typography variant="h4" className="auth-title">
          Set New Password
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} className="auth-form">
          <TextField
            required
            fullWidth
            type="password"
            placeholder="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            variant="standard"
            InputProps={{ disableUnderline: true }}
            InputLabelProps={{ shrink: false }}
            disabled={isSubmitting}
          />
          <Button 
            type="submit" 
            fullWidth 
            variant="contained" 
            className="auth-button"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Updating...' : 'Update Password'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
