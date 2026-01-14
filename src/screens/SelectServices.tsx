import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ImageBackground } from "react-native";
import { useAppNavigation } from "../Components/useAppNavigation";
import BackButton from "../Components/BackButton";
import { SafeAreaView } from "react-native-safe-area-context";



export default function ServicesScreen() {
   const { navigateTo, route } = useAppNavigation<"SelectServices">();

  return (
    
    <ImageBackground
                source={require("../../assets/screen-standar-bg.png")}
                style={styles.container}
                resizeMode="cover"
              >
      <BackButton></BackButton>
      <TouchableOpacity
        style={styles.option}
        onPress={() => navigateTo("ColorCorte")}
      >
        <Image
          source={require("../../assets/android/color-y-corte-icon.png")}
          style={styles.icon}
        />
        <Text style={styles.text}>Color y corte</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.option}
        onPress={() => navigateTo("Peinado")}
      >
        <Image
          source={require("../../assets/android/peinado-icon.png")}
          style={styles.icon}
        />
        <Text style={styles.text}>Peinado</Text>
      </TouchableOpacity>
    </ImageBackground>
    
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  option: {
    backgroundColor: "rgba(0,0,0,0.4)",
    borderWidth: 1,
    borderColor: "#D4AF37",
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 30,
    width: "80%",
    marginVertical: 20,
  },
  icon: {
    width: 60,
    height: 60,
    marginBottom: 10,
  },
  text: {
    color: "#D4AF37",
    fontSize: 20,
    fontWeight: "600",
  },
});
