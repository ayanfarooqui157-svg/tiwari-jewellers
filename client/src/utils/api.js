/**
 * Tiwari Jewellers - API Endpoint and Base URL Manager
 * 
 * In local development:
 *   If VITE_API_URL is unset, relative paths like '/api/products' are routed
 *   through Vite's proxy configured in vite.config.js to http://localhost:5000.
 * 
 * In production (e.g., deployed to Vercel with backend on Render):
 *   VITE_API_URL contains the live Render backend URL (e.g. 'https://tiwari-jewellers-api.onrender.com').
 *   All requests are automatically prefixed with VITE_API_URL.
 */

export const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

/**
 * Resolves a full endpoint URL for any API request or asset.
 * @param {string} endpoint - Path like '/api/products' or '/uploads/item.jpg'
 * @returns {string} Fully qualified or relative URL
 */
export function getApiUrl(endpoint = '') {
  if (!endpoint) return API_BASE_URL;
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) {
    return endpoint;
  }
  const normalized = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return API_BASE_URL ? `${API_BASE_URL}${normalized}` : normalized;
}

/**
 * Enhanced fetch helper that automatically prepends API_BASE_URL when defined.
 * @param {string|Request} input
 * @param {RequestInit} [init]
 * @returns {Promise<Response>}
 */
export function apiFetch(input, init) {
  if (typeof input === 'string') {
    return fetch(getApiUrl(input), init);
  }
  return fetch(input, init);
}

export default getApiUrl;

