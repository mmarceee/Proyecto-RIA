<script setup>
    import { useRoute } from 'vue-router'
    import { ref, onMounted, computed } from 'vue'
    import { getGameById, getGameScreenshots } from '@/services/gameService'
    import LoadingState from '@/components/LoadingState.vue'
    import ErrorState from '@/components/ErrorState.vue'
    import { useFavoriteStore } from '@/stores/favoriteStore'

    const route = useRoute()
    const gameId = route.params.id
    const game = ref(null)
    const cargando = ref(false)
    const error = ref(null)
    const screenshots = ref([])

    const favoritoStore = useFavoriteStore()

    onMounted(async () => {
        cargando.value = true
        error.value = null
        try{
            game.value = await getGameById(gameId)
            screenshots.value = await getGameScreenshots(gameId)
        } catch (err) {
            error.value = 'Error al cargar los detalles del juego'
            console.error(err)
        } finally {
            cargando.value = false
        }
    })

    // Computed para mostrar los nombres de los géneros
    const genreNames = computed(() => {
        if (!game.value?.genres?.length) { //el value?.genres : Si game.value existe, intentá acceder a genres. Si no existe, no rompe. (optional chaining)
            return 'Sin información'        // Y si todo eso es falso, osea no hay géneros disponibles, devolvé 'Sin información'.
        }

        return game.value.genres.map((genre) => genre.name).join(', ')
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


</script>

<template>
    <section class="game-detail">
        <LoadingState v-if="cargando" mensaje="Cargando detalles del juego..." />
        <ErrorState v-else-if="error" :mensaje="error" />
        <div v-else-if="game" class="game-detail__content">
            <div class="game-detail__media">
                <img 
                    class="game-detail__image"
                    v-if="game.background_image"
                    :src="game.background_image" 
                    :alt="game.name"
                />
                <div v-else class="game-detail__placeholder">
                    Sin imagen
                </div>
                <div class="game-detail__gallery-container" v-if="screenshots.length > 0">
                <h2 class="game-detail__gallery-title">Galería</h2>
                <div class="game-detail__gallery">
                    <img 
                        v-for="shot in screenshots" 
                        :key="shot.id" 
                        :src="shot.image" 
                        alt="Screenshot"
                        class="game-detail__gallery-image"
                    />
                </div>
            </div>
            </div>
            <div class="game-detail__info">
                <h1 class="game-detail__title">Detalles del Juego</h1>
                <p class="game-detail__name">{{ game.name }}</p>
                
                <button @click="favoritoStore.marcarDesmarcarFavorito(game)" class="game-detail__favorito-button--active" type="button"> 
                    {{ elJuegoActualEsFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos' }} 
                </button>
                
                <p class="game-detail__description" v-if="game.description_raw">{{ game.description_raw }}</p>
                <div v-else class="game-detail__placeholder">
                    Sin descripción
                </div>
                
                <p class="game-detail__rating">Calificación: {{ game.rating }}</p>
                <p class="game-detail__released">Lanzamiento: {{ game.released }}</p>
                <p class="game-detail__platforms">Plataformas: {{ platformNames}}</p>
                <p class="game-detail__genres">Géneros: {{ genreNames }}</p>
            </div>
            
        </div>
    </section>
</template>

<style scoped>
.game-detail__content {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 3rem;
  background-color: var(--color-bg-primary);
  border-radius: var(--border-radius-lg);
  padding: 2.5rem;
  box-shadow: 0 10px 30px var(--color-card-shadow);
}

.game-detail__image {
  width: 100%;
  border-radius: var(--border-radius-md);
  object-fit: cover;
  box-shadow: 0 5px 15px rgba(0,0,0,0.3);
}

.game-detail__name {
  font-family: var(--font-title);
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--color-accent);
  margin-bottom: 1rem;
}

.game-detail__description {
  font-size: 1.1rem;
  line-height: 1.6;
  color: var(--color-text-secondary);
  margin-bottom: 2rem;
}

.game-detail__favorito-button--active {
  background-color: var(--color-accent);
  color: #fff;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  font-weight: bold;
  margin-bottom: 1.5rem;
}

.game-detail__gallery-container {
  margin-top: 2rem;
  border-top: 1px solid var(--color-border);
  padding-top: 2rem;
}
.game-detail__gallery-title {
  font-family: var(--font-title);
  color: var(--color-text-primary);
  font-size: 1.5rem;
  margin-bottom: 1rem;
}
.game-detail__gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 1rem;
}
.game-detail__gallery-image {
  width: 100%;
  height: 100px;
  object-fit: cover;
  border-radius: var(--border-radius-sm);
  transition: var(--transition-normal);
  cursor: pointer;
  box-shadow: 0 4px 6px rgba(0,0,0,0.2);
}
.game-detail__gallery-image:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 15px var(--color-accent);
}

@media (max-width: 768px) {
  .game-detail__content {
    grid-template-columns: 1fr;
  }
}
</style>
