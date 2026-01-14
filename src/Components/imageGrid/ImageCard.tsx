import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import { Image } from "expo-image";
import { ImageItem } from "./useImageGrid";

interface Props {
  item: ImageItem;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export default function ImageCard({ item, isSelected, onSelect }: Props) {
  return (
    <TouchableOpacity
      onPress={() => onSelect(item.id.toString())}
      style={[styles.card, isSelected && styles.cardSelected]}
      activeOpacity={0.85}
    >
            <Image
        source={{ uri: item.image }}
        style={styles.image}
        contentFit="cover"
        cachePolicy="memory-disk" // 🔥 cachea tanto en RAM como en disco
        transition={500} // animación de aparición suave (0.5s)
        />

      <Text style={[styles.label, isSelected && styles.labelSelected]} numberOfLines={1}>
        {item.nombre}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 160, // Ancho fijo para las cards
    margin: 8,
    backgroundColor: "#fff",
    borderRadius: 10,
    alignItems: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  cardSelected: {
    borderWidth: 3,
    borderColor: "#D4AF37",
  },
  image: {
    width: "100%",
    height: 220, // Mayor altura para aspecto vertical (antes: 150)
    resizeMode: "cover",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  label: {
    padding: 10,
    fontSize: 14,
    color: "#3B1E0F",
    textAlign: "center",
    width: "100%",
  },
  labelSelected: {
    color: "#D4AF37",
    fontWeight: "bold",
  },
});
