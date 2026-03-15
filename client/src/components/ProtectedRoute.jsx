import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children }) => {
  const { token } = useAuth();

  // If no token, kick them to login
  if (!token) return <Navigate to="/login" replace />;

  return children;
};

export default ProtectedRoute;