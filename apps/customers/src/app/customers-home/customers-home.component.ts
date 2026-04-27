import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  CustomersDataService,
  ErpCustomerDto,
} from '@erp/shared/api-client';

@Component({
  selector: 'erp-customers-home',
  standalone: true,
  imports: [AsyncPipe, ReactiveFormsModule],
  templateUrl: './customers-home.component.html',
  styleUrl: './customers-home.component.scss',
})
export class CustomersHomeComponent implements OnInit {
  private readonly customers = inject(CustomersDataService);
  private readonly formBuilder = inject(FormBuilder);

  protected readonly state$ = this.customers.state$;
  protected editingRecord: ErpCustomerDto | null = null;

  protected readonly form = this.formBuilder.nonNullable.group({
    code: ['', [Validators.required, Validators.maxLength(32)]],
    name: ['', [Validators.required, Validators.maxLength(120)]],
    partyType: this.formBuilder.nonNullable.control<'customer' | 'supplier'>('customer', {
      validators: [Validators.required],
    }),
  });

  ngOnInit(): void {
    this.customers.load().subscribe();
  }

  protected save(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const payload = this.form.getRawValue();
    const request = this.editingRecord
      ? this.customers.update(this.editingRecord.id, payload)
      : this.customers.create(payload);

    request.subscribe((record) => {
      if (record) {
        this.resetForm();
      }
    });
  }

  protected edit(record: ErpCustomerDto): void {
    this.editingRecord = record;
    this.form.setValue({
      code: record.code,
      name: record.name,
      partyType: record.partyType,
    });
  }

  protected delete(record: ErpCustomerDto): void {
    this.customers.delete(record.id).subscribe(() => {
      if (this.editingRecord?.id === record.id) {
        this.resetForm();
      }
    });
  }

  protected resetForm(): void {
    this.editingRecord = null;
    this.form.reset({
      code: '',
      name: '',
      partyType: 'customer',
    });
  }
}
