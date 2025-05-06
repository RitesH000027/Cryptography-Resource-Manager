import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import CryptoEventCard from './CryptoEventCard';
import { 
  FaFilter, 
  FaSearch, 
  FaCalendarAlt, 
  FaGraduationCap, 
  FaGlobeAmericas, 
  FaTimes,
  FaSpinner 
} from 'react-icons/fa';

const CryptoEventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  const [filters, setFilters] = useState({
    category: '',
    startDate: '',
    search: ''
  });
  const [showFilters, setShowFilters] = useState(false);

  // Fetch events on component mount
  useEffect(() => {
    fetchEvents();
  }, [activeTab, filters]);

  const fetchEvents = async () => {
    setLoading(true);
    setError(null);
    
    try {
      // Build query parameters
      const params = new URLSearchParams();
      
      // Set source based on active tab
      if (activeTab === 'college') {
        params.append('source', 'college');
      } else if (activeTab === 'worldwide') {
        params.append('source', 'worldwide');
      }
      
      // Add other filters
      if (filters.category) {
        params.append('category', filters.category);
      }
      
      if (filters.startDate) {
        params.append('startDate', new Date(filters.startDate).toISOString());
      }
      
      if (filters.search) {
        params.append('search', filters.search);
      }
      
      // Fetch events
      const response = await axios.get(`/api/events?${params.toString()}`);
      
      setEvents(response.data);
    } catch (err) {
      console.error('Error fetching events:', err);
      setError('Failed to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({
      category: '',
      startDate: '',
      search: ''
    });
  };

  const toggleFilters = () => {
    setShowFilters(prev => !prev);
  };

  return (
    <PageContainer>
      <PageHeader>
        <HeaderContent>
          <PageTitle>Cryptology and Cryptography Events</PageTitle>
          <PageDescription>
            Discover conferences, workshops, and hackathons focused on cryptography, cryptology, and cryptanalysis.
          </PageDescription>
        </HeaderContent>
      </PageHeader>

      <ContentSection>
        <FilterSection>
          <TabsContainer>
            <Tab 
              active={activeTab === 'all'} 
              onClick={() => handleTabChange('all')}
            >
              All Events
            </Tab>
            <Tab 
              active={activeTab === 'college'} 
              onClick={() => handleTabChange('college')}
            >
              <FaGraduationCap /> College Events
            </Tab>
            <Tab 
              active={activeTab === 'worldwide'} 
              onClick={() => handleTabChange('worldwide')}
            >
              <FaGlobeAmericas /> Worldwide Events
            </Tab>
          </TabsContainer>

          <FiltersToggle onClick={toggleFilters}>
            <FaFilter /> {showFilters ? 'Hide Filters' : 'Show Filters'}
          </FiltersToggle>
        </FilterSection>

        {showFilters && (
          <FiltersContainer>
            <FilterGroup>
              <FilterLabel>
                <FaSearch /> Search
              </FilterLabel>
              <FilterInput 
                type="text" 
                name="search" 
                placeholder="Search keywords..." 
                value={filters.search}
                onChange={handleFilterChange}
              />
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>
                <FaCalendarAlt /> Start Date
              </FilterLabel>
              <FilterInput 
                type="date" 
                name="startDate" 
                value={filters.startDate}
                onChange={handleFilterChange}
              />
            </FilterGroup>

            <FilterGroup>
              <FilterLabel>Category</FilterLabel>
              <FilterSelect 
                name="category" 
                value={filters.category}
                onChange={handleFilterChange}
              >
                <option value="">All Categories</option>
                <option value="conference">Conference</option>
                <option value="workshop">Workshop</option>
                <option value="hackathon">Hackathon</option>
                <option value="webinar">Webinar</option>
                <option value="lecture">Lecture</option>
                <option value="meetup">Meetup</option>
              </FilterSelect>
            </FilterGroup>

            <ClearFiltersButton onClick={clearFilters}>
              <FaTimes /> Clear Filters
            </ClearFiltersButton>
          </FiltersContainer>
        )}

        {loading ? (
          <LoadingContainer>
            <FaSpinner className="spinner" />
            <LoadingText>Loading events...</LoadingText>
          </LoadingContainer>
        ) : error ? (
          <ErrorContainer>
            <ErrorMessage>{error}</ErrorMessage>
            <RetryButton onClick={fetchEvents}>Try Again</RetryButton>
          </ErrorContainer>
        ) : events.length === 0 ? (
          <NoEventsContainer>
            <NoEventsMessage>No events found matching your criteria.</NoEventsMessage>
            <RetryButton onClick={clearFilters}>Clear Filters</RetryButton>
          </NoEventsContainer>
        ) : (
          <EventsGrid>
            {events.map(event => (
              <CryptoEventCard key={event.id} event={event} />
            ))}
          </EventsGrid>
        )}
      </ContentSection>
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

const PageHeader = styled.header`
  background: linear-gradient(135deg, #6c5ce7 0%, #4834d4 100%);
  border-radius: 10px;
  margin: 20px 0;
  padding: 40px;
  color: white;
  box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
`;

const HeaderContent = styled.div`
  max-width: 800px;
`;

const PageTitle = styled.h1`
  margin: 0 0 16px 0;
  font-size: 2.5rem;
  font-weight: 700;
`;

const PageDescription = styled.p`
  font-size: 1.1rem;
  line-height: 1.5;
  margin: 0;
  opacity: 0.9;
`;

const ContentSection = styled.section`
  margin: 30px 0;
`;

const FilterSection = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-wrap: wrap;
  gap: 10px;
`;

const TabsContainer = styled.div`
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
`;

const Tab = styled.button`
  background-color: ${props => props.active ? '#6c5ce7' : '#f5f5f5'};
  color: ${props => props.active ? 'white' : '#2d3436'};
  border: none;
  border-radius: 5px;
  padding: 10px 16px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: ${props => props.active ? '#5649c9' : '#e9e9e9'};
  }
  
  svg {
    font-size: 0.9rem;
  }
