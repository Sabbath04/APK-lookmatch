// screens/MagicResultScreen.tsx
import React from "react";
import { View, Text, Image, StyleSheet, ImageBackground } from "react-native";
import BackButton from "../Components/BackButton";
import { useAppNavigation } from "../Components/useAppNavigation";
import ConfirmButton from "../Components/ConfirmButton";
import { useUserSelection } from "../contexts/UserSelectionContext";

export default function MagicResultScreen() {
  const { navigateTo } = useAppNavigation<"VistaPrevia">();
  const { genero, tono, corte, color, peinado, reset } = useUserSelection();

  const handleConfirm = () => {
    navigateTo("Camara");
  };

  return (
    <ImageBackground
      source={require("../../assets/screen-standar-bg.png")}
      style={styles.container}
      resizeMode="cover"
    >
      {/* Botón de regreso */}
      <BackButton />

      {/* Contenido centrado */}
      <View style={styles.centerContent}>
        <Text>Género: {genero}</Text>
      <Text>Tono: {tono}</Text>
      <Text>Corte: {corte}</Text>
      <Text>Color: {color}</Text>
        <Text style={styles.subtitle}>Vista Previa</Text>

        <View style={styles.magicContainer}>
          <Image
            source={{ uri: "https://i.imgur.com/WQpKXMt.jpg" }}
            style={styles.magicImage}
          />
        </View>
      </View>

      {/* Botón inferior fijo */}
      <View style={styles.bottomBar}>
        <ConfirmButton text="Confirm" onPress={handleConfirm} />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3B1E0F",
  },
  centerContent: {
    flex: 1,
    justifyContent: "center", // centra verticalmente
    alignItems: "center", // centra horizontalmente
    paddingHorizontal: 20,
  },
  subtitle: {
    fontSize: 26,
    color: "#EBD2A6",
    fontWeight: "600",
    marginBottom: 20,
  },
  magicContainer: {
    width: "80%", // proporcional al ancho
    aspectRatio: 1, // mantiene cuadrado
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#EBD2A6",
  },
  magicImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  bottomBar: {
    width: "100%",
    paddingVertical: 20,
    alignItems: "center",
    backgroundColor: "rgba(59, 30, 15, 0.6)", // leve fondo semitransparente
    position: "absolute",
    bottom: 0,
  },
});
