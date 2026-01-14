/**
 * Context para manejar las notificaciones Toast globalmente
 */

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import Toast from '../Components/Toast';
import { NotificationType } from '../constants/messages';
import { registerToastFunction } from '../services/NotificationService';

interface ToastContextType {
  showToast: (message: string, type: NotificationType, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within ToastProvider');
  }
  return context;
};

interface ToastProviderProps {
  children: ReactNode;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [type, setType] = useState<NotificationType>(NotificationType.INFO);
  const [duration, setDuration] = useState(3000);

  const showToast = (msg: string, toastType: NotificationType, toastDuration = 3000) => {
    setMessage(msg);
    setType(toastType);
    setDuration(toastDuration);
    setVisible(true);
  };

  const hideToast = () => {
    setVisible(false);
  };

  // Registrar la función showToast globalmente cuando el componente se monta
  useEffect(() => {
    registerToastFunction(showToast);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast
        visible={visible}
        message={message}
        type={type}
        duration={duration}
        onHide={hideToast}
      />
    </ToastContext.Provider>
  );
};
