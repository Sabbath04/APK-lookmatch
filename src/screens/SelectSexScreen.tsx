import React from "react";
import { View, Text, ImageBackground, StyleSheet, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAppNavigation } from "../Components/useAppNavigation";
import { useUserSelection } from "../contexts/UserSelectionContext";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";


export default function SelectSexScreen() {
   const { navigateTo } = useAppNavigation<'SelectSex'>();
    const { setGenero } = useUserSelection();

  const handleSelect = (g: string) => {
    setGenero(g);
    navigateTo("SelectTone", { genero: g });
  };

 

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <ImageBackground
        source={require("../../assets/look-match-bg.png")}
        style={styles.container}
        resizeMode="cover"
      >
        <LinearGradient
          colors={["rgba(0,0,0,0.6)", "rgba(0,0,0,0.8)"]}
          style={styles.overlay}
        >
          <View style={styles.textContainer}>
            <Text style={styles.title}>LOOK</Text>
            <Text style={styles.title}>MATCH</Text>
            <Text style={styles.subtitle}>AI HAIR TRY-ON</Text>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.button} onPress={() => handleSelect("female")}>
              <Text style={styles.buttonText}>♀ FEMALE</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => handleSelect("male")}>
              <Text style={styles.buttonText}>♂ MALE</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  overlay: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 60,
  },
  textContainer: {
    alignItems: "center",
    marginTop: 120,
  },
  title: {
    color: "#D9B45A",
    fontSize: 40,
    fontWeight: "bold",
    letterSpacing: 2,
  },
  subtitle: {
    color: "#D9B45A",
    fontSize: 16,
    marginTop: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 20,
  },
  button: {
    backgroundColor: "#2A1C0E",
    borderWidth: 1,
    borderColor: "#D9B45A",
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 25,
  },
  buttonText: {
    color: "#D9B45A",
    fontSize: 16,
    fontWeight: "600",
  },
});
