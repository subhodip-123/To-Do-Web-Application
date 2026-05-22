import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/auth.service';
import { getSocket } from '../services/socket';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('user'));
    } catch {
      return null;
    }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user?._id) {
      const socket = getSocket();
      socket.connect();
      socket.emit('join', user._id);
      return () => socket.disconnect();
    }
  }, [user?._id]);

  const persist = (data) => {
    localStorage.setItem('token', data.token);
    localStorage.setItem(
      'user',
      JSON.stringify({
        _id: data._id,
        name: data.name,
        email: data.email,
        avatar: data.avatar,
      })
    );
    setUser({
      _id: data._id,
      name: data.name,
      email: data.email,
      avatar: data.avatar,
    });
  };

  const login = async (creds) => {
    setLoading(true);
    try {
      const data = await authService.login(creds);
      persist(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const register = async (info) => {
    setLoading(true);
    try {
      const data = await authService.register(info);
      persist(data);
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const updateUser = (data) => {
    if (data.token) localStorage.setItem('token', data.token);
    const next = {
      _id: data._id,
      name: data.name,
      email: data.email,
      avatar: data.avatar,
    };
    localStorage.setItem('user', JSON.stringify(next));
    setUser(next);
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
