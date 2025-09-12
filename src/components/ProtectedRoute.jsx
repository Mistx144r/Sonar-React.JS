import { Navigate } from "react-router-dom";

function parseJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch (e) {
    return null;
  }
}

export function ProtectedRoute({ children }) {
  const token = JSON.parse(localStorage.getItem("userToken"));

  if (!token) return <Navigate to="/login" replace />;

  const decoded = parseJwt(token.token.token);

  if (!decoded || decoded.exp * 1000 < Date.now()) {
    localStorage.removeItem("userToken");
    return <Navigate to="/login" replace />;
  }

  return children;
}
