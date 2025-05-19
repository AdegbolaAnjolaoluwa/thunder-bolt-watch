
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const Index = () => {
  const { currentUser, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    // Redirect based on user role
    if (currentUser) {
      switch (currentUser.role) {
        case 'ceo':
          navigate('/ceo');
          break;
        case 'accountant':
          navigate('/accountant');
          break;
        default:
          navigate('/login');
      }
    }
  }, [currentUser, isAuthenticated, navigate]);

  return null; // This component doesn't render anything, it just redirects
};

export default Index;
