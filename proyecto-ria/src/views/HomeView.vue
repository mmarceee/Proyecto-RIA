<script setup>
  import { RouterLink } from 'vue-router'
  import { ref, onMounted } from 'vue'
  import { getGames } from '@/services/gameService'
  import GameCard from '@/components/GameCard.vue'
  import LoadingState from '@/components/LoadingState.vue'
  import ErrorState from '@/components/ErrorState.vue'

  const recommendedGames = ref([])
  const loading = ref(true)
  const error = ref(null)

  onMounted(async () => {
    try {
      loading.value = true
      const games = await getGames()
      if (games && games.length > 0) {
        const shuffled = [...games].sort(() => 0.5 - Math.random())
        recommendedGames.value = shuffled.slice(0, 3)
      }
    } catch (err) {
      console.error(err)
      error.value = "No se pudieron cargar recomendaciones."
    } finally {
      loading.value = false
    }
  })
</script>

<template>
  <section class="home-view">
    <div class="home-view__content">
      <div class="home-hero">
        <h1 class="home-hero__title">Bienvenido a <span>ChickenThiefGames</span></h1>
        <p class="home-hero__subtitle">Tu portal definitivo para explorar y guardar tus videojuegos favoritos.</p>
        <div class="home-hero__actions">
          <RouterLink to="/games" class="btn btn--primary">Explorar Juegos</RouterLink>
          <RouterLink to="/favorites" class="btn btn--secondary">Ver Favoritos</RouterLink>
        </div>
      </div>

      <div class="home-recommendations">
        <div class="section-title">
          <span class="section-title__text">Juegos Recomendados</span>
        </div>
        
        <LoadingState v-if="loading" mensaje="Cargando recomendaciones..." />
        <ErrorState v-else-if="error" :mensaje="error" />
        <div v-else-if="recommendedGames.length > 0" class="home-recommendations__grid">
          <div v-for="juego in recommendedGames" :key="juego.id" class="home-recommendations__item">
            <GameCard :game="juego" />
          </div>
        </div>
      </div>

      <div class="home-features">
        <div class="section-title">
          <span class="section-title__text">¿Qué puedes hacer?</span>
        </div>
        <div class="home-features__grid">
          <div class="home-feature-card">
            <div class="home-feature-card__icon">🎮</div>
            <h3 class="home-feature-card__title">Explorar Catálogo</h3>
            <p class="home-feature-card__desc">Busca entre miles de videojuegos gracias a la integración en tiempo real con la API de RAWG.</p>
          </div>
          <div class="home-feature-card">
            <div class="home-feature-card__icon">⭐</div>
            <h3 class="home-feature-card__title">Guardar Favoritos</h3>
            <p class="home-feature-card__desc">Agrega tus títulos preferidos a tu biblioteca personal con persistencia en tu navegador (localStorage).</p>
          </div>
          <div class="home-feature-card">
            <div class="home-feature-card__icon">⚙️</div>
            <h3 class="home-feature-card__title">Personalizar Tema</h3>
            <p class="home-feature-card__desc">Cambia el aspecto visual entre los modos Claro y Oscuro según tus preferencias y se guardará para siempre.</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.home-view {
  position: relative;
  min-height: 70vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  overflow: hidden;
  padding: 1rem 0;
}

.home-view__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  gap: 3.5rem;
}

.home-hero {
  text-align: center;
  padding: 3rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.5rem;
}

.home-hero__title {
  font-family: var(--font-title);
  font-size: 2.8rem;
  font-weight: 800;
  letter-spacing: -0.02em;
  line-height: 1.2;
}

.home-hero__title span {
  color: var(--color-accent);
}

.home-hero__subtitle {
  font-family: var(--font-body);
  font-size: 1.25rem;
  color: var(--color-text-secondary);
  max-width: 600px;
}

.home-hero__actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
  justify-content: center;
}

.home-recommendations {
  padding: 1rem 0;
}

.home-recommendations__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 1rem;
}

.home-recommendations__item {
  display: flex;
  justify-content: center;
}

.home-features {
  padding: 1rem 0;
}

.home-features__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 1rem;
}

.home-feature-card {
  background-color: var(--color-bg-secondary);
  border: 1px solid var(--color-border);
  border-radius: var(--border-radius-md);
  padding: 2.5rem 2rem;
  text-align: center;
  transition: var(--transition-normal);
  box-shadow: 0 4px 6px var(--color-card-shadow);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.home-feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 16px var(--color-card-hover-shadow);
  border-color: var(--color-accent);
}

.home-feature-card__icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.home-feature-card__title {
  font-family: var(--font-title);
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--color-text-primary);
}

.home-feature-card__desc {
  font-size: 0.95rem;
  color: var(--color-text-secondary);
  line-height: 1.5;
}

@media (max-width: 768px) {
  .home-hero__title {
    font-size: 2rem;
  }
  
  .home-hero__subtitle {
    font-size: 1.1rem;
  }
}
</style>