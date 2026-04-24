CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE EXTENSION IF NOT EXISTS citext;

CREATE SCHEMA IF NOT EXISTS auth;
CREATE SCHEMA IF NOT EXISTS erp;

CREATE TYPE auth.user_status AS ENUM ('invited', 'active', 'locked', 'disabled');
CREATE TYPE erp.record_status AS ENUM ('draft', 'active', 'review', 'archived');
CREATE TYPE erp.party_type AS ENUM ('customer', 'supplier', 'employee', 'partner');
CREATE TYPE erp.stock_movement_type AS ENUM ('receipt', 'issue', 'transfer', 'adjustment');
CREATE TYPE erp.document_status AS ENUM ('draft', 'submitted', 'approved', 'fulfilled', 'cancelled');
CREATE TYPE erp.account_type AS ENUM ('asset', 'liability', 'equity', 'revenue', 'expense');

CREATE TABLE erp.organizations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  legal_name TEXT,
  tax_identifier TEXT,
  status erp.record_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE erp.business_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES erp.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  status erp.record_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, code)
);

CREATE TABLE auth.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES erp.organizations(id) ON DELETE CASCADE,
  email CITEXT UNIQUE,
  display_name TEXT NOT NULL,
  password_hash TEXT,
  status auth.user_status NOT NULL DEFAULT 'invited',
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE auth.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES erp.organizations(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, name)
);

CREATE TABLE auth.permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  description TEXT
);

CREATE TABLE auth.user_roles (
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES auth.roles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, role_id)
);

CREATE TABLE auth.role_permissions (
  role_id UUID NOT NULL REFERENCES auth.roles(id) ON DELETE CASCADE,
  permission_id UUID NOT NULL REFERENCES auth.permissions(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (role_id, permission_id)
);

CREATE TABLE auth.sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  refresh_token_hash TEXT NOT NULL,
  expires_at TIMESTAMPTZ NOT NULL,
  revoked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE erp.parties (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES erp.organizations(id) ON DELETE CASCADE,
  party_type erp.party_type NOT NULL,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  tax_identifier TEXT,
  status erp.record_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, code)
);

CREATE TABLE erp.party_contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  party_id UUID NOT NULL REFERENCES erp.parties(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email CITEXT,
  phone TEXT,
  role_title TEXT,
  is_primary BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE erp.addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  line1 TEXT NOT NULL,
  line2 TEXT,
  city TEXT NOT NULL,
  state TEXT,
  postal_code TEXT,
  country TEXT NOT NULL DEFAULT 'Australia',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE erp.party_addresses (
  party_id UUID NOT NULL REFERENCES erp.parties(id) ON DELETE CASCADE,
  address_id UUID NOT NULL REFERENCES erp.addresses(id) ON DELETE CASCADE,
  address_type TEXT NOT NULL DEFAULT 'billing',
  is_primary BOOLEAN NOT NULL DEFAULT false,
  PRIMARY KEY (party_id, address_id, address_type)
);

CREATE TABLE erp.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES erp.organizations(id) ON DELETE CASCADE,
  sku TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  unit_of_measure TEXT NOT NULL DEFAULT 'each',
  reorder_point NUMERIC(12, 2) NOT NULL DEFAULT 0,
  status erp.record_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, sku)
);

CREATE TABLE erp.warehouses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES erp.organizations(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  status erp.record_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, code)
);

CREATE TABLE erp.inventory_balances (
  product_id UUID NOT NULL REFERENCES erp.products(id) ON DELETE CASCADE,
  warehouse_id UUID NOT NULL REFERENCES erp.warehouses(id) ON DELETE CASCADE,
  quantity_on_hand NUMERIC(12, 2) NOT NULL DEFAULT 0,
  quantity_reserved NUMERIC(12, 2) NOT NULL DEFAULT 0,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (product_id, warehouse_id)
);

