/**
 * Format a date string to a more readable format
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  
  return new Date(dateString).toLocaleDateString('en-US', options);
};

/**
 * Format a date range
 * @param {string} startDate - ISO date string
 * @param {string} endDate - ISO date string
 * @returns {string} Formatted date range
 */
export const formatDateRange = (startDate, endDate) => {
  if (!startDate) return '';
  if (!endDate || startDate === endDate) return formatDate(startDate);
  
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // If same month and year, only show the day for start date
  if (start.getMonth() === end.getMonth() && start.getFullYear() === end.getFullYear()) {
    return `${start.getDate()} - ${formatDate(endDate)}`;
  }
  
  return `${formatDate(startDate)} - ${formatDate(endDate)}`;
};

/**
 * Check if a date is in the past
 * @param {string} dateString - ISO date string
 * @returns {boolean} True if date is in the past
 */
export const isPastEvent = (dateString) => {
  if (!dateString) return false;
  
  const eventDate = new Date(dateString);
  const today = new Date();
  
  // Set time to beginning of day for comparison
  today.setHours(0, 0, 0, 0);
  
  return eventDate < today;
};

/**
 * Get relative time description (e.g., "2 days ago", "in 3 weeks")
 * @param {string} dateString - ISO date string
 * @returns {string} Relative time description
 */
export const getRelativeTime = (dateString) => {
  if (!dateString) return '';
  
  const date = new Date(dateString);
  const now = new Date();
  const diffTime = date - now;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays < 0) {
    // Past
    if (diffDays === -1) return 'yesterday';
    if (diffDays > -7) return `${Math.abs(diffDays)} days ago`;
    if (diffDays > -30) return `${Math.ceil(Math.abs(diffDays) / 7)} weeks ago`;
    if (diffDays > -365) return `${Math.ceil(Math.abs(diffDays) / 30)} months ago`;
    return `${Math.ceil(Math.abs(diffDays) / 365)} years ago`;
  } else if (diffDays === 0) {
    // Today
    return 'today';
  } else {
    // Future
    if (diffDays === 1) return 'tomorrow';
    if (diffDays < 7) return `in ${diffDays} days`;
    if (diffDays < 30) return `in ${Math.ceil(diffDays / 7)} weeks`;
    if (diffDays < 365) return `in ${Math.ceil(diffDays / 30)} months`;
    return `in ${Math.ceil(diffDays / 365)} years`;
  }
};