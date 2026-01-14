import { 
  ImageGenerationRequest, 
  ImageGenerationResponse, 
  ImageGenerationSelections,
  Gender,
  ServiceType 
} from '../types/image-generation.types';
import { environment } from '../environments/environment';

const API_BASE_URL = environment.imageGeneratorApiUrl;

class ImageGenerationService {
  /**
   * Genera una imagen con IA aplicando el estilo seleccionado
   * 
   * @param userId - ID del usuario para analytics
   * @param imageBase64 - Imagen del usuario en base64
   * @param mimeType - Tipo de imagen (image/jpeg, image/png, etc.)
   * @param selections - Selecciones del usuario (género, servicio, IDs)
   * @returns Promise con la respuesta del backend
   */
  async generateImage(
    userId: string,
    imageBase64: string,
    mimeType: string,
    selections: ImageGenerationSelections
  ): Promise<ImageGenerationResponse> {
    console.log('🎨 Generando imagen con IA...');
    console.log('📋 Selecciones:', JSON.stringify(selections, null, 2));

    try {
      // Validar reglas de negocio antes de enviar
      this.validateSelections(selections);

      // Asegurar que imageBase64 tenga el formato correcto
      const formattedImage = this.formatBase64Image(imageBase64, mimeType);

      const request: ImageGenerationRequest = {
        userId,
        imageBase64: formattedImage,
        mimeType,
        selections,
      };

      console.log('📤 Enviando petición al backend...');
      const response = await fetch(`${API_BASE_URL}/image-generation/generate-v2`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      const result: ImageGenerationResponse = await response.json();

      if (!response.ok) {
        console.error('❌ Error del backend:', result.errorMessage);
        return {
          id: null,
          status: 'FAILED',
          generatedImageBase64: null,
          errorMessage: result.errorMessage || `Error HTTP ${response.status}`,
        };
      }

      if (result.status === 'COMPLETED' && result.generatedImageBase64) {
        console.log('✅ Imagen generada exitosamente!');
        return result;
      } else {
        console.error('❌ Error en la generación:', result.errorMessage);
        return result;
      }
    } catch (error) {
      console.error('❌ Error en la petición:', error);
      return {
        id: null,
        status: 'FAILED',
        generatedImageBase64: null,
        errorMessage: error instanceof Error ? error.message : 'Error desconocido',
      };
    }
  }

  /**
   * Valida las selecciones según las reglas de negocio
   * 
   * Opción A: Solo CORTE
   * - service: "CORTE"
   * - colorId: null
   * - styleId: 501-529
   * 
   * Opción B: COLOR + PEINADO
   * - service: "PEINADO"
   * - colorId: 101-135 (OBLIGATORIO)
   * - styleId: 701-718
   */
  private validateSelections(selections: ImageGenerationSelections): void {
    const { service, colorId, styleId } = selections;

    if (service === 'CORTE') {
      // Opción A: Solo CORTE
      if (colorId !== null) {
        throw new Error('❌ Para servicio CORTE, colorId debe ser null');
      }
      if (styleId < 501 || styleId > 529) {
        throw new Error('❌ Para servicio CORTE, styleId debe estar entre 501-529');
      }
      console.log('✅ Validación CORTE: OK');
    } else if (service === 'PEINADO') {
      // Opción B: COLOR + PEINADO
      if (colorId === null) {
        throw new Error('❌ Para servicio PEINADO, colorId es OBLIGATORIO');
      }
      if (colorId < 101 || colorId > 135) {
        throw new Error('❌ Para servicio PEINADO, colorId debe estar entre 101-135');
      }
      if (styleId < 701 || styleId > 718) {
        throw new Error('❌ Para servicio PEINADO, styleId debe estar entre 701-718');
      }
      console.log('✅ Validación PEINADO: OK');
    } else {
      throw new Error('❌ Servicio inválido. Debe ser "CORTE" o "PEINADO"');
    }
  }

  /**
   * Formatea la imagen base64 para asegurar que tenga el data URI correcto
   */
  private formatBase64Image(imageBase64: string, mimeType: string): string {
    // Si ya tiene el prefijo data:image, retornar tal cual
    if (imageBase64.startsWith('data:image/')) {
      return imageBase64;
    }

    // Si no tiene el prefijo, agregarlo
    return `data:${mimeType};base64,${imageBase64}`;
  }

  /**
   * Convierte una URI local (file://) a base64
   * Útil para convertir fotos tomadas con la cámara
   */
  async convertUriToBase64(uri: string): Promise<{ base64: string; mimeType: string }> {
    try {
      // Detectar el tipo MIME de la extensión
      const extension = uri.split('.').pop()?.toLowerCase();
      let mimeType = 'image/jpeg'; // Por defecto

      if (extension === 'png') {
        mimeType = 'image/png';
      } else if (extension === 'webp') {
        mimeType = 'image/webp';
      }

      // Leer el archivo como base64
      const base64 = await this.readFileAsBase64(uri);

      return { base64, mimeType };
    } catch (error) {
      console.error('❌ Error convirtiendo URI a base64:', error);
      throw error;
    }
  }

  /**
   * Lee un archivo local y lo convierte a base64
   */
  private async readFileAsBase64(uri: string): Promise<string> {
    // Esta función será implementada con FileSystem de Expo
    // Por ahora retornamos un placeholder
    throw new Error('readFileAsBase64 no implementado. Usar expo-file-system');
  }

  /**
   * Health check del servicio
   */
  async checkHealth(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/image-generation/health`);
      return response.ok;
    } catch (error) {
      console.error('❌ Health check falló:', error);
      return false;
    }
  }

  /**
   * Crea un request de ejemplo para CORTE
   */
  createCutRequest(
    userId: string,
    imageBase64: string,
    mimeType: string,
    gender: Gender,
    cutId: number
  ): ImageGenerationRequest {
    return {
      userId,
      imageBase64: this.formatBase64Image(imageBase64, mimeType),
      mimeType,
      selections: {
        gender,
        service: 'CORTE',
        colorId: null,
        styleId: cutId,
        background: null,
      },
    };
  }

  /**
   * Crea un request de ejemplo para PEINADO
   */
  createStyleRequest(
    userId: string,
    imageBase64: string,
    mimeType: string,
    gender: Gender,
    colorId: number,
    styleId: number
  ): ImageGenerationRequest {
    return {
      userId,
      imageBase64: this.formatBase64Image(imageBase64, mimeType),
      mimeType,
      selections: {
        gender,
        service: 'PEINADO',
        colorId,
        styleId,
        background: null,
      },
    };
  }
}

export default new ImageGenerationService();
