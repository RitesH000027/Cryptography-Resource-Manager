import React from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { 
  FaCalendarAlt, 
  FaMapMarkerAlt, 
  FaTag, 
  FaExternalLinkAlt, 
  FaStar,
  FaUniversity,
  FaGlobeAmericas
} from 'react-icons/fa';
import { format } from 'date-fns';

const CryptoEventCard = ({ event, className }) => {
  const {
    id,
    title,
    description,
    startDate,
    endDate,
    location,
    imageUrl,
    category,
    source,
    organizerName,
    registrationUrl,
    isFeatured
  } = event;

  // Format the date for display
  const formatEventDate = () => {
    try {
      const start = new Date(startDate);
      const end = endDate ? new Date(endDate) : null;
      
      if (!end || start.toDateString() === end.toDateString()) {
        // Same day event
        return format(start, 'MMMM d, yyyy');
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

  // Truncate description
  const truncateDescription = (text, maxLength = 140) => {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
  };

  // Source icon
  const getSourceIcon = () => {
    if (source === 'college') {
      return <FaUniversity />;
    }
    return <FaGlobeAmericas />;
  };

  // Get placeholder image if no image URL
  const getImageUrl = () => {
    if (imageUrl) return imageUrl;
    return `https://via.placeholder.com/300x200?text=${encodeURIComponent(title)}`;
  };

  return (
    <StyledCard className={className}>
      {isFeatured && (
        <FeaturedBadge>
          <FaStar /> Featured
        </FeaturedBadge>
      )}
      
      <SourceBadge source={source}>
        {getSourceIcon()} {source.charAt(0).toUpperCase() + source.slice(1)}
      </SourceBadge>
      
      <CardImage>
        <img src={getImageUrl()} alt={title} />
      </CardImage>
      
      <CardContent>
        <CardTitle>{title}</CardTitle>
        
        <CardDescription>{truncateDescription(description)}</CardDescription>
        
        <CardMetadata>
          <MetadataItem>
            <FaCalendarAlt />
            <span>{formatEventDate()}</span>
          </MetadataItem>
          
          <MetadataItem>
            <FaMapMarkerAlt />
            <span>{location}</span>
          </MetadataItem>
          
          <MetadataItem>
            <FaTag />
            <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
          </MetadataItem>
        </CardMetadata>
        
        {organizerName && (
          <OrganizerInfo>
            Organized by: {organizerName}
          </OrganizerInfo>
        )}
      </CardContent>
      
      <CardActions>
        <ViewDetailsButton to={`/events/${id}`}>View Details</ViewDetailsButton>
        
        {registrationUrl && (
          <RegisterButton href={registrationUrl} target="_blank" rel="noopener noreferrer">
            Register <FaExternalLinkAlt />
          </RegisterButton>
        )}
      </CardActions>
    </StyledCard>
  );
};

CryptoEventCard.propTypes = {
  event: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    startDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    endDate: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
    location: PropTypes.string,
    imageUrl: PropTypes.string,
    category: PropTypes.string,
    source: PropTypes.string,
    organizerName: PropTypes.string,
    registrationUrl: PropTypes.string,
    isFeatured: PropTypes.bool
  }).isRequired,
  className: PropTypes.string
};

const StyledCard = styled.div`
  position: relative;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
`;

const CardImage = styled.div`
  height: 200px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  ${StyledCard}:hover img {
    transform: scale(1.05);
  }
`;

const FeaturedBadge = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  background-color: #ffd700;
  color: #000;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  z-index: 2;
  
  svg {
    margin-right: 4px;
  }
`;

const SourceBadge = styled.div`
  position: absolute;
  top: 10px;
  left: 10px;
  background-color: ${props => props.source === 'college' ? '#6c5ce7' : '#00b894'};
  color: white;
  padding: 5px 10px;
  border-radius: 15px;
  font-size: 0.75rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  z-index: 2;
  
  svg {
    margin-right: 4px;
  }
`;

const CardContent = styled.div`
  padding: 16px;
  flex: 1;
`;

const CardTitle = styled.h3`
  margin: 0 0 10px 0;
  font-size: 1.2rem;
  font-weight: 600;
  color: #2d3436;
  line-height: 1.4;
`;

const CardDescription = styled.p`
  margin: 0 0 16px 0;
  font-size: 0.95rem;
  color: #636e72;
  line-height: 1.5;
`;

const CardMetadata = styled.div`
  margin-bottom: 16px;
`;

const MetadataItem = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 0.85rem;
  color: #636e72;
  
  svg {
    margin-right: 8px;
    color: #6c5ce7;
  }
`;

const OrganizerInfo = styled.div`
  font-size: 0.85rem;
  color: #636e72;
  font-style: italic;
`;

const CardActions = styled.div`
  display: flex;
  padding: 16px;
  border-top: 1px solid #f1f1f1;
`;

const ViewDetailsButton = styled(Link)`
  flex: 1;
  padding: 8px 16px;
  background-color: #f1f1f1;
  color: #2d3436;
  text-align: center;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.85rem;
  margin-right: 8px;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #e1e1e1;
  }
`;

const RegisterButton = styled.a`
  flex: 1;
  padding: 8px 16px;
  background-color: #6c5ce7;
  color: white;
  text-align: center;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.85rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background-color 0.3s;
  
  svg {
    margin-left: 6px;
    font-size: 0.75rem;
  }
  
  &:hover {
    background-color: #5549d6;
  }
`;

export default CryptoEventCard;