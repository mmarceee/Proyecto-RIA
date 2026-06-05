<script setup>
    import GameCard from '@/components/GameCard.vue'
    import { ref, onMounted } from 'vue'
    import { getGames } from '@/services/gameService'
    import LoadingState from '@/components/LoadingState.vue'
    import ErrorState from '@/components/ErrorState.vue'

    const juegos = ref([]);
    const cargando = ref(false);
    const error = ref(null);

    onMounted(async () => {
        cargando.value = true;
        error.value = null;

        try {
            const games = await getGames();
            juegos.value = games;
        } catch (err) {
            error.value = 'Error al cargar los juegos';
            console.error(err);
        } finally {
            cargando.value = false;
        }
    });
</script>

<template>
    <section class="games-view">
        <h1 class="games-view__title">Juegos</h1>
        <LoadingState v-if="cargando" message="Cargando juegos..." />
        <ErrorState v-else-if="error" :message="error" />
        <ul class="games-view__list" v-else>
            <li class="games-view__item" v-for="juego in juegos" :key="juego.id">
                <GameCard :game="juego" />
            </li>
        </ul>
    </section>
</template>

<style scoped>

.games-view__item {
  list-style: none;
}


</style>