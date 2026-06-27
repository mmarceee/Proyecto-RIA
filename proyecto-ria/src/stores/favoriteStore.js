import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { useAuthStore } from '@/stores/authStore' 
import { guardarFavoritoDB, obtenerFavoritosUsuarioDB, eliminarFavoritoDB } from '@/services/db'

export const useFavoriteStore = defineStore('favoritos', () => {
  const authStore = useAuthStore()
  
  // Referencia reactiva interna para los favoritos
  const favoritos = ref([])
  
  //  Función dinámica para cargar los favoritos del usuario actual
async function cargarFavoritosUsuario() {
  const usuarioActivo = authStore.currentUser || 'invitado'
  try {
    // Trae los datos de IndexedDB en vez de localStorage
    const favoritosDB = await obtenerFavoritosUsuarioDB(usuarioActivo)
    favoritos.value = favoritosDB
  } catch (error) {
    console.error("Error al cargar favoritos de IndexedDB", error)
  }
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

 async function agregarFavorito(game) {
  if (isFavorito(game.id)) return
  
  const usuarioActivo = authStore.currentUser || 'invitado'
  const juegoFavorito = {
    id: game.id,
    name: game.name,
    background_image: game.background_image,
    rating: game.rating,
    released: game.released,
  }
  // 1. Guardamos localmente en la reactividad
  favoritos.value.push(juegoFavorito)
  
  // 2. Guardamos de forma asíncrona en IndexedDB
  try {
    await guardarFavoritoDB(juegoFavorito, usuarioActivo)
  } catch (error) {
    console.error("No se pudo guardar en IndexedDB", error)
  }
}
async function quitarFavorito(gameId) {
  favoritos.value = favoritos.value.filter(favorito => favorito.id !== gameId)
  
  const usuarioActivo = authStore.currentUser || 'invitado'
  
  try {
    await eliminarFavoritoDB(gameId, usuarioActivo)
  } catch (error) {
    console.error("No se pudo eliminar de IndexedDB", error)
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