<script setup>
    import GameCard from '@/components/GameCard.vue'
    import { ref, onMounted } from 'vue'
    import { getGames } from '@/services/gameService'
    import LoadingState from '@/components/LoadingState.vue'
    import ErrorState from '@/components/ErrorState.vue'
    import { useSessionStorage } from '@/composables/useSessionStorage'

    const CLAVE_HISTORIAL_BUSQUEDAS = 'historial_busquedas_juegos'

    const juegos = ref([]);
    const cargando = ref(false);
    const error = ref(null);
    const { data: search, save: saveSearch } = useSessionStorage('games_search', '');
    const { data: storedPage, save: savePage } = useSessionStorage('games_page', '1');
    const initialPage = parseInt(storedPage.value);
    const currentPage = ref(Number.isNaN(initialPage) || initialPage < 1 ? 1 : initialPage); 
    const searchHistory = ref(cargarHistorialBusquedas());
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
            savePage('1');
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

    function cargarHistorialBusquedas(){
        let historial = sessionStorage.getItem(CLAVE_HISTORIAL_BUSQUEDAS)
        if(historial == null){
            return []
        }else{
            try{
                return JSON.parse(historial);
            }
            catch{
                sessionStorage.removeItem(CLAVE_HISTORIAL_BUSQUEDAS)
                return []
            }
        }

    }

    function guardarHistorialBusquedas(historial){
        searchHistory.value = historial;
        sessionStorage.setItem(CLAVE_HISTORIAL_BUSQUEDAS, JSON.stringify(historial))
    }

    function agregarBusquedaAlHistorial(busqueda){
        const busquedaLimpia = busqueda.trim();

        if(!busquedaLimpia){
            return
        };

        const historialSinDuplicado = searchHistory.value.filter( //para evitar duplicados, creá una nueva lista con todas las búsquedas anteriores menos la que acabo de escribir.
            item => item !== busquedaLimpia
        );

        const historialActualizado = [busquedaLimpia, ...historialSinDuplicado].slice(0, 5); //crear una lista nueva con la búsqueda actual primero y después todos los elementos anteriores

        guardarHistorialBusquedas(historialActualizado);

    }

    function seleccionarBusquedaHistorial(busqueda){ //cuando el usuario toca una búsqueda vieja, hacemos como si la hubiera escrito de nuevo en el input.
        clearTimeout(temporizador)
        search.value = busqueda;
        saveSearch(busqueda);
        agregarBusquedaAlHistorial(busqueda);

        currentPage.value = 1;
        savePage('1');

        showSearchHistory.value = false;
        fetchCurrentGames();
    }

    function confirmarBusqueda() {
        clearTimeout(temporizador)
        agregarBusquedaAlHistorial(search.value);
        saveSearch(search.value);
        currentPage.value = 1;
        savePage('1');
        showSearchHistory.value = false;
        fetchCurrentGames();
    }
</script>

<template>
    <section class="games-view">
        <h1 class="games-view__title">Juegos</h1>
        <input 
            type="text"
            placeholder="Buscar Juegos..."
            v-model="search"
            @input="handleSearch"
            @keyup.enter="confirmarBusqueda"
            @focus="showSearchHistory = true">
            <button
                type="button"
                class="games-view__search-button"
                @click="confirmarBusqueda"
                >
                Buscar
            </button>
        <div v-if="showSearchHistory && searchHistory.length > 0" class="games-view__search-history">
            <button v-for="item in searchHistory" :key="item" type="button" class="games-view__search-history-item" @click="seleccionarBusquedaHistorial(item)">
            {{ item }}
            </button> 
        </div>
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