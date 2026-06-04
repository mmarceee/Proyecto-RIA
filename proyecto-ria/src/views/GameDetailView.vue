<script setup>
    import { useRoute } from 'vue-router'
    import { ref, onMounted, computed } from 'vue'
    import { getGameById } from '@/services/gameService'

    const route = useRoute()
    const gameId = route.params.id
    const game = ref(null)
    const cargando = ref(false)
    const error = ref(null)

    onMounted(async () => {
        cargando.value = true
        error.value = null
        try{
            game.value = await getGameById(gameId)
        } catch (err) {
            error.value = 'Error al cargar los detalles del juego'
            console.error(err)
        } finally {
            cargando.value = false
        }
    })

    // Computed para mostrar los nombres de los géneros
    const genreNames = computed(() => {
    if (!game.value?.genres?.length) { //el ?: Si game.value existe, intentá acceder a genres. Si no existe, no rompe.
        return 'Sin información'
    }

    return game.value.genres.map((genre) => genre.name).join(', ')
    })

    const platformNames = computed(() => {
    if (!game.value?.platforms?.length) {
        return 'Sin información'
    }
    
    return game.value.platforms.map((item) => item.platform.name).join(', ')
    })

</script>

<template>
    <section class="game-detail">
        <div class="game-detail__loading" v-if="cargando">Cargando detalles del juego...</div>
        <div class="game-detail__error" v-else-if="error">{{ error }}</div>
        <div v-else-if ="game">
            <h1 class="game-detail__title">Detalles del Juego</h1>
            <p class="game-detail__name">{{ game.name }}</p>
            <img 
                v-if="game.background_image"
                :src="game.background_image" 
                :alt="game.name"
            />
            <p class="game-detail__description">{{ game.description_raw }}</p>
            <p class="game-detail__rating">Calificación: {{ game.rating }}</p>
            <p class="game-detail__released">Lanzamiento: {{ game.released }}</p>
            <p class="game-detail__platforms">Plataformas: {{ platformNames}}</p>
            <p class="game-detail__genres">Géneros: {{ genreNames }}</p>
        </div>
    </section>
</template>

<style scoped></style>
