import axios from 'axios';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function useAuth(returnPath?: string) {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        navigate('/login', { state: { from: returnPath || window.location.pathname } });
        return;
      }

      try {
        await axios.get('/api/me', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        setAuthenticated(true);
      } catch (error) {
        localStorage.removeItem('token');
        navigate('/login', { state: { from: returnPath || window.location.pathname } });
      } finally {
        setLoading(false);
      }
    };

    verifyAuth();
  }, [navigate, returnPath]);

  return { loading, authenticated };
}
