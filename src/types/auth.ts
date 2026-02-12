// Типы для авторизации

export interface User {
  email: string;
  username: string;
  _id: number;
}

export interface SignUpRequest {
  email: string;
  password: string;
  username: string;
}

export interface SignUpResponse {
  message: string;
  result: User;
  success: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse extends User {}

export interface TokenRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  refresh: string;
  access: string;
}

export interface RefreshTokenRequest {
  refresh: string;
}

export interface RefreshTokenResponse {
  access: string;
}

export interface ApiError {
  message?: string;
  detail?: string;
  code?: string;
  [key: string]: unknown;
}
