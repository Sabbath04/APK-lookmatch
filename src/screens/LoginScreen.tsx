import React, { useEffect, useState, useCallback } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ImageBackground, 
  Image, 
  TouchableOpacity,
  ActivityIndicator,
  Platform,
  Alert
} from 'react-native';
import * as AuthSession from 'expo-auth-session';
import { auth0Config } from '../config/auth0-config';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { API_CONFIG, API_ENDPOINTS } from '../constants/config'; 

const redirectUri = Platform.OS === 'web'
  ? (typeof window !== 'undefined' ? window.location.origin : 'http://localhost:8081')
  : AuthSession.makeRedirectUri({ scheme: 'lookmatch' });

const CODE_VERIFIER_KEY = 'codeVerifier';

export default function LoginScreen() {
  const [isExchangingCode, setIsExchangingCode] = useState(false);
  const { login } = useAuth(); 

  const baseConfig = {
    clientId: auth0Config.clientId,
    redirectUri,
    scopes: ['openid', 'profile', 'email', 'offline_access'],
    usePKCE: true,
  };
  
  const discovery = { authorizationEndpoint: `https://${auth0Config.domain}/authorize` };

  const [reqEmail, resEmail, promptEmail] = AuthSession.useAuthRequest(
    { ...baseConfig, extraParams: { connection: 'Username-Password-Authentication', audience: 'https://dev-r8oxnkeen7b70t3h.us.auth0.com/api/v2/' } },
    discovery
  );

  const [reqGoogle, resGoogle, promptGoogle] = AuthSession.useAuthRequest(
    { ...baseConfig, extraParams: { audience: 'https://dev-r8oxnkeen7b70t3h.us.auth0.com/api/v2/', connection: 'google-oauth2' } },
    discovery
  );

  const [reqFacebook, resFacebook, promptFacebook] = AuthSession.useAuthRequest(
    { ...baseConfig, extraParams: { audience: 'https://dev-r8oxnkeen7b70t3h.us.auth0.com/api/v2/', connection: 'facebook' } },
    discovery
  );

  const handleLoginPress = useCallback(async (type: 'email' | 'google' | 'facebook') => {
    let requestObj;
    let promptFunc;

    if (type === 'google') { requestObj = reqGoogle; promptFunc = promptGoogle; } 
    else if (type === 'facebook') { requestObj = reqFacebook; promptFunc = promptFacebook; } 
    else { requestObj = reqEmail; promptFunc = promptEmail; }

    if (!requestObj) return;

    if (Platform.OS === 'web' && requestObj.codeVerifier) {
      try { sessionStorage.setItem(CODE_VERIFIER_KEY, requestObj.codeVerifier); } catch (e) {}
    }

    await promptFunc();
  }, [reqGoogle, reqFacebook, reqEmail, promptGoogle, promptFacebook, promptEmail]);

  useEffect(() => {
    const response = resEmail || resGoogle || resFacebook;
    
    let activeRequest = null;
    if (resEmail?.type === 'success') activeRequest = reqEmail;
    else if (resGoogle?.type === 'success') activeRequest = reqGoogle;
    else if (resFacebook?.type === 'success') activeRequest = reqFacebook;

    if (response?.type === 'success') {
      setIsExchangingCode(true);
      const { code } = response.params;
      let codeVerifier: string | null = null;

      if (Platform.OS === 'web') {
        codeVerifier = sessionStorage.getItem(CODE_VERIFIER_KEY);
        sessionStorage.removeItem(CODE_VERIFIER_KEY);
      } else {
        codeVerifier = activeRequest?.codeVerifier || null;
      }

      if (!codeVerifier) {
        Alert.alert("Error", "No se encontró el verificador de seguridad.");
        setIsExchangingCode(false);
        return;
      }

      const exchangeTokenViaBackend = async () => {
        try {
          console.log("[LOGIN] Enviando código al Backend...");
          
          // --- CORRECCIÓN AQUÍ: Usar USERS_BASE_URL ---
          const loginUrl = `${API_CONFIG.USERS_BASE_URL}${API_ENDPOINTS.USERS.LOGIN}`;

          const backendResponse = await fetch(loginUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              code: code,
              codeVerifier: codeVerifier,
              redirectUri: redirectUri,
            }),
          });

          if (!backendResponse.ok) {
             const errorData = await backendResponse.text();
             throw new Error(errorData || "Error en backend login");
          }

          const data = await backendResponse.json();
          console.log("[LOGIN] Éxito. Usuario:", data.user.email);
          
          await login(data.accessToken, data.user, data.refreshToken); 

        } catch (error) {
          console.error("[LOGIN] Error:", error);
          Alert.alert("Error", "No se pudo iniciar sesión. Verifica tu conexión.");
          setIsExchangingCode(false);
        }
      };

      exchangeTokenViaBackend();

    } else if (response?.type === 'error' || response?.type === 'dismiss') {
       setIsExchangingCode(false);
    }
  }, [resEmail, resGoogle, resFacebook, reqEmail, reqGoogle, reqFacebook, login]);

  return (
    <ImageBackground
      source={require('../../assets/look-match-bg-login.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <LinearGradient
        colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0.9)']}
        style={styles.overlay}
      >
        <View style={styles.headerContainer}>
          <Image
            source={require('../../assets/look-match-logo.png')} 
            style={styles.logo}
          />
          <Text style={styles.title}>LOOK MATCH</Text>
        </View>

        <View style={styles.buttonContainer}>
          {isExchangingCode ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#D9B45A" />
              <Text style={styles.loadingText}>Autenticando...</Text>
            </View>
          ) : (
            <>
              <TouchableOpacity
                style={[styles.button, styles.buttonEmail]}
                onPress={() => handleLoginPress('email')}
                disabled={!reqEmail}
              >
                <Ionicons name="mail-outline" size={20} color="#D9B45A" style={styles.icon} />
                <Text style={styles.buttonText}>Continuar con Email</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.buttonGoogle]}
                onPress={() => handleLoginPress('google')}
                disabled={!reqGoogle}
              >
                <Ionicons name="logo-google" size={20} color="#3B1E0F" style={styles.icon} />
                <Text style={[styles.buttonText, { color: '#3B1E0F' }]}>Google</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.buttonFacebook]}
                onPress={() => handleLoginPress('facebook')}
                disabled={!reqFacebook}
              >
                <Ionicons name="logo-facebook" size={20} color="#fff" style={styles.icon} />
                <Text style={[styles.buttonText, { color: '#fff' }]}>Facebook</Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </LinearGradient>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: { flex: 1, justifyContent: 'space-around', alignItems: 'center', paddingVertical: 60 },
  headerContainer: { alignItems: 'center', marginTop: 40 },
  logo: { width: 120, height: 120, resizeMode: 'contain', marginBottom: 20 },
  title: { color: '#D9B45A', fontSize: 32, fontWeight: 'bold', letterSpacing: 2 },
  buttonContainer: { width: '85%', marginBottom: 40, minHeight: 150, justifyContent: 'center', gap: 15 },
  
  button: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    borderRadius: 30, 
    paddingVertical: 12, 
    paddingHorizontal: 25, 
    borderWidth: 1,
  },
  
  buttonEmail: { backgroundColor: '#2A1C0E', borderColor: '#D9B45A' },
  buttonGoogle: { backgroundColor: '#fff', borderColor: '#fff' },
  buttonFacebook: { backgroundColor: '#1877F2', borderColor: '#1877F2' },

  icon: { marginRight: 12 },
  buttonText: { color: '#D9B45A', fontSize: 16, fontWeight: '600' },
  
  loadingContainer: { alignItems: 'center', justifyContent: 'center' },
  loadingText: { color: '#D9B45A', marginTop: 15, fontSize: 16, fontWeight: '600' },
});