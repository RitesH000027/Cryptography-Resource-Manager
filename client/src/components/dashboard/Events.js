import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { motion } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';
import { FiPlus, FiCalendar, FiMap, FiUser, FiExternalLink, FiFilter, FiSearch } from 'react-icons/fi';
import EventForm from './EventForm';
import Loader from '../common/Loader';

const Events = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [showAddEventForm, setShowAddEventForm] = useState(false);
  const [filters, setFilters] = useState({
    source: 'all', // 'all', 'internal', 'external'
    search: '',
    dateRange: 'upcoming', // 'upcoming', 'past', 'all'
  });

  useEffect(() => {
    fetchEvents();
  }, []);

  const applyFilters = useCallback(() => {
    let filtered = [...events];
    
    // Filter by source
    if (filters.source !== 'all') {
      filtered = filtered.filter(event => event.source === filters.source);
    }
    
    // Filter by search term
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(event => 
        event.title.toLowerCase().includes(searchTerm) || 
        event.description.toLowerCase().includes(searchTerm) ||
        event.location.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filter by date range
    const now = new Date();
    if (filters.dateRange === 'upcoming') {
      filtered = filtered.filter(event => new Date(event.startDate) >= now);
    } else if (filters.dateRange === 'past') {
      filtered = filtered.filter(event => new Date(event.startDate) < now);
    }
    
    setFilteredEvents(filtered);
  }, [events, filters]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/events', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      setEvents(response.data.events);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching events:', error);
      setLoading(false);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters({
      ...filters,
      [name]: value
    });
  };

  const handleAddEvent = async (eventData) => {
    try {
      const response = await axios.post('/api/events', eventData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      setEvents([...events, response.data]);
      setShowAddEventForm(false);
      // Show success message
    } catch (error) {
      console.error('Error adding event:', error);
      // Show error message
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Determine if user can add events (admin or authorized user)
  const canAddEvents = user && (user.role === 'admin' || user.role === 'authorized');

  return (
    <EventsContainer
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <Header>
        <h1>Events</h1>
        {canAddEvents && (
          <AddButton 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddEventForm(true)}
          >
            <FiPlus /> Add Event
          </AddButton>
        )}
      </Header>
      
      <FiltersSection>
        <FilterGroup>
          <FilterLabel>
            <FiFilter /> Source:
          </FilterLabel>
          <FilterSelect 
            value={filters.source}
            onChange={(e) => handleFilterChange('source', e.target.value)}
          >
            <option value="all">All Events</option>
            <option value="internal">College Events</option>
            <option value="external">Worldwide Events</option>
          </FilterSelect>
        </FilterGroup>
        
        <FilterGroup>
          <FilterLabel>
            <FiCalendar /> Date:
          </FilterLabel>
          <FilterSelect 
            value={filters.dateRange}
            onChange={(e) => handleFilterChange('dateRange', e.target.value)}
          >
            <option value="upcoming">Upcoming</option>
            <option value="past">Past</option>
            <option value="all">All Dates</option>
          </FilterSelect>
        </FilterGroup>
        
        <SearchContainer>
          <SearchIcon>
            <FiSearch />
          </SearchIcon>
          <SearchInput 
            type="text"
            placeholder="Search events..."
            value={filters.search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
          />
        </SearchContainer>
      </FiltersSection>

      {loading ? (
        <LoaderContainer>
          <Loader />
        </LoaderContainer>
      ) : (
        <EventsGrid>
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <EventCard 
                key={event.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                source={event.source}
              >
                <EventImage src={event.imageUrl} alt={event.title} />
                <EventSourceBadge source={event.source}>
                  {event.source === 'internal' ? 'College Event' : 'External Event'}
                </EventSourceBadge>
                <EventContent>
                  <EventTitle>{event.title}</EventTitle>
                  <EventMeta>
                    <EventMetaItem>
                      <FiCalendar />
                      <span>{formatDate(event.startDate)}</span>
                    </EventMetaItem>
                    <EventMetaItem>
                      <FiMap />
                      <span>{event.location}</span>
                    </EventMetaItem>
                    <EventMetaItem>
                      <FiUser />
                      <span>{event.organizer?.name || 'Unknown'}</span>
                    </EventMetaItem>
                  </EventMeta>
                  <EventDescription>{event.description}</EventDescription>
                  <EventActions>
                    {event.registrationUrl && (
                      <RegisterButton 
                        href={event.registrationUrl} 
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Register <FiExternalLink />
                      </RegisterButton>
                    )}
                  </EventActions>
                </EventContent>
              </EventCard>
            ))
          ) : (
            <NoEventsMessage>
              <p>No events found matching your filters.</p>
              <p>Try adjusting your filters or check back later for new events.</p>
            </NoEventsMessage>
          )}
        </EventsGrid>
      )}

      {showAddEventForm && (
        <ModalOverlay>
          <Modal
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <ModalHeader>
              <h2>Add New Event</h2>
              <CloseButton onClick={() => setShowAddEventForm(false)}>×</CloseButton>
            </ModalHeader>
            <EventForm onSubmit={handleAddEvent} onCancel={() => setShowAddEventForm(false)} />
          </Modal>
        </ModalOverlay>
      )}
    </EventsContainer>
  );
};

