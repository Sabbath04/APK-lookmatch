/**
 * Constantes de mensajes para la aplicación
 * Centraliza todos los mensajes de usuario, errores y notificaciones
 */

export const MESSAGES = {
  // Mensajes de validación
  VALIDATION: {
    NO_PHOTO: "⚠️ Primero debes tomar o seleccionar una foto",
    NO_COLOR: "⚠️ Debes seleccionar un color",
    NO_SERVICE: "⚠️ Debes seleccionar un corte o peinado",
    NO_SELECTION: "⚠️ Antes debes seleccionar algo",
    INCOMPLETE_SELECTION: "⚠️ Debes completar todas las selecciones",
  },

  // Mensajes de éxito
  SUCCESS: {
    IMAGE_GENERATED: "✅ Imagen generada correctamente",
    IMAGE_DOWNLOADED: "✅ Imagen descargada correctamente",
    IMAGE_SHARED: "✅ Imagen compartida",
    SELECTION_SAVED: "✅ Selección guardada",
  },

  // Mensajes de error
  ERROR: {
    GENERATE_IMAGE: "❌ Error al generar la imagen",
    DOWNLOAD_IMAGE: "❌ No se pudo descargar la imagen",
    SHARE_IMAGE: "❌ No se pudo compartir la imagen",
    LOAD_CATALOG: "❌ Error al cargar el catálogo",
    NETWORK_ERROR: "❌ Error de conexión. Verifica tu internet",
    SERVER_ERROR: "❌ Error en el servidor. Intenta más tarde",
    UNKNOWN_ERROR: "❌ Ocurrió un error inesperado",
    PERMISSION_DENIED: "❌ Permiso denegado",
    INVALID_IMAGE: "❌ Imagen no válida",
    BACKEND_UNAVAILABLE: "❌ El servicio no está disponible",
  },

  // Mensajes informativos
  INFO: {
    PROCESSING: "⏳ Procesando...",
    GENERATING: "🎨 Generando imagen...",
    LOADING: "⏳ Cargando...",
    UPLOADING: "📤 Subiendo imagen...",
    DOWNLOADING: "📥 Descargando...",
    PERMISSION_NEEDED: "ℹ️ Se necesita permiso para continuar",
  },

  // Mensajes de permisos
  PERMISSIONS: {
    CAMERA: "Se necesita permiso de cámara para tomar fotos",
    GALLERY: "Se necesita permiso para acceder a la galería",
    STORAGE: "Se necesita permiso para guardar imágenes",
  },

  // Títulos de carga
  LOADING_TITLES: {
    CATALOG: "Cargando catálogo...",
    COLORS: "Obteniendo colores de cabello",
    CUTS: "Obteniendo cortes de cabello",
    STYLES: "Obteniendo peinados",
    IMAGES: "Cargando imágenes...",
  },
};

/**
 * Tipos de notificación
 */
export enum NotificationType {
  SUCCESS = "success",
  ERROR = "error",
  WARNING = "warning",
  INFO = "info",
}

/**
 * Configuración de notificaciones
 */
export const NOTIFICATION_CONFIG = {
  DURATION: {
    SHORT: 2000,
    MEDIUM: 3000,
    LONG: 5000,
  },
  POSITION: {
    TOP: "top",
    BOTTOM: "bottom",
    CENTER: "center",
  },
};
