export interface LoginRequestDto {
  username: string;
  password: string;
}

export interface AuthResponseDto {
  token: string;
  refreshToken: string;
  type: string;
  username: string;
  fullName: string;
  email: string;
  roles: string[];
}

export interface RefreshTokenRequestDto {
  refreshToken: string;
}

export interface UserResponseDto {
  id: number;
  username: string;
  fullName: string;
  email: string;
  enabled: boolean;
  roles: string[];
  createdAt: string;
}

export interface ApiResponseDto<T> {
  success: boolean;
  message: string;
  data: T;
}