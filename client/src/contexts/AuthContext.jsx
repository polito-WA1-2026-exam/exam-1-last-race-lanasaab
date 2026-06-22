import React, { createContext, useContext, useState, useEffect } from "react";
import { AuthAPI } from "../api";

//global authentication
const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  //for user
  const [user, setUser] = useState(null);
  
  //are we still checking the session?
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const currentUser = await AuthAPI.getCurrentUser();
        //stores user globally
        setUser(currentUser);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = async (username, password) => {
    const user = await AuthAPI.login(username, password);
    setUser(user);
    return user;
  };

  const logout = async () => {
    await AuthAPI.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
