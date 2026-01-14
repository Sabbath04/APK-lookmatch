import React, { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, ImageBackground, ActivityIndicator, Linking } from "react-native";
// Revertimos las importaciones a la librería compatible con Expo Go
import { CameraView, useCameraPermissions, CameraType } from "expo-camera"; 
import { Ionicons } from "@expo/vector-icons";
import BackButton from "../Components/BackButton";
import { useAppNavigation } from "../Components/useAppNavigation";
import { useUserSelection } from "../contexts/UserSelectionContext";

// NOTA: Se eliminan todas las referencias a react-native-vision-camera, runOnJS y detectFaces.

export default function CameraScreen() {
  const { navigateTo } = useAppNavigation<"Camara">();
  const { setUserPhoto } = useUserSelection();

  // 1. Manejo de permisos con expo-camera
  const [permission, requestPermission] = useCameraPermissions();
  const [facing, setFacing] = useState<CameraType>("back");
  
  // 2. Referencia a la cámara (tipada para expo-camera)
  const cameraRef = useRef<CameraView | null>(null); 
  
  const [isTakingPhoto, setIsTakingPhoto] = useState(false);
  // La detección de rostros NO funciona en Expo Go con este setup, pero mantenemos el estado
  const [faceDetected, setFaceDetected] = useState(false); 

  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission]);

  // Manejo de permisos (simple)
  if (!permission) return <View style={{ flex: 1, backgroundColor: "black" }} />;

  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Text style={styles.permissionTitle}>Permiso Requerido</Text>
        <Text style={styles.permissionText}>Necesitamos acceso a tu cámara.</Text>

        <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
          <Text style={styles.permissionButtonText}>Otorgar permiso</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.permissionButton} onPress={() => Linking.openSettings()}>
          <Text style={styles.permissionButtonText}>Abrir Ajustes</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePhoto = async () => {
    try {
      if (!cameraRef.current) return;

      setIsTakingPhoto(true);
      
      // Captura de foto usando el método de expo-camera
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.9,
        base64: false,
      });

      setIsTakingPhoto(false);

      setUserPhoto(photo.uri);
      // Asumiendo que CameraPreview ya está tipado en el router
      navigateTo("CamaraPreview", { image: photo.uri }); 

    } catch (err) {
      console.log("Error al tomar foto:", err);
      setIsTakingPhoto(false);
    }
  };

  const switchCamera = () => {
    setFacing((prev) => (prev === "back" ? "front" : "back"));
  };

  return (
    <ImageBackground
      source={require("../../assets/screen-standar-bg.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <BackButton />

      <View style={styles.header}>
        <Text style={styles.title}>Toma una foto</Text>
        <Text style={styles.subtitle}>Asegúrate de tener buena iluminación</Text>
      </View>

      <View style={styles.cameraFrame}>
        {/* Componente CameraView de Expo */}
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing={facing}
          // Eliminamos props de Frame Processor/Detección de Rostros que dan error
        />
      </View>

      {/* Indicador de rostro (siempre mostrará "Sin rostro" aquí) */}
      <Text style={styles.faceIndicator}>
        {faceDetected ? "🟢 Rostro detectado" : "🔴 Sin rostro"}
      </Text>

      <View style={styles.bottomArea}>
        
        {/* switch camera */}
        <TouchableOpacity style={styles.switchButton} onPress={switchCamera}>
          <Ionicons name="camera-reverse-outline" size={32} color="#D4AF37" />
        </TouchableOpacity>

        {/* capture button */}
        <TouchableOpacity style={styles.captureButton} onPress={takePhoto} disabled={isTakingPhoto}>
          {isTakingPhoto ? (
            <ActivityIndicator size="large" color="#D4AF37" />
          ) : (
            <View style={styles.innerCircle} />
          )}
        </TouchableOpacity>

      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 },
  header: { marginTop: 80, alignItems: "center" },

  title: { fontSize: 28, fontWeight: "bold", color: "#f8e5b8" },
  subtitle: { fontSize: 15, color: "#f8e5b8", opacity: 0.8, marginTop: 5 },

  cameraFrame: {
    flex: 1,
    marginTop: 40,
    backgroundColor: "rgba(0,0,0,0.45)",
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "#D4AF37",
    overflow: "hidden",
    elevation: 6,
  },

  camera: { width: "100%", height: "100%" },
  loading: { flex: 1, backgroundColor: 'black' }, 

  faceIndicator: {
    textAlign: "center",
    color: "#f8e5b8",
    marginBottom: 10,
    fontSize: 16,
  },

  bottomArea: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 40,
    marginBottom: 30,
  },

  switchButton: {
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 12,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#D4AF37",
  },

  captureButton: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderWidth: 3, borderColor: "#D4AF37",
    justifyContent: "center", alignItems: "center",
  },

  innerCircle: {
    width: 50, height: 50, borderRadius: 25,
    backgroundColor: "#D4AF37",
  },

  // PERMISOS
  permissionContainer: {
    flex: 1, justifyContent: "center", alignItems: "center",
    backgroundColor: "black", padding: 30,
  },
  permissionTitle: { fontSize: 26, fontWeight: "bold", color: "#D4AF37" },
  permissionText: { fontSize: 16, color: "#f8e5b8", textAlign: "center", marginBottom: 20 },

  permissionButton: {
    backgroundColor: "#D4AF37", paddingVertical: 12, paddingHorizontal: 30, borderRadius: 12,
    marginVertical: 10, 
  },
  permissionButtonText: { color: "black", fontWeight: "bold", fontSize: 16 },
});