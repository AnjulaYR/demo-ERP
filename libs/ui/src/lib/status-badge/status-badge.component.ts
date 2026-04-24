import { Component, input } from '@angular/core';

@Component({
  selector: 'erp-status-badge',
  standalone: true,
  template: `<span class="badge">{{ label() }}</span>`,
  styles: `
    .badge {
      display: inline-flex;
      border-radius: var(--erp-radius-pill);
      background: var(--erp-color-success-subtle);
      color: var(--erp-color-success-strong);
      font-size: 0.85rem;
      font-weight: 800;
      padding: var(--erp-space-1) var(--erp-space-2);
    }
  `,
})
export class ErpStatusBadgeComponent {
  readonly label = input.required<string>();
}

