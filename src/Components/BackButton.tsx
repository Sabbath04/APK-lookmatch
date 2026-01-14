// components/BackButton.tsx
import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function BackButton() {
  const navigation = useNavigation();

  return (
    <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
      <Ionicons name="chevron-back" size={28} color="#fff" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  backButton: {
    position: "absolute",
    top: 10,
    left: 20,
    backgroundColor: "rgba(0,0,0,0.4)",
    borderRadius: 50,
    padding: 8,
    zIndex: 10,
  },
});
