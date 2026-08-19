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
};
