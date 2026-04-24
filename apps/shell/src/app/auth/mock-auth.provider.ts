import { Injectable } from '@angular/core';

import { AuthProvider, DemoUser, LoginCredentials } from './auth.models';

const demoUsers: Array<DemoUser & { password: string }> = [
  {
    id: 'demo-admin',
    username: 'admin',
    password: 'admin123',
    displayName: 'Demo Admin',
    role: 'Administrator',
    permissions: ['admin.manage', 'customers.write', 'inventory.write', 'sales.write', 'finance.write'],
  },
  {
    id: 'operations-user',
    username: 'operations',
    password: 'ops123',
    displayName: 'Operations User',
    role: 'Operations',
    permissions: ['customers.read', 'inventory.read', 'sales.read'],
  },
];

@Injectable({ providedIn: 'root' })
export class MockAuthProvider implements AuthProvider {
  async login(credentials: LoginCredentials): Promise<DemoUser> {
    const normalizedUsername = credentials.username.trim().toLowerCase();
    const user = demoUsers.find(
      (candidate) =>
        candidate.username === normalizedUsername && candidate.password === credentials.password,
    );

    if (!user) {
      throw new Error('Invalid username or password.');
    }

    const { password: _password, ...safeUser } = user;
    return safeUser;
  }

  async logout(): Promise<void> {
    return Promise.resolve();
  }

  getCurrentUser(): DemoUser | null {
    return null;
  }
}

