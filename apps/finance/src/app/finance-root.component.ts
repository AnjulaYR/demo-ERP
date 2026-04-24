import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'erp-finance-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
export class FinanceRootComponent {}

