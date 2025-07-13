import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuthGuard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const activeUser = localStorage.getItem('activeUser');
    if (!activeUser) {
      navigate('/login');
    }
  }, [navigate]);
};