`;

const FiltersToggle = styled.button`
  background-color: #f5f5f5;
  color: #2d3436;
  border: none;
  border-radius: 5px;
  padding: 10px 16px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #e9e9e9;
  }
  
  svg {
    font-size: 0.9rem;
  }
`;

const FiltersContainer = styled.div`
  background-color: #f9f9f9;
  border-radius: 8px;
  padding: 20px;
  margin-bottom: 30px;
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  align-items: flex-end;
`;

const FilterGroup = styled.div`
  flex: 1;
  min-width: 200px;
`;

const FilterLabel = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  font-weight: 500;
  margin-bottom: 8px;
  color: #2d3436;
  
  svg {
    color: #6c5ce7;
  }
`;

const FilterInput = styled.input`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: #6c5ce7;
  }
`;

const FilterSelect = styled.select`
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 0.9rem;
  
  &:focus {
    outline: none;
    border-color: #6c5ce7;
  }
`;

const ClearFiltersButton = styled.button`
  background-color: #ff7675;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 16px;
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.3s ease;
  align-self: flex-end;
  
  &:hover {
    background-color: #e66767;
  }
`;

const EventsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 30px;
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px 0;

  .spinner {
    animation: spin 1s linear infinite;
    font-size: 2rem;
    color: #6c5ce7;
    margin-bottom: 20px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

const LoadingText = styled.p`
  font-size: 1.1rem;
  color: #636e72;
`;

const ErrorContainer = styled.div`
  text-align: center;
  padding: 50px 0;
`;

const ErrorMessage = styled.p`
  font-size: 1.1rem;
  color: #d63031;
  margin-bottom: 20px;
`;

const RetryButton = styled.button`
  background-color: #6c5ce7;
  color: white;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background-color: #5649c9;
  }
`;

const NoEventsContainer = styled.div`
  text-align: center;
  padding: 50px 0;
  background-color: #f9f9f9;
  border-radius: 8px;
`;

const NoEventsMessage = styled.p`
  font-size: 1.1rem;
  color: #636e72;
  margin-bottom: 20px;
`;

export default CryptoEventsPage;