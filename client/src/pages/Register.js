import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { FaUser, FaEnvelope, FaLock, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';
import OtpVerification from '../components/auth/OtpVerification';

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [showOtpVerification, setShowOtpVerification] = useState(false);
  
  const { register } = useAuth();
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
    const { firstName, lastName, email, password, confirmPassword } = formData;
    
    if (!firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!email) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Email is invalid';
    }
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      setRegisterError('');
      
      try {
        const result = await register({
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          password: formData.password
        });
        
        // If registration is successful, show OTP verification
        setShowOtpVerification(true);
      } catch (error) {
        console.error('Registration error details:', error);
        
        // Check for the specific "Email is already registered" error
        if (error.message && error.message.includes('Email is already registered')) {
          setRegisterError('Email is already registered. Please use a different email address.');
        } else if (error.response?.data) {
          // Try to extract error from HTML response if present
          const errorResponse = error.response.data;
          if (typeof errorResponse === 'string' && errorResponse.includes('Error:')) {
            const errorMatch = errorResponse.match(/Error: ([^<]+)/);
            setRegisterError(errorMatch ? errorMatch[1].trim() : 'Registration failed. Please try again.');
          } else {
            setRegisterError(error.response.data.error || error.message || 'Registration failed. Please try again.');
          }
        } else {
          setRegisterError(error.message || 'Registration failed. Please try again.');
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  const handleVerificationSuccess = (data) => {
    // When OTP verification is successful
    setRegistrationSuccess(true);
    setShowOtpVerification(false);
    
    // Redirect to login page instead of dashboard
    setTimeout(() => {
      navigate('/login');
    }, 2000);
  };
  
  if (showOtpVerification) {
    return (
      <RegisterContainer>
        <div className="container">
          <RegisterCard>
            <RegisterHeader>
              <RegisterTitle>Verify Your Email</RegisterTitle>
              <RegisterSubtitle>Confirmation Required</RegisterSubtitle>
            </RegisterHeader>
            <div>
              <RegisterSubtitle>We've sent a verification code to your email</RegisterSubtitle>
              <OtpVerification 
                email={formData.email} 
                onSuccess={handleVerificationSuccess} 
              />
            </div>
          </RegisterCard>
        </div>
      </RegisterContainer>
    );
  }
  
  if (registrationSuccess) {
    return (
      <RegisterContainer>
        <div className="container">
          <SuccessCard>
            <SuccessIcon>
              <FaCheckCircle />
            </SuccessIcon>
            <SuccessTitle>Registration Successful!</SuccessTitle>
            <SuccessMessage>
              Your account has been verified and created successfully.
            </SuccessMessage>
            <SuccessActions>
              <PrimaryButton onClick={() => navigate('/login')}>
                Go to Login
              </PrimaryButton>
            </SuccessActions>
          </SuccessCard>
        </div>
      </RegisterContainer>
    );
  }
  
  return (
    <RegisterContainer>
      <div className="container">
        <RegisterCard>
          <RegisterHeader>
            <RegisterTitle>Join the Cryptography Community</RegisterTitle>
            <RegisterSubtitle>Create your account to access resources and events</RegisterSubtitle>
          </RegisterHeader>
          
          {registerError && (
            <ErrorMessage>
              <FaExclamationCircle />
              <span>{registerError}</span>
            </ErrorMessage>
          )}
          
          <RegisterForm onSubmit={handleSubmit}>
            <FormRow>
              <FormGroup>
                <FormLabel>First Name</FormLabel>
                <InputWrapper>
                  <InputIcon>
                    <FaUser />
                  </InputIcon>
                  <FormInput
                    type="text"
                    name="firstName"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleChange}
                    error={formErrors.firstName}
                  />
                </InputWrapper>
                {formErrors.firstName && (
                  <ErrorText>{formErrors.firstName}</ErrorText>
                )}
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Last Name</FormLabel>
                <InputWrapper>
                  <InputIcon>
                    <FaUser />
                  </InputIcon>
                  <FormInput
                    type="text"
                    name="lastName"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleChange}
                    error={formErrors.lastName}
                  />
                </InputWrapper>
                {formErrors.lastName && (
                  <ErrorText>{formErrors.lastName}</ErrorText>
                )}
              </FormGroup>
            </FormRow>
            
            <FormGroup>
              <FormLabel>Email Address</FormLabel>
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
            
            <FormRow>
              <FormGroup>
                <FormLabel>Password</FormLabel>
                <InputWrapper>
                  <InputIcon>
                    <FaLock />
                  </InputIcon>
                  <FormInput
                    type="password"
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    error={formErrors.password}
                  />
                </InputWrapper>
                {formErrors.password && (
                  <ErrorText>{formErrors.password}</ErrorText>
                )}
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Confirm Password</FormLabel>
                <InputWrapper>
                  <InputIcon>
                    <FaLock />
                  </InputIcon>
                  <FormInput
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    error={formErrors.confirmPassword}
                  />
                </InputWrapper>
                {formErrors.confirmPassword && (
                  <ErrorText>{formErrors.confirmPassword}</ErrorText>
                )}
              </FormGroup>
            </FormRow>
            
            <SubmitButton disabled={isSubmitting}>
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </SubmitButton>
            
            <LoginText>
              Already have an account? <LoginLink to="/login">Log in</LoginLink>
            </LoginText>
          </RegisterForm>
        </RegisterCard>
      </div>
    </RegisterContainer>
  );
};

const RegisterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 160px);
  padding: 2rem 0;
  background: linear-gradient(135deg, #f5f7fa 0%, #e4e9f2 100%);
  
  @media (max-width: 768px) {
    padding: 1rem 0;
  }
`;

const RegisterCard = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  padding: 2.5rem;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  transition: transform 0.3s ease;
  
  &:hover {
    transform: translateY(-5px);
  }
  
  @media (max-width: 768px) {
    padding: 1.5rem;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
`;

const RegisterHeader = styled.div`
  text-align: center;
  margin-bottom: 2.5rem;
  
  @media (max-width: 768px) {
    margin-bottom: 1.8rem;
  }
`;

const RegisterTitle = styled.h1`
  font-size: 1.9rem;
  color: #2A3F62;
  margin-bottom: 0.8rem;
  font-weight: 700;
  
  @media (max-width: 768px) {
    font-size: 1.6rem;
  }
`;

const RegisterSubtitle = styled.p`
  color: #7C8DB5;
  font-size: 1.1rem;
  line-height: 1.5;
  
  @media (max-width: 768px) {
    font-size: 1rem;
  }
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

const RegisterForm = styled.form`
  margin-bottom: 1.5rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.2rem;
  
  @media (max-width: 576px) {
    grid-template-columns: 1fr;
  }
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
  
  @media (max-width: 768px) {
    padding: 0.8rem 1rem 0.8rem 3rem;
    font-size: 0.95rem;
  }
`;

const ErrorText = styled.p`
  color: #ED4C5C;
  font-size: 0.85rem;
  margin-top: 0.5rem;
  font-weight: 500;
`;

const PolicyText = styled.p`
  font-size: 0.9rem;
  color: #7C8DB5;
  margin-bottom: 1.8rem;
  line-height: 1.5;
`;

const PolicyLink = styled.a`
  color: #3772FF;
  font-weight: 600;
  text-decoration: none;
  
  &:hover {
    text-decoration: underline;
  }
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 1rem;
  background: linear-gradient(90deg, #3772FF 0%, #3D80FF 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.05rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(55, 114, 255, 0.3);
  margin-top: 0.5rem;
  letter-spacing: 0.5px;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(55, 114, 255, 0.4);
    background: linear-gradient(90deg, #3066E8 0%, #3772FF 100%);
  }
  
  &:active {
    transform: translateY(0);
  }
  
  &:disabled {
    background: #A0AABA;
    cursor: not-allowed;
    box-shadow: none;
  }
  
  @media (max-width: 768px) {
    padding: 0.9rem;
    font-size: 1rem;
  }
`;

const RegisterFooter = styled.div`
  text-align: center;
  color: #7C8DB5;
  font-size: 0.95rem;
  margin-top: 2rem;
`;

const LoginLink = styled(Link)`
  color: #3772FF;
  margin-left: 0.5rem;
  font-weight: 600;
  
  &:hover {
    text-decoration: underline;
  }
`;

const SuccessCard = styled.div`
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  padding: 3rem 2rem;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
`;

const SuccessIcon = styled.div`
  font-size: 4.5rem;
  color: #4CAF50;
  margin-bottom: 1.5rem;
`;

const SuccessTitle = styled.h2`
  font-size: 2rem;
  color: #2A3F62;
  margin-bottom: 1rem;
  font-weight: 700;
`;

const SuccessMessage = styled.p`
  color: #7C8DB5;
  margin-bottom: 2rem;
  font-size: 1.1rem;
  line-height: 1.6;
`;

const SuccessActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 1.2rem;
  
  @media (max-width: 576px) {
    flex-direction: column;
    align-items: center;
  }
`;

const PrimaryButton = styled.button`
  padding: 0.9rem 2.5rem;
  background: linear-gradient(90deg, #3772FF 0%, #3D80FF 100%);
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(55, 114, 255, 0.3);
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(55, 114, 255, 0.4);
  }
`;

const SecondaryButton = styled.button`
  padding: 0.9rem 2.5rem;
  background-color: transparent;
  color: #3772FF;
  border: 2px solid #3772FF;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: rgba(55, 114, 255, 0.1);
    transform: translateY(-2px);
  }
`;

const LoginText = styled.p`
  text-align: center;
  color: #7C8DB5;
  font-size: 0.95rem;
  margin-top: 1.5rem;
`;

export default Register;