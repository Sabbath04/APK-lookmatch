import AsyncStorage from '@react-native-async-storage/async-storage';
import { HairColor, HairCut, HairStyle } from '../types/catalog.types';
import { environment } from '../environments/environment';

const API_BASE_URL = environment.imageGeneratorApiUrl;
const CATALOG_VERSION_KEY = '@catalog_version';
const COLORS_KEY = '@catalog_colors';
const CUTS_KEY = '@catalog_cuts';
const STYLES_KEY = '@catalog_styles';

class CatalogService {
  private initialized = false;

  /**
   * Inicializa el catálogo al arrancar la app
   * Solo verifica conectividad con el backend
   */
  async initialize(): Promise<void> {
    if (this.initialized) {
      console.log('📚 Catálogo ya inicializado');
      return;
    }

    console.log('🚀 Verificando conectividad con backend...');

    try {
      // Solo hacer un test de conectividad, no guardar nada
      const testResponse = await fetch(`${API_BASE_URL}/catalog/colors`, { method: 'HEAD' });
      
      if (testResponse.ok) {
        console.log('✅ Backend disponible');
      } else {
        console.warn('⚠️ Backend respondió con código:', testResponse.status);
      }

      this.initialized = true;
    } catch (error) {
      console.error('❌ Error conectando con backend:', error);
      console.warn('⚠️ Las pantallas cargarán datos directamente cuando sea necesario');
      this.initialized = true;
    }
  }



