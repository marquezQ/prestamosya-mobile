export interface User {
  id: string;
  username: string;
  name: string;
  role: string;
  // Campos adicionales devueltos por GET /users/me (perfil fresco desde BD)
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface LoginCredentials {
  username?: string;
  password?: string;
}
