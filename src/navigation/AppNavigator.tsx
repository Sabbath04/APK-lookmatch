import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Importaciones de Auth
import { useAuth } from '../context/AuthContext';
import LoginScreen from '../screens/LoginScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BuyCreditsScreen from '../screens/BuyCreditsScreen';

// Importaciones de App
import SelectSexScreen from '../screens/SelectSexScreen';
import SkinToneSelector from '../screens/SkinToneSelector';
import ServicesScreen from '../screens/SelectServices';
import ColorAndCutScreen from '../screens/ColorAndCutScreen';
import HairColorSelector from '../screens/HairColorSelectionScreen';
import HairCutSelector from '../screens/HairCutSelector';
import HairStyleSelector from '../screens/HairStyleSelectorScreen';
import VistaPreviaScreen from '../screens/VistaPreviaScreen';
import PaymentScreen from '../screens/PaymentScreen';
import PhotoSourceSelector from '../screens/PhotoSourceSelector';
import CameraScreen from '../screens/CameraScreen'; 
import CameraPreview from '../screens/CameraPreview'; 
import Magia from '../screens/Magia';
import test from '../screens/test';

// --- CORRECCIÓN AQUÍ: Agregamos 'BuyCredits' a los tipos ---
export type RootStackParamList = {
  Login: undefined;
  Profile: undefined;
  BuyCredits: undefined; // <-- ¡ESTA LÍNEA FALTABA!
  SelectSex: undefined;
  SelectTone: { genero: string };
  SelectServices: { avatarId: number; gender?: string };
  ColorCorte: undefined;
  Corte: undefined;
  Peinado: undefined;
  VistaPrevia: undefined;
  PantallaCobro: undefined;
  PhotoSource: undefined;
  Camara: undefined;
  CamaraPreview: { image: string };
  Magia: undefined;
  test: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const UserStack = () => (
  <>
    <Stack.Screen name="Profile" component={ProfileScreen} options={{ headerShown: false }} />
    <Stack.Screen name="BuyCredits" component={BuyCreditsScreen} options={{ headerShown: false }} />
    
    <Stack.Screen name="SelectSex" component={SelectSexScreen} options={{ headerShown: false }} />
    <Stack.Screen name="SelectTone" component={SkinToneSelector} options={{ headerShown: false }} />
    <Stack.Screen name="SelectServices" component={ServicesScreen} options={{ headerShown: false }} />
    <Stack.Screen name="ColorCorte" component={ColorAndCutScreen} options={{ headerShown: false }} />
    <Stack.Screen name="Corte" component={HairCutSelector} options={{ headerShown: false }} />
    <Stack.Screen name="Peinado" component={HairStyleSelector} options={{ headerShown: false }} />
    <Stack.Screen name="VistaPrevia" component={VistaPreviaScreen} options={{ headerShown: false }} />
    <Stack.Screen name="PantallaCobro" component={PaymentScreen} options={{ headerShown: false }} />
    
    <Stack.Screen name="PhotoSource" component={PhotoSourceSelector} />
    <Stack.Screen name="Camara" component={CameraScreen} /> 
    <Stack.Screen name="CamaraPreview" component={CameraPreview} />
    
    <Stack.Screen name="Magia" component={Magia}/>
    <Stack.Screen name="test" component={test}/>
  </>
);

export default function AppNavigator() {
  const { accessToken } = useAuth();

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {accessToken == null ? (
            <Stack.Screen name="Login" component={LoginScreen} />
          ) : (
            UserStack()
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}