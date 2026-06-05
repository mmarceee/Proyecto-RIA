import { ref } from 'vue'

export function useLocalStorage(key, initialValue) {

  function getInitialValue() {
    const storedValue = localStorage.getItem(key)

    if (!storedValue) {
      return initialValue
    }

    try {
      return JSON.parse(storedValue)
    } catch {
      localStorage.removeItem(key)
      return initialValue
    }
  }

  const data = ref(getInitialValue())

  function save(newValue) {
    data.value = newValue
    localStorage.setItem(key, JSON.stringify(newValue))
  }

  return { data, save }
}

/*
useLocalStorage('favorite-games', [])
        
busca favoritos guardados
        
si existen, los convierte de JSON a array
        
si no existen, usa []
        
devuelve:
  data = favoritos actuales
  save = función para guardar favoritos nuevos

*/