CREATE TABLE erp.stock_movements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES erp.organizations(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES erp.products(id),
  from_warehouse_id UUID REFERENCES erp.warehouses(id),
  to_warehouse_id UUID REFERENCES erp.warehouses(id),
  movement_type erp.stock_movement_type NOT NULL,
  quantity NUMERIC(12, 2) NOT NULL,
  reference TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE erp.sales_orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES erp.organizations(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES erp.parties(id),
  order_number TEXT NOT NULL,
  order_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status erp.document_status NOT NULL DEFAULT 'draft',
  total_amount NUMERIC(14, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, order_number)
);

CREATE TABLE erp.sales_order_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  sales_order_id UUID NOT NULL REFERENCES erp.sales_orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES erp.products(id),
  description TEXT NOT NULL,
  quantity NUMERIC(12, 2) NOT NULL,
  unit_price NUMERIC(14, 2) NOT NULL,
  line_total NUMERIC(14, 2) GENERATED ALWAYS AS (quantity * unit_price) STORED
);

CREATE TABLE erp.invoices (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES erp.organizations(id) ON DELETE CASCADE,
  customer_id UUID NOT NULL REFERENCES erp.parties(id),
  sales_order_id UUID REFERENCES erp.sales_orders(id),
  invoice_number TEXT NOT NULL,
  invoice_date DATE NOT NULL DEFAULT CURRENT_DATE,
  due_date DATE,
  status erp.document_status NOT NULL DEFAULT 'draft',
  total_amount NUMERIC(14, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, invoice_number)
);

CREATE TABLE erp.chart_of_accounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES erp.organizations(id) ON DELETE CASCADE,
  account_code TEXT NOT NULL,
  account_name TEXT NOT NULL,
  account_type erp.account_type NOT NULL,
  parent_account_id UUID REFERENCES erp.chart_of_accounts(id),
  status erp.record_status NOT NULL DEFAULT 'active',
  UNIQUE (organization_id, account_code)
);

CREATE TABLE erp.journal_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES erp.organizations(id) ON DELETE CASCADE,
  journal_number TEXT NOT NULL,
  entry_date DATE NOT NULL DEFAULT CURRENT_DATE,
  description TEXT NOT NULL,
  status erp.document_status NOT NULL DEFAULT 'draft',
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, journal_number)
);

CREATE TABLE erp.journal_lines (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  journal_entry_id UUID NOT NULL REFERENCES erp.journal_entries(id) ON DELETE CASCADE,
  account_id UUID NOT NULL REFERENCES erp.chart_of_accounts(id),
  debit_amount NUMERIC(14, 2) NOT NULL DEFAULT 0,
  credit_amount NUMERIC(14, 2) NOT NULL DEFAULT 0,
  memo TEXT
);

CREATE TABLE erp.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID NOT NULL REFERENCES erp.organizations(id) ON DELETE CASCADE,
  party_id UUID NOT NULL REFERENCES erp.parties(id),
  payment_number TEXT NOT NULL,
  payment_date DATE NOT NULL DEFAULT CURRENT_DATE,
  amount NUMERIC(14, 2) NOT NULL,
  method TEXT NOT NULL DEFAULT 'bank_transfer',
  status erp.document_status NOT NULL DEFAULT 'draft',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (organization_id, payment_number)
);

CREATE TABLE erp.audit_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  organization_id UUID REFERENCES erp.organizations(id) ON DELETE SET NULL,
  actor_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  entity_schema TEXT NOT NULL,
  entity_table TEXT NOT NULL,
  entity_id UUID,
  action TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_parties_org_type ON erp.parties (organization_id, party_type);
CREATE INDEX idx_products_org_status ON erp.products (organization_id, status);
CREATE INDEX idx_sales_orders_org_status ON erp.sales_orders (organization_id, status);
CREATE INDEX idx_stock_movements_org_created ON erp.stock_movements (organization_id, created_at DESC);
CREATE INDEX idx_audit_events_entity ON erp.audit_events (entity_schema, entity_table, entity_id);
