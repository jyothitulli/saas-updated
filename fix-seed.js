const bcrypt = require('bcrypt');
const { exec } = require('child_process');

async function fixSeed() {
  // Generate real bcrypt hashes
  const demoHash = await bcrypt.hash('Demo@123', 10);
  const userHash = await bcrypt.hash('User@123', 10);
  
  console.log('Demo@123 hash:', demoHash);
  console.log('User@123 hash:', userHash);
  
  // SQL with REAL hashes
  const sql = `
-- Insert demo tenant
INSERT INTO tenants (id, name, subdomain, status, subscription_plan, max_users, max_projects, created_at, updated_at)
SELECT '22222222-2222-2222-2222-222222222222', 'Demo Company', 'demo', 'active', 'pro', 25, 15, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM tenants WHERE subdomain = 'demo');

-- Insert demo admin with REAL hash
INSERT INTO users (id, email, password_hash, full_name, role, tenant_id, is_active, created_at, updated_at)
SELECT 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', 'admin@demo.com', '${demoHash}', 'Demo Admin', 'tenant_admin', '22222222-2222-2222-2222-222222222222', true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@demo.com');

-- Insert demo users with REAL hash
INSERT INTO users (id, email, password_hash, full_name, role, tenant_id, is_active, created_at, updated_at)
SELECT 'cccccccc-cccc-cccc-cccc-cccccccccccc', 'user1@demo.com', '${userHash}', 'User One', 'user', '22222222-2222-2222-2222-222222222222', true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'user1@demo.com');

INSERT INTO users (id, email, password_hash, full_name, role, tenant_id, is_active, created_at, updated_at)
SELECT 'dddddddd-dddd-dddd-dddd-dddddddddddd', 'user2@demo.com', '${userHash}', 'User Two', 'user', '22222222-2222-2222-2222-222222222222', true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'user2@demo.com');
  `;
  
  // Save SQL to file
  require('fs').writeFileSync('fix-seed.sql', sql);
  console.log('✅ fix-seed.sql created');
  
  // Copy and execute in container
  exec('docker cp fix-seed.sql database:/fix-seed.sql', (err) => {
    if (err) {
      console.error('Copy failed:', err);
      return;
    }
    console.log('✅ SQL file copied to container');
    
    exec('docker exec -it database psql -U postgres -d saas_db -f /fix-seed.sql', (err, stdout) => {
      console.log(stdout);
      console.log('✅ Seed data inserted');
    });
  });
}

fixSeed();