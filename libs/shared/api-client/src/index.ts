import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, catchError, finalize, map, Observable, of, OperatorFunction, tap } from 'rxjs';

export interface ApiCollectionResponse<T> {
  data: T[];
}

export interface ApiItemResponse<T> {
  data: T;
}

export interface ResourceState<T> {
  items: T[];
  loading: boolean;
  error: string | null;
}

export interface CrudResource<T, TCreate, TUpdate = Partial<TCreate>> {
  list(): Observable<T[]>;
  create(payload: TCreate): Observable<T>;
  update(id: string, payload: TUpdate): Observable<T>;
  delete(id: string): Observable<void>;
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

export type CreateCustomerPayload = Pick<ErpCustomerDto, 'code' | 'name' | 'partyType'> & {
  taxIdentifier?: string;
};

export type UpdateCustomerPayload = Partial<CreateCustomerPayload> & {
  status?: string;
};

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

export type CreateProductPayload = Pick<ErpProductDto, 'sku' | 'name'> &
  Partial<Pick<ErpProductDto, 'description' | 'unitOfMeasure' | 'reorderPoint'>>;

export type UpdateProductPayload = Partial<CreateProductPayload> & {
  status?: string;
};

export interface ErpSalesOrderDto {
  id: string;
  orderNumber: string;
  orderDate: string;
  status: string;
  totalAmount: string;
  customerName: string;
}

export interface ErpAccountDto {
  id: string;
  accountCode: string;
  accountName: string;
  accountType: 'asset' | 'liability' | 'equity' | 'revenue' | 'expense';
  parentAccountId?: string;
  status: string;
}

export class HttpCrudResource<T, TCreate, TUpdate = Partial<TCreate>>
  implements CrudResource<T, TCreate, TUpdate>
{
  constructor(
    private readonly http: HttpClient,
    private readonly endpoint: string,
  ) {}

  list(): Observable<T[]> {
    return this.http.get<ApiCollectionResponse<T>>(this.endpoint).pipe(map((response) => response.data));
  }

  create(payload: TCreate): Observable<T> {
    return this.http.post<ApiItemResponse<T>>(this.endpoint, payload).pipe(map((response) => response.data));
  }

  update(id: string, payload: TUpdate): Observable<T> {
    return this.http
      .put<ApiItemResponse<T>>(`${this.endpoint}/${id}`, payload)
      .pipe(map((response) => response.data));
  }

  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`);
  }
}

export abstract class ResourceStore<T, TCreate, TUpdate = Partial<TCreate>> {
  private readonly stateSubject = new BehaviorSubject<ResourceState<T>>({
    items: [],
    loading: false,
    error: null,
  });

  readonly state$ = this.stateSubject.asObservable();

  protected constructor(private readonly resource: CrudResource<T, TCreate, TUpdate>) {}

  load(): Observable<T[]> {
    this.patchState({ loading: true, error: null });

    return this.resource.list().pipe(
      tap((items) => this.patchState({ items })),
      this.handleFailure<T[], T[]>('Unable to load records', []),
      finalize(() => this.patchState({ loading: false })),
    );
  }

  create(payload: TCreate): Observable<T | null> {
    this.patchState({ loading: true, error: null });

    return this.resource.create(payload).pipe(
      tap((item) => this.patchState({ items: [item, ...this.stateSubject.value.items] })),
      this.handleFailure<T, null>('Unable to create record', null),
      finalize(() => this.patchState({ loading: false })),
    );
  }

  update(id: string, payload: TUpdate): Observable<T | null> {
    this.patchState({ loading: true, error: null });

    return this.resource.update(id, payload).pipe(
      tap((updatedItem) => {
        const items = this.stateSubject.value.items.map((item) =>
          this.getId(item) === id ? updatedItem : item,
        );

        this.patchState({ items });
      }),
      this.handleFailure<T, null>('Unable to update record', null),
      finalize(() => this.patchState({ loading: false })),
    );
  }

  delete(id: string): Observable<void | null> {
    this.patchState({ loading: true, error: null });

    return this.resource.delete(id).pipe(
      tap(() => {
        const items = this.stateSubject.value.items.filter((item) => this.getId(item) !== id);
        this.patchState({ items });
      }),
      this.handleFailure<void, null>('Unable to delete record', null),
      finalize(() => this.patchState({ loading: false })),
    );
  }

  protected getId(item: T): string {
    return (item as { id: string }).id;
  }

  private patchState(patch: Partial<ResourceState<T>>): void {
    this.stateSubject.next({ ...this.stateSubject.value, ...patch });
  }

  private handleFailure<TInput, TFallback>(
    message: string,
    fallback: TFallback,
  ): OperatorFunction<TInput, TInput | TFallback> {
    return catchError(() => {
      this.patchState({ error: message });
      return of(fallback);
    });
  }
}

@Injectable({ providedIn: 'root' })
export class CustomersDataService extends ResourceStore<
  ErpCustomerDto,
  CreateCustomerPayload,
  UpdateCustomerPayload
> {
  constructor() {
    super(
      new HttpCrudResource<ErpCustomerDto, CreateCustomerPayload, UpdateCustomerPayload>(
        inject(HttpClient),
        '/api/customers',
      ),
    );
  }
}

@Injectable({ providedIn: 'root' })
export class ProductsDataService extends ResourceStore<
  ErpProductDto,
  CreateProductPayload,
  UpdateProductPayload
> {
  constructor() {
    super(
      new HttpCrudResource<ErpProductDto, CreateProductPayload, UpdateProductPayload>(
        inject(HttpClient),
        '/api/products',
      ),
    );
  }
}

@Injectable({ providedIn: 'root' })
export class ErpApiClient {
  private readonly http = inject(HttpClient);

  readonly customers = new HttpCrudResource<ErpCustomerDto, CreateCustomerPayload, UpdateCustomerPayload>(
    this.http,
    '/api/customers',
  );

  readonly products = new HttpCrudResource<ErpProductDto, CreateProductPayload, UpdateProductPayload>(
    this.http,
    '/api/products',
  );

  getSalesOrders() {
    return this.http.get<ApiCollectionResponse<ErpSalesOrderDto>>('/api/sales-orders');
  }

  getAccounts() {
    return this.http.get<ApiCollectionResponse<ErpAccountDto>>('/api/accounts');
  }
}
