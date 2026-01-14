import { useEffect, useState } from "react";
import CatalogService from "../../services/CatalogService";

export interface ImageItem {
  id: string;
  nombre: string;
  image: string;
}

export function useImageGrid(
  endpoint?: string, 
  mockData?: any[], 
  catalogType?: "colors" | "cuts" | "styles"
) {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const fetchImages = async (nextPage = 1) => {
    try {
      if (nextPage === 1) setLoading(true);
      else setIsFetchingMore(true);

      let newData: any[] = [];

      // 🎨 Si es un catálogo del backend (colors, cuts, styles)
      if (catalogType) {
        console.log(`📚 Cargando catálogo desde backend: ${catalogType}`);
        
        // Hacer petición directa al backend (no usar caché)
        if (catalogType === "colors") {
          newData = await CatalogService.fetchColors();
        } else if (catalogType === "cuts") {
          newData = await CatalogService.fetchCuts();
        } else if (catalogType === "styles") {
          newData = await CatalogService.fetchStyles();
        }

        const formatted = newData
          .filter(item => item.id != null) // Filtrar items sin ID
          .map((item) => ({
            id: item.id.toString(),
            nombre: item.name,
            image: item.localImagePath || item.imageUrl, // Preferir imagen local
          }));

        setImages(formatted);
        console.log(`✅ Cargados ${formatted.length} items de ${catalogType} (${newData.length} en total, ${newData.length - formatted.length} sin ID)`);
      }
      // 📦 Mock data o datos de prueba
      else if (mockData && mockData.length > 0) {
        newData = mockData;
        const formatted = newData.map((item, idx) => ({
          id: `${item.id}-${nextPage}-${idx}`,
          nombre: item.nombre || item.author || `Image ${item.id}`,
          image: item.image || item.download_url || item.url,
        }));
        setImages((prev) => (nextPage === 1 ? formatted : [...prev, ...formatted]));
        setPage(nextPage);
      }
      // 🌐 Endpoint externo (fallback)
      else if (endpoint) {
        const res = await fetch(`${endpoint}?page=${nextPage}&limit=10`);
        newData = await res.json();
        const formatted = newData.map((item, idx) => ({
          id: `${item.id}-${nextPage}-${idx}`,
          nombre: item.author || `Image ${item.id}`,
          image: item.download_url || item.url,
        }));
        setImages((prev) => (nextPage === 1 ? formatted : [...prev, ...formatted]));
        setPage(nextPage);
      }
    } catch (error) {
      console.error("❌ Error loading images:", error);
    } finally {
      setLoading(false);
      setIsFetchingMore(false);
    }
  };

  useEffect(() => {
    fetchImages(1);
  }, [endpoint, mockData, catalogType]);

  const loadMore = () => {
    // Solo cargar más si NO es del catálogo (el catálogo se carga completo)
    if (!isFetchingMore && !catalogType) {
      fetchImages(page + 1);
    }
  };

  return { images, loading, isFetchingMore, loadMore };
}
