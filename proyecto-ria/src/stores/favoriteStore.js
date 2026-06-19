import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useLocalStorage } from '@/composables/useLocalStorage'
import { useAuthStore } from '@/stores/authStore' // 1. Importamos el store de autenticación

export const useFavoriteStore = defineStore('favoritos', () => {
  const authStore = useAuthStore()
  
  // Referencia reactiva interna para los favoritos
  const favoritos = ref([])
  
  // Guardamos la referencia al almacenamiento local activo en memoria
  let storageActivo = null

  // 2. Función dinámica para cargar los favoritos del usuario actual
  function cargarFavoritosUsuario() {
    // Si no hay sesión iniciada, los favoritos se guardan bajo el perfil de 'invitado'
    const usuarioActivo = authStore.currentUser || 'invitado'
    const KEY_FAVORITOS = `juegos-favoritos-${usuarioActivo}`
    
    // Obtenemos el helper de localStorage con la clave específica
    storageActivo = useLocalStorage(KEY_FAVORITOS, [])
    
    // Sincronizamos la referencia reactiva
    favoritos.value = storageActivo.data.value
  }

  // Inicializar al cargar el store por primera vez
  cargarFavoritosUsuario()

  // 3. Observamos los cambios en el usuario del authStore.
  // Si inicia sesión otro usuario o se cierra sesión, recargamos sus favoritos específicos.
  watch(
    () => authStore.currentUser,
    () => {
      cargarFavoritosUsuario()
    }
  )

  // 4. Métodos del Store (adaptados al almacenamiento activo dinámico)
  function agregarFavorito(game) {
    if (isFavorito(game.id)) {
      return
    }
    
    const juegoFavorito = {
      id: game.id,
      name: game.name,
      background_image: game.background_image,
      rating: game.rating,
      released: game.released,
    }

    favoritos.value.push(juegoFavorito)
    if (storageActivo) {
      storageActivo.save(favoritos.value)
    }
  }
  
  function quitarFavorito(gameId) {
    favoritos.value = favoritos.value.filter(favorito => favorito.id !== gameId)
    if (storageActivo) {
      storageActivo.save(favoritos.value)
    }
  }

  function isFavorito(gameId) {
    return favoritos.value.some(favorito => favorito.id === gameId)
  }

  function marcarDesmarcarFavorito(game) {
    if (isFavorito(game.id)) {
      quitarFavorito(game.id)
    } else {
      agregarFavorito(game)
    }
  }

  return {
    favoritos,
    agregarFavorito,
    quitarFavorito,
    isFavorito,
    marcarDesmarcarFavorito
  }
})