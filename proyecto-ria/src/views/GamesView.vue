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
    const { data: storedPage, save: savePage } = useSessionStorage('games_page', '1');
    const initialPage = parseInt(storedPage.value);
    const currentPage = ref(Number.isNaN(initialPage) || initialPage < 1 ? 1 : initialPage);
    const searchHistory = ref(loadSearchHistory());
    const showSearchHistory = ref(false);

    let temporizador = null;

    async function fetchCurrentGames() {
        cargando.value = true;
        error.value = null;

        try {
            const games = await getGames(search.value, currentPage.value);
            juegos.value = games;
        } catch (err) {
            error.value = 'Error al cargar los juegos';
            console.error(err);
        } finally {
            cargando.value = false;
        }
    }
    function handleSearch() {
        clearTimeout(temporizador);

        temporizador = setTimeout(async () => {
            saveSearch(search.value);
            currentPage.value = 1; // Reiniciar a la primera página al realizar una nueva
            savePage('1')
            fetchCurrentGames();
        }, 300); //300 milisegundos
    }
    onMounted(() => {
        fetchCurrentGames()
    })

    function nextPage() {
        currentPage.value += 1;
        savePage(currentPage.value.toString())
        fetchCurrentGames();
    }

    function prevPage() {
        if (currentPage.value > 1) {
            currentPage.value -= 1;
            savePage(currentPage.value.toString())
            fetchCurrentGames();
        }
    }

    function loadSearchHistory(){
        
    }
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
        <div class="games-view__pagination">
            <button 
                class="games-view__page-button" 
                @click="prevPage" 
                :disabled="currentPage === 1">
                Anterior
            </button>
            
            <span class="games-view__page-indicator">Página {{ currentPage }}</span>
            
            <button 
                class="games-view__page-button" 
                @click="nextPage">
                Siguiente
            </button>
        </div>
    </section>
</template>

<style scoped>

.games-view__item {
  list-style: none;
}


</style>