import { ref } from 'vue'

export function useLocalStorage(key, valorInicial) {

  function getInitialValue() {
    const valorGuardado = localStorage.getItem(key)

    if (!valorGuardado) {
      return valorInicial
    }

    try {
      return JSON.parse(valorGuardado)
    } catch {
      localStorage.removeItem(key)
      return valorInicial
    }
  }

  const data = ref(getInitialValue())

  function save(nuevoValor) {
    data.value = nuevoValor
    localStorage.setItem(key, JSON.stringify(nuevoValor))
  }

  return { data, save }
}

/*
useLocalStorage('juegos-favoritos', [])
        
busca favoritos guardados
        
si existen, los convierte de JSON a array
        
si no existen, usa []
        
devuelve:
  data = favoritos actuales
  save = función para guardar favoritos nuevos

*/