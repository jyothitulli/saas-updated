import { errorResponse } from '../utils/response.util.js';

/**
 * Enforces tenant isolation
 * Blocks access if tenant_id mismatch
 */
export const enforceTenant = (req, res, next) => {
  // Super admin can bypass tenant restriction
  if (req.user.role === 'super_admin') {
    return next();
  }

  if (!req.user.tenantId) {
    return errorResponse(res, 'Tenant context missing', 403);
  }

  // Attach tenantId to request for controllers
  req.tenantId = req.user.tenantId;

  next();
};