// Styled Components
const EventsContainer = styled(motion.div)`
  padding: 1.5rem;
  max-width: 1200px;
  margin: 0 auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  
  h1 {
    margin: 0;
    font-size: 2rem;
    color: #333;
  }
`;

const AddButton = styled(motion.button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 0.375rem;
  padding: 0.75rem 1.25rem;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #4338ca;
  }
`;

const FiltersSection = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background-color: #f9fafb;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
`;

const FilterGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const FilterLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-weight: 500;
  color: #374151;
`;

const FilterSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: white;
  color: #111827;
  cursor: pointer;
`;

const SearchContainer = styled.div`
  position: relative;
  flex: 1;
  min-width: 200px;
`;

const SearchIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem 0.5rem 0.5rem 2.25rem;
  border: 1px solid #d1d5db;
  border-radius: 0.375rem;
  background-color: white;
  color: #111827;
  
  &:focus {
    outline: none;
    border-color: #4f46e5;
    box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
  }
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 300px;
`;

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 1.5rem;
`;

const EventCard = styled(motion.div)`
  position: relative;
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.3s, transform 0.3s;
  border-top: 4px solid ${props => props.source === 'internal' ? '#4f46e5' : '#ea580c'};
  
  &:hover {
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
    transform: translateY(-4px);
  }
`;

const EventImage = styled.img`
  width: 100%;
  height: 160px;
  object-fit: cover;
`;

const EventSourceBadge = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  padding: 0.25rem 0.75rem;
  background-color: ${props => props.source === 'internal' ? '#4f46e5' : '#ea580c'};
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  border-radius: 9999px;
`;

const EventContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.5rem;
  flex: 1;
`;

const EventTitle = styled.h3`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
  color: #111827;
  line-height: 1.4;
`;

const EventMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`;

const EventMetaItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.875rem;
  
  svg {
    flex-shrink: 0;
  }
`;

const EventDescription = styled.p`
  margin: 0;
  color: #4b5563;
  font-size: 0.875rem;
  line-height: 1.5;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  flex: 1;
`;

const EventActions = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 1rem;
`;

const RegisterButton = styled.a`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem 1rem;
  background-color: #10b981;
  color: white;
  text-decoration: none;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 0.3s;
  
  &:hover {
    background-color: #059669;
  }
`;

const NoEventsMessage = styled.div`
  grid-column: 1 / -1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  text-align: center;
  color: #6b7280;
  
  p {
    margin: 0.5rem 0;
  }
`;

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Modal = styled(motion.div)`
  background-color: white;
  border-radius: 0.5rem;
  max-width: 600px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem;
  border-bottom: 1px solid #e5e7eb;
  
  h2 {
    margin: 0;
    font-size: 1.5rem;
    color: #111827;
  }
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #6b7280;
  line-height: 1;
  
  &:hover {
    color: #111827;
  }
`;

export default Events;
