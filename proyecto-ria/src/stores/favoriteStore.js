import { defineStore } from 'pinia';
import { useLocalStorage } from '@/composables/useLocalStorage';


const FAVORITES_STORAGE_KEY = 'favorite-games'
const favoritesStorage = useLocalStorage(FAVORITES_STORAGE_KEY, [])

export const useFavoriteStore = defineStore('favorites', {
  state: () => ({
    favorites: favoritesStorage.data.value
    }),

    actions: {
        addFavorite(game) {
          if(this.isFavorite(game.id)){
            return;
          }
          
          const addGame = {
            id : game.id,
            name : game.name,
            background_image: game.background_image,
            rating : game.rating,
            released : game.released,
          }

          this.favorites.push(addGame);
          favoritesStorage.save(this.favorites)
        },
        
        removeFavorite(gameId) {
          this.favorites = this.favorites.filter((favorite) => favorite.id !== gameId );
          favoritesStorage.save(this.favorites)
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