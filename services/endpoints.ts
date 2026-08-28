export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
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
  },
  ADMIN: {
    RECALCULATE_OVERDUE: '/admin/recalculate-overdue',
  },
};
