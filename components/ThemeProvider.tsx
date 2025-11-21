'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'

export default function ThemeProvider() {
  useEffect(() => {
    const loadTheme = async () => {
      try {
        const { data } = await axios.get('/api/settings')
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
        console.error('Failed to load theme:', error)
      }
    }

    loadTheme()
  }, [])

  return null
}
