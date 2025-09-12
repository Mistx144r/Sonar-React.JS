import { Navigate } from "react-router-dom";

export function GuestRoute({ children }) {
  const token = localStorage.getItem("userToken");

  if (token) {
    return <Navigate to="/" replace />;
  }

  return children;
}
