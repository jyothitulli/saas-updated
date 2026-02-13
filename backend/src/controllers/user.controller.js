import bcrypt from 'bcrypt';
import { query } from '../config/db.js';
import { successResponse, errorResponse } from '../utils/response.util.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * CREATE USER (Tenant Admin only)
 */
export const createUser = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    const tenantId = req.tenantId;

    if (!email || !password || !role) {
      return errorResponse(res, 'Email, password and role are required', 400);
    }

    if (!['user', 'tenant_admin'].includes(role)) {
      return errorResponse(res, 'Invalid role', 400);
    }

    // Check user limit
    const countResult = await query(
      'SELECT COUNT(*) FROM users WHERE tenant_id = $1',
      [tenantId]
    );

    const userCount = parseInt(countResult.rows[0].count, 10);

    const limitResult = await query(
      'SELECT max_users FROM tenants WHERE id = $1',
      [tenantId]
    );

    if (userCount >= limitResult.rows[0].max_users) {
      return errorResponse(res, 'User limit exceeded for subscription plan', 403);
    }

    // Check email uniqueness per tenant
    const existingUser = await query(
      'SELECT id FROM users WHERE email = $1 AND tenant_id = $2',
      [email, tenantId]
    );

    if (existingUser.rows.length > 0) {
      return errorResponse(res, 'User already exists', 409);
    }

    const passwordHash = await bcrypt.hash(password, 10);

    await query(
      `INSERT INTO users (id, tenant_id, email, password_hash, role)
       VALUES ($1, $2, $3, $4, $5)`,
      [uuidv4(), tenantId, email, passwordHash, role]
    );

    return successResponse(res, 'User created successfully');
  } catch (error) {
    console.error(error);
    return errorResponse(res, 'Failed to create user', 500);
  }
};

/**
 * LIST USERS (Tenant scoped)
 */
export const listUsers = async (req, res) => {
  try {
    const tenantId = req.tenantId;

    const result = await query(
      `SELECT id, email, role, is_active, created_at
       FROM users
       WHERE tenant_id = $1
       ORDER BY created_at DESC`,
      [tenantId]
    );

    return successResponse(res, 'Users fetched successfully', result.rows);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 'Failed to fetch users', 500);
  }
};

/**
 * ACTIVATE / DEACTIVATE USER
 */
export const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;
    const tenantId = req.tenantId;

    await query(
      `UPDATE users
       SET is_active = $1
       WHERE id = $2 AND tenant_id = $3`,
      [is_active, id, tenantId]
    );

    return successResponse(res, 'User status updated');
  } catch (error) {
    console.error(error);
    return errorResponse(res, 'Failed to update user', 500);
  }
};
