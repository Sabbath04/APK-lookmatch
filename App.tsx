// App.tsx
import React, { useEffect, useState } from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';

import AppNavigator from './src/navigation/AppNavigator';
import { UserSelectionProvider } from './src/contexts/UserSelectionContext';
import { ToastProvider } from './src/contexts/ToastContext';
import CatalogService from './src/services/CatalogService';
import ImageGenerationService from './src/services/ImageGenerationService';

// --- 1. IMPORTAR NUESTRO AUTHPROVIDER ---
import { AuthProvider } from './src/context/AuthContext';

export default function App() {
  const [isInitializing, setIsInitializing] = useState(true);
  const [initError, setInitError] = useState<string | null>(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    console.log('🚀 Inicializando LookMatch...');
    
    try {
      // (Toda tu lógica de 'initializeApp' permanece igual)
      await CatalogService.clearCache();
      const isHealthy = await ImageGenerationService.checkHealth();
      if (!isHealthy) {
        console.warn('⚠️ Backend no disponible');
      }
      await CatalogService.initialize();
      
      console.log('✅ Aplicación inicializada correctamente');
      setIsInitializing(false);
    } catch (error) {
      console.error('❌ Error inicializando la aplicación:', error);
      setInitError(error instanceof Error ? error.message : 'Error desconocido');
      setIsInitializing(false);
    }
  };

  if (isInitializing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#FF69B4" />
        <Text style={styles.loadingText}>Iniciando LookMatch...</Text>
        <Text style={styles.loadingSubtext}>Conectando con backend</Text>
      </View>
    );
  }

  if (initError) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>❌ Error de inicialización</Text>
        <Text style={styles.errorMessage}>{initError}</Text>
        <Text style={styles.errorHint}>Verifica tu conexión a internet</Text>
      </View>
    );
  }

  // --- 2. ENVOLVER EL RETURN FINAL EN AUTHPROVIDER ---
  // AuthProvider ahora envuelve a todos los demás providers
  return (
    <AuthProvider> 
      <SafeAreaProvider>
        <ToastProvider>
          <UserSelectionProvider>
            <AppNavigator />
          </UserSelectionProvider>
        </ToastProvider>
      </SafeAreaProvider>
    </AuthProvider>
  );
}

// (Tus estilos permanecen iguales)
const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  loadingSubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF0000',
    marginBottom: 10,
  },
  errorMessage: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    marginBottom: 10,
  },
  errorHint: {
    fontSize: 14,
    color: '#999',
    textAlign: 'center',
  },
});