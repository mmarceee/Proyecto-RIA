<script setup>
  import { RouterLink, RouterView } from 'vue-router'
  import { onMounted } from 'vue'
  import { useSettingsStore } from '@/stores/settingsStore'
  import logoHead from '@/assets/logo-head.png'

  const settingsStore = useSettingsStore()

  // Aplicar el tema configurado al iniciar la aplicación
  onMounted(() => {
    settingsStore.applyTheme(settingsStore.theme)
  })
</script>

<template>
  <header class="app-header">
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
        <p>Diseño inspirado en Escape Velocity por <a href="https://html5up.net" target="_blank" rel="noopener noreferrer">HTML5 UP</a>.</p>
      </div>
    </div>
  </footer>
</template>