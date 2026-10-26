import React, { createContext, useContext, useState, useEffect } from 'react';
import { authApi } from '../api/authApi';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('currentUser');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('currentUser', JSON.stringify(user));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authApi.login(email, password);
      const userData = {
        accountID: data.accountID,
        accountName: data.accountName,
        accountEmail: data.accountEmail,
        accountRole: data.accountRole,
        roleName: data.accountRole === 1 ? 'Admin' : 'Staff',
      };
      setUser(userData);
      return userData;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const updateUser = (fields) => {
    setUser((prev) => (prev ? { ...prev, ...fields } : null));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin: user?.accountRole === 1,
        isStaff: user?.accountRole === 2,
        isAuthenticated: !!user,
        login,
        logout,
        updateUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
