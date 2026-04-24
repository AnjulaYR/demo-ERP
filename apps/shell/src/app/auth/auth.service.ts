import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';

import { DemoUser, LoginCredentials } from './auth.models';
import { MockAuthProvider } from './mock-auth.provider';

const storageKey = 'demo-erp-auth-user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly router = inject(Router);
  private readonly provider = inject(MockAuthProvider);
  private readonly userSignal = signal<DemoUser | null>(this.readStoredUser());

  readonly user = this.userSignal.asReadonly();
  readonly isAuthenticated = computed(() => this.userSignal() !== null);

  async login(credentials: LoginCredentials): Promise<void> {
    const user = await this.provider.login(credentials);
    this.userSignal.set(user);
    localStorage.setItem(storageKey, JSON.stringify(user));
  }

  async logout(): Promise<void> {
    await this.provider.logout();
    this.userSignal.set(null);
    localStorage.removeItem(storageKey);
    await this.router.navigate(['/login']);
  }

  private readStoredUser(): DemoUser | null {
    const rawUser = localStorage.getItem(storageKey);

    if (!rawUser) {
      return null;
    }

    try {
      return JSON.parse(rawUser) as DemoUser;
    } catch {
      localStorage.removeItem(storageKey);
      return null;
    }
  }
}

