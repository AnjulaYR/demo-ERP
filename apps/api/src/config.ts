import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: Number(process.env['API_PORT'] ?? 3000),
  databaseUrl:
    process.env['DATABASE_URL'] ??
    'postgres://demo_erp:demo_erp_password@localhost:5432/demo_erp',
  corsOrigin: process.env['CORS_ORIGIN'] ?? 'http://localhost:4200',
  demoOrganizationId:
    process.env['DEMO_ORGANIZATION_ID'] ?? '00000000-0000-0000-0000-000000000001',
};

