import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { FaArrowLeft, FaExclamationCircle, FaPlus, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const AddResource = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'note',
    content: '',
    url: '',
    author: '',
    tags: []
  });
  const [currentTag, setCurrentTag] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Redirect if not admin
  if (!user || user.role !== 'admin') {
    return navigate('/resources');
  }
  
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
  
  const handleTagChange = (e) => {
    setCurrentTag(e.target.value);
  };
  
  const addTag = () => {
    const trimmedTag = currentTag.trim();
    if (trimmedTag && !formData.tags.includes(trimmedTag)) {
      setFormData({
        ...formData,
        tags: [...formData.tags, trimmedTag]
      });
      setCurrentTag('');
    }
  };
  
  const handleTagKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };
  
  const removeTag = (tagToRemove) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.title.trim()) {
      errors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      errors.description = 'Description is required';
    }
    
    if (formData.type === 'video' && !formData.url) {
      errors.url = 'URL is required for video resources';
    }
    
    if (formData.url && !isValidUrl(formData.url)) {
      errors.url = 'Please enter a valid URL';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch (e) {
      return false;
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      setSubmitError('');
      
      try {
        const token = localStorage.getItem('token');
        
        const response = await axios.post(
          'http://0.0.0.0:5001/api/resources',
          formData,
          {
            headers: {
              'x-auth-token': token
            }
          }
        );
        
        navigate(`/resources/${response.data._id}`);
      } catch (error) {
        setSubmitError(error.response?.data?.message || 'Failed to add resource');
        setIsSubmitting(false);
      }
    }
  };
  
  return (
    <AddResourceContainer>
      <div className="container">
        <BackLink to="/resources">
          <FaArrowLeft /> Back to Resources
        </BackLink>
        
        <PageHeader>
          <PageTitle>Add New Resource</PageTitle>
          <PageDescription>
            Create a new cryptographic resource to share with the community
          </PageDescription>
        </PageHeader>
        
        {submitError && (
          <ErrorMessage>
            <FaExclamationCircle />
            <span>{submitError}</span>
          </ErrorMessage>
        )}
        
        <ResourceForm onSubmit={handleSubmit}>
          <FormGroup>
            <FormLabel>Title *</FormLabel>
            <FormInput
              type="text"
              name="title"
              placeholder="Enter resource title"
              value={formData.title}
              onChange={handleChange}
              error={formErrors.title}
            />
            {formErrors.title && (
              <ErrorText>{formErrors.title}</ErrorText>
            )}
          </FormGroup>
          
          <FormGroup>
            <FormLabel>Resource Type *</FormLabel>
            <FormSelect
              name="type"
              value={formData.type}
              onChange={handleChange}
            >
              <option value="note">Note</option>
              <option value="video">Video</option>
              <option value="book">Book</option>
              <option value="citation">Citation</option>
            </FormSelect>
          </FormGroup>
          
          <FormGroup>
            <FormLabel>Description *</FormLabel>
            <FormTextarea
              name="description"
              placeholder="Enter resource description"
              value={formData.description}
              onChange={handleChange}
              error={formErrors.description}
              rows={3}
            />
            {formErrors.description && (
              <ErrorText>{formErrors.description}</ErrorText>
            )}
          </FormGroup>
          
          <FormGroup>
            <FormLabel>Content</FormLabel>
            <FormTextarea
              name="content"
              placeholder="Enter resource content or notes"
              value={formData.content}
              onChange={handleChange}
              rows={6}
            />
            <HelpText>For notes, books, or citations, enter the main content here.</HelpText>
          </FormGroup>
          
          <FormGroup>
            <FormLabel>URL</FormLabel>
            <FormInput
              type="text"
              name="url"
              placeholder="Enter resource URL"
              value={formData.url}
              onChange={handleChange}
              error={formErrors.url}
            />
            {formErrors.url && (
              <ErrorText>{formErrors.url}</ErrorText>
            )}
            <HelpText>For videos or external resources, provide the URL.</HelpText>
          </FormGroup>
          
          <FormGroup>
            <FormLabel>Author</FormLabel>
            <FormInput
              type="text"
              name="author"
              placeholder="Enter author name"
              value={formData.author}
              onChange={handleChange}
            />
          </FormGroup>
          
          <FormGroup>
            <FormLabel>Tags</FormLabel>
            <TagInputContainer>
              <TagInput
                type="text"
                placeholder="Add tags and press Enter"
                value={currentTag}
                onChange={handleTagChange}
                onKeyDown={handleTagKeyDown}
              />
              <AddTagButton type="button" onClick={addTag}>
                <FaPlus />
              </AddTagButton>
            </TagInputContainer>
            <HelpText>Add relevant tags to help users find this resource.</HelpText>
            
            {formData.tags.length > 0 && (
              <TagsContainer>
                {formData.tags.map((tag, index) => (
                  <TagItem key={index}>
                    <span>{tag}</span>
                    <TagRemoveButton onClick={() => removeTag(tag)}>
                      <FaTimes />
                    </TagRemoveButton>
                  </TagItem>
                ))}
              </TagsContainer>
            )}
          </FormGroup>
          
          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Adding Resource...' : 'Add Resource'}
          </SubmitButton>
        </ResourceForm>
      </div>
    </AddResourceContainer>
  );
};

const AddResourceContainer = styled.div`
  padding: 2rem 0;
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

const ResourceForm = styled.form`
  background-color: white;
  border-radius: 10px;
  box-shadow: ${({ theme }) => theme.shadows.medium};
  padding: 2rem;
  max-width: 800px;
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

const FormTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid ${({ error, theme }) => error ? theme.colors.error : theme.colors.gray};
  border-radius: 5px;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.3s ease;
  resize: vertical;
  
  &:focus {
    border-color: ${({ error, theme }) => error ? theme.colors.error : theme.colors.primary};
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

const TagInputContainer = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const TagInput = styled.input`
  flex: 1;
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

const AddTagButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2.5rem;
  height: 2.5rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-top: 1rem;
`;

const TagItem = styled.div`
  display: flex;
  align-items: center;
  background-color: ${({ theme }) => `${theme.colors.primary}20`};
  color: ${({ theme }) => theme.colors.primary};
  padding: 0.5rem 0.8rem;
  border-radius: 20px;
  font-size: 0.9rem;
`;

const TagRemoveButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.primary};
  border: none;
  margin-left: 0.5rem;
  cursor: pointer;
  
  &:hover {
    color: ${({ theme }) => theme.colors.error};
  }
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

export default AddResource;