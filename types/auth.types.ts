export interface User {
  id: string;
  username: string;
  name: string;
  role: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  username?: string;
  password?: string;
}
