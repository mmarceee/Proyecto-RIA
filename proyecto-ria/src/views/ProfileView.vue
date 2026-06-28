<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

const email = ref(authStore.currentUserDetails?.email ?? '')
const nuevaPassword = ref('')
const confirmarPassword = ref('')
const errorMsg = ref('')
const successMsg = ref('')

function guardarCambios() {
  errorMsg.value = ''
  successMsg.value = ''

  if (nuevaPassword.value !== confirmarPassword.value) {
    errorMsg.value = 'Las contraseñas no coinciden.'
    return
  }

  try {
    authStore.actualizarPerfil(email.value, nuevaPassword.value)

    nuevaPassword.value = ''
    confirmarPassword.value = ''
    successMsg.value = 'Perfil actualizado correctamente.'
  } catch (error) {
    errorMsg.value = error.message
  }
}
</script>

<template>
    <section class="profile-view">
        <h1 class="profile-view__title">Mi perfil</h1>

        <p class="profile-view__message profile-view__message--error" v-if="errorMsg" role="alert">{{ errorMsg }}</p>
        <p class="profile-view__message profile-view__message--success" v-if="successMsg" >{{ successMsg }}</p>

        <form class="profile-view__form" @submit.prevent="guardarCambios">
        <div class="profile-view__campo">
            <label class="profile-view__etiqueta" for="username">Nombre de usuario</label>
            <input  class="profile-view__input profile-view__input--readonly"
            id="username"
            :value="authStore.currentUser"
            type="text"
            readonly
            />
            <small class="profile-view__help">El nombre de usuario no se puede modificar.</small>
        </div>

        <div class="profile-view__campo">
            <label class="profile-view__etiqueta" for="email">Correo electrónico</label>
            <input
            id="email"
            v-model="email"
            class="profile-view__input"
            type="email"
            required
            />
        </div>

        <div class="profile-view__campo">
            <label class="profile-view__etiqueta" for="nuevaPassword">Nueva contraseña</label>
            <input
            id="nuevaPassword"
            v-model="nuevaPassword"
            class="profile-view__input"
            type="password"
            placeholder="Dejar vacío para mantener la actual"
            />
        </div>

        <div class="profile-view__campo">
            <label class="profile-view__etiqueta" for="confirmarPassword">Confirmar contraseña</label>
            <input
            id="confirmarPassword"
            class="profile-view__input"
            v-model="confirmarPassword"
            type="password"
            />
        </div>

        <button class="profile-view__submit" type="submit">Guardar cambios</button>
        </form>
    </section>
</template>

<style scoped>

.profile-view {
  width: min(100%, 32rem);
  margin: 0 auto;
  padding: 2rem;
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-lg);
  box-shadow: 0 8px 24px var(--color-card-shadow);
}

.profile-view__title {
  margin-bottom: 1.5rem;
  color: var(--color-text-primary);
  text-align: center;
}

.profile-view__message {
  margin-bottom: 1rem;
  padding: 0.75rem;
  border-radius: var(--border-radius-md);
}

.profile-view__message--error {
  color: var(--color-accent);
  background-color: rgba(var(--color-accent-rgb), 0.1);
  border: 1px solid var(--color-accent);
}

.profile-view__message--success {
  color: #4caf50;
  background-color: rgba(76, 175, 80, 0.1);
  border: 1px solid #4caf50;
}

.profile-view__form {
  display: grid;
  gap: 1.25rem;
}

.profile-view__campo {
  display: grid;
  gap: 0.4rem;
}

.profile-view__etiqueta {
  color: var(--color-text-secondary);
  font-weight: 600;
}

.profile-view__input {
  padding: 0.75rem;
  color: var(--color-text-primary);
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  transition: var(--transition-fast);
}

.profile-view__input:focus {
  outline: none;
  border-color: var(--color-accent);
}

.profile-view__input:hover{
  outline: none;
  border-color: var(--color-accent);
}

.profile-view__input--readonly {
  color: var(--color-text-muted);
  cursor: not-allowed;
  border: none;
}

.profile-view__help {
  color: var(--color-text-muted);
}

.profile-view__submit {
  padding: 0.75rem;
  color: var(--color-text-primary);
  font-weight: 700;
  background-color: var(--color-accent);
  border: none;
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: var(--transition-fast);
}

.profile-view__submit:hover,
.profile-view__submit:focus-visible {
  background-color: var(--color-accent-hover);
}

</style>