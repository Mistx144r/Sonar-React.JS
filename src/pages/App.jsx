import Header from "../components/Header.jsx";
import Dashboard from "../components/Dashboard.jsx";
import PlaylistsSideBar from "../components/PlaylistsSideBar.jsx";
import MiniPlayer from "../components/MiniPlayer.jsx";
import PlayerController from "../components/PlayerController.jsx";
<<<<<<< HEAD

function App() {
  return (
    <div className="flex flex-col w-screen h-screen select-none">
      <Header />
      <div className="flex flex-1 gap-3 px-5">
        <PlaylistsSideBar />
        <Dashboard />
        <MiniPlayer />
      </div>
      <PlayerController />
    </div>
=======
import ArtistProfile from "../components/ArtistProfile.jsx";
import NotFound from "./NotFound.jsx";
import { usePlayer } from "../contexts/PlayerContext.jsx";

import { ArtistProfileProvider } from "../contexts/ArtistProfileContext.jsx";
import { Routes, Route } from "react-router-dom";
import AlbumPage from "../components/AlbumPage.jsx";
import SearchPage from "../components/SearchPage.jsx";
import { ProtectedRoute } from "../components/ProtectedRoute.jsx";
import PlaylistPage from "../components/PlaylistPage.jsx";

import { ToastContainer } from "react-toastify";

function App() {
  const { isSideBarOpen, currentMusic } = usePlayer();

  return (
    <ArtistProfileProvider>
      <ProtectedRoute>
        <div className="flex flex-col w-screen h-[100vh] select-none overflow-y-hidden">
          <Header />
          <div className="flex h-full flex-1 gap-3">
            <PlaylistsSideBar />
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/artist/:artistId"
                element={
                  <ProtectedRoute>
                    <ArtistProfile />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/playlist/:playlistId"
                element={
                  <ProtectedRoute>
                    <PlaylistPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/album/:albumId"
                element={
                  <ProtectedRoute>
                    <AlbumPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/search/:query"
                element={
                  <ProtectedRoute>
                    <SearchPage />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<NotFound />} />
            </Routes>
            {isSideBarOpen && currentMusic && <MiniPlayer />}
          </div>
          <PlayerController />
          <ToastContainer
            position="bottom-center"
            autoClose={2500}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="dark"
            style={{ zIndex: 9999 }}
          />
        </div>
      </ProtectedRoute>
    </ArtistProfileProvider>
>>>>>>> b179d2f (Novas Features Como Pagina Do Artista, Playlist, Album, Pagina De Pesquisa, Playlist Na Sidebar, Mini Player, Header E Controller, Context Para Controlar As Musicas Universalmente No Aplicativo, Pagina De Login, Proteção De Rotas Com O React Router. Consertei Varios Bugs No Caminho.)
  );
}

export default App;
