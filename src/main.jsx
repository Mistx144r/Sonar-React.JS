import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./css/index.css";
<<<<<<< HEAD
import App from "./pages/App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
=======

import { PlayerProvider } from "./contexts/PlayerContext.jsx";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import App from "./pages/App.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import { ProtectedRoute } from "./components/ProtectedRoute.jsx";
import { GuestRoute } from "./components/GuestRoute.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <QueryClientProvider client={queryClient}>
    <PlayerProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              <GuestRoute>
                <Login />
              </GuestRoute>
            }
          />

          <Route
            path="/register"
            element={
              <GuestRoute>
                <Register />
              </GuestRoute>
            }
          />

          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <App />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </PlayerProvider>
  </QueryClientProvider>
>>>>>>> b179d2f (Novas Features Como Pagina Do Artista, Playlist, Album, Pagina De Pesquisa, Playlist Na Sidebar, Mini Player, Header E Controller, Context Para Controlar As Musicas Universalmente No Aplicativo, Pagina De Login, Proteção De Rotas Com O React Router. Consertei Varios Bugs No Caminho.)
);
