import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaEnvelope, FaLock, FaExclamationCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import OtpVerification from '../components/auth/OtpVerification';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ''
      });
    }
  };
  
  const validateForm = () => {
    const errors = {};
    const { email, password } = formData;
    
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      setLoginError('');
      
      try {
        const result = await login(formData.email, formData.password);
        
        // Check if email verification is needed
        if (result?.needsVerification) {
          setShowOtpVerification(true);
        } else {
          // Redirect based on role
          if (result.user && (result.user.role === 'admin' || result.user.role === 'authorized')) {
            navigate('/dashboard');
          } else {
            navigate('/');  // Redirect to home page for regular users
          }
        }
      } catch (error) {
        setLoginError(error.response?.data?.error || error.message || 'Login failed. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  const handleVerificationSuccess = (data) => {
    // When OTP verification is successful
    if (data?.token) {
      localStorage.setItem('token', data.token);
      
      // Redirect based on role
      if (data.user && (data.user.role === 'admin' || data.user.role === 'authorized')) {
        navigate('/dashboard');
      } else {
        navigate('/');  // Redirect to home page for regular users
      }
    }
  };
  
  if (showOtpVerification) {
    return (
      <LoginContainer>
        <div className="container">
          <LoginCard>
            <LoginHeader>
              <LoginTitle>Verify Your Email</LoginTitle>
              <LoginSubtitle>Confirmation Required</LoginSubtitle>
            </LoginHeader>
            <div>
              <FormSubtitle>We've sent a verification code to your email</FormSubtitle>
              <OtpVerification 
                email={formData.email} 
                onSuccess={handleVerificationSuccess} 
              />
            </div>
          </LoginCard>
        </div>
      </LoginContainer>
    );
  }
  
  return (
    <LoginContainer>
      <div className="container">
        <LoginCard>
          <LoginHeader>
            <LoginTitle>Welcome to Cryptography Resources Manager</LoginTitle>
            <LoginSubtitle>Sign in to your account</LoginSubtitle>
          </LoginHeader>
          
          {loginError && (
            <ErrorMessage>
              <FaExclamationCircle />
              <span>{loginError}</span>
            </ErrorMessage>
          )}
          
          <LoginForm onSubmit={handleSubmit}>
            <FormGroup>
              <FormLabel>Email</FormLabel>
              <InputWrapper>
                <InputIcon>
                  <FaEnvelope />
                </InputIcon>
                <FormInput
                  type="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  error={formErrors.email}
                />
              </InputWrapper>
              {formErrors.email && (
                <ErrorText>{formErrors.email}</ErrorText>
              )}
            </FormGroup>
            
            <FormGroup>
              <FormLabel>Password</FormLabel>
              <InputWrapper>
                <InputIcon>
                  <FaLock />
                </InputIcon>
                <FormInput
                  type="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  error={formErrors.password}
                />
              </InputWrapper>
              {formErrors.password && (
                <ErrorText>{formErrors.password}</ErrorText>
              )}
            </FormGroup>
            
            <ForgotPassword to="/forgot-password">
              Forgot your password?
            </ForgotPassword>
            
            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Signing in...' : 'Sign In'}
            </SubmitButton>
          </LoginForm>
          
          <LoginFooter>
            <span>Don't have an account?</span>
            <RegisterLink to="/register">Sign Up</RegisterLink>
          </LoginFooter>
        </LoginCard>
      </div>
    </LoginContainer>
  );
};

const LoginContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 160px);
  padding: 2rem 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%);
`;

const LoginCard = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  padding: 2.5rem;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
`;

const LoginHeader = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
`;

const LoginTitle = styled.h1`
  font-size: 1.8rem;
  color: #2A3F62;
  margin-bottom: 0.8rem;
  font-weight: 700;
`;

const LoginSubtitle = styled.p`
  color: #7C8DB5;
  font-size: 1.1rem;
`;

const FormSubtitle = styled.p`
  color: #7C8DB5;
  text-align: center;
  margin-bottom: 2rem;
  font-size: 1rem;
  font-weight: 500;
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  background-color: rgba(237, 76, 92, 0.15);
  color: #ED4C5C;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 1.5rem;
  
  svg {
    margin-right: 0.8rem;
    font-size: 1.2rem;
  }
`;

const LoginForm = styled.form`
  margin-bottom: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.8rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.6rem;
  font-weight: 600;
  color: #2A3F62;
  font-size: 0.95rem;
`;

const InputWrapper = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 1.2rem;
  transform: translateY(-50%);
  color: #7C8DB5;
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.9rem 1rem 0.9rem 3rem;
  border: 2px solid ${({ error }) => error ? '#ED4C5C' : '#E4E9F2'};
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  transition: all 0.3s ease;
  background-color: #F8FAFC;
  
  &:focus {
    border-color: ${({ error }) => error ? '#ED4C5C' : '#3772FF'};
    box-shadow: 0 0 0 3px ${({ error }) => error ? 'rgba(237, 76, 92, 0.2)' : 'rgba(55, 114, 255, 0.2)'};
    background-color: #FFFFFF;
  }
  
  &::placeholder {
    color: #A0AABA;
  }
`;

const ErrorText = styled.p`
  color: #ED4C5C;
  font-size: 0.85rem;
  margin-top: 0.5rem;
  font-weight: 500;
`;

const ForgotPassword = styled(Link)`
  display: block;
  text-align: right;
  color: #3772FF;
  margin-bottom: 1.8rem;
  font-size: 0.9rem;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.9rem;
  background: linear-gradient(90deg, #3772FF 0%, #3D80FF 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(55, 114, 255, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(55, 114, 255, 0.4);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background: #A0AABA;
    cursor: not-allowed;
    box-shadow: none;
  }
`;

const LoginFooter = styled.div`
  text-align: center;
  color: #7C8DB5;
  font-size: 0.95rem;
  margin-top: 2rem;
`;

const RegisterLink = styled(Link)`
  color: #3772FF;
  margin-left: 0.5rem;
  font-weight: 600;
  
  &:hover {
    text-decoration: underline;
  }
`;

export default Login;