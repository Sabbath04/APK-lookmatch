// Tipos para la generación de imágenes

export type Gender = 'MALE' | 'FEMALE';
export type ServiceType = 'CORTE' | 'PEINADO';
export type GenerationStatus = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';

export interface ImageGenerationSelections {
  gender: Gender;
  service: ServiceType;
  colorId: number | null; // null para CORTE, obligatorio para PEINADO (101-135)
  styleId: number; // 501-529 para CORTE, 701-718 para PEINADO
  background: string | null; // Opcional: background personalizado
}

export interface ImageGenerationRequest {
  userId: string;
  imageBase64: string; // Imagen del usuario en base64 (con o sin data URI)
  mimeType: string; // "image/jpeg", "image/png", etc.
  selections: ImageGenerationSelections;
}

export interface ImageGenerationResponse {
  id: string | null;
  status: GenerationStatus;
  generatedImageBase64: string | null; // Imagen generada en base64 con data URI
  errorMessage: string | null;
}

// Para el contexto de usuario
export interface UserSelections {
  gender: Gender | null;
  skinTone: string | null;
  avatarId: number | null;
  service: ServiceType | null;
  colorId: number | null;
  styleId: number | null;
  userImageBase64: string | null;
  userImageMimeType: string | null;
}
