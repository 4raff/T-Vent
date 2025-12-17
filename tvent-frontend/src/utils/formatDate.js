/**
 * Format date to readable format (e.g., "15 Des 2025, 09:00")
 * @param {string|Date} dateString - ISO date string or Date object
 * @returns {string} Formatted date string
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return 'TBD';
  
  try {
    const date = new Date(dateString);
    const options = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    };
    
    return date.toLocaleDateString('id-ID', options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'TBD';
  }
};

/**
 * Format date only (e.g., "15 Des 2025")
 * @param {string|Date} dateString - ISO date string or Date object
 * @returns {string} Formatted date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return 'TBD';
  
  try {
    const date = new Date(dateString);
    const options = {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    };
    
    return date.toLocaleDateString('id-ID', options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'TBD';
  }
};

/**
 * Format time only (e.g., "09:00")
 * @param {string|Date} dateString - ISO date string or Date object
 * @returns {string} Formatted time string
 */
export const formatTime = (dateString) => {
  if (!dateString) return 'TBD';
  
  try {
    const date = new Date(dateString);
    const options = {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    };
    
    return date.toLocaleTimeString('id-ID', options);
  } catch (error) {
    console.error('Error formatting time:', error);
    return 'TBD';
  }
};
