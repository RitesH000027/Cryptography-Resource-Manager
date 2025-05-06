import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { 
  FaSave, 
  FaTimes, 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaTag,
  FaLink,
  FaUserTie,
  FaImage,
  FaInfoCircle
} from 'react-icons/fa';
import { submitEvent, getCryptoEventCategories } from '../../services/eventService';

const CryptoEventForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startDate: '',
    endDate: '',
    location: '',
    imageUrl: '',
    category: 'conference',
    organizerName: '',
    registrationUrl: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const categories = getCryptoEventCategories();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    // Required fields
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.startDate) newErrors.startDate = 'Start date is required';
    if (!formData.location.trim()) newErrors.location = 'Location is required';
    if (!formData.category) newErrors.category = 'Category is required';
    
    // Validate that it's cryptography related
    const cryptoTerms = ['crypt', 'cipher', 'encryption', 'decryption', 'security', 'blockchain'];
    const containsCryptoTerm = cryptoTerms.some(term => 
      formData.title.toLowerCase().includes(term) || 
      formData.description.toLowerCase().includes(term)
    );
    
    if (!containsCryptoTerm) {
      newErrors.description = 'Event must be related to cryptography or cybersecurity';
    }
    
    // Validate dates
    if (formData.startDate && formData.endDate) {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      
      if (endDate < startDate) {
        newErrors.endDate = 'End date cannot be before start date';
      }
    }
    
    // Validate URLs
    if (formData.imageUrl && !isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = 'Please enter a valid URL';
    }
    
    if (formData.registrationUrl && !isValidUrl(formData.registrationUrl)) {
      newErrors.registrationUrl = 'Please enter a valid URL';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    setSubmitError('');
    
    try {
      await submitEvent(formData);
      // Redirect to events page after successful submission
      navigate('/events');
    } catch (error) {
      console.error('Error submitting event:', error);
      setSubmitError(error.response?.data?.message || 'Failed to submit event. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate('/events');
  };

  return (
    <FormContainer>
      <FormHeader>
        <FormTitle>Submit Cryptography Event</FormTitle>
        <FormDescription>
          Share information about a cryptography, cryptology, or cybersecurity event with the community.
        </FormDescription>
      </FormHeader>

      {submitError && (
        <ErrorMessage>{submitError}</ErrorMessage>
      )}

      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label htmlFor="title">
            <FaInfoCircle /> Event Title*
          </Label>
          <Input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="Enter event title"
            error={!!errors.title}
          />
          {errors.title && <ErrorText>{errors.title}</ErrorText>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="description">
            <FaInfoCircle /> Description*
          </Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Provide a detailed description of the event (include cryptography or security related content)"
            rows={5}
            error={!!errors.description}
          />
          {errors.description && <ErrorText>{errors.description}</ErrorText>}
        </FormGroup>

        <FormRow>
          <FormGroup>
            <Label htmlFor="startDate">
              <FaCalendarAlt /> Start Date & Time*
            </Label>
            <Input
              type="datetime-local"
              id="startDate"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              error={!!errors.startDate}
            />
            {errors.startDate && <ErrorText>{errors.startDate}</ErrorText>}
          </FormGroup>

          <FormGroup>
            <Label htmlFor="endDate">
              <FaCalendarAlt /> End Date & Time
            </Label>
            <Input
              type="datetime-local"
              id="endDate"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              error={!!errors.endDate}
            />
            {errors.endDate && <ErrorText>{errors.endDate}</ErrorText>}
          </FormGroup>
        </FormRow>

        <FormGroup>
          <Label htmlFor="location">
            <FaMapMarkerAlt /> Location*
          </Label>
          <Input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Enter event location or 'Online' for virtual events"
            error={!!errors.location}
          />
          {errors.location && <ErrorText>{errors.location}</ErrorText>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="category">
            <FaTag /> Category*
          </Label>
          <Select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            error={!!errors.category}
          >
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </Select>
          {errors.category && <ErrorText>{errors.category}</ErrorText>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="organizerName">
            <FaUserTie /> Organizer Name
          </Label>
          <Input
            type="text"
            id="organizerName"
            name="organizerName"
            value={formData.organizerName}
            onChange={handleChange}
            placeholder="Enter the name of the organizing person or institution"
          />
        </FormGroup>

        <FormGroup>
          <Label htmlFor="imageUrl">
            <FaImage /> Image URL
          </Label>
          <Input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="Enter URL for event banner image"
            error={!!errors.imageUrl}
          />
          {errors.imageUrl && <ErrorText>{errors.imageUrl}</ErrorText>}
        </FormGroup>

        <FormGroup>
          <Label htmlFor="registrationUrl">
            <FaLink /> Registration URL
          </Label>
          <Input
            type="text"
            id="registrationUrl"
            name="registrationUrl"
            value={formData.registrationUrl}
            onChange={handleChange}
            placeholder="Enter URL for event registration"
            error={!!errors.registrationUrl}
          />
          {errors.registrationUrl && <ErrorText>{errors.registrationUrl}</ErrorText>}
        </FormGroup>

        <FormActions>
          <CancelButton type="button" onClick={handleCancel}>
            <FaTimes /> Cancel
          </CancelButton>
          <SubmitButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : (
              <>
                <FaSave /> Submit Event
              </>
            )}
          </SubmitButton>
        </FormActions>
      </Form>
    </FormContainer>
  );
};

// Styled Components
const FormContainer = styled.div`
  width: 100%;
  max-width: 800px;
  margin: 30px auto;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
  overflow: hidden;
`;

const FormHeader = styled.div`
  padding: 30px;
  background: linear-gradient(135deg, #6c5ce7 0%, #4834d4 100%);
  color: white;
`;

const FormTitle = styled.h1`
  margin: 0 0 10px 0;
  font-size: 1.8rem;
  font-weight: 700;
`;

const FormDescription = styled.p`
  margin: 0;
  font-size: 1rem;
  opacity: 0.9;
`;

const Form = styled.form`
  padding: 30px;
`;

const FormGroup = styled.div`
  margin-bottom: 20px;
`;

const FormRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Label = styled.label`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
  font-weight: 500;
  margin-bottom: 8px;
  color: #2d3436;
  
  svg {
    color: #6c5ce7;
  }
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  border: 1px solid ${props => props.error ? '#e74c3c' : '#ddd'};
  border-radius: 5px;
  font-size: 0.95rem;
  
  &:focus {
    outline: none;
    border-color: ${props => props.error ? '#e74c3c' : '#6c5ce7'};
    box-shadow: 0 0 0 2px ${props => props.error ? 'rgba(231, 76, 60, 0.2)' : 'rgba(108, 92, 231, 0.2)'};
  }
`;

const Textarea = styled.textarea`
  width: 100%;
  padding: 12px;
  border: 1px solid ${props => props.error ? '#e74c3c' : '#ddd'};
  border-radius: 5px;
  font-size: 0.95rem;
  resize: vertical;
  
  &:focus {
    outline: none;
    border-color: ${props => props.error ? '#e74c3c' : '#6c5ce7'};
    box-shadow: 0 0 0 2px ${props => props.error ? 'rgba(231, 76, 60, 0.2)' : 'rgba(108, 92, 231, 0.2)'};
  }
`;

const Select = styled.select`
  width: 100%;
  padding: 12px;
  border: 1px solid ${props => props.error ? '#e74c3c' : '#ddd'};
  border-radius: 5px;
  font-size: 0.95rem;
  appearance: none;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%232d3436' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6 9 12 15 18 9'%3e%3c/polyline%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px;
  
  &:focus {
    outline: none;
    border-color: ${props => props.error ? '#e74c3c' : '#6c5ce7'};
    box-shadow: 0 0 0 2px ${props => props.error ? 'rgba(231, 76, 60, 0.2)' : 'rgba(108, 92, 231, 0.2)'};
  }
`;

const ErrorText = styled.p`
  color: #e74c3c;
  font-size: 0.85rem;
  margin: 5px 0 0 0;
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 16px;
  margin-top: 30px;
`;

const ButtonBase = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 20px;
  border: none;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  svg {
    font-size: 0.9rem;
  }
`;

const CancelButton = styled(ButtonBase)`
  background-color: #f1f1f1;
  color: #2d3436;
  
  &:hover:not(:disabled) {
    background-color: #e1e1e1;
  }
`;

const SubmitButton = styled(ButtonBase)`
  background-color: #6c5ce7;
  color: white;
  
  &:hover:not(:disabled) {
    background-color: #5649c9;
  }
`;

const ErrorMessage = styled.div`
  background-color: #fee;
  color: #e74c3c;
  padding: 15px;
  margin: 0;
  border-bottom: 1px solid #fcc;
  font-size: 0.95rem;
`;

export default CryptoEventForm;