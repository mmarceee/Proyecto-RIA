<script setup>
  // --------------------------------------------------------------------------
  // IMPORTS (Traemos herramientas de otros archivos para usarlas aquí)
  // --------------------------------------------------------------------------

  // RouterLink: Nos permite crear enlaces rápidos. Al hacer clic, cambia de "habitación" (vista) 
  // instantáneamente sin tener que recargar toda la página web.
  import { RouterLink } from 'vue-router'

  // ref: Nos sirve para crear "cajas de datos inteligentes". Si el valor de una caja cambia, 
  // la pantalla se dibuja de nuevo sola con los datos nuevos.
  // onMounted: Es un disparador. Le dice a Vue: "En cuanto la pantalla se termine de dibujar 
  // y esté lista para el usuario, ejecuta este código de inmediato".
  import { ref, onMounted } from 'vue'

  // getGames: Es nuestra función mensajera. Llama a la API externa (RAWG) en internet 
  // para pedirle la lista de videojuegos.
  import { getGames } from '@/services/gameService'

  // GameCard: El molde visual para mostrar cada juego. En lugar de escribir el código de la tarjeta 
  // tres veces, importamos este molde reutilizable.
  import GameCard from '@/components/GameCard.vue'

  // LoadingState: Componente que muestra un spinner animado ("Cargando...") mientras esperamos la API.
  import LoadingState from '@/components/LoadingState.vue'

  // ErrorState: Componente que muestra un mensaje en rojo si internet falla o la API da error.
  import ErrorState from '@/components/ErrorState.vue'

  // --------------------------------------------------------------------------
  // VARIABLES REACTIVAS (Las "cajas de datos inteligentes" con ref)
  // --------------------------------------------------------------------------

  // recommendedGames: Una lista (array) que empieza vacía []. Aquí guardaremos los 3 juegos aleatorios.
  const recommendedGames = ref([])

  // loading: Un interruptor Sí/No (booleano). Empieza en 'true' (sí, estamos cargando). 
  // Cuando los juegos lleguen, lo pondremos en 'false' para ocultar el spinner de carga.
  const loading = ref(true)

  // error: Aquí guardaremos el mensaje si algo sale mal (por ejemplo, si no hay internet). 
  // Empieza vacío (null).
  const error = ref(null)

  // --------------------------------------------------------------------------
  // LÓGICA AL ENTRAR A LA PÁGINA (onMounted)
  // --------------------------------------------------------------------------
  onMounted(async () => {
    // Usamos "try / catch / finally" para controlar los errores como un escudo:
    try {
      // 1. Nos aseguramos de que el interruptor de carga esté activado
      loading.value = true
      
      // 2. Llamamos a la API de internet y esperamos a que nos responda con la lista de juegos.
      // Usamos "await" que significa: "Espera aquí sentado a que los datos lleguen del servidor".
      const games = await getGames()
      
      // 3. Si la API nos devolvió juegos y la lista no está vacía:
      if (games && games.length > 0) {
        // Mezclamos la lista de juegos como si fuera un mazo de cartas.
        // [...games] crea una copia para no dañar la lista original.
        // .sort(() => 0.5 - Math.random()) ordena los juegos de forma completamente aleatoria.
        const shuffled = [...games].sort(() => 0.5 - Math.random())
        
        // Agarramos solo las primeras 3 cartas (juegos) de la lista ya mezclada.
        // .slice(0, 3) corta desde la posición 0 hasta la 3 (sin incluir la 3, o sea: 0, 1 y 2).
        recommendedGames.value = shuffled.slice(0, 3)
      }
    } catch (err) {
      // Si internet se cae o la API falla, el código "salta" directamente aquí:
      console.error(err) // Mostramos el error técnico en la consola del navegador
      error.value = "No se pudieron cargar recomendaciones." // Guardamos un mensaje bonito para el usuario
    } finally {
      // Esto se ejecuta SIEMPRE al final, tanto si todo salió bien como si hubo un error.
      // Apagamos el interruptor de carga para que el spinner desaparezca.
      loading.value = false
    }
  })
</script>

