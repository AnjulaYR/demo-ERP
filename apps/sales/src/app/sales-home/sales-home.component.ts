import { Component } from '@angular/core';

const records = [
  { id: 'SO-5001', name: 'Acme Q2 replenishment', status: 'Confirmed', owner: 'Liam Brooks' },
  { id: 'Q-1044', name: 'Blue Harbor quote', status: 'Draft', owner: 'Ivy Morgan' },
  { id: 'INV-9001', name: 'April invoice batch', status: 'Issued', owner: 'Mason Lee' },
];

@Component({
  selector: 'erp-sales-home',
  standalone: true,
  templateUrl: './sales-home.component.html',
  styleUrl: './sales-home.component.scss',
})
export class SalesHomeComponent {
  protected readonly records = records;
}

