<script setup>
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { ref, onMounted } from 'vue'
import { useSettingsStore } from '@/stores/settingsStore'
import { useAuthStore } from '@/stores/authStore' // 1. Importamos el store de autenticación
import logoHead from '@/assets/logo-head.png'

const settingsStore = useSettingsStore()
const authStore = useAuthStore() // Instanciamos el store
const router = useRouter()
const hayConexion = ref(navigator.onLine) 

// Alternar entre tema claro y oscuro
function toggleTheme() {
  const nextTheme = settingsStore.theme === 'theme-light' ? 'theme-dark' : 'theme-light'
  settingsStore.setTheme(nextTheme)
}

// Aplicar el tema configurado al iniciar la aplicación
onMounted(() => {
  settingsStore.applyTheme(settingsStore.theme)

  window.addEventListener('offline', () => {
    hayConexion.value = false;
  })

  window.addEventListener('online', () => {
    hayConexion.value = true;
  })
})

// 3. Función para cerrar sesión y redirigir
function handleLogout() {
  authStore.cerrarSesion()
  router.push('/')
}
</script>

<template>
  <header class="app-header">

    <div v-if="!hayConexion" class="app-header__conexion">
      <span class="app-header__text">No tienes conexión a internet! Mostrando datos guardados.</span>
    </div>
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

    <!-- Navegación Dinámica -->
    <nav class="app-header__nav">
      <!-- Enlaces públicos siempre visibles -->
      <RouterLink class="app-header__link" to="/"> Inicio </RouterLink>
      <RouterLink class="app-header__link" to="/games"> Juegos </RouterLink>

      <!-- Enlaces visibles solo si está autenticado -->
      <template v-if="authStore.isAuthenticated">
        <RouterLink class="app-header__link" to="/favorites"> Favoritos </RouterLink>
        <RouterLink class="app-header__link" to="/settings"> Configuración </RouterLink>
        
        <!-- Bloque de información de usuario y botón de logout -->
        <div class="app-header__user-info">
          <span class="app-header__user-greeting">
            Hola, <strong>{{ authStore.currentUser }}</strong>
          </span>
          <button @click="handleLogout" class="app-header__logout-btn" type="button">
            Cerrar Sesión
          </button>
        </div>
      </template>

      <!-- Enlace a Login si es un invitado -->
      <template v-else>
        <RouterLink class="app-header__link app-header__link--login" to="/login">
          Iniciar Sesión
        </RouterLink>
      </template>
    </nav>
  </header>

  <main class="app-main">
    <RouterView />
  </main>

  <footer class="app-footer">
    <div class="app-footer__container">
      <div class="app-footer__copyright">
        <p>&copy; 2026 ChickenThiefGames. Todos los derechos reservados.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
/* Estilos para el bloque de información del usuario en la barra de navegación */
.app-header__user-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.1rem 0.5rem 0.1rem 1rem;
  border-left: 2px solid var(--color-border);
  margin-left: 0.5rem;
}

.app-header__user-greeting {
  font-family: var(--font-body);
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}

.app-header__user-greeting strong {
  color: var(--color-accent);
}

.app-header__logout-btn {
  font-family: var(--font-title);
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0.4rem 0.8rem;
  color: var(--color-text-primary);
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-sm);
  transition: var(--transition-fast);
}

.app-header__logout-btn:hover {
  background-color: var(--color-accent);
  color: #ffffff;
  border-color: var(--color-accent);
}

/* Resaltar el botón de iniciar sesión cuando no está logueado */
.app-header__link--login {
  border: 1px dashed var(--color-accent);
}

.app-header__link--login:hover {
  background-color: rgba(224, 90, 71, 0.1);
  border-style: solid;
}

.app-header__conexion {
  /* Usamos un rojo/coral intenso para que llame la atención pero no lastime a la vista */
  background-color: #ff4757; 
  color: #ffffff; /* Texto blanco puro para contraste perfecto */
  text-align: center;
  padding: 0.6rem 1rem;
  font-family: var(--font-title, sans-serif);
  font-weight: 600;
  font-size: 0.9rem;
  letter-spacing: 0.5px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  border-radius: var(--border-radius-sm);
  
  /* Hacemos que se pegue arriba de todo en la pantalla */
  position: sticky;
  top: 0;
  z-index: 1000;
  
  /* Le damos vida con una animación suave de entrada */
  animation: deslizarAbajo 0.4s ease-out;
}
/* La animación que hace que el cartel baje desde arriba */
@keyframes deslizarAbajo {
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
}
/* Adaptación responsive para pantallas pequeñas */
@media (max-width: 768px) {
  .app-header__user-info {
    border-left: none;
    border-top: 2px solid var(--color-border);
    padding-top: 0.75rem;
    padding-left: 0;
    margin-left: 0;
    width: 100%;
    justify-content: center;
  }
}
</style>