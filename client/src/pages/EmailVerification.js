import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { FaCheckCircle, FaTimesCircle, FaSpinner } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import OtpVerification from '../components/auth/OtpVerification';

const EmailVerification = () => {
  const [verificationStatus, setVerificationStatus] = useState('loading');
  const [message, setMessage] = useState('');
  const { token } = useParams();
  const { verifyEmail } = useAuth();
  const location = useLocation();
  
  // Check if we are using OTP verification (no token in URL)
  const useOtpVerification = !token && location.state?.email;
  const email = location.state?.email || '';
  
  useEffect(() => {
    // Only run link verification if we have a token
    if (!useOtpVerification && token) {
      const verifyEmailToken = async () => {
        try {
          const response = await verifyEmail(token);
          setVerificationStatus('success');
          setMessage(response.message || 'Your email has been successfully verified!');
        } catch (error) {
          setVerificationStatus('error');
          setMessage(error.response?.data?.message || 'Email verification failed. The link may be invalid or expired.');
        }
      };
      
      verifyEmailToken();
    } else if (!useOtpVerification && !token) {
      setVerificationStatus('error');
      setMessage('Invalid verification link.');
    }
  }, [token, verifyEmail, useOtpVerification]);
  
  const handleVerificationSuccess = (data) => {
    setVerificationStatus('success');
    setMessage(data.message || 'Your email has been successfully verified!');
  };
  
  if (useOtpVerification) {
    return (
      <Container>
        <VerificationCard>
          <CardHeader>
            <CardTitle>Email Verification</CardTitle>
            <CardSubtitle>Please verify your email to activate your account</CardSubtitle>
          </CardHeader>
          
          <OtpVerification 
            email={email} 
            onSuccess={handleVerificationSuccess} 
          />
        </VerificationCard>
      </Container>
    );
  }
  
  // Link-based verification UI
  return (
    <Container>
      <VerificationCard>
        <CardIconContainer>
          {verificationStatus === 'loading' && (
            <LoadingIcon>
              <FaSpinner />
            </LoadingIcon>
          )}
          
          {verificationStatus === 'success' && (
            <SuccessIcon>
              <FaCheckCircle />
            </SuccessIcon>
          )}
          
          {verificationStatus === 'error' && (
            <ErrorIcon>
              <FaTimesCircle />
            </ErrorIcon>
          )}
        </CardIconContainer>
        
        <CardTitle>
          {verificationStatus === 'loading' && 'Verifying Your Email'}
          {verificationStatus === 'success' && 'Email Verified'}
          {verificationStatus === 'error' && 'Verification Failed'}
        </CardTitle>
        
        <CardMessage>{message}</CardMessage>
        
        <CardActions>
          {verificationStatus === 'success' && (
            <PrimaryButton to="/login">
              Continue to Login
            </PrimaryButton>
          )}
          
          {verificationStatus === 'error' && (
            <SecondaryButton to="/register">
              Return to Registration
            </SecondaryButton>
          )}
        </CardActions>
      </VerificationCard>
    </Container>
  );
};

// Styled Components
const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 160px);
  padding: 2rem 0;
`;

const VerificationCard = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  text-align: center;
`;

const CardHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const CardIconContainer = styled.div`
  margin-bottom: 1.5rem;
  font-size: 4rem;
`;

const LoadingIcon = styled.div`
  color: #3f51b5;
  animation: spin 1s linear infinite;
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const SuccessIcon = styled.div`
  color: #4caf50;
`;

const ErrorIcon = styled.div`
  color: #f44336;
`;

const CardTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
`;

const CardSubtitle = styled.p`
  color: #666;
  font-size: 0.9rem;
  line-height: 1.5;
`;

const CardMessage = styled.p`
  color: #666;
  margin-bottom: 2rem;
  font-size: 0.9rem;
  line-height: 1.5;
`;

const CardActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
`;

const PrimaryButton = styled(Link)`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #3f51b5;
  color: white;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.2s;
  
  &:hover {
    background-color: #303f9f;
  }
`;

const SecondaryButton = styled(Link)`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: transparent;
  color: #3f51b5;
  border: 1px solid #3f51b5;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.2s;
  
  &:hover {
    background-color: rgba(63, 81, 181, 0.05);
  }
`;

export default EmailVerification;