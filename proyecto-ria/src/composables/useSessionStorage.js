import { ref } from 'vue'

export function useSessionStorage(key, initialValue){

    const storedValue = sessionStorage.getItem(key);

    const data = ref(storedValue ? storedValue : initialValue)

    function save(newValue){
        data.value = newValue;

        sessionStorage.setItem(key, newValue);

    }

    return { data, save }
}