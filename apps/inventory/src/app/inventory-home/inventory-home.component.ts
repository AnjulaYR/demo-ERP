import { Component } from '@angular/core';

const records = [
  { id: 'SKU-001', name: 'Industrial Bearing', status: 'In stock', owner: 'Warehouse A' },
  { id: 'SKU-018', name: 'Copper Valve Kit', status: 'Low stock', owner: 'Warehouse B' },
  { id: 'TRF-440', name: 'Stock transfer', status: 'Pending', owner: 'Sydney DC' },
];

@Component({
  selector: 'erp-inventory-home',
  standalone: true,
  templateUrl: './inventory-home.component.html',
  styleUrl: './inventory-home.component.scss',
})
export class InventoryHomeComponent {
  protected readonly records = records;
}

