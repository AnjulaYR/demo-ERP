import { Component } from '@angular/core';

const records = [
  { id: 'COA-100', name: 'Operating revenue', status: 'Active', owner: 'Chart of accounts' },
  { id: 'PAY-320', name: 'Supplier payment run', status: 'Scheduled', owner: 'Accounts payable' },
  { id: 'JE-804', name: 'Month-end accruals', status: 'Draft', owner: 'General ledger' },
];

@Component({
  selector: 'erp-finance-home',
  standalone: true,
  templateUrl: './finance-home.component.html',
  styleUrl: './finance-home.component.scss',
})
export class FinanceHomeComponent {
  protected readonly records = records;
}

