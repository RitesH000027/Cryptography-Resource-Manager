import axios from 'axios';

/**
 * Fetches cryptography, cryptology, and cryptanalysis related events from the API
 * @param {Object} filters - Event filters
 * @returns {Promise<Array>} Array of events
 */
export const fetchCryptoEvents = async (filters = {}) => {
  try {
    // Build query parameters
    const params = new URLSearchParams();
    
    // Add filters
    if (filters.source) {
      if (Array.isArray(filters.source)) {
        filters.source.forEach(source => params.append('source', source));
      } else {
        params.append('source', filters.source);
      }
    }
    
    if (filters.category) {
      params.append('category', filters.category);
    }
    
    if (filters.startDate) {
      params.append('startDate', new Date(filters.startDate).toISOString());
    }
    
    if (filters.search) {
      params.append('search', filters.search);
    }
    
    if (filters.featured) {
      params.append('featured', filters.featured);
    }
    
    // Set limit
    if (filters.limit) {
      params.append('limit', filters.limit);
    }
    
    // Set page
    if (filters.page) {
      params.append('page', filters.page);
    }
    
    // Make API request
    const response = await axios.get(`/api/events?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching crypto events:', error);
    throw error;
  }
};

/**
 * Fetches a single event by ID
 * @param {string|number} id - Event ID
 * @returns {Promise<Object>} Event object
 */
export const fetchEventById = async (id) => {
  try {
    const response = await axios.get(`/api/events/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching event with id ${id}:`, error);
    throw error;
  }
};

/**
 * Submit a new cryptography event
 * @param {Object} eventData - Event data
 * @returns {Promise<Object>} Created event
 */
export const submitEvent = async (eventData) => {
  try {
    // Ensure event is cryptography related
    const cryptoEvent = {
      ...eventData,
      // Add cryptography tags if not present in description
      description: !eventData.description.toLowerCase().includes('crypt') 
        ? `${eventData.description}\n\nTags: cryptography, cryptology, security` 
        : eventData.description
    };
    
    const response = await axios.post('/api/events', cryptoEvent);
    return response.data;
  } catch (error) {
    console.error('Error submitting event:', error);
    throw error;
  }
};

/**
 * Update an existing event
 * @param {string|number} id - Event ID
 * @param {Object} eventData - Updated event data
 * @returns {Promise<Object>} Updated event
 */
export const updateEvent = async (id, eventData) => {
  try {
    const response = await axios.put(`/api/events/${id}`, eventData);
    return response.data;
  } catch (error) {
    console.error(`Error updating event with id ${id}:`, error);
    throw error;
  }
};

/**
 * Delete an event
 * @param {string|number} id - Event ID
 * @returns {Promise<Object>} Response message
 */
export const deleteEvent = async (id) => {
  try {
    const response = await axios.delete(`/api/events/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error deleting event with id ${id}:`, error);
    throw error;
  }
};

/**
 * Approve an event
 * @param {string|number} id - Event ID
 * @returns {Promise<Object>} Approved event
 */
export const approveEvent = async (id) => {
  try {
    const response = await axios.post(`/api/events/${id}/approve`);
    return response.data;
  } catch (error) {
    console.error(`Error approving event with id ${id}:`, error);
    throw error;
  }
};

/**
 * Gets event categories specifically for cryptography events
 * @returns {Array} Array of category objects
 */
export const getCryptoEventCategories = () => {
  return [
    { id: 'conference', name: 'Conference' },
    { id: 'workshop', name: 'Workshop' },
    { id: 'hackathon', name: 'Hackathon' },
    { id: 'webinar', name: 'Webinar' },
    { id: 'lecture', name: 'Lecture' },
    { id: 'meetup', name: 'Meetup' },
    { id: 'competition', name: 'Competition' }
  ];
};

/**
 * Gets event sources
 * @returns {Array} Array of source objects
 */
export const getEventSources = () => {
  return [
    { id: 'college', name: 'College' },
    { id: 'iacr', name: 'IACR' },
    { id: 'cryptologyconference', name: 'Cryptology Conference' },
    { id: 'eventbrite', name: 'Eventbrite' },
    { id: 'defcon', name: 'DEF CON' }
  ];
};