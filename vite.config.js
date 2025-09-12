import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

<<<<<<< HEAD
// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
=======
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
  },
>>>>>>> b179d2f (Novas Features Como Pagina Do Artista, Playlist, Album, Pagina De Pesquisa, Playlist Na Sidebar, Mini Player, Header E Controller, Context Para Controlar As Musicas Universalmente No Aplicativo, Pagina De Login, Proteção De Rotas Com O React Router. Consertei Varios Bugs No Caminho.)
})
