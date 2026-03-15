import { useAuth } from "../context/AuthContext";

const RoleGuard = ({ allowedRoles, children }) => {
  const { user } = useAuth();

  // If user's role is not in the allowed list, render nothing
  if (!user || !allowedRoles.includes(user.role)) return null;

  return children;
};

export default RoleGuard;