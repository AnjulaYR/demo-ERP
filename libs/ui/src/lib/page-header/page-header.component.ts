import { Component, input } from '@angular/core';

@Component({
  selector: 'erp-page-header',
  standalone: true,
  template: `
    <section class="page-header">
      <p class="eyebrow">{{ eyebrow() }}</p>
      <h1>{{ title() }}</h1>
      <p>{{ description() }}</p>
      <ng-content />
    </section>
  `,
  styles: `
    .page-header {
      padding: var(--erp-space-6);
      border-radius: var(--erp-radius-xl);
      background: var(--erp-color-surface-panel);
      box-shadow: var(--erp-shadow-md);
    }

    .eyebrow {
      color: var(--erp-color-brand-600);
      font-weight: 800;
      letter-spacing: 0.12em;
      text-transform: uppercase;
    }

    h1 {
      margin: 0;
      font-size: clamp(2rem, 4vw, 3.5rem);
    }
  `,
})
export class ErpPageHeaderComponent {
  readonly eyebrow = input.required<string>();
  readonly title = input.required<string>();
  readonly description = input('');
}

