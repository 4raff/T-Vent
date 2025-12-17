/**
 * Capitalize first letter of a string
 * @param {string} str - String to capitalize
 * @returns {string} - Capitalized string
 */
export const capitalizeFirstLetter = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

/**
 * Get status badge color based on status
 * @param {string} status - Event/Payment/Ticket status
 * @returns {object} - Object with bgColor and textColor
 */
export const getStatusColor = (status) => {
  const statusLower = status?.toLowerCase() || '';
  
  switch (statusLower) {
    case 'approved':
    case 'success':
    case 'confirmed':
    case 'active':
    case 'used':
      return {
        bgColor: 'bg-green-100',
        textColor: 'text-green-800'
      };
    case 'pending':
      return {
        bgColor: 'bg-yellow-100',
        textColor: 'text-yellow-800'
      };
    case 'rejected':
    case 'cancelled':
    case 'failed':
      return {
        bgColor: 'bg-red-100',
        textColor: 'text-red-800'
      };
    case 'blue':
    case 'info':
      return {
        bgColor: 'bg-blue-100',
        textColor: 'text-blue-800'
      };
    default:
      return {
        bgColor: 'bg-purple-100',
        textColor: 'text-purple-800'
      };
  }
};

/**
 * Capitalize status strings with underscores
 * @param {string} status - Status string (with underscores)
 * @returns {string} - Formatted status string
 */
export const capitalizeStatus = (status) => {
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};
