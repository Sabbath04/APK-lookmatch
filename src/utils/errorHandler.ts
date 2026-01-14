/**
 * Sistema de manejo de excepciones personalizado
 * Proporciona clases de error específicas y manejo centralizado
 */

/**
 * Error base personalizado
 */
export class AppError extends Error {
  public readonly userMessage: string;
  public readonly code: string;
  public readonly statusCode?: number;

  constructor(message: string, userMessage: string, code: string, statusCode?: number) {
    super(message);
    this.name = this.constructor.name;
    this.userMessage = userMessage;
    this.code = code;
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Error de validación
 */
export class ValidationError extends AppError {
  constructor(message: string, userMessage: string) {
    super(message, userMessage, "VALIDATION_ERROR");
  }
}

/**
 * Error de red/conectividad
 */
export class NetworkError extends AppError {
  constructor(message: string, userMessage: string = "❌ Error de conexión. Verifica tu internet") {
    super(message, userMessage, "NETWORK_ERROR");
  }
}

/**
 * Error del servidor/backend
 */
export class ServerError extends AppError {
  constructor(message: string, userMessage: string, statusCode?: number) {
    super(message, userMessage, "SERVER_ERROR", statusCode);
  }
}

/**
 * Error de permisos
 */
export class PermissionError extends AppError {
  constructor(message: string, userMessage: string = "❌ Permiso denegado") {
    super(message, userMessage, "PERMISSION_ERROR");
  }
}

/**
 * Error de imagen inválida
 */
export class ImageError extends AppError {
  constructor(message: string, userMessage: string = "❌ Imagen no válida") {
    super(message, userMessage, "IMAGE_ERROR");
  }
}

/**
 * Manejador centralizado de errores
 */
export class ErrorHandler {
  /**
   * Maneja un error y retorna un mensaje apropiado para el usuario
   */
  static handle(error: unknown): { message: string; code: string; shouldLog: boolean } {
    console.error("🔥 Error capturado:", error);

    // Si es un error personalizado
    if (error instanceof AppError) {
      return {
        message: error.userMessage,
        code: error.code,
        shouldLog: true,
      };
    }

    // Si es un error de fetch/network
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return {
        message: "❌ Error de conexión. Verifica tu internet",
        code: "NETWORK_ERROR",
        shouldLog: true,
      };
    }

    // Si es un error genérico
    if (error instanceof Error) {
      // Detectar errores específicos por mensaje
      if (error.message.includes("permission")) {
        return {
          message: "❌ Permiso denegado",
          code: "PERMISSION_ERROR",
          shouldLog: true,
        };
      }

      if (error.message.includes("network") || error.message.includes("timeout")) {
        return {
          message: "❌ Error de conexión. Verifica tu internet",
          code: "NETWORK_ERROR",
          shouldLog: true,
        };
      }

      return {
        message: `❌ Error: ${error.message}`,
        code: "UNKNOWN_ERROR",
        shouldLog: true,
      };
    }

    // Error completamente desconocido
    return {
      message: "❌ Ocurrió un error inesperado",
      code: "UNKNOWN_ERROR",
      shouldLog: true,
    };
  }

  /**
   * Maneja errores de respuesta HTTP
   */
  static async handleHttpError(response: Response): Promise<never> {
    let errorMessage = "Error en el servidor";
    
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {
      // Si no se puede parsear el JSON, usar mensaje por defecto
      errorMessage = `Error ${response.status}: ${response.statusText}`;
    }

    const userMessage = this.getUserMessageForStatus(response.status);
    
    throw new ServerError(
      errorMessage,
      userMessage,
      response.status
    );
  }

  /**
   * Obtiene mensaje de usuario según código de estado HTTP
   */
  private static getUserMessageForStatus(status: number): string {
    switch (status) {
      case 400:
        return "❌ Solicitud inválida. Verifica los datos";
      case 401:
        return "❌ No autorizado. Inicia sesión nuevamente";
      case 403:
        return "❌ Acceso denegado";
      case 404:
        return "❌ Recurso no encontrado";
      case 408:
        return "❌ Tiempo de espera agotado. Intenta de nuevo";
      case 429:
        return "❌ Demasiadas solicitudes. Espera un momento";
      case 500:
        return "❌ Error en el servidor. Intenta más tarde";
      case 503:
        return "❌ Servicio no disponible. Intenta más tarde";
      default:
        return "❌ Error en el servidor";
    }
  }

  /**
   * Log de error para debugging (puede conectarse a un servicio externo)
   */
  static log(error: unknown, context?: string) {
    const timestamp = new Date().toISOString();
    const contextStr = context ? `[${context}]` : "";
    
    console.error(`${timestamp} ${contextStr} Error:`, error);
    
    // TODO: Aquí se puede agregar integración con servicios como:
    // - Sentry
    // - Firebase Crashlytics
    // - LogRocket
    // - etc.
  }
}
