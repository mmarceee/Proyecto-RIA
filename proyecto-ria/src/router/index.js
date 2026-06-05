import { createRouter, createWebHistory } from 'vue-router'

const HomeView = () => import('@/views/HomeView.vue')
const GamesView = () => import('@/views/GamesView.vue')
const GameDetailView = () => import('@/views/GameDetailView.vue')
const FavoritesView = () => import('@/views/FavoritesView.vue')
const SettingsView = () => import('@/views/SettingsView.vue')

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { title: 'Inicio' },
  },
  {
    path: '/games',
    name: 'games',
    component: GamesView,
    meta: { title: 'Juegos' },
  },
  {
    path: '/games/:id',
    name: 'game-detail',
    component: GameDetailView,
    meta: { title: 'Detalle del juego' },
  },
  {
    path: '/favorites',
    name: 'favorites',
    component: FavoritesView,
    meta: { title: 'Favoritos' },
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView,
    meta: { title: 'Configuración' },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

const appName = import.meta.env.VITE_APP_NAME || 'ChickenThiefGames'

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} - ${appName}` : appName
})


export default router
