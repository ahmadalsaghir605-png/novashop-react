import { createContext, useContext, useEffect, useState } from 'react';

import { Api } from '../api.js';

const AuthContext = createContext();
const TOKEN_KEY = 'novashop_token';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const profile = await Api.getMe(token);
        setUser(profile);
      } catch (error) {
        console.warn('Session invalid', error);
        localStorage.removeItem(TOKEN_KEY);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };

    loadSession();
  }, [token]);

  const login = async (email, password, extToken = null, extUser = null) => {
    let nextToken, nextUser;
    if (extToken && extUser) {
      nextToken = extToken;
      nextUser = extUser;
    } else {
      const result = await Api.login(email, password);
      nextToken = result.token;
      nextUser = result.user;
    }
    localStorage.setItem(TOKEN_KEY, nextToken);
    setToken(nextToken);
    setUser(nextUser);
    return nextUser;
  };

  const register = async (name, email, password) => {
    const { token: nextToken, user: nextUser } = await Api.register(name, email, password);
    localStorage.setItem(TOKEN_KEY, nextToken);
    setToken(nextToken);
    setUser(nextUser);
    return nextUser;
  };

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    setUser(null);
  };

  const value = { user, token, loading, login, register, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
