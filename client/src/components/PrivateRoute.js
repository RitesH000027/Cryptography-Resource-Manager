import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaLock, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const [redirectPath, setRedirectPath] = useState('');
  const location = useLocation();
  
  useEffect(() => {
    // Save the current path for redirecting back after login
    if (!user && !loading) {
      setRedirectPath(location.pathname);
      localStorage.setItem('redirectPath', location.pathname);
    }
  }, [user, loading, location]);
  
  if (loading) {
    return (
      <LoadingContainer>
        <LoadingSpinner>
          <FaSpinner />
        </LoadingSpinner>
        <LoadingText>Verifying your credentials...</LoadingText>
      </LoadingContainer>
    );
  }
  
  if (!user) {
    // Redirect to login but remember where the user was trying to go
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return (
    <ProtectedContent>
      {children}
    </ProtectedContent>
  );
};

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 0;
  text-align: center;
`;

const LoadingSpinner = styled.div`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.textLight};
`;

const ProtectedContent = styled.div`
  position: relative;
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(to right, ${({ theme }) => theme.colors.primary}, ${({ theme }) => theme.colors.success});
  }
`;

export default PrivateRoute;