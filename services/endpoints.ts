export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me', // Refleja el payload del JWT en memoria (sin BD)
  },
  USERS: {
    ME: '/users/me',              // Perfil fresco desde BD { id, name, username, role, isActive, createdAt, updatedAt }
    CHANGE_PASSWORD: '/users/me/password', // PATCH — responde 400 (no 401) si la contraseña actual es incorrecta
  },
  BUSINESS_CONFIG: {
    BASE: '/business-config', // GET (auto-crea con defaults) y PATCH (actualización parcial)
  },
  CLIENTS: {
    GET_ALL: '/clients',
    GET_BY_ID: (id: string) => `/clients/${id}`,
    CREATE: '/clients',
    UPDATE: (id: string) => `/clients/${id}`,
  },
  LOANS: {
    SIMULATE: '/loans/simulate',
    CREATE: '/loans',
    GET_BY_ID: (id: string) => `/loans/${id}`,
  },
  GUARANTEES: {
    BASE: '/guarantees',
    GET_BY_ID: (id: string) => `/guarantees/${id}`,
  },
  PAYMENTS: {
    BASE: '/payments',
    DASHBOARD: '/payments/dashboard',
    REGISTER: '/payments',
    VOID: (id: string) => `/payments/${id}`,
    SETTLE: '/payments/settle',
  },
  ADMIN: {
    RECALCULATE_OVERDUE: '/admin/recalculate-overdue',
  },
  DASHBOARD: {
    HOME: '/dashboard/home',
  },
  STATS: {
    MONTHLY: '/stats/monthly',
    MONTHLY_HISTORY: '/stats/monthly-history',
    MONTHLY_PDF: '/stats/monthly-pdf',
  },
  NOTIFICATIONS: {
    /** GET — lista paginada de notificaciones del usuario */
    LIST: '/notifications',
    /** GET — entero con total de no leídas (para badge) */
    UNREAD_COUNT: '/notifications/unread-count',
    /** PATCH — marca una notificación específica como leída */
    MARK_READ: (id: string) => `/notifications/${id}/read`,
    /** PATCH — marca todas las no leídas como leídas */
    MARK_ALL_READ: '/notifications/read-all',
    /** POST — registra el token de push del dispositivo */
    REGISTER_TOKEN: '/notifications/device-tokens',
    /** DELETE — elimina el token de push del dispositivo (llamar al logout) */
    DELETE_TOKEN: '/notifications/device-tokens',
    /** POST — [solo admin] dispara el resumen diario manualmente */
    TRIGGER_DAILY: '/notifications/trigger-daily-summary',
  },
};
