import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { API_BASE_URL } from './utils/api.js'

// When deployed to production (e.g., Vercel) with a separate backend (e.g., Render),
// route all relative /api and /uploads requests directly to the deployed backend URL.
if (API_BASE_URL) {
  const originalFetch = window.fetch.bind(window)
  window.fetch = (input, init) => {
    if (typeof input === 'string') {
      if (input.startsWith('/api') || input.startsWith('/uploads')) {
        return originalFetch(`${API_BASE_URL}${input}`, init)
      }
    } else if (input instanceof Request) {
      try {
        const url = new URL(input.url)
        if (url.origin === window.location.origin && (url.pathname.startsWith('/api') || url.pathname.startsWith('/uploads'))) {
          const targetUrl = `${API_BASE_URL}${url.pathname}${url.search}`
          return originalFetch(new Request(targetUrl, input), init)
        }
      } catch {
        // Fallback to original fetch
      }
    }
    return originalFetch(input, init)
  }
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
