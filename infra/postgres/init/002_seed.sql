INSERT INTO erp.organizations (id, name, legal_name, tax_identifier)
VALUES ('00000000-0000-0000-0000-000000000001', 'Northwind Works', 'Northwind Works Pty Ltd', 'ABN-DEMO-001')
ON CONFLICT DO NOTHING;

INSERT INTO erp.business_units (organization_id, name, code)
VALUES ('00000000-0000-0000-0000-000000000001', 'Sydney Operations', 'SYD')
ON CONFLICT DO NOTHING;

INSERT INTO auth.permissions (code, description)
VALUES
  ('customers.read', 'View customers and suppliers'),
  ('customers.write', 'Create and update customers and suppliers'),
  ('inventory.read', 'View products, warehouses, and stock'),
  ('inventory.write', 'Create and update inventory data'),
  ('sales.read', 'View sales documents'),
  ('sales.write', 'Create and update sales documents'),
  ('finance.read', 'View finance records'),
  ('finance.write', 'Create and update finance records'),
  ('admin.manage', 'Manage users, roles, and settings')
ON CONFLICT DO NOTHING;

INSERT INTO auth.roles (id, organization_id, name, description)
VALUES
  ('00000000-0000-0000-0000-000000000101', '00000000-0000-0000-0000-000000000001', 'Administrator', 'Full demo ERP access'),
  ('00000000-0000-0000-0000-000000000102', '00000000-0000-0000-0000-000000000001', 'Operations User', 'Customer, inventory, and sales access')
ON CONFLICT DO NOTHING;

INSERT INTO auth.users (id, organization_id, email, display_name, status)
VALUES ('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000001', 'admin@demo-erp.local', 'Demo Admin', 'active')
ON CONFLICT DO NOTHING;

INSERT INTO auth.user_roles (user_id, role_id)
VALUES ('00000000-0000-0000-0000-000000000201', '00000000-0000-0000-0000-000000000101')
ON CONFLICT DO NOTHING;

INSERT INTO auth.role_permissions (role_id, permission_id)
SELECT '00000000-0000-0000-0000-000000000101', id FROM auth.permissions
ON CONFLICT DO NOTHING;

INSERT INTO erp.parties (id, organization_id, party_type, code, name, status)
VALUES
  ('00000000-0000-0000-0000-000000001001', '00000000-0000-0000-0000-000000000001', 'customer', 'CUS-1001', 'Acme Manufacturing', 'active'),
  ('00000000-0000-0000-0000-000000001002', '00000000-0000-0000-0000-000000000001', 'customer', 'CUS-1002', 'Blue Harbor Supplies', 'review'),
  ('00000000-0000-0000-0000-000000001003', '00000000-0000-0000-0000-000000000001', 'supplier', 'SUP-2001', 'Northline Logistics', 'active')
ON CONFLICT DO NOTHING;

INSERT INTO erp.products (id, organization_id, sku, name, description, reorder_point)
VALUES
  ('00000000-0000-0000-0000-000000002001', '00000000-0000-0000-0000-000000000001', 'SKU-001', 'Industrial Bearing', 'High-load replacement bearing', 25),
  ('00000000-0000-0000-0000-000000002002', '00000000-0000-0000-0000-000000000001', 'SKU-018', 'Copper Valve Kit', 'Valve kit for maintenance orders', 40)
ON CONFLICT DO NOTHING;

INSERT INTO erp.warehouses (id, organization_id, code, name)
VALUES
  ('00000000-0000-0000-0000-000000003001', '00000000-0000-0000-0000-000000000001', 'SYD-A', 'Sydney Warehouse A'),
  ('00000000-0000-0000-0000-000000003002', '00000000-0000-0000-0000-000000000001', 'SYD-B', 'Sydney Warehouse B')
ON CONFLICT DO NOTHING;

INSERT INTO erp.inventory_balances (product_id, warehouse_id, quantity_on_hand, quantity_reserved)
VALUES
  ('00000000-0000-0000-0000-000000002001', '00000000-0000-0000-0000-000000003001', 128, 14),
  ('00000000-0000-0000-0000-000000002002', '00000000-0000-0000-0000-000000003002', 18, 6)
ON CONFLICT DO NOTHING;

INSERT INTO erp.sales_orders (id, organization_id, customer_id, order_number, status, total_amount)
VALUES ('00000000-0000-0000-0000-000000004001', '00000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000001001', 'SO-5001', 'approved', 4200)
ON CONFLICT DO NOTHING;

INSERT INTO erp.chart_of_accounts (id, organization_id, account_code, account_name, account_type)
VALUES
  ('00000000-0000-0000-0000-000000005001', '00000000-0000-0000-0000-000000000001', '1000', 'Cash at Bank', 'asset'),
  ('00000000-0000-0000-0000-000000005002', '00000000-0000-0000-0000-000000000001', '4000', 'Operating Revenue', 'revenue'),
  ('00000000-0000-0000-0000-000000005003', '00000000-0000-0000-0000-000000000001', '5000', 'Cost of Goods Sold', 'expense')
ON CONFLICT DO NOTHING;

