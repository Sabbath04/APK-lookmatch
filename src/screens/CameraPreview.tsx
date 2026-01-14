import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useAppNavigation } from "../Components/useAppNavigation";
import { useUserSelection } from "../contexts/UserSelectionContext";
import { Ionicons } from "@expo/vector-icons";

export default function CameraPreview() {
  const { navigateTo } = useAppNavigation<"CamaraPreview">();
  const { userPhoto } = useUserSelection();

  const handleUsePhoto = () => {
    // Ya está en contexto
    navigateTo("Magia");
  };

  return (
    <View style={styles.container}>
      <Image source={{ uri: userPhoto }} style={styles.photo} />

      <View style={styles.buttons}>
        {/* CORRECCIÓN: Cambiado "CamaraGo" por "Camara" */}
        <TouchableOpacity style={styles.retryButton} onPress={() => navigateTo("Camara")}>
          <Ionicons name="refresh-circle" size={50} color="#D4AF37" />
          <Text style={styles.buttonText}>Repetir</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.useButton} onPress={handleUsePhoto}>
          <Ionicons name="checkmark-circle" size={50} color="#D4AF37" />
          <Text style={styles.buttonText}>Usar foto</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "black", justifyContent: "center" },
  photo: { width: "100%", height: "80%", resizeMode: "cover" },
  buttons: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 20,
  },
  retryButton: { alignItems: "center" },
  useButton: { alignItems: "center" },
  buttonText: { color: "#D4AF37", fontSize: 18, marginTop: 5 },
});