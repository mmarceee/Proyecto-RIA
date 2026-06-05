<script setup>
    import { useFavoriteStore } from '@/stores/favoriteStore';
    import  GameCard  from '@/components/GameCard.vue'
    import { computed } from 'vue';

    const favoriteStore = useFavoriteStore();

    const isEmpty = computed(() => {
        if (favoriteStore.favorites.length === 0){
            return true; 
        }
        else return false;
    } )

    
</script>

<template>
    <section class="favorites-view">
        <h1 class="favorites-view__title">Favoritos</h1>
        <div v-if="isEmpty">No hay juegos favoritos aún</div>
        <ul v-else class="favorites-view__list">
            <li class="favorites-view__item" v-for="favorito in favoriteStore.favorites" :key="favorito.id">
                 <GameCard :game="favorito" />
            </li>
        </ul>
    </section>
</template>

<style scoped></style>