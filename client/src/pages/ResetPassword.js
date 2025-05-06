import React, { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaLock, FaExclamationCircle, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetError, setResetError] = useState('');
  const [resetSuccess, setResetSuccess] = useState(false);
  
  const { token } = useParams();
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
    const { password, confirmPassword } = formData;
    
    if (!password) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
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
      setResetError('');
      
      try {
        await axios.post(
          `http://0.0.0.0:5001/api/auth/reset-password/${token}`,
          { password: formData.password }
        );
        
        setResetSuccess(true);
      } catch (error) {
        setResetError(error.response?.data?.message || 'Password reset failed. The link may be invalid or expired.');
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  if (resetSuccess) {
    return (
      <ResetPasswordContainer>
        <div className="container">
          <SuccessCard>
            <SuccessIcon>
              <FaCheckCircle />
            </SuccessIcon>
            <SuccessTitle>Password Reset Successful!</SuccessTitle>
            <SuccessMessage>
              Your password has been successfully reset. You can now log in with your new password.
            </SuccessMessage>
            <SuccessActions>
              <PrimaryButton onClick={() => navigate('/login')}>
                Go to Login
              </PrimaryButton>
            </SuccessActions>
          </SuccessCard>
        </div>
      </ResetPasswordContainer>
    );
  }
  
  return (
    <ResetPasswordContainer>
      <div className="container">
        <ResetPasswordCard>
          <ResetPasswordHeader>
            <ResetPasswordTitle>Reset Password</ResetPasswordTitle>
            <ResetPasswordSubtitle>
              Enter your new password below
            </ResetPasswordSubtitle>
          </ResetPasswordHeader>
          
          {resetError && (
            <ErrorMessage>
              <FaExclamationCircle />
              <span>{resetError}</span>
            </ErrorMessage>
          )}
          
          <ResetPasswordForm onSubmit={handleSubmit}>
            <FormGroup>
              <FormLabel>New Password</FormLabel>
              <InputWrapper>
                <InputIcon>
                  <FaLock />
                </InputIcon>
                <FormInput
                  type="password"
                  name="password"
                  placeholder="Enter new password"
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
              <FormLabel>Confirm New Password</FormLabel>
              <InputWrapper>
                <InputIcon>
                  <FaLock />
                </InputIcon>
                <FormInput
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm new password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  error={formErrors.confirmPassword}
                />
              </InputWrapper>
              {formErrors.confirmPassword && (
                <ErrorText>{formErrors.confirmPassword}</ErrorText>
              )}
            </FormGroup>
            
            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Resetting Password...' : 'Reset Password'}
            </SubmitButton>
          </ResetPasswordForm>
          
          <ResetPasswordFooter>
            <span>Remember your password?</span>
            <LoginLink to="/login">Sign In</LoginLink>
          </ResetPasswordFooter>
        </ResetPasswordCard>
      </div>
    </ResetPasswordContainer>
  );
};

const ResetPasswordContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 160px);
  padding: 2rem 0;
`;

const ResetPasswordCard = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  padding: 2rem;
  width: 100%;
  max-width: 500px;
  margin: 0 auto;
`;

const ResetPasswordHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const ResetPasswordTitle = styled.h1`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.5rem;
`;

const ResetPasswordSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
`;

const ErrorMessage = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => `${theme.colors.error}20`};
  color: ${({ theme }) => theme.colors.error};
  padding: 1rem;
  border-radius: 5px;
  margin-bottom: 1.5rem;
  
  svg {
    margin-right: 0.5rem;
  }
`;

const ResetPasswordForm = styled.form`
  margin-bottom: 1.5rem;
`;

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const FormLabel = styled.label`
  display: block;
  margin-bottom: 0.5rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.text};
`;

const InputWrapper = styled.div`
  position: relative;
`;

const InputIcon = styled.div`
  position: absolute;
  top: 50%;
  left: 1rem;
  transform: translateY(-50%);
  color: ${({ theme }) => theme.colors.textLight};
`;

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem 0.75rem 2.5rem;
  border: 1px solid ${({ error, theme }) => error ? theme.colors.error : theme.colors.gray};
  border-radius: 5px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;
  
  &:focus {
    border-color: ${({ error, theme }) => error ? theme.colors.error : theme.colors.primary};
  }
`;

const ErrorText = styled.p`
  color: ${({ theme }) => theme.colors.error};
  font-size: 0.875rem;
  margin-top: 0.5rem;
`;

const SubmitButton = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
  
  &:disabled {
    background-color: ${({ theme }) => theme.colors.gray};
    cursor: not-allowed;
  }
`;

const ResetPasswordFooter = styled.div`
  text-align: center;
  color: ${({ theme }) => theme.colors.textLight};
`;

const LoginLink = styled(Link)`
  color: ${({ theme }) => theme.colors.primary};
  margin-left: 0.5rem;
  font-weight: 500;
  
  &:hover {
    text-decoration: underline;
  }
`;

const SuccessCard = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  padding: 3rem 2rem;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
`;

const SuccessIcon = styled.div`
  font-size: 4rem;
  color: ${({ theme }) => theme.colors.success};
  margin-bottom: 1.5rem;
`;

const SuccessTitle = styled.h2`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;
`;

const SuccessMessage = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 2rem;
  font-size: 1.1rem;
  line-height: 1.6;
`;

const SuccessActions = styled.div`
  display: flex;
  justify-content: center;
  gap: 1rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
    align-items: center;
  }
`;

const PrimaryButton = styled.button`
  padding: 0.8rem 2rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 5px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
    transform: translateY(-3px);
  }
`;

export default ResetPassword;