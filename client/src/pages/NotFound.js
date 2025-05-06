import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome } from 'react-icons/fa';

const NotFound = () => {
  return (
    <NotFoundContainer>
      <div className="container">
        <NotFoundContent>
          <NotFoundTitle>404</NotFoundTitle>
          <NotFoundSubtitle>Page Not Found</NotFoundSubtitle>
          <NotFoundText>
            The page you are looking for doesn't exist or has been moved.
          </NotFoundText>
          <HomeLink to="/">
            <FaHome />
            <span>Back to Home</span>
          </HomeLink>
        </NotFoundContent>
      </div>
    </NotFoundContainer>
  );
};

const NotFoundContainer = styled.div`
  padding: 4rem 0;
  text-align: center;
`;

const NotFoundContent = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

const NotFoundTitle = styled.h1`
  font-size: 8rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
`;

const NotFoundSubtitle = styled.h2`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1.5rem;
`;

const NotFoundText = styled.p`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 2rem;
`;

const HomeLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border-radius: 5px;
  font-size: 1.1rem;
  font-weight: 500;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

export default NotFound;