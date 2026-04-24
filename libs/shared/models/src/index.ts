export type EntityStatus = 'draft' | 'active' | 'review' | 'archived';

export interface AuditableEntity {
  id: string;
  createdAt: string;
  updatedAt: string;
  status: EntityStatus;
}

export interface Customer extends AuditableEntity {
  name: string;
  type: 'customer' | 'supplier';
  primaryContact?: string;
}

export interface Product extends AuditableEntity {
  sku: string;
  name: string;
  quantityOnHand: number;
  reorderPoint: number;
}

export interface SalesOrder extends AuditableEntity {
  orderNumber: string;
  customerId: string;
  totalAmount: number;
}

export interface JournalEntry extends AuditableEntity {
  journalNumber: string;
  description: string;
  amount: number;
}

