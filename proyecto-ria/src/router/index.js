import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/authStore' // 1. Importamos el Store de Autenticación

// Importación de las vistas existentes
const HomeView = () => import('@/views/HomeView.vue')
const GamesView = () => import('@/views/GamesView.vue')
const GameDetailView = () => import('@/views/GameDetailView.vue')
const FavoritesView = () => import('@/views/FavoritesView.vue')
const SettingsView = () => import('@/views/SettingsView.vue')

// 2. Importación de las nuevas vistas de usuario
const LoginView = () => import('@/views/LoginView.vue')
const RegisterView = () => import('@/views/RegisterView.vue')

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
    // 3. Agregamos 'requiresAuth: true' para proteger esta ruta
    meta: { title: 'Favoritos', requiresAuth: true },
  },
  {
    path: '/settings',
    name: 'settings',
    component: SettingsView,
    // 3. Agregamos 'requiresAuth: true' para proteger esta ruta
    meta: { title: 'Configuración', requiresAuth: true },
  },
  // 4. Registramos las rutas de Login y Registro
  {
    path: '/login',
    name: 'login',
    component: LoginView,
    meta: { title: 'Iniciar Sesión' },
  },
  {
    path: '/register',
    name: 'register',
    component: RegisterView,
    meta: { title: 'Registrarse' },
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

// 5. Guardián de navegación (Navigation Guard)
// Se ejecuta cada vez que el usuario intenta cambiar de página
router.beforeEach((to) => {
  const authStore = useAuthStore()

  // Si la ruta a la que va requiere autenticación y el usuario NO está logueado
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    // Redirigir a la página de inicio de sesión
    return { name: 'login' }
  } else {
    // Permitir el paso
    return true
  }
})

const appName = import.meta.env.VITE_APP_NAME || 'ChickenThiefGames'

router.afterEach((to) => {
  document.title = to.meta.title ? `${to.meta.title} - ${appName}` : appName
})

export default router