<script setup>
  import { RouterLink } from 'vue-router'
  import { ref, onMounted, onUnmounted } from 'vue'
  import { getGames } from '@/services/gameService'
  import GameCard from '@/components/GameCard.vue'
  import LoadingState from '@/components/LoadingState.vue'
  import ErrorState from '@/components/ErrorState.vue'

  const juegosRecomendados = ref([])
  const loading = ref(true)
  const error = ref(null)
  const currentIndex = ref(0)
  let secInterval = null;
  
  onMounted(async () => {
    try {
      loading.value = true
      const games = await getGames()
      if (games && games.length > 0) {
        const barajaDeJuegos = [...games].sort(() => 0.5 - Math.random())
        juegosRecomendados.value = barajaDeJuegos.slice(0, 10)
      }
    } catch (err) {
      console.error(err)
      error.value = "No se pudieron cargar recomendaciones."
    } finally {
      loading.value = false
    }
    
    secInterval = setInterval(() => {
      currentIndex.value ++;
      if(currentIndex.value >= juegosRecomendados.value.length) {
        currentIndex.value = 0;
      }
    }, 4000);
  })

  onUnmounted(() => {
      clearInterval(secInterval);
  })
</script>

<template>
  <section class="home-view">
    <div class="home-view__content">
      <div class="home-hero">
        <h1 class="home-hero__title">Bienvenido a <span>ChickenThiefGames</span></h1>
        <p class="home-hero__subtitle">Tu portal definitivo para explorar y guardar tus videojuegos favoritos.</p>
        <div class="home-hero__actions">
          <RouterLink to="/games" class="btn btn--primary">Explorar juegos</RouterLink>
          <RouterLink to="/favorites" class="btn btn--secondary">Ver favoritos</RouterLink>
        </div>
      </div>

      <div class="home-recomendaciones">
        <h1 class="section-title">
          <span class="section-title__text">Juegos recomendados</span>
        </h1>
        
        <div class="home-carrusel" v-if="juegosRecomendados.length > 0">
         
          <Transition name="fade" mode="out-in">
            <article class="home-carrusel__card" :key="currentIndex">
              <img
                :src="juegosRecomendados[currentIndex].background_image"
                :alt="juegosRecomendados[currentIndex].name"
                class="home-carrusel__image"
              />
              <div class="home-carrusel__overlay">
                <h2 class="home-carrusel__title">{{ juegosRecomendados[currentIndex].name }}</h2>
              </div>
            </article>
          </Transition>
        </div>

        <!-- <LoadingState v-if="loading" mensaje="Cargando recomendaciones..." />
        <ErrorState v-else-if="error" :mensaje="error" />
        <div v-else-if="juegosRecomendados.length > 0" class="home-recomendaciones__grid">
          <div v-for="juego in juegosRecomendados" :key="juego.id" class="home-recomendaciones__item">
            <GameCard :game="juego" />
          </div>
        </div> -->
      </div>

      <div class="home-features">
        <div class="section-title">
          <span class="section-title__text">¿Qué puedes hacer?</span>
        </div>
        <div class="home-features__grid">
          <div class="home-feature-card">
            <div class="home-feature-card__icon">🎮</div>
            <h3 class="home-feature-card__title">Explorar catálogo</h3>
            <p class="home-feature-card__desc">Busca entre miles de videojuegos gracias a la integración en tiempo real con la API de RAWG.</p>
          </div>
          <div class="home-feature-card">
            <div class="home-feature-card__icon">⭐</div>
            <h3 class="home-feature-card__title">Guardar favoritos</h3>
            <p class="home-feature-card__desc">Agrega tus títulos preferidos a tu biblioteca personal con persistencia en tu navegador (localStorage).</p>
          </div>
          <div class="home-feature-card">
            <div class="home-feature-card__icon">⚙️</div>
            <h3 class="home-feature-card__title">Personalizar tema</h3>
            <p class="home-feature-card__desc">Cambia el aspecto visual entre los modos Claro y Oscuro según tus preferencias y se guardará.</p>
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

.home-recomendaciones {
  padding: 1rem 0;
}

.home-recomendaciones__grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 1rem;
}

.home-recomendaciones__item {
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

.home-carrusel__card {
  position: relative;
  width: 100%;
  max-width: 800px;
  height: 400px;
  margin: 0 auto;
  border-radius: var(--border-radius-lg);
  overflow: hidden;
  box-shadow: 0 10px 30px var(--color-card-shadow);
}

.home-carrusel__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.home-carrusel__overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  padding: 3rem 2rem 1.5rem;
  background: linear-gradient(to top, rgba(0,0,0,0.9), transparent);
  display: flex;
  justify-content: center;
}

.home-carrusel__title {
  font-family: var(--font-title);
  font-size: 1.5rem;
  color: #fff;
  text-shadow: 0 2px 4px rgba(0,0,0,0.7);
  text-align: center;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.5s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
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