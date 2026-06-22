<script setup>
    import { useRoute, useRouter } from 'vue-router'
    import { ref, onMounted, computed, onUnmounted } from 'vue'
    import { getGameById, getGameScreenshots } from '@/services/gameService'
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

    const screenshots = ref([])
    const imagenSeleccionada = ref(null)
    let inicioToqueX = 0

    onMounted(async () => {
        const id = route.params.id
        window.addEventListener('keydown', manejarTeclado)
        try {
            game.value = await getGameById(id)
        } catch (err) {
            error.value = 'Error al cargar los detalles del juego'
            console.error(err)
        } finally {
            cargando.value = false
        }
    })

    onUnmounted(() => {
        window.removeEventListener('keydown', manejarTeclado)
    })

    // Computed para mostrar los nombres de los géneros
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

    function mostrarSiguiente(){
        const indiceActual = screenshots.value.findIndex(function (shot) {
            return shot.id === imagenSeleccionada.value.id
        })

        const siguienteIndice = (indiceActual + 1) % screenshots.value.length
        imagenSeleccionada.value = screenshots.value[siguienteIndice]
    }

    function mostrarAnterior(){
        const indiceActual = screenshots.value.findIndex(function (shot) {
            return shot.id === imagenSeleccionada.value.id
        })

        const indiceAnterior = (indiceActual - 1 + screenshots.value.length) % screenshots.value.length
        imagenSeleccionada.value = screenshots.value[indiceAnterior]
    }

    function manejarTeclado(event) {
        if (event.key === 'Escape') {
            imagenSeleccionada.value = null
        }
    }

    function iniciarDeslizamiento(event) {
        inicioToqueX = event.touches[0].clientX
    }

    function terminarDeslizamiento(event) {
        const finToqueX = event.changedTouches[0].clientX
        const diferenciaX = finToqueX - inicioToqueX

        if (diferenciaX < -50) {
            mostrarSiguiente()
        } else if (diferenciaX > 50) {
            mostrarAnterior()
        }
    }

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
                        @click="imagenSeleccionada = shot"
                        class="game-detail__gallery-image"
                    />
                </div>
            </div>
            </div>
            <div class="game-detail__info">
                <h1 class="game-detail__title">Detalles del Juego</h1>
                <p class="game-detail__name">{{ game.name }}</p>
                
                <button @click="handleFavoriteClick" class="game-detail__favorito-button--active" type="button"> 
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
        <div v-if="imagenSeleccionada" class="game-detail__modal">
            <div class="game-detail__modal-contenido" @touchstart="iniciarDeslizamiento" @touchend="terminarDeslizamiento">
                <button
                    type="button"
                    class="game-detail__modal-cerrar"
                    aria-label="Cerrar imagen"
                    @click="imagenSeleccionada = null"
                >
                    X
                </button>
                <button
                    type="button"
                    class="game-detail__modal-anterior"
                    aria-label="Imagen anterior"
                    @click="mostrarAnterior"
                >
                    &lt;
                </button>
                <button
                    type="button"
                    class="game-detail__modal-siguiente"
                    aria-label="Imagen siguiente"
                    @click="mostrarSiguiente"
                >
                    &gt;
                </button>
                <img
                class="game-detail__modal-imagen"
                :src="imagenSeleccionada.image"
                alt="Imagen Ampliada"
                >
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

.game-detail__modal{
    position: fixed;
    inset: 0;
    background-color: rgba(0, 0, 0, 0.8);
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
}

.game-detail__modal-contenido{
    position: relative;
    touch-action: pan-y;
}

.game-detail__modal-imagen{
    max-width: 90vw;
    max-height: 90vh;
    object-fit: contain;
    border-radius: var(--border-radius-md);
}

.game-detail__modal-cerrar{
    font-size: 1.8rem;
    position: absolute;
    top: 1.5rem;
    right: 1.5rem;
    background-color: var(--color-accent);
    color: var(--color-bg-primary);
    cursor: pointer;
    z-index: 99999;
    border-radius: var(--border-radius-lg);
    padding: 0.3rem;
    border: 1px solid var(--color-bg-primary);
}

.game-detail__modal-cerrar:hover{
    background-color: var(--color-accent-hover);
}

.game-detail__modal-siguiente {
    position: absolute;
    top: 50%;
    right: 1.5rem;
    transform: translateY(-50%);
    z-index: 1;
    background-color: var(--color-accent);
    color: var(--color-text-primary);
    font-size: 1.8rem;
    border-radius: 20px;
    padding: 0.3rem;
    border: 1px solid var(--color-text-primary);
    cursor: pointer;
}

.game-detail__modal-siguiente:hover{
    background-color: var(--color-accent-hover);
}

.game-detail__modal-anterior {
    position: absolute;
    top: 50%;
    left: 1.5rem;
    transform: translateY(-50%);
    z-index: 1;
    background-color: var(--color-accent);
    color: var(--color-text-primary);
    font-size: 1.8rem;
    border-radius: 20px;
    padding: 0.3rem;
    border: 1px solid var(--color-text-primary);
    cursor: pointer;
}

.game-detail__modal-anterior:hover{
    background-color: var(--color-accent-hover);
}


@media (max-width: 768px) {
  .game-detail__content {
    grid-template-columns: 1fr;
  }
  .game-detail__modal-cerrar{
    font-size: 0.8rem;
  }
  .game-detail__modal-anterior{
    font-size: 0.8rem;
  }
  .game-detail__modal-siguiente{
    font-size: 0.8rem;
  }
}
</style>
