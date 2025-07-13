import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuthRedirect = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const activeUser = localStorage.getItem('activeUser');
    if (activeUser) {
      navigate('/');
    }
  }, [navigate]);
};