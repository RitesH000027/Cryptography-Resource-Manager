import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaSpinner, FaCheckCircle, FaTimesCircle, FaEnvelope } from 'react-icons/fa';
import axios from 'axios';

const OtpVerification = ({ email, onSuccess, showResend = true }) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [resending, setResending] = useState(false);
  const inputRefs = Array(6).fill(0).map(() => React.createRef());
  const navigate = useNavigate();

  // Start the countdown timer
  useEffect(() => {
    if (timer > 0 && !success) {
      const interval = setInterval(() => {
        setTimer(prevTimer => prevTimer - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timer, success]);

  // Handle input changes
  const handleChange = (e, index) => {
    const { value } = e.target;
    
    // Only allow numbers
    if (value && !/^\d+$/.test(value)) return;
    
    const newOtp = [...otp];
    
    // Allow paste of full OTP
    if (value.length > 1 && index === 0) {
      const pastedOtp = value.split('').slice(0, 6);
      for (let i = 0; i < pastedOtp.length; i++) {
        if (i < 6) newOtp[i] = pastedOtp[i];
      }
      setOtp(newOtp);
      
      // Focus on the last filled input or the next empty one
      const lastFilledIndex = newOtp.findIndex(val => val === '') - 1;
      const focusIndex = lastFilledIndex >= 0 ? lastFilledIndex : 
                         (newOtp[5] !== '' ? 5 : newOtp.findIndex(val => val === ''));
      
      if (focusIndex >= 0 && focusIndex < 6) {
        inputRefs[focusIndex].current.focus();
      }
      return;
    }
    
    // Regular single digit input
    newOtp[index] = value.substring(0, 1);
    setOtp(newOtp);
    
    // Auto-focus next input
    if (value && index < 5) {
      inputRefs[index + 1].current.focus();
    }
  };

  // Handle key press to allow backspace navigation
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      // Focus previous input when backspace is pressed on empty input
      inputRefs[index - 1].current.focus();
    }
  };

  // Verify the OTP
  const verifyOtp = async () => {
    const otpValue = otp.join('');
    
    if (otpValue.length !== 6) {
      setError('Please enter a valid 6-digit verification code');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5001'}/api/auth/verify`, {
        email,
        otp: otpValue
      });
      
      setSuccess(true);
      setLoading(false);
      
      // Store token if provided
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      
      // Call success callback if provided
      if (onSuccess) {
        onSuccess(response.data);
      } else {
        // Default behavior - redirect to dashboard after success
        setTimeout(() => {
          navigate('/dashboard');
        }, 2000);
      }
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || 'Verification failed. Please try again.');
    }
  };

  // Resend OTP
  const resendOtp = async () => {
    if (timer > 0) return;
    setResending(true);
    setError('');
    
    try {
      await axios.post(`${process.env.REACT_APP_BASE_URL || 'http://localhost:5001'}/api/auth/resend-otp`, { email });
      setTimer(60);
      setResending(false);
    } catch (err) {
      setResending(false);
      setError(err.response?.data?.message || 'Failed to resend verification code');
    }
  };

  return (
    <VerificationContainer>
      <VerificationCard>
        <IconContainer>
          <FaEnvelope size={40} color="#3f51b5" />
        </IconContainer>
        
        <Title>Email Verification</Title>
        <Subtitle>
          We've sent a 6-digit verification code to <Email>{email}</Email>
        </Subtitle>
        
        {success ? (
          <SuccessMessage>
            <FaCheckCircle size={24} color="#4caf50" />
            <span>Email verified successfully!</span>
          </SuccessMessage>
        ) : (
          <>
            <OtpInputContainer>
              {otp.map((digit, index) => (
                <OtpInput
                  key={index}
                  type="text"
                  maxLength={index === 0 ? 6 : 1} // Allow paste on first input
                  value={digit}
                  onChange={(e) => handleChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={inputRefs[index]}
                  autoFocus={index === 0}
                />
              ))}
            </OtpInputContainer>
            
            {error && (
              <ErrorMessage>
                <FaTimesCircle size={16} />
                <span>{error}</span>
              </ErrorMessage>
            )}
            
            <VerifyButton onClick={verifyOtp} disabled={loading || otp.join('').length !== 6}>
              {loading ? <FaSpinner className="spinner" /> : 'Verify Email'}
            </VerifyButton>
            
            {showResend && (
              <ResendContainer>
                {timer > 0 ? (
                  <ResendTimer>Resend code in {timer}s</ResendTimer>
                ) : (
                  <ResendButton onClick={resendOtp} disabled={resending}>
                    {resending ? <FaSpinner className="spinner" /> : 'Resend verification code'}
                  </ResendButton>
                )}
              </ResendContainer>
            )}
          </>
        )}
      </VerificationCard>
    </VerificationContainer>
  );
};

// Styled Components
const VerificationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  padding: 2rem 1rem;
`;

const VerificationCard = styled.div`
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  text-align: center;
`;

const IconContainer = styled.div`
  background-color: #f0f2ff;
  width: 80px;
  height: 80px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 1.5rem auto;
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
`;

const Subtitle = styled.p`
  color: #666;
  margin-bottom: 2rem;
  font-size: 0.9rem;
  line-height: 1.5;
`;

const Email = styled.span`
  font-weight: bold;
  color: #3f51b5;
`;

const OtpInputContainer = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  
  @media (max-width: 480px) {
    gap: 0.25rem;
  }
`;

const OtpInput = styled.input`
  width: 50px;
  height: 50px;
  border: 1px solid #ddd;
  border-radius: 8px;
  text-align: center;
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  
  &:focus {
    border-color: #3f51b5;
    outline: none;
    box-shadow: 0 0 0 2px rgba(63, 81, 181, 0.2);
  }
  
  @media (max-width: 480px) {
    width: 40px;
    height: 40px;
    font-size: 1.25rem;
  }
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #f44336;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  justify-content: center;
`;

const SuccessMessage = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #4caf50;
  margin: 2rem 0;
  font-size: 1.1rem;
  justify-content: center;
  font-weight: 500;
`;

const VerifyButton = styled.button`
  background-color: #3f51b5;
  color: white;
  border: none;
  border-radius: 4px;
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  width: 100%;
  transition: background-color 0.2s;
  display: flex;
  justify-content: center;
  align-items: center;
  
  &:hover:not(:disabled) {
    background-color: #303f9f;
  }
  
  &:disabled {
    background-color: #b0bec5;
    cursor: not-allowed;
  }
  
  .spinner {
    animation: spin 1s linear infinite;
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const ResendContainer = styled.div`
  margin-top: 1.5rem;
  text-align: center;
`;

const ResendTimer = styled.div`
  color: #757575;
  font-size: 0.9rem;
`;

const ResendButton = styled.button`
  background: none;
  border: none;
  color: #3f51b5;
  font-size: 0.9rem;
  cursor: pointer;
  text-decoration: underline;
  
  &:disabled {
    color: #bdbdbd;
    cursor: not-allowed;
  }
  
  .spinner {
    animation: spin 1s linear infinite;
    font-size: 0.8rem;
    margin-right: 0.5rem;
  }
`;

export default OtpVerification;