import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

export interface ApiCollectionResponse<T> {
  data: T[];
}

export interface ApiItemResponse<T> {
  data: T;
}

export interface ErpCustomerDto {
  id: string;
  code: string;
  name: string;
  partyType: 'customer' | 'supplier';
  status: string;
  createdAt: string;
  updatedAt: string;
}

export interface ErpProductDto {
  id: string;
  sku: string;
  name: string;
  description?: string;
  unitOfMeasure: string;
  reorderPoint: string;
  quantityOnHand: string;
  status: string;
}

@Injectable({ providedIn: 'root' })
export class ErpApiClient {
  private readonly http = inject(HttpClient);

  getCustomers() {
    return this.http.get<ApiCollectionResponse<ErpCustomerDto>>('/api/customers');
  }

  createCustomer(payload: Pick<ErpCustomerDto, 'code' | 'name' | 'partyType'>) {
    return this.http.post<ApiItemResponse<ErpCustomerDto>>('/api/customers', payload);
  }

  getProducts() {
    return this.http.get<ApiCollectionResponse<ErpProductDto>>('/api/products');
  }
}
