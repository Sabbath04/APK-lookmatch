import React, { createContext, useState, useContext, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import { ActivityIndicator, View, StyleSheet } from 'react-native';
import { auth0Config } from '../config/auth0-config';
import { API_CONFIG } from '../constants/config'; 

const TOKEN_KEY = 'accessToken';
const USER_INFO_KEY = 'userInfo';
const REFRESH_TOKEN_KEY = 'refreshToken';

interface User {
  name?: string;
  email?: string;
  picture?: string;
  [key: string]: any; 
}

interface AuthContextData {
  accessToken: string | null;
  userInfo: User | null;
  isLoading: boolean;
  login: (accessToken: string, userInfo: User, refreshToken: string | null) => Promise<void>;
  logout: () => Promise<void>;
  authFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextData>(null!);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadSession() {
      try {
        const storedToken = await SecureStore.getItemAsync(TOKEN_KEY);
        const storedUserInfo = await SecureStore.getItemAsync(USER_INFO_KEY); 
        
        if (storedToken) {
          setAccessToken(storedToken);
          if (storedUserInfo) {
            setUserInfo(JSON.parse(storedUserInfo)); 
          }
        }
      } catch (e) {
        console.log("Error al cargar la sesión:", e);
      } finally {
        setIsLoading(false);
      }
    }
    loadSession();
  }, []);

  const authFetch = async (url: string, options: RequestInit = {}) => {
    let tokenToUse = accessToken;
    if (!tokenToUse) {
        tokenToUse = await SecureStore.getItemAsync(TOKEN_KEY);
    }

    let optionsWithAuth = {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${tokenToUse}`,
      },
    };
    
    let response = await fetch(url, optionsWithAuth);

    if (response.status === 401) {
      console.log("Token expirado. Refrescando...");
      const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      
      if (!refreshToken) {
        logout();
        throw new Error("Sesión expirada.");
      }
      
      const refreshResponse = await fetch(`https://${auth0Config.domain}/oauth/token`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
            grant_type: 'refresh_token',
            client_id: auth0Config.clientId,
            refresh_token: refreshToken,
        }).toString(),
      });
      
      const tokenData = await refreshResponse.json();
      
      if (tokenData.error) {
        logout();
        throw new Error("Sesión expirada.");
      }
      
      const newAccessToken = tokenData.access_token;
      await SecureStore.setItemAsync(TOKEN_KEY, newAccessToken);
      if (tokenData.refresh_token) {
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, tokenData.refresh_token);
      }
      
      setAccessToken(newAccessToken);
      optionsWithAuth.headers['Authorization'] = `Bearer ${newAccessToken}`;
      response = await fetch(url, optionsWithAuth);
    }
    
    return response;
  };

  const login = async (newToken: string, newUserInfo: User, newRefreshToken: string | null) => {
    try {
      // Guardar sesión localmente
      await SecureStore.setItemAsync(TOKEN_KEY, newToken);
      await SecureStore.setItemAsync(USER_INFO_KEY, JSON.stringify(newUserInfo));
      if (newRefreshToken) {
        await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, newRefreshToken);
      }
      
      setAccessToken(newToken);
      setUserInfo(newUserInfo);
      
      // NOTA: Ya no llamamos a /sync-user aquí porque el backend ya lo hizo durante el login
      console.log("✅ Sesión iniciada correctamente.");

    } catch (e) {
      console.log("Error al guardar la sesión:", e);
    }
  };

  const logout = async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(USER_INFO_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      
      setAccessToken(null);
      setUserInfo(null);
    } catch (e) {
      console.log("Error al cerrar la sesión:", e);
    }
  };
  
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#D9B45A" />
      </View>
    );
  }

  return (
    <AuthContext.Provider value={{ accessToken, userInfo, isLoading, login, logout, authFetch }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000',
  },
});