import { ref } from 'vue'

export function useSessionStorage(key, valorInicial){

    const valorGuardado = sessionStorage.getItem(key);

    const data = ref(valorGuardado ? valorGuardado : valorInicial)

    function save(nuevoValor){
        data.value = nuevoValor;

        sessionStorage.setItem(key, nuevoValor);

    }

    return { data, save }
}