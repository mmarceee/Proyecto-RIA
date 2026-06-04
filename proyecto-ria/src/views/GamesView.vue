<script setup>
    import GameCard from '@/components/GameCard.vue'
    import { ref, onMounted } from 'vue'
    import { getGames } from '@/services/gameService'

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
        <div class="games-view__status" v-if="cargando">Cargando juegos...</div>
        <div class="games-view__error" v-else-if="error">{{ error }}</div>
        <ul class="games-view__list" v-else>
            <li class="games-view__item" v-for="juego in juegos" :key="juego.id">
                <GameCard :game="juego" />
            </li>
        </ul>
    </section>
</template>

<style scoped>

li{
    list-style: none;
}

</style>