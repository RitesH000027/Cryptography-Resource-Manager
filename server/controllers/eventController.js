const { validationResult } = require('express-validator');
const eventService = require('../services/eventService');
const logger = require('../utils/logger');

/**
 * Get all events (both internal and external)
 * Filter by type, date range, search term, etc.
 */
exports.getAllEvents = async (req, res) => {
  try {
    const { 
      category = 'all',  // 'all', 'internal', 'external'
      limit = 50, 
      offset = 0,
      search = '',
      dateRange = 'upcoming', // 'upcoming', 'past', 'all'
      source = 'all' // 'all', 'eventbrite', 'meetup', etc.
    } = req.query;
    
    const options = {
      category,
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      searchTerm: search,
      dateRange,
      source
    };
    
    // Log the request
    logger.info(`User ${req.user.id} requested events with options: ${JSON.stringify(options)}`);
    
    // Get events from service
    const result = await eventService.getAllEvents(options);
    
    return res.json(result);
  } catch (error) {
    logger.error(`Error fetching events: ${error.message}`, { userId: req.user.id, error });
    return res.status(500).json({ message: 'Failed to fetch events' });
  }
};

/**
 * Get internal events only
 */
exports.getInternalEvents = async (req, res) => {
  try {
    const { 
      limit = 50, 
      offset = 0,
      search = '',
      status = 'active' // 'active', 'pending', 'rejected'
    } = req.query;
    
    const options = {
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      searchTerm: search,
      status
    };
    
    // For admin users, allow filtering by status
    if (req.user.role !== 'admin') {
      options.status = 'active'; // Non-admins can only see approved events
    }
    
    const events = await eventService.getInternalEvents(options);
    
    return res.json({
      events,
      total: events.length,
      limit: options.limit,
      offset: options.offset
    });
  } catch (error) {
    logger.error(`Error fetching internal events: ${error.message}`, { userId: req.user.id, error });
    return res.status(500).json({ message: 'Failed to fetch internal events' });
  }
};

/**
 * Get external events only
 */
exports.getExternalEvents = async (req, res) => {
  try {
    const { 
      limit = 50, 
      offset = 0,
      source = 'all' // 'all', 'eventbrite', 'meetup', etc.
    } = req.query;
    
    const options = {
      limit: parseInt(limit, 10),
      offset: parseInt(offset, 10),
      source
    };
    
    const events = await eventService.getExternalEvents(options);
    
    return res.json({
      events,
      total: events.length,
      limit: options.limit,
      offset: options.offset
    });
  } catch (error) {
    logger.error(`Error fetching external events: ${error.message}`, { userId: req.user.id, error });
    return res.status(500).json({ message: 'Failed to fetch external events' });
  }
};

/**
 * Create a new internal event
 */
exports.createEvent = async (req, res) => {
  try {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    // Check if user is authorized to create events
    if (req.user.role !== 'admin' && req.user.role !== 'authorised') {
      return res.status(403).json({ message: 'Not authorized to create events' });
    }
    
    const eventData = req.body;
    
    // Create the event
    const event = await eventService.createInternalEvent(eventData, req.user.id);
    
    logger.info(`User ${req.user.id} created a new event: ${event.id}`, { eventId: event.id });
    
    return res.status(201).json(event);
  } catch (error) {
    logger.error(`Error creating event: ${error.message}`, { userId: req.user.id, error });
    return res.status(500).json({ message: 'Failed to create event' });
  }
};

/**
 * Update an existing internal event
 */
exports.updateEvent = async (req, res) => {
  try {
    // Check validation results
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    
    const { eventId } = req.params;
    const eventData = req.body;
    
    // Update the event
    const event = await eventService.updateInternalEvent(eventId, eventData, req.user.id);
    
    logger.info(`User ${req.user.id} updated event: ${eventId}`, { eventId });
    
    return res.json(event);
  } catch (error) {
    logger.error(`Error updating event: ${error.message}`, { userId: req.user.id, eventId: req.params.eventId, error });
    
    if (error.message === 'Event not found') {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    if (error.message === 'Not authorized to update this event') {
      return res.status(403).json({ message: 'Not authorized to update this event' });
    }
    
    return res.status(500).json({ message: 'Failed to update event' });
  }
};

/**
 * Approve or reject an internal event
 * Only admin users can approve/reject events
 */
exports.updateEventStatus = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { status } = req.body;
    
    if (!status || (status !== 'active' && status !== 'rejected')) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    
    // Update event status
    const event = await eventService.updateEventStatus(eventId, status, req.user.id);
    
    logger.info(`Admin ${req.user.id} ${status === 'active' ? 'approved' : 'rejected'} event: ${eventId}`, { eventId });
    
    return res.json(event);
  } catch (error) {
    logger.error(`Error updating event status: ${error.message}`, { userId: req.user.id, eventId: req.params.eventId, error });
    
    if (error.message === 'Event not found') {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    if (error.message === 'Only admins can approve or reject events') {
      return res.status(403).json({ message: 'Only admins can approve or reject events' });
    }
    
    return res.status(500).json({ message: 'Failed to update event status' });
  }
};

