# API Documentation

## Authentication
1. POST /api/auth/register-tenant - Register new tenant
2. POST /api/auth/login - User login
3. GET /api/auth/me - Get current user
4. POST /api/auth/logout - Logout

## Tenant Management
5. GET /api/tenants/:tenantId - Get tenant details
6. PUT /api/tenants/:tenantId - Update tenant
7. GET /api/tenants - List all tenants (super_admin only)

## User Management
8. POST /api/tenants/:tenantId/users - Add user
9. GET /api/tenants/:tenantId/users - List tenant users
10. PUT /api/users/:userId - Update user
11. DELETE /api/users/:userId - Delete user

## Project Management
12. POST /api/projects - Create project
13. GET /api/projects - List projects
14. PUT /api/projects/:projectId - Update project
15. DELETE /api/projects/:projectId - Delete project

## Task Management
16. POST /api/tasks - Create task
17. GET /api/tasks - List tasks (with projectId query param)
18. PATCH /api/tasks/:id/status - Update task status
19. PUT /api/tasks/:id - Update task
20. DELETE /api/tasks/:id - Delete task
