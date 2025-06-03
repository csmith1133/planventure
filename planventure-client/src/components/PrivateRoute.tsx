import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function PrivateRoute({ children }: { children: JSX.Element }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/me', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('access_token')}`
          }
        });
        setIsAuthenticated(true);
      } catch (error) {
        // If token is invalid or expired, clear storage and redirect
        localStorage.clear();
        setIsAuthenticated(false);
        navigate('/login', { replace: true });
      }
    };

    validateToken();
  }, [navigate]);

  return isAuthenticated ? children : null;
}