import React, { useState } from 'react';
import styled from 'styled-components';
import { FaCalendarAlt, FaPlus } from 'react-icons/fa';
import AddEvent from './AddEvent';

const DashboardEvents = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [events, setEvents] = useState([]);

  const handleEventAdded = (newEvent) => {
    setEvents(prev => [...prev, newEvent]);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <DashboardContainer>
      <Header>
        <div>
          <h1>Events Management</h1>
          <p>View and manage cryptography events</p>
        </div>
        <AddButton onClick={() => setShowAddModal(true)}>
          <FaPlus />
          <span>Add Event</span>
        </AddButton>
      </Header>

      {events.length === 0 ? (
        <ComingSoonMessage>
          <FaCalendarAlt />
          <h2>No Events Yet</h2>
          <p>Click the Add Event button to create your first event.</p>
        </ComingSoonMessage>
      ) : (
        <EventsGrid>
          {events.map(event => (
            <EventCard key={event.id}>
              {event.imageUrl && (
                <EventImage src={event.imageUrl} alt={event.title} />
              )}
              <EventContent>
                <EventTitle>{event.title}</EventTitle>
                <EventType>{event.eventType}</EventType>
                <EventMeta>
                  <MetaItem>
                    <FaCalendarAlt />
                    <span>Start: {formatDate(event.startDate)}</span>
                  </MetaItem>
                  <MetaItem>
                    <FaCalendarAlt />
                    <span>End: {formatDate(event.endDate)}</span>
                  </MetaItem>
                </EventMeta>
                <EventDescription>{event.description}</EventDescription>
                <EventLocation>
                  <strong>Location:</strong> {event.location}
                </EventLocation>
                <EventOrganizer>
                  <strong>Organizer:</strong> {event.organizerName}
                </EventOrganizer>
              </EventContent>
            </EventCard>
          ))}
        </EventsGrid>
      )}

      {showAddModal && (
        <AddEvent 
          onClose={() => setShowAddModal(false)}
          onEventAdded={handleEventAdded}
        />
      )}
    </DashboardContainer>
  );
};

const DashboardContainer = styled.div`
  padding: 2rem;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  h1 {
    font-size: 2rem;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 0.5rem;
  }
  
  p {
    color: ${({ theme }) => theme.colors.textLight};
  }
`;

const AddButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${({ theme }) => theme.colors.primaryDark};
    transform: translateY(-2px);
  }
  
  svg {
    font-size: 1rem;
  }
`;

const ComingSoonMessage = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 8px;
  box-shadow: ${({ theme }) => theme.shadows.small};
  
  svg {
    font-size: 3rem;
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: 1rem;
  }
  
  h2 {
    font-size: 1.5rem;
    color: ${({ theme }) => theme.colors.text};
    margin-bottom: 0.5rem;
  }
  
  p {
    color: ${({ theme }) => theme.colors.textLight};
  }
`;

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
`;

const EventCard = styled.div`
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: ${({ theme }) => theme.shadows.small};
`;

const EventImage = styled.img`
  width: 100%;
  height: 200px;
  object-fit: cover;
  border-radius: 8px 8px 0 0;
`;

const EventContent = styled.div`
  padding: 1rem;
`;

const EventTitle = styled.h3`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const EventType = styled.span`
  display: inline-block;
  padding: 0.25rem 0.5rem;
  background-color: ${({ theme }) => theme.colors.primaryLight};
  color: ${({ theme }) => theme.colors.primary};
  border-radius: 4px;
  font-size: 0.875rem;
  margin-bottom: 1rem;
`;

const EventMeta = styled.div`
  margin-bottom: 1rem;
`;

const MetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: ${({ theme }) => theme.colors.textLight};
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
  
  svg {
    color: ${({ theme }) => theme.colors.primary};
  }
`;

const EventDescription = styled.p`
  color: ${({ theme }) => theme.colors.text};
  margin-bottom: 1rem;
  font-size: 0.95rem;
  line-height: 1.5;
`;

const EventLocation = styled.div`
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
`;

const EventOrganizer = styled.div`
  font-size: 0.9rem;
  color: ${({ theme }) => theme.colors.text};
`;

export default DashboardEvents;