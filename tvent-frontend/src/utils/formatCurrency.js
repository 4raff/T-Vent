/**
 * Format number to Indonesian Rupiah currency
 * @param {number} amount - The amount to format
 * @returns {string} - Formatted currency string (e.g., "Rp10.000.000")
 */
export const formatRupiah = (amount) => {
  if (!amount || isNaN(amount)) return "Rp0";
  
  const number = Math.round(parseFloat(amount));
  return `Rp${number.toLocaleString("id-ID")}`;
};

/**
 * Format number to Indonesian Rupiah without Rp prefix
 * @param {number} amount - The amount to format
 * @returns {string} - Formatted number string (e.g., "10.000.000")
 */
export const formatNumber = (amount) => {
  if (!amount || isNaN(amount)) return "0";
  
  const number = Math.round(parseFloat(amount));
  return number.toLocaleString("id-ID");
};
