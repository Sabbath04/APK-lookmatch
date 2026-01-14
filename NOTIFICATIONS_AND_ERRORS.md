# Sistema de Notificaciones y Manejo de Excepciones

Sistema centralizado para gestionar notificaciones de usuario y errores de la aplicación.

## 📁 Estructura

```
src/
├── constants/
│   ├── messages.ts      # Mensajes centralizados
│   └── config.ts        # Configuración de la app
├── utils/
│   └── errorHandler.ts  # Manejo de excepciones
└── services/
    └── NotificationService.ts  # Sistema de notificaciones
```

## 🎯 Uso

### 1. Notificaciones

```typescript
import { notify } from '../services/NotificationService';

// Éxito
notify.success("✅ Operación completada");

// Error
notify.error("❌ Algo salió mal");

// Advertencia
notify.warning("⚠️ Revisa los datos");

// Información
notify.info("ℹ️ Procesando...");

// Confirmación
notify.confirm(
  "¿Estás seguro?",
  "Esta acción no se puede deshacer",
  () => console.log("Confirmado"),
  () => console.log("Cancelado")
);
```

### 2. Mensajes Constantes

```typescript
import { MESSAGES } from '../constants/messages';

// Usar mensajes predefinidos
notify.warning(MESSAGES.VALIDATION.NO_PHOTO);
notify.success(MESSAGES.SUCCESS.IMAGE_GENERATED);
notify.error(MESSAGES.ERROR.NETWORK_ERROR);
```

### 3. Manejo de Errores

```typescript
import { ErrorHandler, ValidationError, ServerError } from '../utils/errorHandler';

try {
  // Tu código aquí
  if (!data) {
    throw new ValidationError(
      "Data is missing",
      MESSAGES.VALIDATION.NO_DATA
    );
  }
  
  const response = await fetch(url);
  if (!response.ok) {
    await ErrorHandler.handleHttpError(response);
  }
  
} catch (error) {
  // Log del error
  ErrorHandler.log(error, "myFunction");
  
  // Obtener mensaje amigable
  const errorInfo = ErrorHandler.handle(error);
  
  // Mostrar al usuario
  notify.error(errorInfo.message);
}
```

### 4. Configuración

```typescript
import { API_CONFIG, API_ENDPOINTS, DEFAULTS } from '../constants/config';

// URL completa del endpoint
const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.IMAGE_GENERATION.GENERATE_V2}`;

// Valores por defecto
const requestBody = {
  userId: DEFAULTS.USER_ID,
  background: DEFAULTS.BACKGROUND,
  mimeType: DEFAULTS.IMAGE_MIME_TYPE,
};
```

## 🎨 Tipos de Errores Personalizados

### ValidationError
```typescript
throw new ValidationError(
  "Technical message",
  "User-friendly message"
);
```

### NetworkError
```typescript
throw new NetworkError(
  "Connection failed",
  "❌ Verifica tu conexión"
);
```

### ServerError
```typescript
throw new ServerError(
  "Internal server error",
  "❌ Error en el servidor",
  500
);
```

### PermissionError
```typescript
throw new PermissionError(
  "Camera permission denied",
  "❌ Necesitamos acceso a la cámara"
);
```

### ImageError
```typescript
throw new ImageError(
  "Invalid image format",
  "❌ Formato de imagen no válido"
);
```

## 📊 Constantes Disponibles

### MESSAGES.VALIDATION
- `NO_PHOTO`: "⚠️ Primero debes tomar o seleccionar una foto"
- `NO_COLOR`: "⚠️ Debes seleccionar un color"
- `NO_SERVICE`: "⚠️ Debes seleccionar un corte o peinado"
- `NO_SELECTION`: "⚠️ Antes debes seleccionar algo"

### MESSAGES.SUCCESS
- `IMAGE_GENERATED`: "✅ Imagen generada correctamente"
- `IMAGE_DOWNLOADED`: "✅ Imagen descargada correctamente"
- `IMAGE_SHARED`: "✅ Imagen compartida"

### MESSAGES.ERROR
- `GENERATE_IMAGE`: "❌ Error al generar la imagen"
- `DOWNLOAD_IMAGE`: "❌ No se pudo descargar la imagen"
- `NETWORK_ERROR`: "❌ Error de conexión. Verifica tu internet"
- `SERVER_ERROR`: "❌ Error en el servidor. Intenta más tarde"

### MESSAGES.INFO
- `PROCESSING`: "⏳ Procesando..."
- `GENERATING`: "🎨 Generando imagen..."
- `LOADING`: "⏳ Cargando..."

### MESSAGES.PERMISSIONS
- `CAMERA`: "Se necesita permiso de cámara para tomar fotos"
- `GALLERY`: "Se necesita permiso para acceder a la galería"
- `STORAGE`: "Se necesita permiso para guardar imágenes"

## 🔧 Configuración API

### API_CONFIG
```typescript
{
  BASE_URL: 'http://10.10.10.172:8080/api/v1',
  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
}
```

### API_ENDPOINTS
```typescript
{
  IMAGE_GENERATION: {
    GENERATE_V2: '/image-generation/generate-v2',
    GET_STATUS: (id) => `/image-generation/${id}/status`,
  },
  CATALOG: {
    COLORS: '/catalog/colors',
    CUTS: '/catalog/cuts',
    STYLES: '/catalog/styles',
  }
}
```

## 🚀 Mejoras Futuras

### Notificaciones Push Reales
Para implementar notificaciones push nativas, instalar:
```bash
npx expo install expo-notifications
```

### Toast Messages
Para mensajes tipo toast más elegantes:
```bash
npm install react-native-toast-message
```

### Haptic Feedback
Para vibraciones y feedback táctil:
```bash
npx expo install expo-haptics
```

### Analytics
Para tracking de errores en producción:
```bash
npm install @sentry/react-native
```

## 📝 Ejemplo Completo

```typescript
import { notify } from '../services/NotificationService';
import { MESSAGES } from '../constants/messages';
import { ErrorHandler, ValidationError } from '../utils/errorHandler';
import { API_CONFIG, API_ENDPOINTS } from '../constants/config';

const handleSubmit = async () => {
  try {
    // Validación
    if (!data.photo) {
      notify.warning(MESSAGES.VALIDATION.NO_PHOTO);
      return;
    }

    // Notificar inicio
    notify.info(MESSAGES.INFO.PROCESSING);

    // Llamada al API
    const url = `${API_CONFIG.BASE_URL}${API_ENDPOINTS.IMAGE_GENERATION.GENERATE_V2}`;
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    // Verificar respuesta
    if (!response.ok) {
      await ErrorHandler.handleHttpError(response);
    }

    const result = await response.json();

    // Éxito
    notify.success(MESSAGES.SUCCESS.IMAGE_GENERATED);
    
  } catch (error) {
    // Log y notificación
    ErrorHandler.log(error, 'handleSubmit');
    const errorInfo = ErrorHandler.handle(error);
    notify.error(errorInfo.message);
  }
};
```

## ✅ Ventajas

- ✅ **Centralización**: Todos los mensajes en un solo lugar
- ✅ **Consistencia**: Mismos mensajes en toda la app
- ✅ **Mantenibilidad**: Fácil cambiar mensajes globalmente
- ✅ **Tipado**: TypeScript detecta errores
- ✅ **Escalabilidad**: Fácil agregar nuevos tipos de errores
- ✅ **Debugging**: Logs centralizados
- ✅ **UX**: Mensajes amigables para usuarios