<template>
  <!-- section: Etiqueta semántica de HTML que agrupa este contenido. Usa BEM: bloque principal 'home-view' -->
  <section class="home-view">
    
    <!-- Contenedor del contenido principal para ordenarlo todo verticalmente -->
    <div class="home-view__content">
      
      <!-- HERO: El bloque de bienvenida principal del sitio web -->
      <div class="home-hero">
        <!-- Título principal. La etiqueta <span> nos sirve para pintar la palabra "ChickenThiefGames" de naranja -->
        <h1 class="home-hero__title">Bienvenido a <span>ChickenThiefGames</span></h1>
        
        <!-- Subtítulo descriptivo -->
        <p class="home-hero__subtitle">Tu portal definitivo para explorar y guardar tus videojuegos favoritos.</p>
        
        <!-- Contenedor de botones de acción rápida -->
        <div class="home-hero__actions">
          <!-- RouterLink: Enlace a la lista de juegos. Usa el estilo de botón primario (.btn--primary) -->
          <RouterLink to="/games" class="btn btn--primary">Explorar Juegos</RouterLink>
          
          <!-- RouterLink: Enlace a los favoritos. Usa el estilo de botón secundario (.btn--secondary) -->
          <RouterLink to="/favorites" class="btn btn--secondary">Ver Favoritos</RouterLink>
        </div>
      </div>

      <!-- SECCIÓN DE JUEGOS RECOMENDADOS (Los 3 juegos aleatorios que cargamos) -->
      <div class="home-recommendations">
        <!-- Título de la sección con una línea horizontal divisoria (estilo Escape Velocity) -->
        <div class="section-title">
          <span class="section-title__text">Juegos Recomendados</span>
        </div>
        
        <!-- v-if="loading": Si estamos cargando datos de internet, dibuja el componente LoadingState -->
        <LoadingState v-if="loading" message="Cargando recomendaciones..." />
        
        <!-- v-else-if="error": Si la carga falló, dibuja el componente ErrorState con nuestro mensaje de error -->
        <ErrorState v-else-if="error" :message="error" />
        
        <!-- v-else-if="...": Si no está cargando, no hay error y tenemos juegos, dibuja la grilla de tarjetas -->
        <div v-else-if="recommendedGames.length > 0" class="home-recommendations__grid">
          
          <!-- v-for: Es un bucle. Va uno por uno en la lista de 3 juegos recomendados.
               En cada vuelta, guarda el juego actual en la variable 'juego'.
               :key: Le da a Vue un identificador único (id) para controlar el rendimiento.
               :game="juego": Le pasa los datos del juego actual al molde de la tarjeta (GameCard) -->
          <div v-for="juego in recommendedGames" :key="juego.id" class="home-recommendations__item">
            <GameCard :game="juego" />
          </div>
        </div>
      </div>

      <!-- SECCIÓN DE CARACTERÍSTICAS (Tres bloques informativos abajo) -->
      <div class="home-features">
        <!-- Título de la sección con estilo Escape Velocity -->
        <div class="section-title">
          <span class="section-title__text">¿Qué puedes hacer?</span>
        </div>
        
        <!-- Grilla responsiva que ordena las tres cajitas de características -->
        <div class="home-features__grid">
          
          <!-- Característica 1: Catálogo -->
          <div class="home-feature-card">
            <div class="home-feature-card__icon">🎮</div>
            <h3 class="home-feature-card__title">Explorar Catálogo</h3>
            <p class="home-feature-card__desc">Busca entre miles de videojuegos gracias a la integración en tiempo real con la API de RAWG.</p>
          </div>
          
          <!-- Característica 2: Favoritos -->
          <div class="home-feature-card">
            <div class="home-feature-card__icon">⭐</div>
            <h3 class="home-feature-card__title">Guardar Favoritos</h3>
            <p class="home-feature-card__desc">Agrega tus títulos preferidos a tu biblioteca personal con persistencia en tu navegador (localStorage).</p>
          </div>
          
          <!-- Característica 3: Temas -->
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
/* -------------------------------------------------------------------------- */
/* CONEXIONES CSS A LA VISTA (Cómo se aplican los estilos de main.css y scoped) */
/* -------------------------------------------------------------------------- */

/* 'scoped' significa que estas reglas de pintura SOLO se aplican a este archivo. 
   No afectarán a otras páginas como Favoritos o Juegos. */

.home-view {
  position: relative; /* Define que este bloque es el punto de referencia para posiciones absolutas */
  min-height: 70vh; /* Ocupa al menos el 70% de la altura visible de la pantalla */
  display: flex; /* Activa Flexbox para ordenar cosas fácilmente */
  flex-direction: column; /* Alinea los hijos verticalmente (uno abajo del otro) */
  justify-content: center; /* Centra el contenido verticalmente */
  overflow: hidden; /* Oculta cualquier cosa que intente salirse de los límites de la página */
  padding: 1rem 0; /* Añade espacio arriba y abajo para que no choque con la cabecera/footer */
}

.home-view__content {
  position: relative;
  z-index: 1; /* Hace que el contenido se dibuje por encima de cualquier fondo */
  display: flex;
  flex-direction: column;
  gap: 3.5rem; /* Añade exactamente 3.5rem de espacio entre cada sección vertical */
}