/**
 * Delete an internal event
 */
exports.deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    
    // Delete the event
    await eventService.deleteInternalEvent(eventId, req.user.id);
    
    logger.info(`User ${req.user.id} deleted event: ${eventId}`, { eventId });
    
    return res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    logger.error(`Error deleting event: ${error.message}`, { userId: req.user.id, eventId: req.params.eventId, error });
    
    if (error.message === 'Event not found') {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    if (error.message === 'Not authorized to delete this event') {
      return res.status(403).json({ message: 'Not authorized to delete this event' });
    }
    
    return res.status(500).json({ message: 'Failed to delete event' });
  }
};

// Update the fetchEventsFromEventbrite function
const fetchEventsFromEventbrite = async () => {
  try {
    const categories = [
      '101', // Science & Technology
      '102', // Business & Professional 
      '104', // Community & Culture
      '105', // Performing & Visual Arts
      '108', // Sports & Fitness
    ];
    
    // Use keywords related to cryptography, blockchain, and security
    const keywords = [
      'cryptography', 
      'blockchain', 
      'security', 
      'cyber', 
      'encryption', 
      'cryptocurrency',
      'quantum',
      'hacking',
      'privacy',
      'zero-knowledge'
    ];
    
    let allEvents = [];
    
    // Fetch events for each category and keyword combination
    for (const category of categories) {
      for (const keyword of keywords) {
        const response = await axios.get('https://www.eventbriteapi.com/v3/events/search/', {
          headers: {
            'Authorization': `Bearer ${process.env.EVENTBRITE_OAUTH_TOKEN}`
          },
          params: {
            'categories': category,
            'q': keyword,
            'expand': 'venue,organizer',
            'page_size': 50
          }
        });
        
        if (response.data && response.data.events) {
          allEvents = [...allEvents, ...response.data.events];
        }
      }
    }
    
    // Process and format the events
    return allEvents.map(event => ({
      id: event.id,
      title: event.name.text,
      description: event.description ? event.description.text : '',
      start_date: event.start.utc,
      end_date: event.end.utc,
      venue: event.venue ? {
        name: event.venue.name,
        address: event.venue.address ? event.venue.address.localized_address_display : 'Online',
        city: event.venue.address ? event.venue.address.city : '',
        country: event.venue.address ? event.venue.address.country : ''
      } : { name: 'Online Event', address: 'Online', city: '', country: '' },
      organizer: event.organizer ? event.organizer.name : '',
      url: event.url, // This is the original event URL
      image_url: event.logo ? event.logo.url : null,
      source: 'eventbrite',
      category: 'technology',
      tags: ['cryptography', 'security', 'blockchain'].filter(tag => 
        event.name.text.toLowerCase().includes(tag) || 
        (event.description && event.description.text.toLowerCase().includes(tag))
      )
    }));
  } catch (error) {
    console.error('Error fetching events from Eventbrite:', error.message);
    return [];
  }
};

// Update the main getEvents function to include fallback to sample data
exports.getEvents = async (req, res) => {
  try {
    // Try to fetch from APIs first
    let events = [];
    
    // Fetch from Eventbrite
    const eventbriteEvents = await fetchEventsFromEventbrite();
    events = [...events, ...eventbriteEvents];
    
    // Add other API integrations here if needed
    // const meetupEvents = await fetchEventsFromMeetup();
    // events = [...events, ...meetupEvents];
    
    // If no events were fetched from APIs, use sample data
    if (events.length === 0) {
      const sampleEvents = await getSampleEvents();
      events = sampleEvents;
      return res.status(200).json({ 
        success: true, 
        count: events.length, 
        data: events,
        message: 'Using sample data - Failed to load events from API'
      });
    }
    
    return res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    console.error('Error in getEvents:', error.message);
    
    // Fallback to sample data in case of any error
    try {
      const sampleEvents = await getSampleEvents();
      return res.status(200).json({ 
        success: true, 
        count: sampleEvents.length, 
        data: sampleEvents,
        message: 'Using sample data - Failed to load events from API'
      });
    } catch (fallbackError) {
      return res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
};
