import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { axios } from '../service/api/axios';
import { useRouter } from 'expo-router';
import { api } from '@/service/api';
import { User } from '@/service/models/user';


type SignInCredentials = {
  email: string;
  password: string;
};

type AuthContextData = {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  signIn: (data: SignInCredentials) => Promise<void>;
  logOut: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
};

export const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  const checkAuth = async () => {
    try {
      const access_token = await AsyncStorage.getItem('access_token');
      const refresh_token = await AsyncStorage.getItem('refresh_token');
      const storedUser = await AsyncStorage.getItem('user');

      if (!access_token || !refresh_token) {
        return false;
      }

      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }

      setIsAuthenticated(true);
      return true;
    } catch (err) {
      return false;
    }
  };

  useEffect(() => {
    let unregister: (() => void) | null = null;

    const loadStoredAuth = async () => {
      try {
        const isAuth = await checkAuth();
        setIsAuthenticated(isAuth);
        
        unregister = axios.registerInterceptTokenManager({ logOut: () => { void logOut(); } });
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setLoading(false);
      }
    };

    loadStoredAuth();

    return () => {
      if (unregister) unregister();
    };
  }, []);

  const signIn = async ({ email, password }: SignInCredentials) => {
    setLoading(true);
    try {
      const resp = await api.auth.signIn({ email, password });

      const { access_token, refresh_token } = resp;

      if (access_token) {
        await AsyncStorage.setItem('access_token', access_token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      }

      if (refresh_token) await AsyncStorage.setItem('refresh_token', refresh_token);
      
      const userData = await api.user.getUser();
      if (userData) {
        await AsyncStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
      }

      router.replace('/home');
    } catch (err) {
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logOut = async () => {
    setLoading(true);
    try {
      await AsyncStorage.removeItem('access_token');
      await AsyncStorage.removeItem('refresh_token');
      await AsyncStorage.removeItem('user');
      setUser(null);
      delete axios.defaults.headers.common['Authorization'];
      router.replace('/login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated, signIn, logOut, checkAuth }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
