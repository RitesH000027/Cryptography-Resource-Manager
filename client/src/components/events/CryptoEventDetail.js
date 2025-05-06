import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import styled from 'styled-components';
import { 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaTag, 
  FaExternalLinkAlt, 
  FaUserTie,
  FaArrowLeft,
  FaSpinner,
  FaUniversity,
  FaGlobeAmericas
} from 'react-icons/fa';
import { format } from 'date-fns';

const CryptoEventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch event on component mount
  useEffect(() => {
    const fetchEvent = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const response = await axios.get(`/api/events/${id}`);
        setEvent(response.data);
      } catch (err) {
        console.error('Error fetching event:', err);
        setError('Failed to load event details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  // Format date
  const formatEventDate = (startDate, endDate) => {
    try {
      const start = new Date(startDate);
      const end = endDate ? new Date(endDate) : null;
      
      if (!end || start.toDateString() === end.toDateString()) {
        // Same day event
        return `${format(start, 'MMMM d, yyyy')} (${format(start, 'p')} ${end ? '- ' + format(end, 'p') : ''})`;
      } else if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
        // Same month
        return `${format(start, 'MMMM d')} - ${format(end, 'd, yyyy')}`;
      } else {
        // Different months
        return `${format(start, 'MMMM d, yyyy')} - ${format(end, 'MMMM d, yyyy')}`;
      }
    } catch (error) {
      console.error('Date formatting error:', error);
      return 'Date unavailable';
    }
  };

  const getSourceName = (source) => {
    switch(source) {
      case 'iacr':
        return 'International Association for Cryptologic Research';
      case 'eventbrite':
        return 'Eventbrite';
      case 'defcon':
        return 'DEF CON';
      case 'cryptologyconference':
        return 'Cryptology Conference';
      case 'college':
        return 'College Event';
      default:
        return source.charAt(0).toUpperCase() + source.slice(1);
    }
  };

  const getSourceIcon = (source) => {
    if (source === 'college') {
      return <FaUniversity />;
    }
    return <FaGlobeAmericas />;
  };

  if (loading) {
    return (
      <LoadingContainer>
        <FaSpinner className="spinner" />
        <LoadingText>Loading event details...</LoadingText>
      </LoadingContainer>
    );
  }

  if (error) {
    return (
      <ErrorContainer>
        <ErrorMessage>{error}</ErrorMessage>
        <BackButton to="/events">Back to Events</BackButton>
      </ErrorContainer>
    );
  }

  if (!event) {
    return (
      <NotFoundContainer>
        <NotFoundMessage>Event not found</NotFoundMessage>
        <BackButton to="/events">Back to Events</BackButton>
      </NotFoundContainer>
    );
  }

  const {
    title,
    description,
    startDate,
    endDate,
    location,
    imageUrl,
    category,
    source,
    organizerName,
    registrationUrl
  } = event;

  return (
    <PageContainer>
      <BackButtonContainer>
        <BackButton to="/events">
          <FaArrowLeft /> Back to Events
        </BackButton>
      </BackButtonContainer>

      <EventContainer>
        <EventImageContainer>
          <EventImage src={imageUrl || `https://via.placeholder.com/1200x600?text=${encodeURIComponent(title)}`} alt={title} />
          <SourceBadge source={source}>
            {getSourceIcon(source)} {getSourceName(source)}
          </SourceBadge>
        </EventImageContainer>

        <EventContent>
          <EventTitle>{title}</EventTitle>

          <EventMetadata>
            <MetadataGroup>
              <MetadataIcon>
                <FaCalendarAlt />
              </MetadataIcon>
              <MetadataText>
                <MetadataLabel>Date & Time</MetadataLabel>
                <MetadataValue>{formatEventDate(startDate, endDate)}</MetadataValue>
              </MetadataText>
            </MetadataGroup>

            <MetadataGroup>
              <MetadataIcon>
                <FaMapMarkerAlt />
              </MetadataIcon>
              <MetadataText>
                <MetadataLabel>Location</MetadataLabel>
                <MetadataValue>{location}</MetadataValue>
              </MetadataText>
            </MetadataGroup>

            <MetadataGroup>
              <MetadataIcon>
                <FaTag />
              </MetadataIcon>
              <MetadataText>
                <MetadataLabel>Category</MetadataLabel>
                <MetadataValue>{category.charAt(0).toUpperCase() + category.slice(1)}</MetadataValue>
              </MetadataText>
            </MetadataGroup>

            {organizerName && (
              <MetadataGroup>
                <MetadataIcon>
                  <FaUserTie />
                </MetadataIcon>
                <MetadataText>
                  <MetadataLabel>Organizer</MetadataLabel>
                  <MetadataValue>{organizerName}</MetadataValue>
                </MetadataText>
              </MetadataGroup>
            )}
          </EventMetadata>

          <EventDescriptionSection>
            <SectionTitle>About This Event</SectionTitle>
            <EventDescription>{description}</EventDescription>
          </EventDescriptionSection>

          {registrationUrl && (
            <RegisterButtonContainer>
              <RegisterButton href={registrationUrl} target="_blank" rel="noopener noreferrer">
                Register Now <FaExternalLinkAlt />
              </RegisterButton>
            </RegisterButtonContainer>
          )}
        </EventContent>
      </EventContainer>
    </PageContainer>
  );
};

// Styled Components
const PageContainer = styled.div`
  width: 100%;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
`;

const BackButtonContainer = styled.div`
  margin: 20px 0;
`;

const BackButton = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  background-color: #f1f1f1;
  color: #2d3436;
  padding: 10px 16px;
  border-radius: 5px;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #e1e1e1;
  }
  
  svg {
    font-size: 0.9rem;
  }
