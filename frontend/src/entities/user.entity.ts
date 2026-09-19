export type UserRole = 'ROLE_ADMIN' | 'ROLE_USER';

export interface User {
  id?: number;
  username: string;
  fullName: string;
  email?: string;
  roles: UserRole[];
  enabled?: boolean;
}

export interface AuthSession {
  token: string;
  user: User;
  isAuthenticated: boolean;
  isAdmin: boolean;
}
