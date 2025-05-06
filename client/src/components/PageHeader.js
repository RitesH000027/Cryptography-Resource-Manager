import React from 'react';
import styled from 'styled-components';

const PageHeader = ({ title, description }) => {
  return (
    <HeaderContainer>
      <Title>{title}</Title>
      {description && <Description>{description}</Description>}
    </HeaderContainer>
  );
};

const HeaderContainer = styled.div`
  text-align: center;
  margin-bottom: 1.5rem;
  padding-top: 10px;
`;

const Title = styled.h1`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.5rem;
  font-family: var(--font-secondary);
`;

const Description = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 1rem;
  max-width: 800px;
  margin: 0 auto;
`;

export default PageHeader;