\# API Documentation



All responses follow: { success: boolean, message?: string, data?: any }

Auth uses Authorization: Bearer <jwt>.



\## Health

\- GET /api/health → { status: "ok", database: "connected" }



\## Auth

\- POST /api/auth/register-tenant (public)

&nbsp; - Body: { tenantName, subdomain, adminEmail, adminPassword, adminFullName }

&nbsp; - 201 → data: { tenantId, subdomain, adminUser }

\- POST /api/auth/login (public)

&nbsp; - Body: { email, password, tenantSubdomain | tenantId }

&nbsp; - 200 → data: { user, token, expiresIn }

\- GET /api/auth/me (auth)

&nbsp; - 200 → data: user + tenant info

\- POST /api/auth/logout (auth)

&nbsp; - 200 → message



\## Tenants

\- GET /api/tenants/:tenantId (auth; same-tenant or super)

&nbsp; - 200 → data: tenant + stats

\- PUT /api/tenants/:tenantId (auth; tenant\_admin: name only, super: all fields)

&nbsp; - 200 → message + updated

\- GET /api/tenants (auth; super only)

&nbsp; - Query: page, limit, status, subscriptionPlan

&nbsp; - 200 → data: tenants\[], pagination



\## Users

\- POST /api/tenants/:tenantId/users (auth; tenant\_admin)

&nbsp; - Body: { email, password, fullName, role }

&nbsp; - 201 → data: new user (no password\_hash)

\- GET /api/tenants/:tenantId/users (auth; same-tenant)

&nbsp; - Query: search, role, page, limit

&nbsp; - 200 → data: users\[], total, pagination

\- PUT /api/users/:userId (auth; tenant\_admin or self/limited)

&nbsp; - Body: { fullName?, role?, isActive? }

&nbsp; - 200 → message + updated

\- DELETE /api/users/:userId (auth; tenant\_admin)

&nbsp; - 200 → message



\## Projects

\- POST /api/projects (auth)

&nbsp; - Body: { name, description?, status? }

&nbsp; - 201 → data: project

\- GET /api/projects (auth)

&nbsp; - Query: status, search, page, limit

&nbsp; - 200 → data: projects\[], total, pagination

\- PUT /api/projects/:projectId (auth; tenant\_admin or creator)

&nbsp; - 200 → message + updated

\- DELETE /api/projects/:projectId (auth; tenant\_admin or creator)

&nbsp; - 200 → message



\## Tasks

\- POST /api/projects/:projectId/tasks (auth)

&nbsp; - Body: { title, description?, assignedTo?, priority?, dueDate? }

&nbsp; - 201 → data: task

\- GET /api/projects/:projectId/tasks (auth)

&nbsp; - Query: status, assignedTo, priority, search, page, limit

&nbsp; - 200 → data: tasks\[], total, pagination

\- PATCH /api/tasks/:taskId/status (auth)

&nbsp; - Body: { status }

&nbsp; - 200 → data: { id, status, updatedAt }

\- PUT /api/tasks/:taskId (auth)

&nbsp; - Body: { title?, description?, status?, priority?, assignedTo?, dueDate? }

&nbsp; - 200 → message + updated

