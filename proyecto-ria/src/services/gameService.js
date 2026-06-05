
const apiKey = import.meta.env.VITE_RAWG_API_KEY;
const baseUrl = import.meta.env.VITE_RAWG_API_BASE_URL || 'https://api.rawg.io/api';
const pageSize = import.meta.env.VITE_RAWG_PAGE_SIZE || 20;

export async function getGames () {
    
    validarApiKey();
    
    //Construir la URL con los parámetros
    const url = new URL(`${baseUrl}/games`)
    url.searchParams.set('key', apiKey)
    url.searchParams.set('page_size', pageSize)


    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Error en la respuesta de la API: ' + response.status);
    }

    const data = await response.json();
    return data.results;
}

export async function getGameById (id) {

    if (!id) {
        throw new Error('El id del juego es obligatorio')
    }

    validarApiKey();

    const url = new URL(`${baseUrl}/games/${id}`)
    url.searchParams.set('key', apiKey)

    const response = await fetch(url)

    if (!response.ok) {
        throw new Error('Error en la respuesta de la API: ' + response.status)
    }

    const game = await response.json();
    return game;
}

function validarApiKey(){
    if (!apiKey) {
        throw new Error('RAWG API key no está definida. Por favor setea VITE_RAWG_API_KEY en tu archivo .env.');
    }
}