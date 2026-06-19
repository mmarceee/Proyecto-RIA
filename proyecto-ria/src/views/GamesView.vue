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
    const { data: selectedPlatforms, save: saveSelectedPlatforms } = useSessionStorage('games_platforms', '');
    const { data: selectedGenres, save: saveSelectedGenres } = useSessionStorage('games_genres', '');

    const initialPage = parseInt(storedPage.value);
    const currentPage = ref(Number.isNaN(initialPage) || initialPage < 1 ? 1 : initialPage); 
    const searchHistory = ref(cargarHistorialBusquedas());
    const showSearchHistory = ref(false);

    let temporizador = null;

    async function fetchCurrentGames() {
        cargando.value = true;
        error.value = null;

        try {
            const games = await getGames(search.value, currentPage.value, selectedPlatforms.value, selectedGenres.value);
            juegos.value = [...games].sort(() => Math.random() - 0.5); //spread operator crea un nuevo array copiando todos los elementos de games.
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

    function handleFilterChange() {
        currentPage.value = 1; // Reiniciar a la primera página al cambiar filtros
        saveSelectedPlatforms(selectedPlatforms.value);
        saveSelectedGenres(selectedGenres.value);
        savePage('1');
        fetchCurrentGames();
    }

    function handleBlur() {
        setTimeout(() => {
            showSearchHistory.value = false;
        }, 200);
    }

    function limpiarFiltros(){
        selectedGenres.value = ''
        selectedPlatforms.value = ''
        handleFilterChange()
    }

</script>

<template>
    <section class="games-view">
        <h1 class="games-view__title">Juegos</h1>
        <div class="games-view__filters">
            <p class="games-view__filter-label">Filtrar por:</p>
            <select v-model="selectedPlatforms" @change="handleFilterChange" class="games-view__filter-select">
                <option value="">Todas las plataformas</option>
                <option value="4">PC</option>
                <option value="187">PlayStation 5</option>
                <option value="18">PlayStation 4</option>
                <option value="1">Xbox One</option>
            </select>

            <select v-model="selectedGenres" @change="handleFilterChange" class="games-view__filter-select">
                <option value="">Todos los géneros</option>
                <option value="action">Acción</option>
                <option value="role-playing-games">RPG</option>
                <option value="shooter">Shooter</option>
                <option value="adventure">Aventura</option>
            </select>
            <button
                type="button"
                class="games-view__clear-filters"
                v-if="(selectedGenres) || (selectedPlatforms)"
                @click="limpiarFiltros"
            >
            Limpiar Filtros
            </button>
        </div>
        <div class="games-view__search">
            <input
                class="games-view__search-input" 
                type="text"
                placeholder="Buscar Juegos..."
                v-model="search"
                @input="handleSearch"
                @keyup.enter="confirmarBusqueda"
                @focus="showSearchHistory = true"
                @blur="handleBlur"
            >

            <button
                type="button"
                class="games-view__search-button"
                @click="confirmarBusqueda"
            >
                Buscar
            </button>
        </div>
        <div v-if="showSearchHistory && searchHistory.length > 0" class="games-view__search-history">
            <p class="games-view__search-history-label">Búsquedas recientes:</p>
            <button v-for="item in searchHistory" :key="item" type="button" class="games-view__search-history-item" @click="seleccionarBusquedaHistorial(item)">
            {{ item }}
            </button> 
        </div>
        <LoadingState v-if="cargando" mensaje="Cargando juegos..." />
        <ErrorState v-else-if="error" :mensaje="error" />
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

.games-view__title{
    display: flex;
    justify-content: center;
}

.games-view__list {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 2rem;
    padding: 2rem 0;
}

.games-view__item {
    display: flex;
    justify-content: center;
    margin: 0;
    padding: 0;
}

.games-view__search{
    display: flex;
    gap: 0.5rem;
}

.games-view__search-input{
    background-color: var(--color-bg-secondary);
    color: var(--color-text-primary);
    border: 1px solid var(--color-border);
    border-radius: var(--border-radius-md);
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    transition: var(--transition-fast);
}

.games-view__search-input:hover{
    border: 1px solid var(--color-text-muted);
}

.games-view__search-input:focus{
    border-color: var(--color-accent);
}

.games-view__search-button{
    padding: 0 1.5rem;
    border-radius: var(--border-radius-md);
    border: 1px solid var(--color-border);
    background-color: var(--color-accent);
}

.games-view__search-button:hover{
    border: 1px solid var(--color-text-muted);
}

.games-view__search-button:focus-visible{
    border-color: var(--color-text-primary);

}

.games-view__filter-label{
    color: var(--color-text-secondary);
    display: flex;
    max-width: fit-content;
    padding-left: 1.5rem;
    padding-right: 1.5rem;
}

.games-view__filter-select{
    color: var(--color-text-primary);
    border-radius: var(--border-radius-md);
    border: 1px solid var(--color-border);
    background-color: var(--color-accent);
    padding-left: 1.5rem;
    padding-right: 1.5rem;
    transition: var(--transition-fast);
}

.games-view__filter-select:hover{
    border-color: var(--color-text-muted);
}

.games-view__filter-select:focus{
    border-color: var(--color-accent);
}

.games-view__filters{
    display: flex;
    justify-content: flex-start;
    gap: 0.5rem;
    margin: 1rem 0;
}

.games-view__clear-filters{
    background-color: var(--color-bg-secondary);
    color: var(--color-text-primary);
    border: 1px solid var(--color-accent);
    border-radius: var(--border-radius-md);
    padding: 0 1rem;
    transition: var(--transition-fast);
}

.games-view__clear-filters:hover{
    background-color: var(--color-border);
}

.games-view__search-history{
    display: flex;
    flex-wrap: wrap;
    gap: 0.5rem;
    margin-top: 0.5rem;
    align-items: center;
}

.games-view__search-history-item{
    padding: 0 0.5rem;
    font-family: var(--font-body);
    font-style: italic;
    transition: var(--transition-fast);
}

.games-view__search-history-item:hover{
    background-color: var(--color-accent);
    border-radius: var(--border-radius-md);
}

.games-view__search-history-label{
    padding: 0 0.5rem;
    color: var(--color-text-secondary);
    font-size: 0.8rem;
}

.games-view__pagination{
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
}

.games-view__page-button{
    background-color: var(--color-accent);
    border: 1px solid var(--color-text-primary);
    border-radius: var(--border-radius-md);
    padding: 0 0.5rem;
    transition: var(--transition-fast);
    
}

.games-view__page-button:not(:disabled):hover{
    color: var(--color-text-primary);
    border: 1px solid var(--color-text-muted);
}

.games-view__page-button:disabled{
    opacity: 0.5;
    cursor: not-allowed;
    background-color: var(--color-bg-tertiary);
}

@media (max-width: 768px) {
    .games-view__filters{
        flex-direction: column;
    }

    .games-view__filter-select{
        width: 100%;
    }

    .games-view__clear-filters{
        width: 100%;
    }

    .games-view__search{
        flex-direction: column;
        width: 100%;
    }
}
</style>
