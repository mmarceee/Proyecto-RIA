import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { useLocalStorage } from '@/composables/useLocalStorage'
import { useSessionStorage } from '@/composables/useSessionStorage'

export const useAuthStore = defineStore('auth', () => {
  // 1. Almacenamiento local de todos los usuarios registrados
  const usuariosStorage = useLocalStorage('usuarios-registrados', [])
  
  // 2. Almacenamiento de la sesión del usuario activo (se borra al cerrar el navegador)
  const sessionActivaStorage = useSessionStorage('usuario-activo', '')

  // Referencias reactivas vinculadas al storage
  const usuarios = ref(usuariosStorage.data.value)
  const currentUser = ref(sessionActivaStorage.data.value)

  // 3. Inicialización del usuario administrador por defecto (Semilla)
  function inicializarUsuariosSemilla() {
    if (usuarios.value.length === 0) {
      const adminUser = {
        username: 'admin',
        email: 'admin@gmail.com',
        password: 'admin' // En un entorno real se usaría hashing, pero para simulación es ideal
      }
      usuarios.value.push(adminUser)
      usuariosStorage.save(usuarios.value)
    }
  }

  // Ejecutamos la inicialización al cargar el store
  inicializarUsuariosSemilla()

  // 4. Getters reactivos
  const isAuthenticated = computed(() => {
    return currentUser.value !== ''
  })

  // Obtener el objeto completo del usuario actual (por si se necesita el email)
  const currentUserDetails = computed(() => {
    if (!isAuthenticated.value) return null
    return usuarios.value.find(u => u.username === currentUser.value) || null
  })

  // 5. Acciones: Registro de nuevos usuarios
  function registrarUsuario(username, email, password) {
    // Validar si el usuario ya existe
    const existeUsername = usuarios.value.some(
      u => u.username.toLowerCase() === username.toLowerCase()
    )
    if (existeUsername) {
      throw new Error('El nombre de usuario ya está registrado.')
    }

    // Validar si el email ya existe
    const existeEmail = usuarios.value.some(
      u => u.email.toLowerCase() === email.toLowerCase()
    )
    if (existeEmail) {
      throw new Error('El correo electrónico ya está registrado.')
    }

    // Guardar nuevo usuario
    const nuevoUsuario = {
      username,
      email,
      password
    }

    usuarios.value.push(nuevoUsuario)
    usuariosStorage.save(usuarios.value)
    return true
  }

  // 6. Acciones: Inicio de Sesión
  function iniciarSesion(username, password) {
    const usuarioEncontrado = usuarios.value.find(
      u => u.username.toLowerCase() === username.toLowerCase()
    )

    if (!usuarioEncontrado) {
      throw new Error('El usuario no existe.')
    }

    if (usuarioEncontrado.password !== password) {
      throw new Error('La contraseña es incorrecta.')
    }

    // Guardar en la sesión reactiva y persistir en sessionStorage
    currentUser.value = usuarioEncontrado.username
    sessionActivaStorage.save(usuarioEncontrado.username)
    return true
  }

  function actualizarPerfil(email, nuevaPassword = '') {
    const emailNormalizado = email.trim()

    if (!emailNormalizado) {
      throw new Error('El correo electrónico es obligatorio.')
    }

    const indiceUsuario = usuarios.value.findIndex(
      usuario => usuario.username === currentUser.value
    )

    if (indiceUsuario === -1) {
      throw new Error('No se encontró el usuario activo.')
    }

    const emailEnUso = usuarios.value.some(
      (usuario, indice) =>
        indice !== indiceUsuario &&
        usuario.email.toLowerCase() === emailNormalizado.toLowerCase()
    )

    if (emailEnUso) {
      throw new Error('El correo electrónico ya está registrado.')
    }

    if (nuevaPassword && nuevaPassword.length < 4) {
      throw new Error('La contraseña debe tener al menos 4 caracteres.')
    }

    const usuarioActual = usuarios.value[indiceUsuario]

    usuarios.value[indiceUsuario] = {
      ...usuarioActual,
      email: emailNormalizado,
      ...(nuevaPassword ? { password: nuevaPassword } : {})
    }

    usuariosStorage.save([...usuarios.value])
    return true
  }

  // 7. Acciones: Cerrar Sesión
  function cerrarSesion() {
    currentUser.value = ''
    sessionActivaStorage.save('')
  }

  return {
    usuarios,
    currentUser,
    isAuthenticated,
    currentUserDetails,
    registrarUsuario,
    iniciarSesion,
    actualizarPerfil,
    cerrarSesion,
  }
})
