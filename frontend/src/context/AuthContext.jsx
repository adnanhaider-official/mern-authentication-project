import { createContext, useContext, useState } from "react";

// 1. Create Context
const AuthContext = createContext();

// 2. Create Provider
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

// 3. Custom Hook
export function useAuth() {
  return useContext(AuthContext);
}
