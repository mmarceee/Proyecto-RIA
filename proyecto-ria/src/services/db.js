// src/services/db.js

const DB_NAME = 'ChickenThiefGamesDB';
const DB_VERSION = 1;
const STORE_NAME = 'favoritos';

export function inicializarDB() {
  return new Promise((resolve, reject) => {
    // Abrimos (o creamos) la base de datos
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    // Este evento solo se dispara si la base de datos no existe o cambia de versión
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        // Creamos el almacén usando el campo 'id' de los juegos como clave primaria
        // Y añadimos un índice para poder filtrar por 'usuario' si fuese necesario
        const store = db.createObjectStore(STORE_NAME, { keyPath: 'id' });
        store.createIndex('usuario', 'usuario', { unique: false });
      }
    };

    request.onsuccess = (event) => {
      resolve(event.target.result); // Retorna la conexión a la base de datos
    };

    request.onerror = (event) => {
      reject(event.target.error);
    };
  });
}

// Guardar o actualizar un favorito
export async function guardarFavoritoDB(juego, usuarioId) {
  const db = await inicializarDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    // Añadimos el ID del usuario al objeto del juego para saber de quién es
    const registro = { ...juego, usuario: usuarioId };
    
    const request = store.put(registro); // .put añade o sobreescribe si ya existe
    request.onsuccess = () => resolve(true);
    request.onerror = (e) => reject(e.target.error);
  });
}
// Obtener todos los favoritos de un usuario específico usando el índice
export async function obtenerFavoritosUsuarioDB(usuarioId) {
  const db = await inicializarDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readonly');
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index('usuario');
    
    // Buscamos solo los registros donde el campo 'usuario' coincida con 'usuarioId'
    const request = index.getAll(usuarioId);
    request.onsuccess = (e) => resolve(e.target.result);
    request.onerror = (e) => reject(e.target.error);
  });
}
// Eliminar un favorito por su ID
export async function eliminarFavoritoDB(juegoId) {
  const db = await inicializarDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    const request = store.delete(juegoId);
    request.onsuccess = () => resolve(true);
    request.onerror = (e) => reject(e.target.error);
  });
}