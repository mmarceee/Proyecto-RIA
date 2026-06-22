<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const router = useRouter()

// Campos del formulario
const username = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

// Estados de feedback
const errorMsg = ref('')
const successMsg = ref('')
const cargando = ref(false)

// Función para procesar el registro
function handleRegister() {
  errorMsg.value = ''
  successMsg.value = ''
  // Validaciones básicas en el cliente
  if (!username.value.trim() || !email.value.trim() || !password.value || !confirmPassword.value) {
    errorMsg.value = 'Por favor, completa todos los campos.'
    return
  }
  if (password.value !== confirmPassword.value) {
    errorMsg.value = 'Las contraseñas no coinciden.'
    return
  }
  if (password.value.length < 4) {
    errorMsg.value = 'La contraseña debe tener al menos 4 caracteres.'
    return
  }
  cargando.value = true
  // Retardo simulado para una buena transición visual
  setTimeout(() => {
    try {
      const userToRegister = username.value.trim()
      const passToRegister = password.value
      // 1. Registramos el usuario en LocalStorage
      authStore.registrarUsuario(userToRegister, email.value.trim(), passToRegister)
      
      // 2. Iniciamos sesión automáticamente con los mismos datos
      authStore.iniciarSesion(userToRegister, passToRegister)
      
      successMsg.value = '¡Cuenta creada con éxito! Iniciando sesión...'
      
      // Limpiamos los campos
      username.value = ''
      email.value = ''
      password.value = ''
      confirmPassword.value = ''
      // 3. Redirigir directamente al Home (/) después de 1.5 segundos
      setTimeout(() => {
        router.push('/')
      }, 1500)
    } catch (error) {
      // Si el store tira un error (ej. usuario o email repetidos), lo capturamos aquí
      errorMsg.value = error.message
    } finally {
      cargando.value = false
    }
  }, 800)
}
</script>

<template>
  <section class="auth-view">
    <div class="auth-card">
      <h2 class="auth-card__title">Crear Cuenta</h2>
      <p class="auth-card__subtitle">Únete a ChickenThiefGames para guardar tus favoritos</p>

      <!-- Mensajes de Estado -->
      <div v-if="errorMsg" class="auth-alert auth-alert--error" role="alert">
        <span>⚠️</span> {{ errorMsg }}
      </div>
      <div v-if="successMsg" class="auth-alert auth-alert--success" role="alert">
        <span>✅</span> {{ successMsg }}
      </div>

      <!-- Formulario -->
      <form class="auth-form" @submit.prevent="handleRegister">
        <div class="auth-form__group">
          <label for="username" class="auth-form__label">Nombre de Usuario</label>
          <input
            id="username"
            v-model="username"
            type="text"
            class="auth-form__input"
            placeholder="Ej: chickenthief"
            required
            :disabled="cargando"
          />
        </div>

        <div class="auth-form__group">
          <label for="email" class="auth-form__label">Correo Electrónico</label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="auth-form__input"
            placeholder="correo@ejemplo.com"
            required
            :disabled="cargando"
          />
        </div>

        <div class="auth-form__group">
          <label for="password" class="auth-form__label">Contraseña</label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="auth-form__input"
            placeholder="••••••••"
            required
            :disabled="cargando"
          />
        </div>

        <div class="auth-form__group">
          <label for="confirmPassword" class="auth-form__label">Confirmar Contraseña</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            class="auth-form__input"
            placeholder="••••••••"
            required
            :disabled="cargando"
          />
        </div>

        <button type="submit" class="auth-form__button" :disabled="cargando">
          <span v-if="cargando">Creando cuenta...</span>
          <span v-else>Registrarse</span>
        </button>
      </form>

      <div class="auth-card__footer">
        ¿Ya tienes una cuenta?
        <RouterLink to="/login" class="auth-card__link">Inicia sesión aquí</RouterLink>
      </div>
    </div>
  </section>
</template>

<style scoped>
.auth-view {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 3rem 1rem;
  min-height: 70vh;
}

.auth-card {
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  padding: 2.5rem;
  width: 100%;
  max-width: 450px;
  box-shadow: 0 8px 24px var(--color-card-shadow);
  transition: var(--transition-normal);
}

.auth-card__title {
  font-family: var(--font-title);
  color: var(--color-text-primary);
  font-size: 1.8rem;
  margin-bottom: 0.5rem;
  text-align: center;
}

.auth-card__subtitle {
  color: var(--color-text-muted);
  font-size: 0.95rem;
  margin-bottom: 2rem;
  text-align: center;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.auth-form__group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.auth-form__label {
  color: var(--color-text-secondary);
  font-size: 0.9rem;
  font-weight: 600;
}

.auth-form__input {
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  color: var(--color-text-primary);
  border-radius: var(--border-radius-md);
  padding: 0.8rem 1rem;
  font-size: 1rem;
  transition: var(--transition-fast);
}

.auth-form__input:focus {
  border-color: var(--color-accent);
  box-shadow: 0 0 0 2px rgba(var(--color-accent-rgb), 0.2);
}

.auth-form__input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-form__button {
  background-color: var(--color-accent);
  color: #fff;
  font-weight: 700;
  border-radius: var(--border-radius-md);
  padding: 0.9rem;
  font-size: 1rem;
  text-align: center;
  transition: var(--transition-fast);
  margin-top: 0.5rem;
  box-shadow: 0 4px 6px rgba(var(--color-accent-rgb), 0.2);
}

.auth-form__button:hover:not(:disabled) {
  background-color: var(--color-accent-hover);
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(var(--color-accent-rgb), 0.3);
}

.auth-form__button:active:not(:disabled) {
  transform: translateY(0);
}

.auth-form__button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.auth-alert {
  border-radius: var(--border-radius-md);
  padding: 0.8rem 1rem;
  font-size: 0.9rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  animation: fadeIn 0.3s ease;
}

.auth-alert--error {
  background-color: rgba(224, 90, 71, 0.15);
  border: 1px solid var(--color-accent);
  color: #f77d6c;
}

.auth-alert--success {
  background-color: rgba(46, 204, 113, 0.15);
  border: 1px solid #2ecc71;
  color: #2ecc71;
}

.auth-card__footer {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
  color: var(--color-text-secondary);
}

.auth-card__link {
  color: var(--color-accent);
  font-weight: 600;
  margin-left: 0.25rem;
  border-bottom: 1px solid transparent;
}

.auth-card__link:hover {
  color: var(--color-accent-hover);
  border-bottom-color: var(--color-accent-hover);
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-5px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>