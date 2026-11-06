import { createContext, useContext, useState, useEffect } from "react";
import api from "../lib/axios";

// 1. Create Context
const AuthContext = createContext();

// 2. Create Provider
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check Logged In User
  const checkAuth = async () => {
    try {
      const response = await api.get("/auth/profile");

      setUser(response.data.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Run When App Loads
  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, loading, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Custom Hook
export function useAuth() {
  return useContext(AuthContext);
}
