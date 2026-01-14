import React, { useEffect, useState } from "react";
import { View, FlatList, ActivityIndicator, Text, Modal, StyleSheet } from "react-native";
import { useUserSelection } from "../../contexts/UserSelectionContext";
import { useImageGrid } from "./useImageGrid";
import ImageCard from "./ImageCard";
import styles from "./styles";

interface Props {
  endpoint?: string;
  mockData?: any[];
  type: "genero" | "tono" | "corte" | "color" | "peinado";
  title?: string;
  catalogType?: "colors" | "cuts" | "styles"; // Tipo de catálogo del backend
}

export default function ImageGrid({ endpoint, mockData, type, title, catalogType }: Props) {
  const { genero, tono, corte, color, peinado, setGenero, setTono, setCorte, setColor, setPeinado } =
    useUserSelection();

  const { images, loading, isFetchingMore, loadMore } = useImageGrid(endpoint, mockData, catalogType);

  //  Mapeo de valores del contexto
  const selectedValue =
    type === "genero" ? genero :
    type === "tono" ? tono :
    type === "peinado" ? peinado :
    type === "corte" ? corte : color;

  const setSelectedValue =
    type === "genero" ? setGenero :
    type === "tono" ? setTono :
    type === "peinado" ? setPeinado :
    type === "corte" ? setCorte : setColor;

  // 🪄 Cuando el usuario selecciona una imagen
  const handleSelect = (id: string) => {
    setSelectedValue(id); // guarda el ID en contexto
  };

  return (
    <>
      {/* Modal de carga - Solo se muestra mientras loading=true */}
      <Modal
        visible={loading}
        transparent={true}
        animationType="fade"
      >
        <View style={loadingStyles.modalOverlay}>
          <View style={loadingStyles.modalContent}>
            <ActivityIndicator size="large" color="#FF69B4" />
            <Text style={loadingStyles.loadingTitle}>Cargando catálogo...</Text>
            <Text style={loadingStyles.loadingSubtitle}>
              {catalogType === 'colors' && 'Obteniendo colores de cabello'}
              {catalogType === 'cuts' && 'Obteniendo cortes de cabello'}
              {catalogType === 'styles' && 'Obteniendo peinados'}
              {!catalogType && 'Cargando imágenes...'}
            </Text>
          </View>
        </View>
      </Modal>

      {/* Contenido principal - Siempre visible, con fondo transparente */}
      <View style={styles.container}>
        {title && <Text style={styles.title}>{title}</Text>}

        <FlatList
          data={images}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <ImageCard
              item={item}
              isSelected={selectedValue === item.id.toString()}
              onSelect={handleSelect}
            />
          )}
          showsVerticalScrollIndicator={false}
          onEndReached={loadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            isFetchingMore ? (
              <ActivityIndicator color="#D4AF37" style={{ marginVertical: 20 }} />
            ) : null
          }
          style={{ backgroundColor: "transparent" }}
          contentContainerStyle={{
            paddingBottom: 20,
            backgroundColor: "transparent",
            alignItems: "center", // Centrar horizontalmente
            paddingHorizontal: 10,
          }}
          columnWrapperStyle={{
            justifyContent: "center", // Centrar las 2 columnas
            gap: 12, // Espacio entre cards
          }}
        />
      </View>
    </>
  );
}

// Estilos para el modal de carga
const loadingStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
    padding: 40,
    alignItems: 'center',
    shadowColor: '#FF69B4',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 105, 180, 0.3)',
  },
  loadingTitle: {
    marginTop: 20,
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  loadingSubtitle: {
    marginTop: 10,
    fontSize: 14,
    color: '#FF69B4',
    textAlign: 'center',
  },
});
