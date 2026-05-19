import React, { createContext, useContext, useState } from 'react';
import { dbCreateUser, dbGetUserByEmail, dbGetUserById } from '../database/database';
import { hashPassword, verifyPassword } from '../utils/crypto';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  const signup = async ({ fullName, email, password, businessName }) => {
    const existing = dbGetUserByEmail(email);
    if (existing) {
      return { success: false, error: 'An account with this email already exists.' };
    }
    const passwordHash = await hashPassword(password);
    const result = dbCreateUser({ fullName, email, passwordHash, businessName });
    const newUser = dbGetUserById(result.lastInsertRowId);
    setUser(newUser);
    return { success: true };
  };

  const login = async (email, password) => {
    const found = dbGetUserByEmail(email);
    if (!found) {
      return { success: false, error: 'No account found with that email.' };
    }
    const valid = await verifyPassword(password, found.password_hash);
    if (!valid) {
      return { success: false, error: 'Incorrect password.' };
    }
    setUser(found);
    return { success: true };
  };

  const logout = () => {
    setUser(null);
  };

  const refreshUser = () => {
    if (user) {
      const updated = dbGetUserById(user.user_id);
      setUser(updated);
    }
  };

  return (
    <AuthContext.Provider value={{ user, signup, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
