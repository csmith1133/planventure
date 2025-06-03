import { Alert, Box, Button, Link, Paper, TextField, Typography } from '@mui/material';
import { useEffect, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import type { AuthError } from '../services/auth';
import * as authService from '../services/auth';
import '../styles/auth.css';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setMessage('');
    
    try {
      const response = await authService.forgotPassword(email);
      setMessage(response.message || 'If an account exists, a reset link will be sent.');
    } catch (err: unknown) {
      const authError = err as AuthError;
      setError(authError.response?.data?.message || 'Failed to process request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };
    useEffect(() => {
      // Hide both navbar and footer
      document.body.classList.add('hide-nav', 'hide-footer');
      
      return () => {
        document.body.classList.remove('hide-nav', 'hide-footer');
      };
    }, []);

  return (
    <Box className="auth-container">
      <div class="bg"></div>
      <div class="bg bg2"></div>
      <div class="bg bg3"></div>
      <Paper className="auth-card">
        <Typography variant="h4" className="auth-title">
          Reset Password
        </Typography>
        {message && <Alert severity="success" sx={{ mb: 2 }}>{message}</Alert>}
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        <Box component="form" onSubmit={handleSubmit} className="auth-form">
          <TextField
            required
            fullWidth
            placeholder="Email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            {isSubmitting ? 'Sending...' : 'Send Reset Link'}
          </Button>
          <Box className="auth-link">
            <Link component={RouterLink} to="/login">
              Back to Login
            </Link>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
