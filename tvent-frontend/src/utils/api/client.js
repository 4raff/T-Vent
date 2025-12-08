import { API_CONFIG } from '@/config/api';

/**
 * Create a custom fetch wrapper with error handling
 */
class ApiClient {
  constructor(baseURL, timeout = API_CONFIG.TIMEOUT) {
    this.baseURL = baseURL;
    this.timeout = timeout;
  }

  /**
   * Make an HTTP request
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };

    // Tambah JWT token from localStorage if available
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('jwtToken');
      if (token) {
        // Token already has 'Bearer ' prefix from backend, so don't add it again
        headers['Authorization'] = token;
      }
    }

    const config = {
      ...options,
      headers,
      signal: AbortSignal.timeout(this.timeout),
    };

    try {
      const response = await fetch(url, config);

      // Try to parse JSON response
      let responseData = {};
      try {
        responseData = await response.json();
      } catch (e) {
        // Response is not JSON (might be HTML error page)
        responseData = { message: response.statusText };
      }

      if (!response.ok) {
        const errorMsg = responseData?.message || responseData?.error || response.statusText;
        console.error(`API Error [${response.status}]:`, endpoint, errorMsg, responseData);
        throw new ApiError(
          errorMsg,
          response.status,
          responseData
        );
      }

      return responseData;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      console.error('API Network Error:', endpoint, error.message);
      throw new ApiError('Network error', 0, { message: error.message });
    }
  }

  /**
   * GET request
   */
  async get(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'GET',
    });
  }

  /**
   * POST request
   */
  async post(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  /**
   * PUT request
   */
  async put(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  /**
   * DELETE request
   */
  async delete(endpoint, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'DELETE',
    });
  }

  /**
   * PATCH request
   */
  async patch(endpoint, data, options = {}) {
    return this.request(endpoint, {
      ...options,
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }
}

/**
 * Custom API Error class
 */
export class ApiError extends Error {
  constructor(message, status, data) {
    super(message);
    this.status = status;
    this.data = data;
    this.name = 'ApiError';
  }
}

// Export singleton instance
export const apiClient = new ApiClient(API_CONFIG.BASE_URL);
