import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { FaArrowLeft, FaExclamationCircle } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const EditUser = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'user'
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchUser = async () => {
      if (!user || user.role !== 'admin') {
        navigate('/');
        return;
      }
      
      try {
        setLoading(true);
        const response = await axios.get(`http://0.0.0.0:5001/api/admin/users/${id}`, {
          headers: {
            'x-auth-token': localStorage.getItem('token')
          }
        });
        
        setFormData({
          name: response.data.name || '',
          email: response.data.email || '',
          role: response.data.role || 'user'
        });
        
        setLoading(false);
      } catch (err) {
        setLoadError('Failed to load user');
        setLoading(false);
        console.error(err);
      }
    };
    
    fetchUser();
  }, [id, user, navigate]);
  
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
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Email is invalid';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      setSubmitError('');
      
      try {
        const token = localStorage.getItem('token');
        
        await axios.put(
          `http://0.0.0.0:5001/api/admin/users/${id}`,
          formData,
          {
            headers: {
              'x-auth-token': token
            }
          }
        );
        
        navigate('/admin/users');
      } catch (error) {
        setSubmitError(error.response?.data?.message || 'Failed to update user');
        setIsSubmitting(false);
      }
    }
  };
  
  if (loading) {
    return (
      <EditUserContainer>
        <div className="container">
          <LoadingMessage>Loading user...</LoadingMessage>
        </div>
      </EditUserContainer>
    );
  }
  
  if (loadError) {
    return (
      <EditUserContainer>
        <div className="container">
          <ErrorMessage>
            <FaExclamationCircle />
            <span>{loadError}</span>
          </ErrorMessage>
          <BackLink to="/admin/users">
            <FaArrowLeft /> Back to Users
          </BackLink>
        </div>
      </EditUserContainer>
    );
  }
  
  return (
    <EditUserContainer>
      <div className="container">
        <BackLink to="/admin/users">
          <FaArrowLeft /> Back to Users
        </BackLink>
        
        <PageHeader>
          <PageTitle>Edit User</PageTitle>
          <PageDescription>
            Update user information and role
          </PageDescription>
        </PageHeader>
        
        {submitError && (
          <ErrorMessage>
            <FaExclamationCircle />
            <span>{submitError}</span>
          </ErrorMessage>
        )}
        
        <UserForm onSubmit={handleSubmit}>
          <FormGroup>
            <FormLabel>Name *</FormLabel>
            <FormInput
              type="text"
              name="name"
              placeholder="Enter user name"
              value={formData.name}
              onChange={handleChange}
              error={formErrors.name}
            />
            {formErrors.name && (
              <ErrorText>{formErrors.name}</ErrorText>
            )}
          </FormGroup>
          
          <FormGroup>
            <FormLabel>Email *</FormLabel>
            <FormInput
              type="email"
              name="email"
              placeholder="Enter user email"
              value={formData.email}
              onChange={handleChange}
              error={formErrors.email}
            />
            {formErrors.email && (
              <ErrorText>{formErrors.email}</ErrorText>
            )}
          </FormGroup>
          
          <FormGroup>
            <FormLabel>Role</FormLabel>
            <FormSelect
              name="role"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </FormSelect>
            <HelpText>Admin users have full access to manage resources and other users.</HelpText>
          </FormGroup>
          
          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Updating User...' : 'Update User'}
          </SubmitButton>
        </UserForm>
      </div>
    </EditUserContainer>
  );
};

const EditUserContainer = styled.div`
  padding: 2rem 0;
`;

const LoadingMessage = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.textLight};
  padding: 3rem 0;
`;

const BackLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 2rem;
  font-weight: 500;
  
  svg {
    margin-right: 0.5rem;
  }
  
  &:hover {
    text-decoration: underline;
  }
`;

const PageHeader = styled.div`
  text-align: center;
  margin-bottom: 2rem;
`;

const PageTitle = styled.h1`
  font-size: 2.5rem;
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 0.5rem;
`;

const PageDescription = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 1.1rem;
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

const UserForm = styled.form`
  background-color: white;
  border-radius: 10px;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
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

const FormInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${({ error, theme }) => error ? theme.colors.error : theme.colors.gray};
  border-radius: 5px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;
  
  &:focus {
    border-color: ${({ error, theme }) => error ? theme.colors.error : theme.colors.primary};
  }
`;

const FormSelect = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${({ theme }) => theme.colors.gray};
  border-radius: 5px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;
  
  &:focus {
    border-color: ${({ theme }) => theme.colors.primary};
  }
`;

const HelpText = styled.p`
  color: ${({ theme }) => theme.colors.textLight};
  font-size: 0.875rem;
  margin-top: 0.5rem;
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

export default EditUser;