  /**
   * Obtiene la lista de colores del backend
   */
  async fetchColors(): Promise<HairColor[]> {
    console.log('🎨 Obteniendo colores del backend...');
    const response = await fetch(`${API_BASE_URL}/catalog/colors`);
    if (!response.ok) {
      throw new Error(`Error fetching colors: ${response.status}`);
    }
    const data = await response.json();
    console.log(`✅ ${data.length} colores obtenidos`);
    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      prompt: item.prompt,
      imageUrl: item.imageBase64, // El backend ya retorna en base64
      active: true,
      localImagePath: item.imageBase64 // Usar directamente el base64
    }));
  }

  /**
   * Obtiene la lista de cortes del backend
   */
  async fetchCuts(): Promise<HairCut[]> {
    console.log('✂️ Obteniendo cortes del backend...');
    const response = await fetch(`${API_BASE_URL}/catalog/cuts`);
    if (!response.ok) {
      throw new Error(`Error fetching cuts: ${response.status}`);
    }
    const data = await response.json();
    console.log(`✅ ${data.length} cortes obtenidos del backend`);
    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      prompt: item.prompt,
      imageUrl: item.imageBase64,
      active: true,
      localImagePath: item.imageBase64
    }));
  }

  /**
   * Obtiene la lista de peinados del backend
   */
  async fetchStyles(): Promise<HairStyle[]> {
    console.log('💇 Obteniendo peinados del backend...');
    const response = await fetch(`${API_BASE_URL}/catalog/styles`);
    if (!response.ok) {
      throw new Error(`Error fetching styles: ${response.status}`);
    }
    const data = await response.json();
    console.log(`✅ ${data.length} peinados obtenidos`);
    return data.map((item: any) => ({
      id: item.id,
      name: item.name,
      prompt: item.prompt,
      imageUrl: item.imageBase64,
      active: true,
      localImagePath: item.imageBase64
    }));
  }

  /**
   * Detecta si hay cambios en el catálogo comparando con el almacenamiento local
   */
  private async detectChanges(
    colors: HairColor[],
    cuts: HairCut[],
    styles: HairStyle[]
  ): Promise<boolean> {
    try {
      const storedColors = await AsyncStorage.getItem(COLORS_KEY);
      const storedCuts = await AsyncStorage.getItem(CUTS_KEY);
      const storedStyles = await AsyncStorage.getItem(STYLES_KEY);

      // Si no hay datos almacenados, hay cambios
      if (!storedColors || !storedCuts || !storedStyles) {
        return true;
      }

      // Comparar IDs para detectar cambios
      const currentColorIds = colors.map(c => c.id).sort().join(',');
      const storedColorIds = JSON.parse(storedColors).map((c: HairColor) => c.id).sort().join(',');

      const currentCutIds = cuts.map(c => c.id).sort().join(',');
      const storedCutIds = JSON.parse(storedCuts).map((c: HairCut) => c.id).sort().join(',');

      const currentStyleIds = styles.map(s => s.id).sort().join(',');
      const storedStyleIds = JSON.parse(storedStyles).map((s: HairStyle) => s.id).sort().join(',');

      return (
        currentColorIds !== storedColorIds ||
        currentCutIds !== storedCutIds ||
        currentStyleIds !== storedStyleIds
      );
    } catch (error) {
      console.error('❌ Error detectando cambios:', error);
      return true; // Si hay error, asumir que hay cambios
    }
  }



  /**
   * Guarda el catálogo en el almacenamiento local
   */
  private async saveCatalogToStorage(
    colors: HairColor[],
    cuts: HairCut[],
    styles: HairStyle[]
  ): Promise<void> {
    await Promise.all([
      AsyncStorage.setItem(COLORS_KEY, JSON.stringify(colors)),
      AsyncStorage.setItem(CUTS_KEY, JSON.stringify(cuts)),
      AsyncStorage.setItem(STYLES_KEY, JSON.stringify(styles)),
      AsyncStorage.setItem(CATALOG_VERSION_KEY, new Date().toISOString()),
    ]);
  }

  /**
   * Carga el catálogo del almacenamiento local
   */
  private async loadCatalogFromStorage(): Promise<void> {
    console.log('📦 Cargando catálogo desde almacenamiento local...');
    // Este método se usa como fallback si falla la sincronización
  }

  /**
   * Obtiene todos los colores almacenados localmente
   */
  async getColors(): Promise<HairColor[]> {
    const stored = await AsyncStorage.getItem(COLORS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * Obtiene todos los cortes almacenados localmente
   */
  async getCuts(): Promise<HairCut[]> {
    const stored = await AsyncStorage.getItem(CUTS_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * Obtiene todos los peinados almacenados localmente
   */
  async getStyles(): Promise<HairStyle[]> {
    const stored = await AsyncStorage.getItem(STYLES_KEY);
    return stored ? JSON.parse(stored) : [];
  }

  /**
   * Obtiene un color específico por ID
   */
  async getColorById(id: number): Promise<HairColor | null> {
    const colors = await this.getColors();
    return colors.find(c => c.id === id) || null;
  }

  /**
   * Obtiene un corte específico por ID
   */
  async getCutById(id: number): Promise<HairCut | null> {
    const cuts = await this.getCuts();
    return cuts.find(c => c.id === id) || null;
  }

  /**
   * Obtiene un peinado específico por ID
   */
  async getStyleById(id: number): Promise<HairStyle | null> {
    const styles = await this.getStyles();
    return styles.find(s => s.id === id) || null;
  }

  /**
   * Fuerza una re-sincronización del catálogo
   */
  async forceSync(): Promise<void> {
    this.initialized = false;
    await this.initialize();
  }

  /**
   * Limpia el caché de AsyncStorage
   */
  async clearCache(): Promise<void> {
    console.log('🧹 Limpiando caché del catálogo...');
    try {
      await Promise.all([
        AsyncStorage.removeItem(COLORS_KEY),
        AsyncStorage.removeItem(CUTS_KEY),
        AsyncStorage.removeItem(STYLES_KEY),
        AsyncStorage.removeItem(CATALOG_VERSION_KEY),
      ]);
      console.log('✅ Caché limpiado exitosamente');
    } catch (error) {
      console.error('❌ Error limpiando caché:', error);
    }
  }
}

export default new CatalogService();
