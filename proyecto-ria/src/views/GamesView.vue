<script setup>
    import GameCard from '@/components/GameCard.vue'
    import { ref, onMounted } from 'vue'
    import { getGames } from '@/services/gameService'
    import LoadingState from '@/components/LoadingState.vue'
    import ErrorState from '@/components/ErrorState.vue'
    import { useSessionStorage } from '@/composables/useSessionStorage'

    const juegos = ref([]);
    const cargando = ref(false);
    const error = ref(null);
    const { data: search, save: saveSearch } = useSessionStorage('games_search', '');

    let temporizador = null;

    function handleSearch() {
        clearTimeout(temporizador);

        temporizador = setTimeout(async () => {

            cargando.value = true;
            error.value = null;

            saveSearch(search.value);

            try {
                const games = await getGames(search.value);
                juegos.value = games;
            } catch (err) {
                error.value = 'Error al buscar los juegos';
            } finally {
                cargando.value = false;
            }
        }, 300); //500 milisegundos
    }
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
        <input 
            type="text"
            placeholder="Buscar Juegos..."
            v-model="search"
            @keyup="handleSearch">
        <LoadingState v-if="cargando" message="Cargando juegos..." />
        <ErrorState v-else-if="error" :message="error" />
        <p class="games-view__empty-state" v-else-if="juegos.length === 0">
            No hay resultados para tu busqueda.
        </p>
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