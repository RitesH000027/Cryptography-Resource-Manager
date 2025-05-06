import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { FaUser, FaEnvelope, FaExclamationCircle, FaCheckCircle, FaSignOutAlt } from 'react-icons/fa';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import { useNavigate } from 'react-router-dom';

const API_URL = `${process.env.REACT_APP_BASE_URL}/api`;

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [profileErrors, setProfileErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState('');
  const [updateError, setUpdateError] = useState('');
  
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        if (user) {
          setProfileData({
            firstName: user.firstName || '',
            lastName: user.lastName || '',
            email: user.email || ''
          });
        } else if (authService.isAuthenticated()) {
          const profileData = await authService.getProfile();
          setProfileData({
            firstName: profileData.firstName || '',
            lastName: profileData.lastName || '',
            email: profileData.email || ''
          });
        }
      } catch (error) {
        console.error('Failed to fetch profile:', error);
        setUpdateError('Failed to load profile data');
      }
    };
    fetchProfile();
  }, [user]);
  
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setUpdateSuccess('');
    setUpdateError('');
  };
  
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData({
      ...profileData,
      [name]: value
    });
    if (profileErrors[name]) {
      setProfileErrors({
        ...profileErrors,
        [name]: ''
      });
    }
  };
  
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({
      ...passwordData,
      [name]: value
    });
    
    // Clear error when user types
    if (passwordErrors[name]) {
      setPasswordErrors({
        ...passwordErrors,
        [name]: ''
      });
    }
  };
  
  const validateProfileForm = () => {
    const errors = {};
    const { firstName, lastName, email } = profileData;
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
    setProfileErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const validatePasswordForm = () => {
    const errors = {};
    const { currentPassword, newPassword, confirmPassword } = passwordData;
    
    if (!currentPassword) {
      errors.currentPassword = 'Current password is required';
    }
    
    if (!newPassword) {
      errors.newPassword = 'New password is required';
    } else if (newPassword.length < 6) {
      errors.newPassword = 'New password must be at least 6 characters';
    }
    
    if (newPassword !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setPasswordErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (validateProfileForm()) {
      setIsSubmitting(true);
      setUpdateSuccess('');
      setUpdateError('');
      try {
        const response = await authService.updateProfile({
          firstName: profileData.firstName.trim(),
          lastName: profileData.lastName.trim(),
          email: profileData.email
        });
        
        // Update local user data with the response
        if (response && response.user) {
          setProfileData({
            firstName: response.user.firstName || '',
            lastName: response.user.lastName || '',
            email: response.user.email || ''
          });
        }
        
        setUpdateSuccess('Profile updated successfully');
      } catch (error) {
        const errorMessage = error.message || error.response?.data?.message || 'Failed to update profile';
        setUpdateError(errorMessage);
        console.error('Profile update error:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    
    if (validatePasswordForm()) {
      setIsSubmitting(true);
      setUpdateSuccess('');
      setUpdateError('');
      
      try {
        const token = localStorage.getItem('token');
        
        await axios.put(
          `${API_URL}/users/password`,
          {
            currentPassword: passwordData.currentPassword,
            newPassword: passwordData.newPassword
          },
          {
            headers: {
              'x-auth-token': token
            }
          }
        );
        
        setUpdateSuccess('Password updated successfully');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } catch (error) {
        setUpdateError(error.response?.data?.message || 'Failed to update password');
      } finally {
        setIsSubmitting(false);
      }
    }
  };
  
  const handleLogout = () => {
    logout();
    navigate('/');
  };
  
  if (!user) {
    return (
      <ProfileContainer>
        <div className="container">
          <ProfileCard>
            <NotLoggedInMessage>
              Please log in to view your profile.
            </NotLoggedInMessage>
          </ProfileCard>
        </div>
      </ProfileContainer>
    );
  }
  
  return (
    <ProfileContainer>
      <div className="container">
        <ProfileCard>
          <ProfileHeader>
            <ProfileTitle>My Account</ProfileTitle>
            <ProfileSubtitle>Manage your account information</ProfileSubtitle>
          </ProfileHeader>
          
          <TabsContainer>
            <TabButton 
              $active={activeTab === 'profile'} 
              onClick={() => handleTabChange('profile')}
            >
              Profile Information
            </TabButton>
            <TabButton 
              $active={activeTab === 'password'} 
              onClick={() => handleTabChange('password')}
            >
              Change Password
            </TabButton>
          </TabsContainer>
          
          {updateSuccess && (
            <SuccessMessage>
              <FaCheckCircle />
              <span>{updateSuccess}</span>
            </SuccessMessage>
          )}
          
          {updateError && (
            <ErrorMessage>
              <FaExclamationCircle />
              <span>{updateError}</span>
            </ErrorMessage>
          )}
          
          {activeTab === 'profile' && (
            <ProfileForm onSubmit={handleProfileSubmit}>
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
                      placeholder="Enter your first name"
                      value={profileData.firstName}
                      onChange={handleProfileChange}
                      error={profileErrors.firstName}
                    />
                  </InputWrapper>
                  {profileErrors.name && (
                    <ErrorText>{profileErrors.name}</ErrorText>
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
                      placeholder="Enter your last name"
                      value={profileData.lastName}
                      onChange={handleProfileChange}
                      error={profileErrors.lastName}
                    />
                  </InputWrapper>
                  {profileErrors.surname && (
                    <ErrorText>{profileErrors.surname}</ErrorText>
                  )}
                </FormGroup>
              </FormRow>
              
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
                    value={profileData.email}
                    onChange={handleProfileChange}
                    error={profileErrors.email}
                  />
                </InputWrapper>
                {profileErrors.email && (
                  <ErrorText>{profileErrors.email}</ErrorText>
                )}
              </FormGroup>
              
              <SubmitButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Updating Profile...' : 'Update Profile'}
              </SubmitButton>
            </ProfileForm>
          )}

          {activeTab === 'password' && (
            <PasswordForm onSubmit={handlePasswordSubmit}>
              <FormGroup>
                <FormLabel>Current Password</FormLabel>
                <InputWrapper>
                  <InputIcon>
                    <FaUser />
                  </InputIcon>
                  <FormInput
                    type="password"
                    name="currentPassword"
                    placeholder="Enter your current password"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    error={passwordErrors.currentPassword}
                  />
                </InputWrapper>
                {passwordErrors.currentPassword && (
                  <ErrorText>{passwordErrors.currentPassword}</ErrorText>
                )}
              </FormGroup>
              
              <FormGroup>
                <FormLabel>New Password</FormLabel>
                <InputWrapper>
                  <InputIcon>
                    <FaUser />
                  </InputIcon>
                  <FormInput
                    type="password"
                    name="newPassword"
                    placeholder="Enter your new password"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    error={passwordErrors.newPassword}
                  />
                </InputWrapper>
                {passwordErrors.newPassword && (
                  <ErrorText>{passwordErrors.newPassword}</ErrorText>
                )}
              </FormGroup>
              
              <FormGroup>
                <FormLabel>Confirm New Password</FormLabel>
                <InputWrapper>
                  <InputIcon>
                    <FaUser />
                  </InputIcon>
                  <FormInput
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm your new password"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    error={passwordErrors.confirmPassword}
                  />
                </InputWrapper>
                {passwordErrors.confirmPassword && (
                  <ErrorText>{passwordErrors.confirmPassword}</ErrorText>
                )}
              </FormGroup>
              
              <SubmitButton type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Updating Password...' : 'Update Password'}
              </SubmitButton>
            </PasswordForm>
          )}
          
          <LogoutSection>
            <LogoutButton onClick={handleLogout}>
              <FaSignOutAlt /> Logout
            </LogoutButton>
          </LogoutSection>
        </ProfileCard>
      </div>
    </ProfileContainer>
  );
};

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: calc(100vh - 160px);
  padding: 2rem 0;
`;

const ProfileCard = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  padding: 2rem;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
`;

const ProfileHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const ProfileTitle = styled.h1`
  font-size: 2rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.5rem;
`;

const ProfileSubtitle = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid ${({ theme }) => theme.colors.gray};
  margin-bottom: 2rem;
`;

const TabButton = styled.button`
  padding: 1rem 1.5rem;
  background-color: transparent;
  border: none;
  border-bottom: 3px solid ${({ $active, theme }) => 
    $active ? theme.colors.primary : 'transparent'};
  color: ${({ $active, theme }) => 
    $active ? theme.colors.primary : theme.colors.textLight};
  font-weight: ${({ $active }) => $active ? '600' : '400'};
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const SuccessMessage = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => `${theme.colors.success}20`};
  color: ${({ theme }) => theme.colors.success};
  padding: 1rem;
  border-radius: 5px;
  margin-bottom: 1.5rem;
  
  svg {
    margin-right: 0.5rem;
  }
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

const ProfileForm = styled.form`
  margin-bottom: 1.5rem;
`;

const PasswordForm = styled.form`
  margin-bottom: 1.5rem;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    grid-template-columns: 1fr;
  }
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

const NotLoggedInMessage = styled.p`
  text-align: center;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.textLight};
  padding: 2rem 0;
`;

const LogoutSection = styled.div`
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid ${({ theme }) => theme.colors.gray};
  display: flex;
  justify-content: center;
`;

const LogoutButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme }) => theme.colors.error};
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.errorDark || '#c0392b'};
  }
  
  svg {
    font-size: 1.2rem;
  }
`;

export default Profile;