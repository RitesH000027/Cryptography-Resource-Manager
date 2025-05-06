// ... existing code ...

const EventCard = ({ event }) => {
  const handleViewDetails = () => {
    // If the event has a URL, redirect to it
    if (event.url) {
      window.open(event.url, '_blank');
    } else {
      // If no URL is available, you might want to show a modal with event details
      // or navigate to a details page within your app
      console.log('No external URL available for this event');
      // You could implement a fallback here
    }
  };

  return (
    <div className="event-card">
      {/* ... existing card content ... */}
      
      <button 
        className="view-details-btn" 
        onClick={handleViewDetails}
      >
        View Details
      </button>
    </div>
  );
};

// ... existing code ...