import { Component } from '@angular/core';

const records = [
  { id: 'CUS-1001', name: 'Acme Manufacturing', status: 'Active', owner: 'Ava Singh' },
  { id: 'CUS-1002', name: 'Blue Harbor Supplies', status: 'Review', owner: 'Noah Chen' },
  { id: 'SUP-2001', name: 'Northline Logistics', status: 'Active', owner: 'Mia Patel' },
];

@Component({
  selector: 'erp-customers-home',
  standalone: true,
  templateUrl: './customers-home.component.html',
  styleUrl: './customers-home.component.scss',
})
export class CustomersHomeComponent {
  protected readonly records = records;
}

