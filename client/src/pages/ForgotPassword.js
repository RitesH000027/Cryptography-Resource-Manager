import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaEnvelope, FaLock, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import OtpVerification from '../components/auth/OtpVerification';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1); // 1: Email entry, 2: OTP verification, 3: New password, 4: Success
  const [message, setMessage] = useState('');
  
  const { forgotPassword, resetPassword } = useAuth();
  
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await forgotPassword(email);
      setMessage(response.message || 'A verification code has been sent to your email');
      setStep(2); // Move to OTP verification step
    } catch (err) {
      setError(err.message || 'Failed to process your request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleVerificationSuccess = () => {
    setStep(3); // Move to new password step
    setMessage('Verification successful! Please set your new password.');
  };
  
  const handlePasswordReset = async (e) => {
    e.preventDefault();
    
    if (!newPassword) {
      setError('Please enter a new password');
      return;
    }
    
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    setIsLoading(true);
    setError('');
    
    try {
      const response = await resetPassword(email, null, newPassword); // OTP is already verified in step 2
      setMessage(response.message || 'Your password has been successfully reset');
      setStep(4); // Move to success step
    } catch (err) {
      setError(err.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <PageContainer>
      <ResetCard>
        {step === 1 && (
          <>
            <CardHeader>
              <CardTitle>Reset Password</CardTitle>
              <CardSubtitle>
                Enter your email address to receive a verification code
              </CardSubtitle>
            </CardHeader>
            
            {error && (
              <ErrorMessage>
                <FaExclamationCircle />
                <span>{error}</span>
              </ErrorMessage>
            )}
            
            <Form onSubmit={handleEmailSubmit}>
              <FormGroup>
                <FormLabel>Email Address</FormLabel>
                <InputWrapper>
                  <InputIcon>
                    <FaEnvelope />
                  </InputIcon>
                  <FormInput
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isLoading}
                  />
                </InputWrapper>
              </FormGroup>
              
              <SubmitButton type="submit" disabled={isLoading}>
                {isLoading ? 'Processing...' : 'Send Verification Code'}
              </SubmitButton>
            </Form>
            
            <LinkContainer>
              <span>Remember your password?</span>
              <StyledLink to="/login">Back to Login</StyledLink>
            </LinkContainer>
          </>
        )}
        
        {step === 2 && (
          <>
            <CardHeader>
              <CardTitle>Verify Your Email</CardTitle>
              <CardSubtitle>{message}</CardSubtitle>
            </CardHeader>
            
            <OtpVerification 
              email={email} 
              onSuccess={handleVerificationSuccess} 
            />
            
            <LinkContainer>
              <StyledLink to="/login">Back to Login</StyledLink>
            </LinkContainer>
          </>
        )}
        
        {step === 3 && (
          <>
            <CardHeader>
              <CardTitle>Set New Password</CardTitle>
              <CardSubtitle>{message}</CardSubtitle>
            </CardHeader>
            
            {error && (
              <ErrorMessage>
                <FaExclamationCircle />
                <span>{error}</span>
              </ErrorMessage>
            )}
            
            <Form onSubmit={handlePasswordReset}>
              <FormGroup>
                <FormLabel>New Password</FormLabel>
                <InputWrapper>
                  <InputIcon>
                    <FaLock />
                  </InputIcon>
                  <FormInput
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </InputWrapper>
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Confirm New Password</FormLabel>
                <InputWrapper>
                  <InputIcon>
                    <FaLock />
                  </InputIcon>
                  <FormInput
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={isLoading}
                  />
                </InputWrapper>
              </FormGroup>
              
              <SubmitButton type="submit" disabled={isLoading}>
                {isLoading ? 'Resetting Password...' : 'Reset Password'}
              </SubmitButton>
            </Form>
          </>
        )}
        
        {step === 4 && (
          <>
            <SuccessContainer>
              <SuccessIcon>
                <FaCheckCircle />
              </SuccessIcon>
              <SuccessTitle>Password Reset Successful!</SuccessTitle>
              <SuccessMessage>
                {message}
              </SuccessMessage>
              <LinkButton to="/login">
                Go to Login
              </LinkButton>
            </SuccessContainer>
          </>
        )}
      </ResetCard>
    </PageContainer>
  );
};

// Styled Components
const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 160px);
  padding: 2rem 0;
`;

const ResetCard = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
`;

const CardHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const CardTitle = styled.h1`
  font-size: 2rem;
  color: #333;
  margin-bottom: 0.5rem;
`;

const CardSubtitle = styled.p`
  color: #666;
  font-size: 0.9rem;
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: rgba(244, 67, 54, 0.1);
  color: #f44336;
  padding: 1rem;
  border-radius: 5px;
  margin-bottom: 1.5rem;
  font-size: 0.9rem;
`;

const Form = styled.form`
  margin-bottom: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: #333;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  color: #757575;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;
  
  &:focus {
    border-color: #3f51b5;
  }
  
  &:disabled {
    background-color: #f5f5f5;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #3f51b5;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover:not(:disabled) {
    background-color: #303f9f;
  }
  
  &:disabled {
    background-color: #b0bec5;
    cursor: not-allowed;
  }
`;

const LinkContainer = styled.div`
  text-align: center;
  color: #757575;
  font-size: 0.9rem;
`;

const StyledLink = styled(Link)`
  color: #3f51b5;
  margin-left: 0.5rem;
  font-weight: 500;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const SuccessContainer = styled.div`
  text-align: center;
  padding: 1.5rem 0;
`;

const SuccessIcon = styled.div`
  font-size: 4rem;
  color: #4caf50;
  margin-bottom: 1.5rem;
`;

const SuccessTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 1rem;
`;

const SuccessMessage = styled.p`
  color: #666;
  margin-bottom: 2rem;
  font-size: 0.9rem;
  line-height: 1.5;
`;

const LinkButton = styled(Link)`
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background-color: #3f51b5;
  color: white;
  border-radius: 5px;
  text-decoration: none;
  font-weight: 500;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #303f9f;
  }
`;

export default ForgotPassword;