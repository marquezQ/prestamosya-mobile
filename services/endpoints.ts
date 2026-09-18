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
  },
};
