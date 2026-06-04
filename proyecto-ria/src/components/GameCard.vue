<script setup> 

import { RouterLink } from 'vue-router'

defineProps({
    game:{
        type: Object,
        required: true
    }
})

</script>

<template>
    <article class="game-card">
            <RouterLink :to="{ name: 'game-detail', params: { id: game.id } }">
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
    margin-right: 20px;
    display: flex;
    align-items: center;
    flex-direction: column;
}



</style>