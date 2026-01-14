/**
 * Componente de Toast/Notificación personalizado
 * Muestra notificaciones visuales sin usar Alert
 */

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated, TouchableOpacity, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NotificationType } from '../constants/messages';

interface ToastProps {
  visible: boolean;
  message: string;
  type: NotificationType;
  duration?: number;
  onHide: () => void;
}

const Toast: React.FC<ToastProps> = ({ visible, message, type, duration = 3000, onHide }) => {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [slideAnim] = useState(new Animated.Value(-100));

  useEffect(() => {
    if (visible) {
      // Animación de entrada
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.spring(slideAnim, {
          toValue: 0,
          friction: 8,
          tension: 40,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto-ocultar después de la duración
      const timer = setTimeout(() => {
        hideToast();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  };

  if (!visible) return null;

  const { backgroundColor, icon, iconColor } = getStyleByType(type);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          backgroundColor,
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      <TouchableOpacity
        style={styles.content}
        onPress={hideToast}
        activeOpacity={0.9}
      >
        <Ionicons name={icon} size={24} color={iconColor} style={styles.icon} />
        <Text style={styles.message}>{message}</Text>
        <TouchableOpacity onPress={hideToast} style={styles.closeButton}>
          <Ionicons name="close" size={20} color="#fff" />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
};

const getStyleByType = (type: NotificationType) => {
  switch (type) {
    case NotificationType.SUCCESS:
      return {
        backgroundColor: '#4CAF50',
        icon: 'checkmark-circle' as const,
        iconColor: '#fff',
      };
    case NotificationType.ERROR:
      return {
        backgroundColor: '#F44336',
        icon: 'close-circle' as const,
        iconColor: '#fff',
      };
    case NotificationType.WARNING:
      return {
        backgroundColor: '#FF9800',
        icon: 'warning' as const,
        iconColor: '#fff',
      };
    case NotificationType.INFO:
      return {
        backgroundColor: '#2196F3',
        icon: 'information-circle' as const,
        iconColor: '#fff',
      };
    default:
      return {
        backgroundColor: '#9E9E9E',
        icon: 'notifications' as const,
        iconColor: '#fff',
      };
  }
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 60,
    left: 20,
    right: 20,
    zIndex: 9999,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  icon: {
    marginRight: 12,
  },
  message: {
    flex: 1,
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 20,
  },
  closeButton: {
    padding: 4,
    marginLeft: 8,
  },
});

export default Toast;
