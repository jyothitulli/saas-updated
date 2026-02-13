-- =====================================================
-- SEED DATA FOR MULTI-TENANT SAAS APPLICATION
-- =====================================================

-- -------------------------
-- TENANTS
-- -------------------------
INSERT INTO tenants (
    id, name, subdomain, status, subscription_plan, max_users, max_projects
) VALUES (
    '11111111-1111-1111-1111-111111111111',
    'Demo Organization',
    'demo',
    'active',
    'free',
    5,
    3
);

-- -------------------------
-- USERS
-- Password for all users: Password@123
-- bcrypt hash: $2b$10$CwTycUXWue0Thq9StjUM0uJ8v5KZL8AjtKoa6HgMHqYjgJv1nVbW6
-- -------------------------

-- Super Admin
INSERT INTO users (
    id, tenant_id, email, password_hash, role, is_active
) VALUES (
    'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    NULL,
    'superadmin@saas.com',
    '$2b$10$CwTycUXWue0Thq9StjUM0uJ8v5KZL8AjtKoa6HgMHqYjgJv1nVbW6',
    'super_admin',
    true
);

-- Tenant Admin
INSERT INTO users (
    id, tenant_id, email, password_hash, role, is_active
) VALUES (
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    '11111111-1111-1111-1111-111111111111',
    'admin@demo.com',
    '$2b$10$CwTycUXWue0Thq9StjUM0uJ8v5KZL8AjtKoa6HgMHqYjgJv1nVbW6',
    'tenant_admin',
    true
);

-- User 1
INSERT INTO users (
    id, tenant_id, email, password_hash, role, is_active
) VALUES (
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    '11111111-1111-1111-1111-111111111111',
    'user1@demo.com',
    '$2b$10$CwTycUXWue0Thq9StjUM0uJ8v5KZL8AjtKoa6HgMHqYjgJv1nVbW6',
    'user',
    true
);

-- User 2
INSERT INTO users (
    id, tenant_id, email, password_hash, role, is_active
) VALUES (
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    '11111111-1111-1111-1111-111111111111',
    'user2@demo.com',
    '$2b$10$CwTycUXWue0Thq9StjUM0uJ8v5KZL8AjtKoa6HgMHqYjgJv1nVbW6',
    'user',
    true
);

-- -------------------------
-- PROJECTS
-- -------------------------
INSERT INTO projects (
    id, tenant_id, name, description, status, created_by
) VALUES
(
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    '11111111-1111-1111-1111-111111111111',
    'Project Alpha',
    'First demo project',
    'active',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
),
(
    'ffffffff-ffff-ffff-ffff-ffffffffffff',
    '11111111-1111-1111-1111-111111111111',
    'Project Beta',
    'Second demo project',
    'active',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb'
);

-- -------------------------
-- TASKS (5 tasks)
-- -------------------------
INSERT INTO tasks (
    id, project_id, tenant_id, title, description, status, priority, assigned_to, due_date
) VALUES
(
    '1111aaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    '11111111-1111-1111-1111-111111111111',
    'Design UI',
    'Create initial UI designs',
    'todo',
    'high',
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    '2025-01-10'
),
(
    '2222bbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee',
    '11111111-1111-1111-1111-111111111111',
    'Setup Backend',
    'Initialize backend project',
    'in_progress',
    'medium',
    'dddddddd-dddd-dddd-dddd-dddddddddddd',
    '2025-01-12'
),
(
    '3333cccc-cccc-cccc-cccc-cccccccccccc',
    'ffffffff-ffff-ffff-ffff-ffffffffffff',
    '11111111-1111-1111-1111-111111111111',
    'Create APIs',
    'Develop REST APIs',
    'todo',
    'high',
    'cccccccc-cccc-cccc-cccc-cccccccccccc',
    '2025-01-15'
),
(
    '4444dddd-dddd-dddd-dddd-dddddddddddd',
    'ffffffff-ffff-ffff-ffff-ffffffffffff',
    '11111111-1111-1111-1111-111111111111',
    'Write Tests',
    'Add unit tests',
    'todo',
    'low',
    NULL,
    '2025-01-18'
),
(
    '5555eeee-eeee-eeee-eeee-eeeeeeeeeeee',
    'ffffffff-ffff-ffff-ffff-ffffffffffff',
    '11111111-1111-1111-1111-111111111111',
    'Deploy App',
    'Prepare deployment',
    'todo',
    'medium',
    NULL,
    '2025-01-20'
);

-- -------------------------
-- AUDIT LOGS
-- -------------------------
INSERT INTO audit_logs (
    id, tenant_id, user_id, action, entity_type, entity_id
) VALUES
(
    '9999aaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    '11111111-1111-1111-1111-111111111111',
    'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    'CREATE_PROJECT',
    'project',
    'eeeeeeee-eeee-eeee-eeee-eeeeeeeeeeee'
);
