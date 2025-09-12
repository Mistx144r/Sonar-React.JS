import { createRoot } from "react-dom/client";
import "./css/index.css";
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
);
