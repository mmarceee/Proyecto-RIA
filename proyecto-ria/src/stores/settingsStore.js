import { defineStore } from 'pinia'
import { useLocalStorage } from '@/composables/useLocalStorage'

export const useSettingsStore = defineStore('settings', () => {
  // Guardamos el tema en localStorage. Por defecto: theme-dark
  const themeStorage = useLocalStorage('theme-preference', 'theme-dark')

  function setTheme(newTheme) {
    themeStorage.save(newTheme)
    applyTheme(newTheme)
  }

  function applyTheme(theme) {
    if (theme === 'theme-light') {
      document.body.classList.add('theme-light')
    } else {
      document.body.classList.remove('theme-light')
    }
  }

  return {
    theme: themeStorage.data,
    setTheme,
    applyTheme
  }
})
