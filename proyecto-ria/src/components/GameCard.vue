<script setup> 

import { RouterLink, useRouter } from 'vue-router'
import { computed } from 'vue'
import { useFavoriteStore } from '@/stores/favoriteStore'
import { useAuthStore } from '@/stores/authStore'

const favoritoStore = useFavoriteStore()
const authStore = useAuthStore() 
const router = useRouter() 

const props = defineProps({
    game:{
        type: Object,
        required: true
    },
})
const esJuegoFavorito = computed(() => {
    return favoritoStore.isFavorito(props.game.id)
})

function handleFavoriteClick() {
  if (!authStore.isAuthenticated) {
    
    router.push('/login')
  } else {
    
    favoritoStore.marcarDesmarcarFavorito(props.game)
  }
}

const estrellas = computed(() => {
  const puntos = Math.round(props.game.rating);

  const vacias = 5 - puntos;

  return '★'.repeat(puntos) + '☆'.repeat(vacias);
})
</script>

<template>
    <article class="game-card">
        <RouterLink  class="game-card__link" :to="{ name: 'game-detail', params: { id: game.id } }">
        <h2 class="game-card__title">{{ game.name }}</h2>
        <img 
        v-if="game.background_image"
        class="game-card__image" 
        :src="game.background_image" 
        :alt="game.name" 
        />
        <div v-else class="game-card__placeholder">
            Sin imagen
        </div>
        <p class="game-card__rating">Calificación: <span class="game-card__stars">{{ estrellas }}</span></p>
        <p class="game-card__released">Lanzamiento: {{ game.released }}</p>
        </RouterLink>
        <button type="button" @click="handleFavoriteClick" class="game-card__favorite-button" :class="{ 'game-card__favorite-button--active': esJuegoFavorito }">
            {{ esJuegoFavorito ? 'Quitar de favoritos' : 'Agregar a favoritos' }}
        </button>
    </article>
</template>

<style scoped>

.game-card {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: var(--color-bg-primary);
  border: 1px solid var(--color-text-primary); 
  border-radius: var(--border-radius-sm);
  box-shadow: 0 4px 8px var(--color-card-shadow);
  transition: var(--transition-normal);
  overflow: hidden; 
}

.game-card__title {
  font-family: var(--font-title);
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text-primary);
  margin: 0.5rem 0;
  text-align: center;
}

.game-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 24px var(--color-card-hover-shadow);
}

.game-card__image {
  width: 100%;
  height: 200px;
  object-fit: cover;
}

.game-card__link {
  display: flex;
  flex-direction: column;
  padding: 1.5rem;
  flex-grow: 1; 
  text-decoration: none;
  color: inherit;
}

.game-card__favorite-button {
  margin: 1rem;
  padding: 0.5rem 1rem;
  background-color: var(--color-accent);
  color: var(--color-text-primary);
  border: 1px solid var(--color-text-primary);
  border-radius: var(--border-radius-sm);
  cursor: pointer;
  transition: var(--transition-normal);
}

.game-card__favorite-button:hover{
  color: var(--color-bg-primary);
  border: 1px solid var(--color-text-muted);
  transition: var(--transition-fast);
}

.game-card__stars {
  color: #f1c40f;
  font-size: 1.2rem; 
  letter-spacing: 2px; 
}
</style>
