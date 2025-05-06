import React, { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import styled from 'styled-components';
import axios from 'axios';
import { FaArrowLeft, FaExclamationCircle, FaPlus, FaTimes } from 'react-icons/fa';
import { useAuth } from '../context/AuthContext';

const EditResource = () => {
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
  const [isDeleting, setIsDeleting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');
  
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchResource = async () => {
      if (!user || user.role !== 'admin') {
        navigate('/resources');
        return;
      }
      
      try {
        setLoading(true);
        const response = await axios.get(`http://0.0.0.0:5001/api/resources/${id}`, {
          headers: {
            'x-auth-token': localStorage.getItem('token')
          }
        });
        
        setFormData({
          title: response.data.title || '',
          description: response.data.description || '',
          type: response.data.type || 'note',
          content: response.data.content || '',
          url: response.data.url || '',
          author: response.data.author || '',
          tags: response.data.tags || []
        });
        
        setLoading(false);
      } catch (err) {
        setLoadError('Failed to load resource');
        setLoading(false);
        console.error(err);
      }
    };
    
    fetchResource();
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
        
        await axios.put(
          `http://0.0.0.0:5001/api/resources/${id}`,
          formData,
          {
            headers: {
              'x-auth-token': token
            }
          }
        );
        
        navigate(`/resources/${id}`);
      } catch (error) {
        setSubmitError(error.response?.data?.message || 'Failed to update resource');
        setIsSubmitting(false);
      }
    }
  };
  
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this resource? This action cannot be undone.')) {
      setIsDeleting(true);
      
      try {
        const token = localStorage.getItem('token');
        
        await axios.delete(
          `http://0.0.0.0:5001/api/resources/${id}`,
          {
            headers: {
              'x-auth-token': token
            }
          }
        );
        
        navigate('/resources');
      } catch (error) {
        setSubmitError(error.response?.data?.message || 'Failed to delete resource');
        setIsDeleting(false);
      }
    }
  };
  
  if (loading) {
    return (
      <EditResourceContainer>
        <div className="container">
          <LoadingMessage>Loading resource...</LoadingMessage>
        </div>
      </EditResourceContainer>
    );
  }
  
  if (loadError) {
    return (
      <EditResourceContainer>
        <div className="container">
          <ErrorMessage>
            <FaExclamationCircle />
            <span>{loadError}</span>
          </ErrorMessage>
          <BackLink to="/resources">
            <FaArrowLeft /> Back to Resources
          </BackLink>
        </div>
      </EditResourceContainer>
    );
  }
  
  return (
    <EditResourceContainer>
      <div className="container">
        <BackLink to={`/resources/${id}`}>
          <FaArrowLeft /> Back to Resource
        </BackLink>
        
        <PageHeader>
          <PageTitle>Edit Resource</PageTitle>
          <PageDescription>
            Update the details of this cryptographic resource
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
          
          <FormActions>
            <SubmitButton type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Updating Resource...' : 'Update Resource'}
            </SubmitButton>
            
            <DeleteButton 
              type="button" 
              onClick={handleDelete} 
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : 'Delete Resource'}
            </DeleteButton>
          </FormActions>
        </ResourceForm>
      </div>
    </EditResourceContainer>
  );
};

const EditResourceContainer = styled.div`
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

const FormActions = styled.div`
  display: flex;
  gap: 1rem;
  
  @media (max-width: ${({ theme }) => theme.breakpoints.sm}) {
    flex-direction: column;
  }
`;

const SubmitButton = styled.button`
  flex: 1;
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

const DeleteButton = styled.button`
  flex: 1;
  padding: 0.75rem;
  background-color: transparent;
  color: ${({ theme }) => theme.colors.error};
  border: 2px solid ${({ theme }) => theme.colors.error};
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${({ theme }) => `${theme.colors.error}10`};
  }
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default EditResource;