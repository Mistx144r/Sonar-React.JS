import Header from "../components/Header.jsx";
import Dashboard from "../components/Dashboard.jsx";
import PlaylistsSideBar from "../components/PlaylistsSideBar.jsx";
import MiniPlayer from "../components/MiniPlayer.jsx";
import PlayerController from "../components/PlayerController.jsx";
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
import LyricsPage from "../components/LyricsPage.jsx";

function App() {
  const { isSideBarOpen, currentMusic, isLyricsOpen } = usePlayer();

  return (
    <ArtistProfileProvider>
      <ProtectedRoute>
        <div className="flex flex-col w-screen h-[100vh] select-none overflow-y-hidden">
          <Header />
          <div className="flex h-full flex-1 gap-3">
            <PlaylistsSideBar />

            <div className="flex h-full w-full relative">
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

              {isLyricsOpen && currentMusic && (
                <div className="absolute inset-0">
                  <LyricsPage />
                </div>
              )}
            </div>

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
  );
}

export default App;
