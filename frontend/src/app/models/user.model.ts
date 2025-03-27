export interface User {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  role?: string;
  token?: string;
}

export interface AuthResponse {
  _id: string;
  name: string;
  email: string;
  role: string;
  token: string;
} 