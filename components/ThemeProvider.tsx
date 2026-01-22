'use client'

import { useEffect } from 'react'
import axios from 'axios'

// Retry utility function with exponential backoff
const fetchWithRetry = async (url: string, maxRetries = 3, baseDelay = 1000) => {
  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      const response = await axios.get(url, { timeout: 5000 })
      return response.data
    } catch (error) {
      if (attempt === maxRetries - 1) throw error
      // Exponential backoff: 1s, 2s, 4s
      await new Promise(resolve => setTimeout(resolve, baseDelay * Math.pow(2, attempt)))
    }
  }
}

export default function ThemeProvider() {
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const data = await fetchWithRetry('/api/settings')
        if (data) {
          // Set CSS variables for dynamic theming
          const root = document.documentElement

          if (data.primaryColor) {
            root.style.setProperty('--color-primary', data.primaryColor)
          }

          if (data.secondaryColor) {
            root.style.setProperty('--color-secondary', data.secondaryColor)
          }
        }
      } catch (error) {
        // Silently fail - use default theme colors from CSS
        // This prevents the error from being logged multiple times
        if (process.env.NODE_ENV === 'development') {
          console.warn('Theme loading failed, using default colors')
        }
      }
    }

    loadTheme()
  }, [])

  return null
}
