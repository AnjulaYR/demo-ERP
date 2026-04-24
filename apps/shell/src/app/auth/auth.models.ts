export interface DemoUser {
  id: string;
  username: string;
  displayName: string;
  role: string;
  permissions: string[];
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthProvider {
  login(credentials: LoginCredentials): Promise<DemoUser>;
  logout(): Promise<void>;
  getCurrentUser(): DemoUser | null;
}

