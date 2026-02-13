import express from 'express';
import {
  createTask,
  getTasks,
  updateTaskStatus,
  updateTask,
  deleteTask
} from '../controllers/task.controller.js';

import { authenticate } from '../middleware/auth.middleware.js';
import { enforceTenant } from '../middleware/tenant.middleware.js';

const router = express.Router();

router.post('/', authenticate, enforceTenant, createTask);
router.get('/', authenticate, enforceTenant, getTasks);
router.patch('/:id/status', authenticate, enforceTenant, updateTaskStatus);
router.put('/:id', authenticate, enforceTenant, updateTask);
router.delete('/:id', authenticate, enforceTenant, deleteTask);

export default router;