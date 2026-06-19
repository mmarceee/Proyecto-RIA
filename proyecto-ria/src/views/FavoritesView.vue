<script setup>
    import { useFavoriteStore } from '@/stores/favoriteStore';
    import  GameCard  from '@/components/GameCard.vue'
    import { computed } from 'vue';

    const favoritoStore = useFavoriteStore();

    const estaVacio = computed(() => favoritoStore.favoritos.length === 0)

</script>

<template>
    <section class="favoritos-view">
        <h1 class="favoritos-view__title">Favoritos</h1>
        <div class="favoritos-view__empty-state" v-if="estaVacio">No hay juegos favoritos aún</div>
        <ul v-else class="favoritos-view__list">
            <li class="favoritos-view__item" v-for="favorito in favoritoStore.favoritos" :key="favorito.id">
                 <GameCard :game="favorito" />
            </li>
        </ul>
    </section>
</template>

<style scoped>

.favoritos-view__title{
    display: flex;
    justify-content: center;
    margin-bottom: 1.5rem;
}

.favoritos-view__list{
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 1rem;
}

.favoritos-view__item {
    width: 100%;
    max-width: 350px;
}

</style>
