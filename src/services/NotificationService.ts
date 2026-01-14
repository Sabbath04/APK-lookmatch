/**
 * Sistema de notificaciones tipo Toast/Push
 * Compatible con React Native y Web
 */

import { Alert, Platform } from "react-native";
import { NotificationType } from "../constants/messages";

export interface NotificationOptions {
  type?: NotificationType;
  duration?: number;
  position?: "top" | "bottom" | "center";
  vibrate?: boolean;
}

// Variable global para guardar la función showToast del contexto
let globalShowToast: ((message: string, type: NotificationType, duration?: number) => void) | null = null;

/**
 * Registra la función showToast del contexto
 */
export const registerToastFunction = (
  showToast: (message: string, type: NotificationType, duration?: number) => void
) => {
  globalShowToast = showToast;
};

/**
 * Servicio de notificaciones
 */
export class NotificationService {
  /**
   * Muestra una notificación
   */
  static show(
    message: string,
    options: NotificationOptions = {}
  ) {
    const {
      type = NotificationType.INFO,
      duration = 3000,
      position = "top",
      vibrate = false,
    } = options;

    // Si tenemos el Toast Context disponible, usarlo
    if (globalShowToast) {
      globalShowToast(message, type, duration);
    } else {
      // Fallback a Alert nativo si no está el contexto
      if (Platform.OS === "web") {
        this.showWebNotification(message, type, duration);
      } else {
        this.showNativeNotification(message, type, vibrate);
      }
    }
  }

  /**
   * Muestra notificación de éxito
   */
  static success(message: string, duration?: number) {
    this.show(message, {
      type: NotificationType.SUCCESS,
      duration,
      vibrate: false,
    });
  }

  /**
   * Muestra notificación de error
   */
  static error(message: string, duration?: number) {
    this.show(message, {
      type: NotificationType.ERROR,
      duration,
      vibrate: true,
    });
  }

  /**
   * Muestra notificación de advertencia
   */
  static warning(message: string, duration?: number) {
    this.show(message, {
      type: NotificationType.WARNING,
      duration,
      vibrate: false,
    });
  }

  /**
   * Muestra notificación informativa
   */
  static info(message: string, duration?: number) {
    this.show(message, {
      type: NotificationType.INFO,
      duration,
      vibrate: false,
    });
  }

  /**
   * Muestra un diálogo de confirmación
   */
  static confirm(
    title: string,
    message: string,
    onConfirm: () => void,
    onCancel?: () => void
  ) {
    Alert.alert(
      title,
      message,
      [
        {
          text: "Cancelar",
          style: "cancel",
          onPress: onCancel,
        },
        {
          text: "Confirmar",
          onPress: onConfirm,
        },
      ],
      { cancelable: true }
    );
  }

  /**
   * Implementación para web (puede mejorarse con una librería de toast)
   */
  private static showWebNotification(
    message: string,
    type: NotificationType,
    duration: number
  ) {
    // Por ahora usa alert simple
    // TODO: Implementar con una librería de toast para web
    alert(message);
    
    // También podemos mostrar en consola con estilo
    const style = this.getConsoleStyle(type);
    console.log(`%c${message}`, style);
  }

  /**
   * Implementación para React Native nativo
   */
  private static showNativeNotification(
    message: string,
    type: NotificationType,
    vibrate: boolean
  ) {
    const title = this.getTitleForType(type);
    
    Alert.alert(title, message, [{ text: "OK" }], {
      cancelable: true,
    });

    // Vibrar en caso de error
    if (vibrate && Platform.OS !== "web") {
      // TODO: Implementar vibración con Haptics de Expo
      // import * as Haptics from 'expo-haptics';
      // Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }

  /**
   * Obtiene el título según el tipo de notificación
   */
  private static getTitleForType(type: NotificationType): string {
    switch (type) {
      case NotificationType.SUCCESS:
        return "✅ Éxito";
      case NotificationType.ERROR:
        return "❌ Error";
      case NotificationType.WARNING:
        return "⚠️ Advertencia";
      case NotificationType.INFO:
        return "ℹ️ Información";
      default:
        return "Notificación";
    }
  }

  /**
   * Obtiene estilo de consola según tipo
   */
  private static getConsoleStyle(type: NotificationType): string {
    const baseStyle = "padding: 8px 12px; border-radius: 4px; font-weight: bold;";
    
    switch (type) {
      case NotificationType.SUCCESS:
        return `${baseStyle} background: #4CAF50; color: white;`;
      case NotificationType.ERROR:
        return `${baseStyle} background: #F44336; color: white;`;
      case NotificationType.WARNING:
        return `${baseStyle} background: #FF9800; color: white;`;
      case NotificationType.INFO:
        return `${baseStyle} background: #2196F3; color: white;`;
      default:
        return `${baseStyle} background: #9E9E9E; color: white;`;
    }
  }
}

/**
 * Alias para uso más simple
 */
export const notify = {
  success: (message: string) => NotificationService.success(message),
  error: (message: string) => NotificationService.error(message),
  warning: (message: string) => NotificationService.warning(message),
  info: (message: string) => NotificationService.info(message),
  confirm: (title: string, message: string, onConfirm: () => void, onCancel?: () => void) =>
    NotificationService.confirm(title, message, onConfirm, onCancel),
};
