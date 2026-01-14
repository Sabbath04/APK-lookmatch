/**
 * Constantes de configuración de la aplicación
 */

// --- 1. CONFIGURACIÓN DE CONEXIÓN ---
// IP del nuevo servidor remoto (Backend Java)
const SERVER_IP = '157.230.174.12'; 
const SERVER_PORT = '8080'; 

// Backend del Compañero (IA/Catálogo)
const PARTNER_SERVER = 'http://138.68.61.170:5001'; 

export const API_CONFIG = {
  // A. Tu Backend (Usuarios/Pagos) -> Apunta al servidor en la nube
  USERS_BASE_URL: `http://${SERVER_IP}:${SERVER_PORT}/api`, 
  
  // B. Backend Compañero (IA/Catálogo) -> Apunta a su servidor
  GENERAL_BASE_URL: `${PARTNER_SERVER}/api/v1`,

  TIMEOUT: 30000,
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000,
};

/**
 * Endpoints del API
 */
export const API_ENDPOINTS = {
  // --- TUS ENDPOINTS (Java) ---
  USERS: {
    LOGIN: '/login',
    SYNC: '/sync-user',
    DELETE: '/delete-user',
    BALANCE: '/user-balance',
    PURCHASE: '/purchase',
  },
  
  // --- ENDPOINTS COMPAÑERO ---
  IMAGE_GENERATION: {
    GENERATE_V2: '/image-generation/generate-v2',
    GET_STATUS: (id: string) => `/image-generation/${id}/status`,
  },
  CATALOG: {
    COLORS: '/catalog/colors',
    CUTS: '/catalog/cuts',
    STYLES: '/catalog/styles',
    SKIN_TONES: '/catalog/skin-tones',
    COLOR_IMAGE: (id: number) => `/catalog/colors/${id}/image`,
    CUT_IMAGE: (id: number) => `/catalog/cuts/${id}/image`,
    STYLE_IMAGE: (id: number) => `/catalog/styles/${id}/image`,
    SKIN_TONE_IMAGE: (id: number) => `/catalog/skin-tones/${id}/image`,
  },
};

export const DEFAULTS = {
  GENDER: 'MASCULINO',
  BACKGROUND: 'WHITE',
  USER_ID: 'user_mobile_app',
  IMAGE_MIME_TYPE: 'image/jpeg',
};

export const VALIDATION_RULES = {
  COLOR_ID_RANGE: null,
  CUT_ID_RANGE: null,
  STYLE_ID_RANGE: null,
  MAX_IMAGE_SIZE_MB: 10,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
};

export const CACHE_DURATION = {
  CATALOG: 24 * 60 * 60 * 1000, 
  IMAGES: 7 * 24 * 60 * 60 * 1000, 
};

export const UI_CONFIG = {
  CARD_WIDTH: 160,
  CARD_HEIGHT: 220,
  GRID_COLUMNS: 2,
  ANIMATION_DURATION: 500,
  IMAGE_TRANSITION: 500,
};