// screens/PhotoSourceSelector.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ActivityIndicator, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as ImagePicker from 'expo-image-picker';
import { useAppNavigation } from "../Components/useAppNavigation";
import { useUserSelection } from "../contexts/UserSelectionContext";
import BackButton from "../Components/BackButton";
import { Ionicons } from '@expo/vector-icons';

export default function PhotoSourceSelector() {
  const { navigateTo } = useAppNavigation<"PhotoSource">();
  const { setUserPhoto } = useUserSelection();
  const [loading, setLoading] = useState(false);

  // Solicitar permisos de galería y seleccionar imagen
  const pickImageFromGallery = async () => {
    try {
      setLoading(true);
      
      // Solicitar permisos
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert(
          "Permiso denegado",
          "Necesitas dar permiso para acceder a la galería"
        );
        setLoading(false);
        return;
      }

      // Abrir selector de imágenes
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const photoUri = result.assets[0].uri;
        console.log('📸 Imagen seleccionada de galería:', photoUri);
        
        // Guardar la foto del usuario en el contexto
        setUserPhoto(photoUri);
        
        // TODO: Aquí puedes llamar al backend para generar la imagen con el estilo seleccionado
        // Por ahora, navega a Magia para mostrar el preview
        navigateTo("Magia");
      }
      
      setLoading(false);
    } catch (error) {
      console.error('❌ Error seleccionando imagen:', error);
      Alert.alert("Error", "No se pudo seleccionar la imagen");
      setLoading(false);
    }
  };

  // Abrir cámara (navegar a CameraScreen)
  const openCamera = async () => {
    try {
      setLoading(true);
      
      // Solicitar permisos de cámara
      const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
      
      if (!permissionResult.granted) {
        Alert.alert(
          "Permiso denegado",
          "Necesitas dar permiso para usar la cámara"
        );
        setLoading(false);
        return;
      }

      // Navegar a la pantalla de cámara existente
      navigateTo("Camara");
      setLoading(false);
    } catch (error) {
      console.error('❌ Error abriendo cámara:', error);
      Alert.alert("Error", "No se pudo abrir la cámara");
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <ImageBackground
        source={require("../../assets/screen-standar-bg.png")}
        style={styles.container}
        resizeMode="cover"
      >
        <BackButton />

        <View style={styles.content}>
          <Text style={styles.title}>¿Cómo quieres tu foto?</Text>
          <Text style={styles.subtitle}>Elige una opción para continuar</Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#D4AF37" />
              <Text style={styles.loadingText}>Preparando...</Text>
            </View>
          ) : (
            <View style={styles.optionsContainer}>
              {/* Opción: Tomar foto */}
              <TouchableOpacity 
                style={styles.optionCard}
                onPress={openCamera}
                activeOpacity={0.8}
              >
                <View style={styles.iconContainer}>
                  <Ionicons name="camera" size={64} color="#D4AF37" />
                </View>
                <Text style={styles.optionTitle}>Tomar Foto</Text>
                <Text style={styles.optionDescription}>
                  Abre la cámara para tomar una foto nueva
                </Text>
              </TouchableOpacity>

              {/* Opción: Seleccionar de galería */}
              <TouchableOpacity 
                style={styles.optionCard}
                onPress={pickImageFromGallery}
                activeOpacity={0.8}
              >
                <View style={styles.iconContainer}>
                  <Ionicons name="images" size={64} color="#D4AF37" />
                </View>
                <Text style={styles.optionTitle}>Elegir de Galería</Text>
                <Text style={styles.optionDescription}>
                  Selecciona una foto existente de tu galería
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    width: "100%",
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#f8e5b8",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#f8e5b8",
    textAlign: "center",
    marginBottom: 40,
    opacity: 0.8,
  },
  optionsContainer: {
    width: "100%",
    gap: 20,
  },
  optionCard: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderWidth: 2,
    borderColor: "#D4AF37",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#D4AF37",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  iconContainer: {
    marginBottom: 15,
  },
  optionTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#D4AF37",
    marginBottom: 8,
    textAlign: "center",
  },
  optionDescription: {
    fontSize: 14,
    color: "#f8e5b8",
    textAlign: "center",
    opacity: 0.9,
  },
  loadingContainer: {
    alignItems: "center",
    justifyContent: "center",
    padding: 40,
  },
  loadingText: {
    fontSize: 16,
    color: "#f8e5b8",
    marginTop: 15,
  },
});
