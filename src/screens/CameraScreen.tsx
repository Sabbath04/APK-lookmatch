import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Modal,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system";
import { useAppNavigation } from "../Components/useAppNavigation";
import { useUserSelection } from "../contexts/UserSelectionContext";
import { resolve } from "path";

export default function CameraScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [facing, setFacing] = useState<"front" | "back">("front");
  const [showInstructions, setShowInstructions] = useState(true);
  const cameraRef = useRef<CameraView>(null);
  const { navigateTo } = useAppNavigation<'Camara'>();
  const { setUserPhoto } = useUserSelection();


  useEffect(() => {
    if (!permission) requestPermission();
  }, [permission]);

  if (!permission) {
    return <View style={styles.center}><Text>Solicitando permisos...</Text></View>;
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text>No hay permisos para usar la cámara.</Text>
        <TouchableOpacity style={styles.button} onPress={requestPermission}>
          <Text style={styles.buttonText}>Dar permiso</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      setPhotoUri(photo.uri);
    }
  };

  const toggleCameraFacing = () => {
    setFacing((prev) => (prev === "front" ? "back" : "front"));
  };

const sendPhotoToBackend = async () => {
  if (!photoUri) return;
  setLoading(true);

    
    
      {/*
      const base64 = await FileSystem.readAsStringAsync(photoUri, {
        encoding: "base64",
      });
        //navigateTo('Magia');
      const response = await fetch("https://tu-backend.com/upload", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: base64 }),
      });
      */}
      
       try {
    // Guardar la foto del usuario en el contexto
    setUserPhoto(photoUri);
    
    // Simulación de envío al backend (mock)
    const response: { json: () => { message: string } } = await new Promise((resolve) =>
      setTimeout(() => resolve({ json: () => ({ message: "OK - mock" }) }), 1000)
    );

    const data = await response.json();
    console.log("Respuesta del backend:", data);
    console.log("📸 Foto guardada:", photoUri);
    
    // TODO: Aquí llamar al backend para generar la imagen
    // const generatedImageUri = await ImageGenerationService.generateImage(...)
    // setGeneratedPhoto(generatedImageUri);
    
    navigateTo('Magia');
  } catch (error) {
    console.error(error);
    alert("Error al enviar la imagen ❌");
  } finally {
    setLoading(false);
  }
};
  

  // 🧾 Pantalla previa a enviar la foto
  if (photoUri) {
    return (
      <View style={styles.container}>
        <Image source={{ uri: photoUri }} style={styles.preview} />
        {loading ? (
          <ActivityIndicator size="large" color="#000" />
        ) : (
          <>
            <TouchableOpacity style={styles.button} onPress={sendPhotoToBackend}>
              <Text style={styles.buttonText}>Enviar al backend</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.secondary]}
              onPress={() => setPhotoUri(null)}
            >
              <Text style={styles.buttonText}>Tomar otra</Text>
            </TouchableOpacity>
          </>
        )}
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Modal de instrucciones */}
      <Modal visible={showInstructions} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>📸 Instrucciones</Text>
            <Text style={styles.modalText}>
              - Alinea tu rostro al centro de la pantalla.{"\n"}
              - Asegúrate de tener buena iluminación.{"\n"}
              - No uses lentes oscuros o gorras.
            </Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowInstructions(false)}
            >
              <Text style={styles.modalButtonText}>Entendido</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Cámara */}
      <CameraView ref={cameraRef} style={styles.camera} facing={facing} />

      {/* Controles */}
      <View style={styles.controls}>
        <TouchableOpacity style={styles.switchButton} onPress={toggleCameraFacing}>
          <Text style={styles.switchText}>
            {facing === "front" ? "↩️ Trasera" : "🤳 Frontal"}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.captureButton} onPress={takePhoto} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  controls: {
    position: "absolute",
    bottom: 40,
    alignSelf: "center",
    alignItems: "center",
  },
  captureButton: {
    width: 80,
    height: 80,
    backgroundColor: "#fff",
    borderRadius: 40,
    borderWidth: 5,
    borderColor: "#aaa",
    marginTop: 20,
  },
  switchButton: {
    backgroundColor: "#222",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  switchText: {
    color: "#fff",
    fontSize: 16,
  },
  preview: {
    flex: 1,
    resizeMode: "cover",
  },
  button: {
    alignItems: "center",
     backgroundColor: "#EBD2A6",
      paddingVertical: 10,
      marginHorizontal: 20,
      paddingHorizontal: 50,
      marginBottom: 15,
      borderRadius: 30,
      shadowColor: "#000",
      shadowOpacity: 0.3,
      shadowRadius: 4.5,
  },
  buttonText: {
    fontSize: 18,
      fontWeight: "bold",
      color: "#3B1E0F",
      textTransform: "uppercase",
  },
  secondary: {
    backgroundColor: "#555",
  },
  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 25,
    width: "80%",
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
    marginBottom: 20,
  },
  modalButton: {
    backgroundColor: "#000",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  modalButtonText: {
    color: "#fff",
    fontSize: 16,
  },
});
