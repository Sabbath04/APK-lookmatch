// Tipos para el catálogo de colores, cortes y peinados

export interface HairColor {
  id: number; // 101-135
  name: string;
  prompt: string;
  imageUrl: string;
  active: boolean;
  localImagePath?: string; // Ruta local de la imagen descargada
}

export interface HairCut {
  id: number; // 501-529
  name: string;
  prompt: string;
  imageUrl: string;
  active: boolean;
  localImagePath?: string;
}

export interface HairStyle {
  id: number; // 701-718
  name: string;
  prompt: string;
  imageUrl: string;
  active: boolean;
  localImagePath?: string;
}

export type CatalogItem = HairColor | HairCut | HairStyle;

export interface CatalogResponse {
  colors: HairColor[];
  cuts: HairCut[];
  styles: HairStyle[];
}
