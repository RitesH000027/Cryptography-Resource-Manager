import React, { useState } from 'react';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { FiCalendar, FiMapPin, FiTag, FiLink, FiUser, FiMail, FiX } from 'react-icons/fi';

const EventForm = ({ onSubmit, onCancel, initialData = {} }) => {
  const [eventData, setEventData] = useState({
    title: initialData.title || '',
    description: initialData.description || '',
    startDate: initialData.startDate ? new Date(initialData.startDate).toISOString().split('T')[0] : '',
    endDate: initialData.endDate ? new Date(initialData.endDate).toISOString().split('T')[0] : '',
    location: initialData.location || '',
    category: initialData.category || 'Technology',
    tags: initialData.tags || ['cryptography', 'security'],
    imageUrl: initialData.imageUrl || '',
    registrationUrl: initialData.registrationUrl || '',
    organizerName: initialData.organizer?.name || '',
    organizerEmail: initialData.organizer?.email || '',
  });
  
  const [tagInput, setTagInput] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    
    if (!eventData.title) newErrors.title = 'Title is required';
    if (!eventData.description) newErrors.description = 'Description is required';
    if (!eventData.startDate) newErrors.startDate = 'Start date is required';
    if (!eventData.location) newErrors.location = 'Location is required';
    if (!eventData.organizerName) newErrors.organizerName = 'Organizer name is required';
    
    if (eventData.startDate && eventData.endDate && new Date(eventData.startDate) > new Date(eventData.endDate)) {
      newErrors.endDate = 'End date must be after start date';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEventData({ ...eventData, [name]: value });
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors({ ...errors, [name]: null });
    }
  };

  const handleTagInputChange = (e) => {
    setTagInput(e.target.value);
  };

  const handleTagInputKeyDown = (e) => {
    if (e.key === 'Enter' && tagInput.trim()) {
      e.preventDefault();
      if (!eventData.tags.includes(tagInput.trim())) {
        setEventData({
          ...eventData,
          tags: [...eventData.tags, tagInput.trim()]
        });
      }
      setTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove) => {
    setEventData({
      ...eventData,
      tags: eventData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      await onSubmit({
        ...eventData,
        // Ensure dates are in ISO format
        startDate: new Date(eventData.startDate).toISOString(),
        endDate: eventData.endDate ? new Date(eventData.endDate).toISOString() : undefined,
      });
      
      // Form submission successful - onSubmit handler will close the form
    } catch (error) {
      console.error('Error submitting event form:', error);
      setErrors({ 
        ...errors, 
        submit: error.response?.data?.message || 'Failed to submit event. Please try again.' 
      });
      setIsSubmitting(false);
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit}>
      <FormGrid>
        <FormGroup fullWidth>
          <FormLabel htmlFor="title">Event Title</FormLabel>
          <FormInput
            id="title"
            name="title"
            value={eventData.title}
            onChange={handleChange}
            placeholder="Enter event title"
            error={errors.title}
          />
          {errors.title && <ErrorMessage>{errors.title}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup fullWidth>
          <FormLabel htmlFor="description">Description</FormLabel>
          <FormTextarea
            id="description"
            name="description"
            value={eventData.description}
            onChange={handleChange}
            placeholder="Enter event description"
            rows={4}
            error={errors.description}
          />
          {errors.description && <ErrorMessage>{errors.description}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup>
          <FormLabel htmlFor="startDate">
            <FiCalendar /> Start Date
          </FormLabel>
          <FormInput
            id="startDate"
            name="startDate"
            type="date"
            value={eventData.startDate}
            onChange={handleChange}
            error={errors.startDate}
          />
          {errors.startDate && <ErrorMessage>{errors.startDate}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup>
          <FormLabel htmlFor="endDate">
            <FiCalendar /> End Date
          </FormLabel>
          <FormInput
            id="endDate"
            name="endDate"
            type="date"
            value={eventData.endDate}
            onChange={handleChange}
            error={errors.endDate}
          />
          {errors.endDate && <ErrorMessage>{errors.endDate}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup fullWidth>
          <FormLabel htmlFor="location">
            <FiMapPin /> Location
          </FormLabel>
          <FormInput
            id="location"
            name="location"
            value={eventData.location}
            onChange={handleChange}
            placeholder="Enter event location (e.g., Online, University Campus, etc.)"
            error={errors.location}
          />
          {errors.location && <ErrorMessage>{errors.location}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup>
          <FormLabel htmlFor="category">Category</FormLabel>
          <FormSelect
            id="category"
            name="category"
            value={eventData.category}
            onChange={handleChange}
          >
            <option value="Technology">Technology</option>
            <option value="Security">Security</option>
            <option value="Cryptography">Cryptography</option>
            <option value="Workshop">Workshop</option>
            <option value="Hackathon">Hackathon</option>
            <option value="Conference">Conference</option>
            <option value="Seminar">Seminar</option>
            <option value="Other">Other</option>
          </FormSelect>
        </FormGroup>
        
        <FormGroup fullWidth>
          <FormLabel>
            <FiTag /> Tags
          </FormLabel>
          <TagsContainer>
            {eventData.tags.map(tag => (
              <Tag key={tag}>
                {tag}
                <RemoveTagButton type="button" onClick={() => handleRemoveTag(tag)}>
                  <FiX />
                </RemoveTagButton>
              </Tag>
            ))}
            <TagInput
              value={tagInput}
              onChange={handleTagInputChange}
              onKeyDown={handleTagInputKeyDown}
              placeholder="Add tag and press Enter"
            />
          </TagsContainer>
        </FormGroup>
        
        <FormGroup fullWidth>
          <FormLabel htmlFor="imageUrl">Image URL</FormLabel>
          <FormInput
            id="imageUrl"
            name="imageUrl"
            value={eventData.imageUrl}
            onChange={handleChange}
            placeholder="Enter URL for event image (optional)"
          />
        </FormGroup>
        
        <FormGroup fullWidth>
          <FormLabel htmlFor="registrationUrl">
            <FiLink /> Registration URL
          </FormLabel>
          <FormInput
            id="registrationUrl"
            name="registrationUrl"
            value={eventData.registrationUrl}
            onChange={handleChange}
            placeholder="Enter registration link (optional)"
          />
        </FormGroup>
        
        <FormGroup>
          <FormLabel htmlFor="organizerName">
            <FiUser /> Organizer Name
          </FormLabel>
          <FormInput
            id="organizerName"
            name="organizerName"
            value={eventData.organizerName}
            onChange={handleChange}
            placeholder="Event organizer"
            error={errors.organizerName}
          />
          {errors.organizerName && <ErrorMessage>{errors.organizerName}</ErrorMessage>}
        </FormGroup>
        
        <FormGroup>
          <FormLabel htmlFor="organizerEmail">
            <FiMail /> Organizer Email
          </FormLabel>
          <FormInput
            id="organizerEmail"
            name="organizerEmail"
            type="email"
            value={eventData.organizerEmail}
            onChange={handleChange}
            placeholder="Contact email (optional)"
          />
        </FormGroup>
      </FormGrid>
      
      {errors.submit && <SubmitError>{errors.submit}</SubmitError>}
      
      <ButtonGroup>
        <CancelButton 
          type="button" 
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </CancelButton>
        <SubmitButton 
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {isSubmitting ? 'Submitting...' : 'Submit Event'}
        </SubmitButton>
      </ButtonGroup>
    </FormContainer>
  );
};

// Styled Components
const FormContainer = styled.form`
  padding: 1.5rem;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
`;

const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  grid-column: ${props => props.fullWidth ? '1 / span 2' : 'auto'};
`;

const FormLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #374151;
  
  svg {
    color: #6b7280;
  }
`;

const FormInput = styled.input`
  padding: 0.625rem;
  border: 1px solid ${props => props.error ? '#ef4444' : '#d1d5db'};
  border-radius: 0.375rem;
  background-color: white;
  color: #111827;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.error ? '#ef4444' : '#4f46e5'};
    box-shadow: 0 0 0 2px ${props => props.error ? 'rgba(239, 68, 68, 0.2)' : 'rgba(79, 70, 229, 0.2)'};
  }
`;

const FormTextarea = styled.textarea`
  padding: 0.625rem;
  border: 1px solid ${props => props.error ? '#ef4444' : '#d1d5db'};
  border-radius: 0.375rem;
  background-color: white;
  color: #111827;
  font-size: 0.875rem;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${props => props.error ? '#ef4444' : '#4f46e5'};
    box-shadow: 0 0 0 2px ${props => props.error ? 'rgba(239, 68, 68, 0.2)' : 'rgba(79, 70, 229, 0.2)'};
  }
`;

const FormSelect = styled.select`
  padding: 0.625rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: white;
  color: #111827;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
  }
`;

const TagsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  min-height: 2.5rem;
`;

const Tag = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.25rem 0.5rem;
  background-color: #e0e7ff;
  color: #4f46e5;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
`;

const RemoveTagButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  cursor: pointer;
  color: #4f46e5;
  padding: 0.125rem;
  
  &:hover {
    color: #4338ca;
  }
`;

const TagInput = styled.input`
  flex: 1;
  min-width: 100px;
  border: none;
  font-size: 0.875rem;
  
  &:focus {
    outline: none;
  }
`;

const ErrorMessage = styled.span`
  color: #ef4444;
  font-size: 0.75rem;
`;

const SubmitError = styled.div`
  margin-top: 1rem;
  padding: 0.75rem;
  background-color: #fee2e2;
  color: #b91c1c;
  border-radius: 0.375rem;
  font-size: 0.875rem;
`;

const ButtonGroup = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-top: 2rem;
`;

const CancelButton = styled.button`
  padding: 0.625rem 1.25rem;
  background-color: #f3f4f6;
  color: #111827;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover:not(:disabled) {
    background-color: #e5e7eb;
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const SubmitButton = styled(motion.button)`
  padding: 0.625rem 1.25rem;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover:not(:disabled) {
    background-color: #4338ca;
  }
  
  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

export default EventForm;
