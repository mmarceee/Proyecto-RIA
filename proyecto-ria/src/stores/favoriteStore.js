import { defineStore } from 'pinia';
const FAVORITES_STORAGE_KEY = 'favorite-games'

function loadFavorites(){
  let storedFavorites = localStorage.getItem(FAVORITES_STORAGE_KEY)

  if(!storedFavorites){
    return []
  }

  return JSON.parse(storedFavorites) //JSON.stringify(array) para guardar. y JSON.parse(texto) para recuperar.
}

function saveFavorites(favorites){
  localStorage.setItem(FAVORITES_STORAGE_KEY, 
  JSON.stringify(favorites)) //Eso transforma el array en un string
}


export const useFavoriteStore = defineStore('favorites', {
  state: () => ({
    favorites: loadFavorites(),
    }),

    actions: {
        addFavorite(game) {
          if(this.isFavorite(game.id)){
            return;
          }
          else{
            const addGame = {
              id : game.id,
              name : game.name,
              background_image: game.background_image,
              rating : game.rating,
              released : game.released,
            }

            this.favorites.push(addGame);
            saveFavorites(this.favorites)
          }

        },
        removeFavorite(gameId) {
          this.favorites = this.favorites.filter((favorite) => favorite.id !== gameId );
          saveFavorites(this.favorites)
        },

        isFavorite(gameId) {
          return this.favorites.some((favorite) => favorite.id === gameId);
        },

        marcarDesmarcarFavorito(game){
          if(this.isFavorite(game.id)){
            this.removeFavorite(game.id)

          }else{
            this.addFavorite(game)
          }
        },
    }
});