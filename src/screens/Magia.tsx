import React, { useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, ImageBackground, Share, ActivityIndicator, ScrollView } from "react-native";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import { Ionicons } from "@expo/vector-icons";
import BackButton from "../Components/BackButton";
import { useAppNavigation } from "../Components/useAppNavigation";
import { useUserSelection } from "../contexts/UserSelectionContext";
import { notify } from "../services/NotificationService";
import { MESSAGES } from "../constants/messages";
import { ErrorHandler, ServerError } from "../utils/errorHandler";
import { API_CONFIG, API_ENDPOINTS, DEFAULTS } from "../constants/config";

export default function MagicResultScreen() {
  const { navigateTo } = useAppNavigation<"VistaPrevia">();
  const { userPhoto, generatedPhoto, setGeneratedPhoto, genero, corte, color, peinado } = useUserSelection();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleConfirm = () => {
    navigateTo("PantallaCobro");
  };

  // Generar imagen con el backend
  const handleGenerateImage = async () => {
    // Validaciones con notificaciones
    if (!userPhoto) {
      notify.warning(MESSAGES.VALIDATION.NO_PHOTO);
      return;
    }

    if (!color) {
      notify.warning(MESSAGES.VALIDATION.NO_COLOR);
      return;
    }

    if (!corte && !peinado) {
      notify.warning(MESSAGES.VALIDATION.NO_SERVICE);
      return;
    }

    setIsGenerating(true);
    try {
      // Convertir la foto del usuario a base64
      let base64Photo: string;
      
      if (userPhoto.startsWith('data:')) {
        base64Photo = userPhoto.split(',')[1];
      } else if (userPhoto.startsWith('http') || userPhoto.startsWith('blob:')) {
        const response = await fetch(userPhoto);
        const blob = await response.blob();
        base64Photo = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            const result = reader.result as string;
            resolve(result.split(',')[1]);
          };
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      } else {
        // Para archivos locales (file://)
        // CORRECCIÓN AQUÍ: Usamos el string 'base64' directamente
        base64Photo = await FileSystem.readAsStringAsync(userPhoto, {
          encoding: 'base64', 
        });
      }

      const service = corte ? "CORTE" : "PEINADO";
      const styleId = corte || peinado; 

      const genderMap: { [key: string]: string } = {
        "male": "MASCULINO", "female": "FEMENINO", "MASCULINO": "MASCULINO", "FEMENINO": "FEMENINO"
      };
      const mappedGender = genderMap[genero || ""] || "MASCULINO";

      const requestBody = {
        userId: DEFAULTS.USER_ID,
        selections: {
          gender: mappedGender,
          service: service,
          colorId: parseInt(color || "0"),
          styleId: parseInt(styleId || "0"),
          background: DEFAULTS.BACKGROUND
        },
        imageBase64: base64Photo,
        mimeType: DEFAULTS.IMAGE_MIME_TYPE
      };

      console.log("🚀 Enviando petición al backend de IA...");

      const response = await fetch(`${API_CONFIG.GENERAL_BASE_URL}${API_ENDPOINTS.IMAGE_GENERATION.GENERATE_V2}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      if (!response.ok) {
        await ErrorHandler.handleHttpError(response);
      }

      const result = await response.json();
      console.log("✅ Respuesta del backend:", { id: result.id, status: result.status });

      if (result.status === "COMPLETED" && result.generatedImageBase64) {
        const generatedImageUri = `data:image/jpeg;base64,${result.generatedImageBase64}`;
        setGeneratedPhoto(generatedImageUri);
        notify.success(MESSAGES.SUCCESS.IMAGE_GENERATED);
      } else if (result.status === "FAILED") {
        throw new ServerError(
          result.errorMessage || "La generación falló",
          MESSAGES.ERROR.GENERATE_IMAGE
        );
      } else {
        notify.info(MESSAGES.INFO.PROCESSING);
      }
      
    } catch (error) {
      ErrorHandler.log(error, "handleGenerateImage");
      const errorInfo = ErrorHandler.handle(error);
      notify.error(errorInfo.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const imageUrl = generatedPhoto || "https://i.imgur.com/WQpKXMt.jpg";

  const handleDownload = async () => {
    try {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        notify.warning(MESSAGES.PERMISSIONS.STORAGE);
        return;
      }

      notify.info(MESSAGES.INFO.DOWNLOADING);
      const fileUri = `${FileSystem.documentDirectory ?? ""}magic_result.jpg`;
      const { uri } = await FileSystem.downloadAsync(imageUrl, fileUri);

      await MediaLibrary.saveToLibraryAsync(uri);
      notify.success(MESSAGES.SUCCESS.IMAGE_DOWNLOADED);
    } catch (error) {
      ErrorHandler.log(error, "handleDownload");
      const errorInfo = ErrorHandler.handle(error);
      notify.error(errorInfo.message || MESSAGES.ERROR.DOWNLOAD_IMAGE);
    }
  };

  const handleShare = async () => {
    try {
      await Share.share({
        message: "¡Mira esta imagen mágica!",
        url: imageUrl,
      });
      notify.success(MESSAGES.SUCCESS.IMAGE_SHARED);
    } catch (error) {
      ErrorHandler.log(error, "handleShare");
      const errorInfo = ErrorHandler.handle(error);
      notify.error(errorInfo.message || MESSAGES.ERROR.SHARE_IMAGE);
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/screen-standar-bg.png")}
      style={styles.container}
      resizeMode="cover"
    >
      <BackButton />

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.subtitle}>Original</Text>

        {userPhoto ? (
          <Image source={{ uri: userPhoto }} style={styles.originalImage} />
        ) : (
          <View style={styles.noPhotoContainer}>
            <Ionicons name="image-outline" size={64} color="#EBD2A6" />
            <Text style={styles.noPhotoText}>No hay foto del usuario</Text>
          </View>
        )}

        <TouchableOpacity 
          style={[styles.generateButton, isGenerating && styles.generateButtonDisabled]} 
          onPress={handleGenerateImage}
          disabled={isGenerating || !userPhoto}
        >
          {isGenerating ? (
            <>
              <ActivityIndicator size="small" color="#fff" style={{ marginRight: 10 }} />
              <Text style={styles.generateButtonText}>Generando...</Text>
            </>
          ) : (
            <>
              <Ionicons name="sparkles" size={24} color="#fff" style={{ marginRight: 10 }} />
              <Text style={styles.generateButtonText}>Generar Imagen Mágica</Text>
            </>
          )}
        </TouchableOpacity>

        <Text style={styles.title}>Magia</Text>
        
        <View style={styles.magicContainer}>
          {generatedPhoto ? (
            <Image source={{ uri: generatedPhoto }} style={styles.magicImage} />
          ) : (
            <View style={styles.placeholderContainer}>
              <Ionicons name="image-outline" size={80} color="#EBD2A6" />
              <Text style={styles.placeholderText}>
                {isGenerating ? "Generando imagen..." : "Presiona el botón para generar"}
              </Text>
            </View>
          )}
        </View>

        {generatedPhoto && (
          <View style={styles.bottomContainer}>
            <TouchableOpacity style={styles.iconButton} onPress={handleDownload}>
              <Ionicons name="download-outline" size={32} color="#EBD2A6" />
              <Text style={styles.iconText}>Descargar</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.iconButton} onPress={handleShare}>
              <Ionicons name="share-social-outline" size={32} color="#EBD2A6" />
              <Text style={styles.iconText}>Compartir</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#3B1E0F",
  },
  scrollContent: {
    alignItems: "center",
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    color: "#EBD2A6",
    fontWeight: "bold",
    marginBottom: 15,
    marginTop: 20,
  },
  subtitle: {
    fontSize: 26,
    color: "#EBD2A6",
    marginBottom: 15,
    fontWeight: "600",
  },
  originalImage: {
    width: 180,
    height: 180,
    borderRadius: 10,
    resizeMode: "cover",
  },
  magicContainer: {
    width: 320,
    height: 320,
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 2,
    borderColor: "#EBD2A6",
    marginBottom: 50,
  },
  magicImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "80%",
    marginBottom: 30,
  },
  iconButton: {
    alignItems: "center",
  },
  iconText: {
    color: "#EBD2A6",
    marginTop: 4,
    fontSize: 14,
  },
  placeholderContainer: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.3)",
  },
  placeholderText: {
    color: "#EBD2A6",
    marginTop: 15,
    fontSize: 16,
    textAlign: "center",
  },
  noPhotoContainer: {
    width: 180,
    height: 180,
    borderRadius: 10,
    backgroundColor: "rgba(0, 0, 0, 0.3)",
    borderWidth: 2,
    borderColor: "#EBD2A6",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  noPhotoText: {
    color: "#EBD2A6",
    marginTop: 10,
    fontSize: 14,
    textAlign: "center",
  },
  generateButton: {
    backgroundColor: "#D4AF37",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 25,
    marginVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  generateButtonDisabled: {
    backgroundColor: "#666",
    opacity: 0.6,
  },
  generateButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
});