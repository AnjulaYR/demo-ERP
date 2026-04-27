import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErpProductDto, ProductsDataService } from '@erp/shared/api-client';

@Component({
  selector: 'erp-inventory-home',
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule],
  templateUrl: './inventory-home.component.html',
  styleUrl: './inventory-home.component.scss',
})
export class InventoryHomeComponent implements OnInit {
  private readonly products = inject(ProductsDataService);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly state$ = this.products.state$;
  protected editingRecord: ErpProductDto | null = null;

  protected readonly form = this.formBuilder.nonNullable.group({
    sku: ['', [Validators.required, Validators.maxLength(32)]],
    name: ['', [Validators.required, Validators.maxLength(120)]],
    description: [''],
    reorderPoint: ['0', [Validators.required]],
  });

  ngOnInit(): void {
    this.products.load().subscribe();
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue();
    const request = this.editingRecord
      ? this.products.update(this.editingRecord.id, payload)
      : this.products.create(payload);

    request.subscribe((record) => {
      if (record) {
        this.resetForm();
      }
    });
  }

  protected edit(record: ErpProductDto): void {
    this.editingRecord = record;
    this.form.setValue({
      sku: record.sku,
      name: record.name,
      description: record.description ?? '',
      reorderPoint: record.reorderPoint,
    });
  }

  protected delete(record: ErpProductDto): void {
    this.products.delete(record.id).subscribe(() => {
      if (this.editingRecord?.id === record.id) {
        this.resetForm();
      }
    });
  }

  protected resetForm(): void {
    this.editingRecord = null;
    this.form.reset({
      sku: '',
      name: '',
      description: '',
      reorderPoint: '0',
    });
  }
}
