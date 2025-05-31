import { Alert, Box, Button, Link, Paper, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import * as authService from '../services/auth';
import '../styles/auth.css';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      const response = await authService.register(email, password);
      if (response.access_token) {
        // Store token and automatically log in
        localStorage.setItem('token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token);
        navigate('/dashboard');
      } else {
        throw new Error('No access token received');
      }
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || 'Registration failed';
      setError(errorMessage);
    }
  };

  return (
    <Box className="auth-container">
      <Paper className="auth-card">
        <Typography variant="h4" className="auth-title">
          Create Account
        </Typography>
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
          <Button 
            type="submit" 
            fullWidth 
            variant="contained"
            className="auth-button"
          >
            Register
          </Button>
          <Box className="auth-link">
            <Link component={RouterLink} to="/login">
              Already have an account? Sign in
            </Link>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}
