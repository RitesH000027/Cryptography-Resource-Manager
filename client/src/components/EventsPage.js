// ... existing code ...

const EventsPage = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState({
    source: 'all',
    when: 'upcoming',
    search: ''
  });

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/events');
      setEvents(response.data.data);
      
      // Check if there's an error message from the API
      if (response.data.message) {
        setError(response.data.message);
      } else {
        setError(null);
      }
    } catch (err) {
      setError('Failed to load events. Please try again later.');
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleTryAgain = () => {
    fetchEvents();
  };

  // Filter events based on user selections
  const filteredEvents = events.filter(event => {
    // Filter by source
    if (filter.source !== 'all' && event.source !== filter.source) {
      return false;
    }
    
    // Filter by date
    const eventDate = new Date(event.start_date);
    const today = new Date();
    
    if (filter.when === 'upcoming' && eventDate < today) {
      return false;
    }
    
    if (filter.when === 'past' && eventDate >= today) {
      return false;
    }
    
    // Filter by search term
    if (filter.search && !event.title.toLowerCase().includes(filter.search.toLowerCase()) && 
        !event.description.toLowerCase().includes(filter.search.toLowerCase())) {
      return false;
    }
    
    return true;
  });

  return (
    <div className="events-page">
      {error && (
        <div className="error-banner">
          {error}
          <button onClick={handleTryAgain} className="try-again-btn">Try Again</button>
        </div>
      )}
      
      {/* Filter controls */}
      <div className="filter-controls">
        {/* ... existing filter controls ... */}
      </div>
      
      {loading ? (
        <div className="loading-spinner">Loading events...</div>
      ) : (
        <div className="events-grid">
          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <EventCard key={event.id} event={event} />
            ))
          ) : (
            <div className="no-events-message">
              No events found matching your criteria. Try adjusting your filters.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// ... existing code ...