`;

const EventContainer = styled.div`
  background-color: white;
  border-radius: 10px;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
  overflow: hidden;
  margin-bottom: 30px;
`;

const EventImageContainer = styled.div`
  position: relative;
  height: 400px;
`;

const EventImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const SourceBadge = styled.div`
  position: absolute;
  top: 20px;
  left: 20px;
  background-color: ${props => props.source === 'college' ? '#6c5ce7' : '#00b894'};
  color: white;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 4px 6px rgba(0,0,0,0.1);
  
  svg {
    font-size: 0.9rem;
  }
`;

const EventContent = styled.div`
  padding: 30px;
`;

const EventTitle = styled.h1`
  margin: 0 0 20px 0;
  font-size: 2.5rem;
  font-weight: 700;
  color: #2d3436;
  line-height: 1.3;
`;

const EventMetadata = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
  padding-bottom: 30px;
  border-bottom: 1px solid #f1f1f1;
`;

const MetadataGroup = styled.div`
  display: flex;
  gap: 16px;
`;

const MetadataIcon = styled.div`
  width: 40px;
  height: 40px;
  background-color: #f5f5f5;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  
  svg {
    font-size: 1.2rem;
    color: #6c5ce7;
  }
`;

const MetadataText = styled.div`
  display: flex;
  flex-direction: column;
`;

const MetadataLabel = styled.span`
  font-size: 0.85rem;
  color: #636e72;
  margin-bottom: 4px;
`;

const MetadataValue = styled.span`
  font-size: 1rem;
  color: #2d3436;
  font-weight: 500;
`;

const EventDescriptionSection = styled.div`
  margin-bottom: 30px;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: #2d3436;
  margin: 0 0 16px 0;
`;

const EventDescription = styled.div`
  font-size: 1.05rem;
  line-height: 1.6;
  color: #636e72;
  white-space: pre-line;
`;

const RegisterButtonContainer = styled.div`
  margin-top: 30px;
  padding-top: 30px;
  border-top: 1px solid #f1f1f1;
`;

const RegisterButton = styled.a`
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background-color: #6c5ce7;
  color: white;
  padding: 14px 28px;
  border-radius: 5px;
  text-decoration: none;
  font-weight: 600;
  font-size: 1.05rem;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #5649c9;
  }
  
  svg {
    font-size: 0.9rem;
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 100px 0;

  .spinner {
    animation: spin 1s linear infinite;
    font-size: 2.5rem;
    color: #6c5ce7;
    margin-bottom: 20px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  font-size: 1.2rem;
  color: #636e72;
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 100px 0;
`;

const ErrorMessage = styled.p`
  font-size: 1.2rem;
  color: #d63031;
  margin-bottom: 20px;
`;

const NotFoundContainer = styled.div`
  text-align: center;
  padding: 100px 0;
`;

const NotFoundMessage = styled.p`
  font-size: 1.5rem;
  color: #636e72;
  margin-bottom: 20px;
`;

export default CryptoEventDetail;