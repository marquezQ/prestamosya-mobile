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
    // VOID: '/payments/:id' — pendiente de UI (DELETE con body { reason })
  },
};
