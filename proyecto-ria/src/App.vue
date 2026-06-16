<script setup>
  import { RouterLink, RouterView } from 'vue-router'
  import { onMounted } from 'vue'
  import { useSettingsStore } from '@/stores/settingsStore'
  import logoHead from '@/assets/logo-head.png'

  const settingsStore = useSettingsStore()

  // Alternar entre tema claro y oscuro
  function toggleTheme() {
    const nextTheme = settingsStore.theme === 'theme-light' ? 'theme-dark' : 'theme-light'
    settingsStore.setTheme(nextTheme)
  }

  // Aplicar el tema configurado al iniciar la aplicación
  onMounted(() => {
    settingsStore.applyTheme(settingsStore.theme)
  })
</script>

<template>
  <header class="app-header">
    <!-- Interruptor de Tema Deslizante (Sol y Luna) -->
    <button 
      class="theme-toggle" 
      :class="{ 'theme-toggle--light': settingsStore.theme === 'theme-light' }"
      @click="toggleTheme"
      :aria-label="settingsStore.theme === 'theme-light' ? 'Activar modo oscuro' : 'Activar modo claro'"
      type="button"
    >
      <span class="theme-toggle__icon theme-toggle__icon--moon">🌙</span>
      <span class="theme-toggle__icon theme-toggle__icon--sun">☀️</span>
      <span class="theme-toggle__knob"></span>
    </button>

    <div class="app-header__brand">
      <div class="app-header__logo-container">
        <img class="app-header__logo-img" :src="logoHead" alt="ChickenThief Games Logo" />
        <h1 class="app-header__logo-text">ChickenThief<span>Games</span></h1>
      </div>
      <p class="app-header__logo-sub">Tu Base de Datos de Videojuegos</p>
    </div>
    <nav class="app-header__nav">
      <RouterLink class="app-header__link" to="/"> Inicio </RouterLink>
      <RouterLink class="app-header__link" to="/games"> Juegos </RouterLink>
      <RouterLink class="app-header__link" to="/favorites"> Favoritos </RouterLink>
      <RouterLink class="app-header__link" to="/settings"> Configuración </RouterLink>
    </nav>
  </header>

  <main class="app-main">
    <RouterView />
  </main>

  <footer class="app-footer">
    <div class="app-footer__container">
      <div class="app-footer__links">
        <RouterLink class="app-footer__link" to="/">Inicio</RouterLink>
        <RouterLink class="app-footer__link" to="/games">Juegos</RouterLink>
        <RouterLink class="app-footer__link" to="/favorites">Favoritos</RouterLink>
        <RouterLink class="app-footer__link" to="/settings">Configuración</RouterLink>
      </div>
      <div class="app-footer__copyright">
        <p>&copy; 2026 ChickenThiefGames. Todos los derechos reservados.</p>
      </div>
    </div>
  </footer>
</template>