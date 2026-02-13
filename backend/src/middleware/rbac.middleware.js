import { errorResponse } from '../utils/response.util.js';

/**
 * RBAC Middleware
 * Usage: allowRoles('super_admin', 'tenant_admin')
 */
export const allowRoles = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) {
      return errorResponse(res, 'Unauthorized', 401);
    }

    if (!allowedRoles.includes(req.user.role)) {
      return errorResponse(res, 'Forbidden: insufficient permissions', 403);
    }

    next();
  };
};
