<script setup>
    import { ref, onMounted, computed } from 'vue'
    import { useRoute, useRouter } from 'vue-router' 
    import { getGameById } from '@/services/gameService'
    import LoadingState from '@/components/LoadingState.vue'
    import ErrorState from '@/components/ErrorState.vue'
    import { useFavoriteStore } from '@/stores/favoriteStore'
    import { useAuthStore } from '@/stores/authStore'
   
    const route = useRoute()
    const router = useRouter()
    const favoritoStore = useFavoriteStore()
    const authStore = useAuthStore()

    const game = ref(null)
    const cargando = ref(true)
    const error = ref(null)

    onMounted(async () => {
        const id = route.params.id
        try {
            game.value = await getGameById(id)
        } catch (err) {
            error.value = 'Error al cargar los detalles del juego'
            console.error(err)
        } finally {
            cargando.value = false
        }
    })
    const genreNames = computed(() => {
        if (!game.value?.genres?.length) {
            return 'Sin información'
        }
        return game.value.genres.map((item) => item.name).join(', ')
    })
    const platformNames = computed(() => {
        if (!game.value?.platforms?.length) {
            return 'Sin información'
        }
    
        return game.value.platforms.map((item) => item.platform.name).join(', ')
    })
    const elJuegoActualEsFavorito = computed(() => {
        if (!game.value){
            return false
        }
        return favoritoStore.isFavorito(game.value.id)
    })

    function handleFavoriteClick() {
      if (!authStore.isAuthenticated) {
        
        router.push('/login')
      } else {
        favoritoStore.marcarDesmarcarFavorito(game.value)
      }
    }
</script>

<template>
    <section class="game-detail">
        <LoadingState v-if="cargando" mensaje="Cargando detalles del juego..." />
        <ErrorState v-else-if="error" :mensaje="error" />
        <div v-else-if="game">
            <h1 class="game-detail__title">Detalles del Juego</h1>
            <p class="game-detail__name">{{ game.name }}</p>
            <button @click="handleFavoriteClick" class="game-detail__favorito-button--active" type="button">
                {{ elJuegoActualEsFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos' }} 
            </button>
            <img 
                class="game-detail__image"
                v-if="game.background_image"
                :src="game.background_image" 
                :alt="game.name"
            />
            <div v-else class="game-detail__placeholder">
                Sin imagen
            </div>
            <p class="game-detail__description" v-if="game.description_raw">{{ game.description_raw }}</p>
            <div v-else class="game-detail__placeholder">
                Sin descripción
            </div>
            <p class="game-detail__rating">Calificación: {{ game.rating }}</p>
            <p class="game-detail__released">Lanzamiento: {{ game.released }}</p>
            <p class="game-detail__platforms">Plataformas: {{ platformNames}}</p>
            <p class="game-detail__genres">Géneros: {{ genreNames }}</p>
        </div>
    </section>
</template>

<style scoped></style>
