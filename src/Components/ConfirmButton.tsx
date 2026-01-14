import React from "react";
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";

interface ConfirmButtonProps {
    text?: string;
    onPress: () => void;
}

export default function ConfirmButton({ text = "Confirmar", onPress}: ConfirmButtonProps){
    return(
        <View style={styles.fixedButtonContainer}>
            <TouchableOpacity style={styles.confirmButton} onPress={onPress}>
                <Text style={styles.confirmText}>{text}</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    fixedButtonContainer: {
      position: "absolute",
      bottom: 40,
      left: 0,
      right: 0,
      alignItems: "center",
      justifyContent: "center",
    },
    confirmButton: {
      backgroundColor: "#EBD2A6",
      paddingVertical: 12,
      paddingHorizontal: 50,
      borderRadius: 30,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 4.5,
      elevation: 6,
    },
    confirmText: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#3B1E0F",
      textTransform: "uppercase",
    },
  });