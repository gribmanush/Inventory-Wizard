import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [registeredUser, setRegisteredUser] = useState(null);
  const [isLoading, setIsLoading] = useState(false); // no loading

  const signUp = async (userData) => {
    // Save credentials in memory and log user in
    setRegisteredUser(userData);
    setUser(userData);
  };

  const login = async (email, password) => {
    if (
      registeredUser &&
      registeredUser.email === email &&
      registeredUser.password === password
    ) {
      setUser(registeredUser);
      return true;
    }
    return false;
  };

  const logout = async () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, signUp, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);