import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import type { RemoteAppNavItem } from '@erp/shared/shell-contract';
import { AuthService } from './auth/auth.service';

const navItems: RemoteAppNavItem[] = [
  { label: 'Dashboard', routePath: '/', icon: 'grid' },
  { label: 'Customers', routePath: '/customers', icon: 'users' },
  { label: 'Inventory', routePath: '/inventory', icon: 'boxes' },
  { label: 'Sales', routePath: '/sales', icon: 'receipt' },
  { label: 'Finance', routePath: '/finance', icon: 'coins' },
];

@Component({
  selector: 'erp-root',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  constructor(protected readonly authService: AuthService) {}

  protected readonly navItems = navItems;

  protected logout(): Promise<void> {
    return this.authService.logout();
  }
}
