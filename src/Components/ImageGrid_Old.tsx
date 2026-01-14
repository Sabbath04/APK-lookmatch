import React, { useEffect, useState } from "react";
import {
  View,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Text,
  FlatList,
} from "react-native";
import { useUserSelection } from "../contexts/UserSelectionContext";

interface ImageItem {
  id: number;
  image: string;
  nombre: string;
}

interface ImageGridProps {
  endpoint?: string;
  mockData?: any[];
  type: "genero" | "tono" | "corte" | "color";
  title?: string;
}

export default function ImageGrid({ endpoint, mockData, type, title }: ImageGridProps) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1); // 👈 control de paginación
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const { genero, tono, corte, color, setGenero, setTono, setCorte, setColor } = useUserSelection();

  const selectedValue =
    type === "genero" ? genero :
    type === "tono" ? tono :
    type === "corte" ? corte : color;

  const setSelectedValue =
    type === "genero" ? setGenero :
    type === "tono" ? setTono :
    type === "corte" ? setCorte : setColor;

  // 🔹 Carga inicial
  useEffect(() => {
    if (mockData && mockData.length > 0) {
      setImages(mockData);
      setLoading(false);
    } else if (endpoint) {
      fetchImages();
    } else {
      setLoading(false);
    }
  }, [endpoint, mockData]);

  // 🔹 Función que descarga imágenes (por páginas)
  const fetchImages = async (nextPage = 1) => {
    try {
      if (nextPage === 1) setLoading(true);
      else setIsFetchingMore(true);

      const response = await fetch(`${endpoint}?page=${nextPage}&limit=15`);
      const data = await response.json();

      const formatted = data.map((item: any) => ({
        id: item.id,
        nombre: item.author || `Image ${item.id}`,
        image: item.download_url || item.url,
      }));


      // 🔸 Si es la primera página, reemplaza. Si no, agrega al final.
      setImages(prev => nextPage === 1 ? formatted : [...prev, ...formatted]);
      setPage(nextPage);
    } catch (error) {
      console.error("Error al cargar imágenes:", error);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  const handleSelect = (nombre: string) => {
    setSelectedValue(nombre);
  };

  // 🔹 Cargar más al llegar al final del scroll
  const loadMore = () => {
    if (!isFetchingMore) {
      fetchImages(page + 1);
    }
  };

  if (loading) {
  return (
    <View style={styles.loader}>
      <ActivityIndicator size="large" color="#D4AF37" />
      <Text style={styles.loaderText}>Cargando imágenes...</Text>
    </View>
  );
}

return (
  <View style={styles.container}>
    {title && <Text style={styles.title}>{title}</Text>}

    <FlatList
      data={images}
      numColumns={2}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => {
        const isSelected = selectedValue === item.nombre;
        return (
          <TouchableOpacity
            onPress={() => handleSelect(item.nombre)}
            style={[styles.card, isSelected && styles.cardSelected]}
            activeOpacity={0.85}
          >
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text
              style={[styles.label, isSelected && styles.labelSelected]}
              numberOfLines={1}
            >
              {item.nombre}
            </Text>
          </TouchableOpacity>
        );
      }}
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
    backgroundColor: "transparent", // importante también
  }}
    />
  </View>
)};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "transparent", // mismo tono que HairColorSelector
  },
  title: {
    fontSize: 22,
    fontWeight: "600",
    color: "#f8e5b8",
    textAlign: "center",
    marginBottom: 40,
    width: "80%",
  },
  card: {
    flex: 1,
    margin: 8,
    backgroundColor: "#fff",
    borderRadius: 10,
    overflow: "hidden",
    alignItems: "center",
    elevation: 4,
  },
  cardSelected: {
    borderWidth: 3,
    borderColor: "#D4AF37",
  },
  image: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  label: {
    padding: 10,
    fontSize: 16,
    color: "#3B1E0F",
    textAlign: "center",
  },
  labelSelected: {
    color: "#D4AF37",
    fontWeight: "bold",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#2B140A",
  },
  loaderText: {
    color: "#f8e5b8",
    marginTop: 12,
    fontSize: 16,
    letterSpacing: 0.5,
  },
});

