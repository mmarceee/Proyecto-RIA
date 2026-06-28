// src/services/db.js

const DB_NAME = 'ChickenThiefGamesDB';
const DB_VERSION = 3;
const STORE_NAME = 'favoritos';
const CACHE_STORE_NAME = 'cache_juegos';

export function inicializarDB() {
  return new Promise((resolve, reject) => {
    // Abrimos (o creamos) la base de datos
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    // Este evento solo se dispara si la base de datos no existe o cambia de versión
    request.onupgradeneeded = (event) => {
      
      const db = event.target.result;
      
      if (db.objectStoreNames.contains(STORE_NAME)) {
        db.deleteObjectStore(STORE_NAME);
      }

      const store = db.createObjectStore(STORE_NAME, {
        keyPath: 'favoritoId'
      });

      store.createIndex('usuario', 'usuario', { unique: false });

      if (!db.objectStoreNames.contains(CACHE_STORE_NAME)) {
        db.createObjectStore(CACHE_STORE_NAME, { keyPath: 'id' });
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
    
    const registro = { 
      ...juego, 
      usuario: usuarioId,
      favoritoId: `${usuarioId}-${juego.id}`
    };
    
    const request = store.put(registro); 
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
export async function eliminarFavoritoDB(juegoId, usuarioId) {
  const db = await inicializarDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(STORE_NAME, 'readwrite');
    const store = transaction.objectStore(STORE_NAME);
    
    const favoritoId = `${usuarioId}-${juegoId}`;
    
    const request = store.delete(favoritoId);
    
    request.onsuccess = () => resolve(true);
    request.onerror = (e) => reject(e.target.error);
  });
}

// Guardar datos en la cache de juegos descargados
export async function guardarEnCacheDB(claveBusqueda, datos) {
  const db = await inicializarDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(CACHE_STORE_NAME, 'readwrite');
    const store = transaction.objectStore(CACHE_STORE_NAME);
    
    // Guardamos los datos con la clave de búsqueda como ID
    const registro = { id: claveBusqueda, datos, timestamp: Date.now() };
    
    const request = store.put(registro);
    request.onsuccess = () => resolve(true);
    request.onerror = (e) => reject(e.target.error);
  });
}

export async function obtenerDeCacheDB(claveBusqueda) {
  const db = await inicializarDB();
  return new Promise((resolve, reject) => {
    const transaction = db.transaction(CACHE_STORE_NAME, 'readonly'); 
    const store = transaction.objectStore(CACHE_STORE_NAME);
    
    const request = store.get(claveBusqueda);
    
    request.onsuccess = (e) => {
      const registro = e.target.result;
      if (registro) {
      const TIEMPO_MAXIMO = 12 * 60 * 60 * 1000; // 12 horas 
      const TIEMPO_ACTUAL = Date.now();
      
      if(TIEMPO_ACTUAL - registro.timestamp > TIEMPO_MAXIMO) {
        resolve(null);
      } else {
        resolve(registro.datos); // Retornamos los datos si no están caducados
      }
    } else {
      resolve(null); // No hay datos en cache para esa clave
    }
    };
    request.onerror = (e) => reject(e.target.error);
  });
}
