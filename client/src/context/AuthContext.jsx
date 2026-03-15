import { createContext, useContext, useState } from "react";

// Create the context object
const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Initialize token from localStorage so login survives page refresh
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [user, setUser] = useState(() => {
    // On load, decode the stored token to get user info (role, id, companyId)
    const stored = localStorage.getItem("token");
    if (!stored) return null;
    try {
      // JWT payload is the middle part — base64 decode it
      const payload = JSON.parse(atob(stored.split(".")[1]));
      return payload;
    } catch {
      return null;
    }
  });

  // Called after successful login or signup
  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    const payload = JSON.parse(atob(newToken.split(".")[1]));
    setUser(payload);
  };

  // Called on logout — wipe everything
  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook so any component can just write: const { user, login, logout } = useAuth()
export const useAuth = () => useContext(AuthContext);