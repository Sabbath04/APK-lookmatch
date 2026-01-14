// src/components/LoadingScreen.tsx
import React from "react";
import { View, ActivityIndicator, Text, StyleSheet } from "react-native";

export default function LoadingScreen() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#D4AF37" />
      <Text style={styles.text}>Verificando catálogo...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  text: {
    marginTop: 10,
    fontSize: 16,
    color: "#333",
  },
});
