// screens/ColorAndCutScreen.tsx
import React, { useState } from "react";
import { StyleSheet, ImageBackground, Text, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ConfirmButton from "../Components/ConfirmButton";
import ImageGrid from "../Components/imageGrid/ImageGrid";
import { useAppNavigation } from "../Components/useAppNavigation";
import { useUserSelection } from "../contexts/UserSelectionContext";

type Step = 'CORTE' | 'COLOR';

export default function ColorAndCutScreen() {
  const { navigateTo } = useAppNavigation<"ColorCorte">();
  const { corte, setCorte, color, setColor } = useUserSelection();
  
  const [currentStep, setCurrentStep] = useState<Step>('CORTE');

  const handleConfirm = () => {
    if (currentStep === 'CORTE') {
      // Validar que se haya seleccionado un corte
      if (!corte) {
        alert("Primero debes seleccionar un corte");
        return;
      }
      // Pasar al siguiente paso: seleccionar color
      setCurrentStep('COLOR');
    } else {
      // Validar que se haya seleccionado un color
      if (!color) {
        alert("Primero debes seleccionar un color");
        return;
      }
      // Ambos seleccionados, continuar a selección de foto
      navigateTo("PhotoSource");
    }
  };

  const handleBack = () => {
    if (currentStep === 'COLOR') {
      // Si está en color, volver a corte
      setCurrentStep('CORTE');
    } else {
      // Si está en corte, navegar atrás
      navigateTo("SelectServices");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <ImageBackground
        source={require("../../assets/screen-standar-bg.png")}
        style={styles.container}
        resizeMode="cover"
      >
        {/* Botón de retroceso personalizado para manejar los pasos */}
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>

        {/* Mostrar grid según el paso actual */}
        {currentStep === 'CORTE' ? (
          <ImageGrid
            type="corte"
            title="Elige tu corte"
            catalogType="cuts"
          />
        ) : (
          <ImageGrid
            type="color"
            title="Elige el color"
            catalogType="colors"
          />
        )}

        <ConfirmButton 
          text={currentStep === 'CORTE' ? "Siguiente: Color" : "Confirmar"} 
          onPress={handleConfirm} 
        />
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  backButtonText: {
    fontSize: 24,
    color: '#000',
  },
});
