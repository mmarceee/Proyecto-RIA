<script setup>
  import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <header class="app-header">
    <nav class="app-header__nav">
      <RouterLink class="app-header__link" to="/"> Inicio </RouterLink>
      <RouterLink class="app-header__link" to="/games"> Juegos </RouterLink>
      <RouterLink class="app-header__link" to="/favorites"> Favoritos </RouterLink>
      <RouterLink class="app-header__link" to="/settings"> Configuración </RouterLink>
    </nav>
  </header>

  <main class="app-main">
    <RouterView />
  </main>
</template>