# ChickenThief Games

**ChickenThief Games** es una aplicación web de base de datos de videojuegos construida con **Vue 3**, **Vite**, **Pinia** y **Vue Router**. Permite a los usuarios explorar juegos, registrarse, iniciar sesión y gestionar una lista de favoritos. Cuenta con un diseño responsivo, modos claro y oscuro.

## Tecnologías Principales

- **[Vue 3](https://vuejs.org/)** (Composition API)
- **[Vite](https://vitejs.dev/)** - Herramienta de construcción rápida.
- **[Pinia](https://pinia.vuejs.org/)** - Gestión de estado.
- **[Vue Router](https://router.vuejs.org/)** - Enrutamiento.
- **[ESLint](https://eslint.org/)** & **[Prettier](https://prettier.io/)** - Herramientas de calidad y formato de código.

## Requisitos Previos

Asegúrate de tener instalado en tu sistema:
- **Node.js** (Versión 20.19.0 o superior, o >= 22.12.0)
- **npm** (Normalmente se incluye con Node.js)

## Instrucciones de Ejecución

Sigue estos pasos para levantar el proyecto en tu entorno local:

###  Instalación de Dependencias
Abre una terminal en el directorio raíz del proyecto (`proyecto-ria`) y ejecuta:
```bash
npm install
```

###  Levantar el Entorno de Desarrollo
Para iniciar el servidor de desarrollo con Hot-Module Replacement (HMR):
```bash
npm run dev
```
La terminal mostrará la URL local donde se está ejecutando la aplicación (generalmente `http://localhost:5173/`).

###  Construcción para Producción (Build)
Para compilar y minificar la aplicación para su despliegue en producción:
```bash
npm run build
```
Los archivos optimizados se generarán en la carpeta `dist`.

###  Previsualizar la Producción
Si quieres probar localmente la versión construida (después de ejecutar el comando build):
```bash
npm run preview
```

## Otros Comandos Útiles

- **Formatear el código** usando Prettier:
  ```bash
  npm run format
  ```
- **Analizar y corregir errores de código** (Linting):
  ```bash
  npm run lint
  ```

## Estructura del Proyecto

- `src/assets/`: Imágenes y recursos estáticos.
- `src/components/`: Componentes reutilizables de Vue (Tarjetas, Estados de Carga, etc.).
- `src/composables/`: Funciones reutilizables (Composition API).
- `src/data/`: Datos simulados o estáticos.
- `src/router/`: Configuración de rutas de la aplicación.
- `src/services/`: Lógica de interacción con APIs o bases de datos simuladas.
- `src/stores/`: Archivos de configuración de Pinia (Estado global, Autenticación, Configuración de temas).
- `src/views/`: Componentes que representan páginas completas (Inicio, Juegos, Login, Perfil).

