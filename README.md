# 💇 LookMatch Mobile App

> AI-powered hairstyle simulation mobile application built with React Native and Expo.

[![React Native](https://img.shields.io/badge/React%20Native-0.81.5-blue.svg)](https://reactnative.dev/)
[![Expo](https://img.shields.io/badge/Expo-54.0.23-black.svg)](https://expo.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9.2-blue.svg)](https://www.typescriptlang.org/)

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Running the App](#-running-the-app)
- [Project Structure](#-project-structure)
- [Backend Integration](#-backend-integration)
- [Notification System](#-notification-system)
- [Error Handling](#-error-handling)
- [Contributing](#-contributing)
- [Documentation](#-documentation)

## ✨ Features

- 🎨 **AI Image Generation**: Generate hairstyle variations using AI-powered backend
- 📸 **Photo Capture & Upload**: Take photos or upload from gallery
- 🎭 **Multiple Services**: Support for hair cuts (CORTE) and hairstyles (PEINADO)
- 🌈 **Color Catalog**: Browse and select from 35+ hair colors
- ✂️ **Cut/Style Catalog**: Choose from 29 cuts and 18 hairstyles
- 🔔 **Custom Notifications**: Beautiful toast notifications with animations
- 🌐 **Multi-platform**: Works on Web, iOS, and Android
- 🎯 **Real-time Preview**: See your original and generated images side by side
- 💾 **Download & Share**: Save or share generated images

## 🛠️ Tech Stack

### Core
- **React Native**: 0.81.5
- **Expo**: 54.0.23
- **TypeScript**: 5.9.2
- **React**: 19.1.0

### Key Libraries
- **expo-image-picker**: Photo selection and capture
- **expo-camera**: Camera functionality
- **expo-file-system**: File operations and base64 conversion
- **expo-media-library**: Save images to device
- **@react-navigation/native**: Navigation

### State Management
- **React Context API**: Global state management

## 📋 Prerequisites

- **Node.js**: >=18.x.x
- **npm** or **yarn**: >=9.x.x
- **Expo CLI**: Latest version
- **Git**: For version control

## 🚀 Installation

### 1. Clone the repository
```bash
git clone https://github.com/admin-lookmatch/lookmatch-movile-app.git
cd FrontUlises
```

### 2. Install dependencies
```bash
npm install
# or
yarn install
```

### 3. Configure backend URL
Update the backend URL in `src/environments/environment.ts`:
```typescript
export const environment = {
  production: false,
  imageGeneratorApiUrl: 'http://YOUR_BACKEND_IP:8080/api/v1'
};
```

> **Note**: For Android devices, use your local network IP (e.g., `10.10.10.172`) instead of `localhost`

## 📱 Running the App

### Start Development Server
```bash
npx expo start
```

### Run on Specific Platform
```bash
# Web
npx expo start --web

# iOS (requires Mac)
npx expo start --ios

# Android
npx expo start --android
```

### Clear Cache (if needed)
```bash
npx expo start --clear
```

### Available Scripts
```bash
npm start          # Start Expo dev server
npm test           # Run tests
npm run web        # Run on web browser
npm run android    # Run on Android
npm run ios        # Run on iOS
```

## 📁 Project Structure

```
FrontUlises/
├── src/
│   ├── Components/          # Reusable components
│   │   ├── BackButton.tsx
│   │   ├── ConfirmButton.tsx
│   │   ├── Toast.tsx        # Custom toast notification
│   │   └── imageGrid/       # Grid components for catalog
│   │       ├── ImageCard.tsx
│   │       ├── ImageGrid.tsx
│   │       └── useImageGrid.tsx
│   ├── screens/             # Screen components
│   │   ├── SelectSexScreen.tsx
│   │   ├── ColorAndCutScreen.tsx
│   │   ├── HairColorSelectionScreen.tsx
│   │   ├── HairCutSelector.tsx
│   │   ├── HairStyleSelectorScreen.tsx
│   │   ├── PhotoSourceSelector.tsx
│   │   ├── CameraScreen.tsx
│   │   └── Magia.tsx        # Result/generation screen
│   ├── contexts/            # React Context providers
│   │   ├── UserSelectionContext.tsx
│   │   └── ToastContext.tsx
│   ├── services/            # API and business logic
│   │   ├── CatalogService.ts
│   │   ├── ImageGenerationService.ts
│   │   └── NotificationService.ts
│   ├── constants/           # App constants
│   │   ├── messages.ts      # User messages
│   │   └── config.ts        # API configuration
│   ├── utils/               # Utility functions
│   │   └── errorHandler.ts
│   ├── navigation/          # Navigation setup
│   │   └── AppNavigator.tsx
│   ├── environments/        # Environment configs
│   │   └── environment.ts
│   └── types/               # TypeScript types
├── assets/                  # Images and static assets
├── App.tsx                  # Root component
├── app.json                 # Expo configuration
├── package.json
├── tsconfig.json
└── README.md
```

## 🔌 Backend Integration

### API Configuration

The app integrates with the LookMatch Image Generator backend:

```typescript
// src/constants/config.ts
export const API_CONFIG = {
  BASE_URL: 'http://10.10.10.172:8080/api/v1',
  TIMEOUT: 30000,
};

export const API_ENDPOINTS = {
  IMAGE_GENERATION: {
    GENERATE_V2: '/image-generation/generate-v2',
    GET_STATUS: (id: string) => `/image-generation/${id}/status`,
  },
  CATALOG: {
    COLORS: '/catalog/colors',
    CUTS: '/catalog/cuts',
    STYLES: '/catalog/styles',
  },
};
```

### Backend Requirements

The backend must be running and accessible. See backend documentation:
- Swagger UI: `http://YOUR_BACKEND_IP:8080/swagger-ui.html`
- API Docs: [Backend API Documentation](./NOTIFICATIONS_AND_ERRORS.md)

### Image Generation Flow

1. User selects gender (MASCULINO/FEMENINO)
2. User selects color (ID: 101-135)
3. User selects cut (ID: 501-529) or style (ID: 701-718)
4. User takes/uploads photo
5. App sends request to `/image-generation/generate-v2`
6. Backend processes with NanoBanana AI
7. Generated image displayed in Magia screen

### Request Format

```typescript
{
  userId: "user_mobile_app",
  selections: {
    gender: "MASCULINO" | "FEMENINO",
    service: "CORTE" | "PEINADO",
    colorId: 129,
    styleId: 505,
    background: "WHITE"
  },
  imageBase64: "base64_string_without_prefix",
  mimeType: "image/jpeg"
}
```

## 🔔 Notification System

### Custom Toast Notifications

The app uses a custom toast notification system instead of native alerts:

```typescript
import { notify } from '../services/NotificationService';

// Success notification
notify.success("✅ Imagen generada correctamente");

// Error notification
notify.error("❌ Error al generar la imagen");

// Warning notification
notify.warning("⚠️ Debes seleccionar un color");

// Info notification
notify.info("ℹ️ Procesando...");
```

### Features
- ✅ Non-blocking UI
- ✅ Smooth animations (slide-down with bounce)
- ✅ Color-coded by type
- ✅ Auto-dismiss after 3 seconds
- ✅ Manual close button
- ✅ Touch to dismiss

### Notification Types

| Type    | Color  | Icon                |
|---------|--------|---------------------|
| Success | Green  | ✓ checkmark-circle  |
| Error   | Red    | ✗ close-circle      |
| Warning | Orange | ⚠ warning           |
| Info    | Blue   | ℹ information-circle|

## ⚠️ Error Handling

### Custom Error Classes

```typescript
import { ErrorHandler, ValidationError, NetworkError } from '../utils/errorHandler';

try {
  // Your code
  if (!data) {
    throw new ValidationError(
      "Data missing",
      MESSAGES.VALIDATION.NO_DATA
    );
  }
  
  const response = await fetch(url);
  if (!response.ok) {
    await ErrorHandler.handleHttpError(response);
  }
} catch (error) {
  ErrorHandler.log(error, 'functionName');
  const errorInfo = ErrorHandler.handle(error);
  notify.error(errorInfo.message);
}
```

### Error Types
- **ValidationError**: Input validation failures
- **NetworkError**: Connection/timeout issues
- **ServerError**: Backend errors (4xx, 5xx)
- **PermissionError**: Camera/storage permissions
- **ImageError**: Invalid image format/size

## 🎨 User Flow

```
1. Select Gender (MASCULINO/FEMENINO)
   ↓
2. Select Color (from catalog)
   ↓
3. Select Cut or Style (from catalog)
   ↓
4. Choose Photo Source (Camera/Gallery)
   ↓
5. Take/Upload Photo
   ↓
6. View Magia Screen
   ↓
7. Click "Generar Imagen Mágica"
   ↓
8. View Generated Result
   ↓
9. Download or Share
```

## 🔧 Configuration

### Environment Variables

Update `src/environments/environment.ts`:

```typescript
export const environment = {
  production: false,
  imageGeneratorApiUrl: 'http://10.10.10.172:8080/api/v1'
};
```

### Constants

All app constants are centralized in `src/constants/`:
- `messages.ts`: User-facing messages
- `config.ts`: API endpoints, defaults, validation rules

## 📚 Documentation

Additional documentation:
- [Notification System & Error Handling](./NOTIFICATIONS_AND_ERRORS.md)
- [Backend API Documentation](http://YOUR_BACKEND_IP:8080/swagger-ui.html)

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage
```

## 📦 Building for Production

### Web Build
```bash
npx expo export:web
```

### Android APK
```bash
# Build APK
eas build --platform android --profile preview

# Build AAB (for Play Store)
eas build --platform android --profile production
```

### iOS Build (requires Mac)
```bash
eas build --platform ios --profile production
```

## 🐛 Troubleshooting

### Common Issues

**Backend not accessible from Android:**
- Solution: Use local network IP instead of `localhost`
- Check: `ipconfig` (Windows) or `ifconfig` (Mac/Linux)

**Image picker not working:**
```bash
npx expo install expo-image-picker
```

**Cache issues:**
```bash
npx expo start --clear
```

**Metro bundler errors:**
```bash
rm -rf node_modules
npm install
npx expo start --clear
```

## 🤝 Contributing

1. Create a new branch: `git checkout -b feature/my-feature`
2. Make your changes
3. Commit: `git commit -m 'feat: add some feature'`
4. Push: `git push origin feature/my-feature`
5. Create Pull Request

### Commit Convention

Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Code style
- `refactor:` Code refactoring
- `test:` Tests
- `chore:` Maintenance

## 📄 License

[Your License Here]

## 👥 Team

- **Project**: LookMatch
- **Organization**: admin-lookmatch
- **Repository**: lookmatch-movile-app

## 🔗 Links

- [Backend Repository](link-to-backend-repo)
- [API Documentation](http://YOUR_BACKEND_IP:8080/swagger-ui.html)
- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)

## 📊 Status

- ✅ Gender selection
- ✅ Color catalog integration
- ✅ Cut/Style catalog integration
- ✅ Photo capture/upload
- ✅ Image generation with AI
- ✅ Toast notifications
- ✅ Error handling
- ✅ Download/Share functionality
- 🚧 User authentication (pending)
- 🚧 Payment integration (pending)

---

Made with ❤️ by the LookMatch Team
