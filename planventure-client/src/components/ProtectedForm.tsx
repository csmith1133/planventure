import { ReactNode, useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

interface Props {
  children: ReactNode;
  returnPath?: string;
}

export default function ProtectedForm({ children, returnPath }: Props) {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem('access_token');
      console.log('Current token:', token);

      if (!token) {
        console.log('No token found, redirecting to login');
        navigate('/login');
        return;
      }

      try {
        console.log('Verifying token...');
        const response = await api.get('/api/me');
        console.log('Auth response:', response.data);

        if (response.data && response.data.id) {
          setAuthorized(true);
          setLoading(false);
        }
      } catch (error) {
        console.error('Auth error:', error);
        localStorage.removeItem('access_token');
        navigate('/login');
      }
    };

    verifyAuth();
  }, [navigate, location]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg">Verifying authentication...</div>
      </div>
    );
  }

  if (!authorized) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg text-red-600">Authentication failed. Please try again.</div>
      </div>
    );
  }

  return <>{children}</>;
}
