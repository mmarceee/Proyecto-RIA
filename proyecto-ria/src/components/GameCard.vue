<script setup> 

import { RouterLink } from 'vue-router'
import { computed } from 'vue'
import { useFavoriteStore } from '@/stores/favoriteStore'

const favoriteStore = useFavoriteStore()

const props = defineProps({
    game:{
        type: Object,
        required: true
    },
})

const isGameFavorite = computed(() => {
    return favoriteStore.isFavorite(props.game.id)
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
        <p class="game-card__rating">Calificación: {{ game.rating }}</p>
        <p class="game-card__released">Lanzamiento: {{ game.released }}</p>
        </RouterLink>
        <button type="button" @click="favoriteStore.marcarDesmarcarFavorito(game)" class="game-card__favorite-button" :class="{ 'game-card__favorite-button--active': isGameFavorite }">
            {{ isGameFavorite ? 'Quitar de favoritos' : 'Agregar a favoritos' }}
        </button>
    </article>
</template>

<style scoped>

.game-card{
    display: flex;
    align-items: center;
    flex-direction: column;
}

.game-card__image{
    width: 150px;
    height: 100px;
    object-fit: cover;
}

</style>