/* -------------------------------------------------------------------------- */
/* Sección Hero (Bienvenida) */
/* -------------------------------------------------------------------------- */
.home-hero {
  text-align: center; /* Centra todos los textos dentro del bloque */
  padding: 3rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center; /* Centra los elementos horizontalmente */
  gap: 1.5rem; /* Espaciado entre título, subtítulo y botones */
}

.home-hero__title {
  font-family: var(--font-title); /* Conecta con la variable '--font-title' de main.css (Montserrat) */
  font-size: 2.8rem; /* Tamaño de letra grande para llamar la atención */
  font-weight: 800; /* Letra extra gruesa (negrita) */
  letter-spacing: -0.02em; /* Junta las letras un poquito para estilo moderno */
  line-height: 1.2;
}

.home-hero__title span {
  color: var(--color-accent); /* Pinta ChickenThiefGames del color naranja acento de main.css */
}

.home-hero__subtitle {
  font-family: var(--font-body); /* Conecta con la variable '--font-body' de main.css (Source Sans 3) */
  font-size: 1.25rem;
  color: var(--color-text-secondary); /* Usa el color de texto gris claro/secundario de main.css */
  max-width: 600px; /* Limita el ancho del subtítulo para que no ocupe toda la pantalla y sea fácil de leer */
}

.home-hero__actions {
  display: flex;
  gap: 1rem; /* Espacio de 1rem entre los dos botones */
  margin-top: 1rem;
  flex-wrap: wrap; /* Si la pantalla es pequeña (celular), baja el segundo botón abajo */
  justify-content: center;
}

/* Nota: Las clases '.btn', '.btn--primary' y '.btn--secondary' están programadas en main.css. 
   Se aplican de forma global para que todos los botones de la web tengan el mismo aspecto Escape Velocity. */

/* -------------------------------------------------------------------------- */
/* Sección Recomendaciones (Grilla de 3 juegos de la API) */
/* -------------------------------------------------------------------------- */
.home-recommendations {
  padding: 1rem 0;
}

/* Nota: La clase '.section-title' y '.section-title__text' que hacen la línea horizontal 
   también están escritas en main.css de forma global para reusarse en todas las páginas. */

.home-recommendations__grid {
  display: grid; /* Activa el modo Grid (cuadrícula) */
  /* Genera columnas automáticas según el espacio disponible. Cada columna mide mínimo 280px */
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); 
  gap: 2rem; /* Espacio de separación entre las tarjetas de juegos */
  margin-top: 1rem;
}

.home-recommendations__item {
  display: flex;
  justify-content: center; /* Centra la tarjeta de juego dentro de su espacio de la grilla */
}

/* -------------------------------------------------------------------------- */
/* Sección Características (Cajitas informativas) */
/* -------------------------------------------------------------------------- */
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
  background-color: var(--color-bg-secondary); /* Usa el fondo secundario de main.css (gris más claro en oscuro) */
  border: 1px solid var(--color-border); /* Dibuja un borde fino definido por main.css */
  border-radius: var(--border-radius-md); /* Redondea las esquinas con la variable de main.css (8px) */
  padding: 2.5rem 2rem;
  text-align: center;
  /* Transición normal (0.3s): Hace que los efectos al pasar el ratón se sientan suaves (animados) y no de golpe */
  transition: var(--transition-normal); 
  box-shadow: 0 4px 6px var(--color-card-shadow); /* Aplica una sombra suave debajo */
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

/* Efecto hover: Qué pasa cuando pasas el ratón por encima de la tarjeta */
.home-feature-card:hover {
  transform: translateY(-5px); /* Eleva la tarjeta 5 píxeles hacia arriba */
  box-shadow: 0 8px 16px var(--color-card-hover-shadow); /* Hace que la sombra sea más grande y suave (efecto altura) */
  border-color: var(--color-accent); /* Pinta el borde de naranja acento */
}

.home-feature-card__icon {
  font-size: 2.5rem; /* Agranda los emojis de los iconos */
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

/* -------------------------------------------------------------------------- */
/* Medias Queries (Diseño adaptativo para celulares) */
/* -------------------------------------------------------------------------- */

/* Si la pantalla es de 768 píxeles o menos (como la de un teléfono móvil): */
@media (max-width: 768px) {
  .home-hero__title {
    font-size: 2rem; /* Achicamos el tamaño del título de bienvenida para que quepa bien */
  }
  
  .home-hero__subtitle {
    font-size: 1.1rem; /* Achicamos un poco el subtítulo */
  }
}
</style>