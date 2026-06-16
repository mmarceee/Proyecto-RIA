import { defineStore } from 'pinia';
import { useLocalStorage } from '@/composables/useLocalStorage';


const KEY_FAVORITOS = 'juegos-favoritos'
const favoritosStorage = useLocalStorage(KEY_FAVORITOS, [])

export const useFavoriteStore = defineStore('favoritos', {
  state: () => ({
    favoritos: favoritosStorage.data.value
    }),

    actions: {
        agregarFavorito(game) {
          if(this.isFavorito(game.id)){
            return;
          }
          
          const juegoFavorito = {
            id : game.id,
            name : game.name,
            background_image: game.background_image,
            rating : game.rating,
            released : game.released,
          }

          this.favoritos.push(juegoFavorito);
          favoritosStorage.save(this.favoritos)
        },
        
        quitarFavorito(gameId) {
          this.favoritos = this.favoritos.filter((favorito) => favorito.id !== gameId );
          favoritosStorage.save(this.favoritos)
        },

        isFavorito(gameId) {
          return this.favoritos.some((favorito) => favorito.id === gameId);
        },

        marcarDesmarcarFavorito(game){
          if(this.isFavorito(game.id)){
            this.quitarFavorito(game.id)

          }else{
            this.agregarFavorito(game)
          }
        },
    }
});
