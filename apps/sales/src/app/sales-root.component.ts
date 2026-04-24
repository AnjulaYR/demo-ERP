import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'erp-sales-root',
  standalone: true,
  imports: [RouterOutlet],
  template: '<router-outlet />',
})
export class SalesRootComponent {}

