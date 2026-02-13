-- =========================================
-- ENABLE EXTENSIONS
-- =========================================
CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =========================================
-- DROP TABLES (clean slate)
-- =========================================
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS tenants CASCADE;

-- =========================================
-- CREATE TABLES
-- =========================================
CREATE TABLE tenants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  subdomain VARCHAR(100) UNIQUE NOT NULL,
  status VARCHAR(20) DEFAULT 'active',
  subscription_plan VARCHAR(50) DEFAULT 'free',
  max_users INT NOT NULL,
  max_projects INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  email VARCHAR(255) NOT NULL,
  password_hash TEXT NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  UNIQUE(tenant_id, email)
);

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'active',
  created_by UUID,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL,
  tenant_id UUID NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  status VARCHAR(20) DEFAULT 'todo',
  priority VARCHAR(20) DEFAULT 'medium',
  assigned_to UUID,
  due_date DATE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_to) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID,
  user_id UUID,
  action VARCHAR(255) NOT NULL,
  entity_type VARCHAR(50),
  entity_id UUID,
  ip_address VARCHAR(45),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (tenant_id) REFERENCES tenants(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- =========================================
-- CREATE INDEXES
-- =========================================
CREATE INDEX idx_tenants_subdomain ON tenants(subdomain);
CREATE INDEX idx_users_tenant_id ON users(tenant_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_projects_tenant_id ON projects(tenant_id);
CREATE INDEX idx_tasks_tenant_id ON tasks(tenant_id);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);
CREATE INDEX idx_audit_logs_tenant_id ON audit_logs(tenant_id);

-- =========================================
-- SEED DATA
-- =========================================

-- 1. Insert Demo Tenant
INSERT INTO tenants (id, name, subdomain, status, subscription_plan, max_users, max_projects, created_at, updated_at)
VALUES (
  '11111111-1111-1111-1111-111111111111',
  'Demo Organization',
  'demo',
  'active',
  'pro',
  25,
  15,
  NOW(),
  NOW()
);

-- 2. Insert Super Admin (NO tenant_id)
INSERT INTO users (id, email, password_hash, full_name, role, tenant_id, is_active, created_at, updated_at)
VALUES (
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'superadmin@saas.com',
  crypt('Admin@123', gen_salt('bf')),
  'Super Admin',
  'super_admin',
  NULL,
  true,
  NOW(),
  NOW()
);

-- 3. Insert Tenant Admin
INSERT INTO users (id, email, password_hash, full_name, role, tenant_id, is_active, created_at, updated_at)
VALUES (
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'admin@demo.com',
  crypt('Demo@123', gen_salt('bf')),
  'Demo Admin',
  'tenant_admin',
  '11111111-1111-1111-1111-111111111111',
  true,
  NOW(),
  NOW()
);

-- 4. Insert Regular Users
INSERT INTO users (id, email, password_hash, full_name, role, tenant_id, is_active, created_at, updated_at)
VALUES 
(
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  'user1@demo.com',
  crypt('User@123', gen_salt('bf')),
  'User One',
  'user',
  '11111111-1111-1111-1111-111111111111',
  true,
  NOW(),
  NOW()
),
(
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  'user2@demo.com',
  crypt('User@123', gen_salt('bf')),
  'User Two',
  'user',
  '11111111-1111-1111-1111-111111111111',
  true,
  NOW(),
  NOW()
);

-- 5. Insert Projects
INSERT INTO projects (id, tenant_id, name, description, status, created_by, created_at, updated_at)
VALUES 
(
  'e1111111-e111-e111-e111-e11111111111',
  '11111111-1111-1111-1111-111111111111',
  'Project Alpha',
  'First demo project',
  'active',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  NOW(),
  NOW()
),
(
  'e2222222-e222-e222-e222-e22222222222',
  '11111111-1111-1111-1111-111111111111',
  'Project Beta',
  'Second demo project',
  'active',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  NOW(),
  NOW()
);

-- 6. Insert Tasks
INSERT INTO tasks (id, project_id, tenant_id, title, description, status, priority, assigned_to, due_date, created_at, updated_at)
VALUES 
(
  'f1111111-f111-f111-f111-f11111111111',
  'e1111111-e111-e111-e111-e11111111111',
  '11111111-1111-1111-1111-111111111111',
  'Design homepage',
  'Create high-fidelity mockup',
  'todo',
  'high',
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
  NOW() + INTERVAL '7 days',
  NOW(),
  NOW()
),
(
  'f2222222-f222-f222-f222-f22222222222',
  'e1111111-e111-e111-e111-e11111111111',
  '11111111-1111-1111-1111-111111111111',
  'Implement authentication',
  'Add JWT auth',
  'in_progress',
  'high',
  'dddddddd-dddd-dddd-dddd-dddddddddddd',
  NOW() + INTERVAL '3 days',
  NOW(),
  NOW()
);

-- =========================================
-- VERIFICATION QUERIES
-- =========================================
SELECT 'TENANTS' as section, name, subdomain, subscription_plan FROM tenants;
SELECT 'USERS' as section, email, role, 
  CASE WHEN tenant_id IS NULL THEN 'Super Admin' ELSE 'Tenant User' END as type 
FROM users;
SELECT 'PROJECTS' as section, name, status FROM projects;
SELECT 'TASKS' as section, title, status, priority FROM tasks;