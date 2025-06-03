import { CssBaseline } from '@mui/material';
import { GoogleOAuthProvider } from '@react-oauth/google';
import axios from 'axios';
import { useEffect } from 'react';
import { BrowserRouter, Navigate, Outlet, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import './App.css';
import Documentation from './components/Documentation';
import TopVariancesDoc from './components/documentation/TopVariancesDoc';
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';


// Auth routes that should not show navbar
const authRoutes = ['/login', '/register', '/reset-password', '/forgot-password'];

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('access_token');
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};

const RootRedirect = () => {
  const token = localStorage.getItem('access_token');
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      // Verify token is still valid
      axios.get('http://localhost:5000/api/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(() => {
        navigate('/dashboard');
      })
      .catch(() => {
        localStorage.removeItem('access_token');
        navigate('/login');
      });
    } else {
      navigate('/login');
    }
  }, [token, navigate]);

  return <div>Loading...</div>;
};

function App() {
  const location = useLocation();
  const isAuthPage = authRoutes.includes(location.pathname);

  return (
    <div style={{ 
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      paddingBottom: '0'
    }}>
      {!isAuthPage && <Navbar />}
      <div className={`app-content ${isAuthPage ? 'auth-page' : ''}`}>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          
          {/* Root path handler */}
          <Route path="/" element={<RootRedirect />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute><Outlet /></ProtectedRoute>}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/documentation" element={<Documentation />} />
            <Route path="/documentation/top-variances" element={<TopVariancesDoc />} />
          </Route>

          {/* 404 Not Found route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      <Footer />
    </div>
  );
}

const AppWrapper = () => {
  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || ''}>
      <BrowserRouter>
        <CssBaseline />
        <App />
      </BrowserRouter>
    </GoogleOAuthProvider>
  );
};

export default AppWrapper;
