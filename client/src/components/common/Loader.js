import React from 'react';
import styled, { keyframes } from 'styled-components';

const Loader = ({ size = 'medium', color = '#4f46e5' }) => {
  return (
    <LoaderContainer>
      <SpinnerRing size={size} color={color} />
    </LoaderContainer>
  );
};

const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
`;

const SpinnerRing = styled.div`
  display: inline-block;
  width: ${props => {
    switch(props.size) {
      case 'small': return '20px';
      case 'large': return '60px';
      default: return '40px';
    }
  }};
  height: ${props => {
    switch(props.size) {
      case 'small': return '20px';
      case 'large': return '60px';
      default: return '40px';
    }
  }};
  
  &:after {
    content: "";
    display: block;
    width: ${props => {
      switch(props.size) {
        case 'small': return '16px';
        case 'large': return '48px';
        default: return '32px';
      }
    }};
    height: ${props => {
      switch(props.size) {
        case 'small': return '16px';
        case 'large': return '48px';
        default: return '32px';
      }
    }};
    margin: 8px;
    border-radius: 50%;
    border: ${props => {
      switch(props.size) {
        case 'small': return '2px';
        case 'large': return '6px';
        default: return '4px';
      }
    }} solid ${props => props.color};
    border-color: ${props => props.color} transparent ${props => props.color} transparent;
    animation: ${spin} 1.2s linear infinite;
  }
`;

export default Loader;
