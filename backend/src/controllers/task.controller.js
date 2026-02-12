/**
 * Create Task - NO DEPENDENCIES, PURE MOCK
 */
export const createTask = async (req, res) => {
  try {
    const { title, description, projectId, assignedTo, priority, dueDate } = req.body;
    
    // Mock successful response - NO DATABASE, NO MODELS
    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: {
        id: 'mock-task-' + Date.now(),
        project_id: projectId || 'mock-project-id',
        tenant_id: req.user?.tenantId || 'mock-tenant-id',
        title: title || 'Untitled Task',
        description: description || '',
        status: 'todo',
        priority: priority || 'medium',
        assigned_to: assignedTo || null,
        due_date: dueDate || null,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create task'
    });
  }
};

/**
 * List Tasks - NO DEPENDENCIES, PURE MOCK
 */
export const getTasks = async (req, res) => {
  try {
    const { projectId, status } = req.query;
    
    // Mock tasks - NO DATABASE, NO MODELS
    const mockTasks = [
      {
        id: 'mock-task-1',
        project_id: projectId || 'e1111111-e111-e111-e111-e11111111111',
        tenant_id: req.user?.tenantId || '11111111-1111-1111-1111-111111111111',
        title: 'Design homepage',
        description: 'Create high-fidelity mockup',
        status: 'todo',
        priority: 'high',
        assigned_to: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        assignee: {
          id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
          email: 'user1@demo.com',
          full_name: 'User One'
        }
      },
      {
        id: 'mock-task-2',
        project_id: projectId || 'e1111111-e111-e111-e111-e11111111111',
        tenant_id: req.user?.tenantId || '11111111-1111-1111-1111-111111111111',
        title: 'Implement authentication',
        description: 'Add JWT auth',
        status: 'in_progress',
        priority: 'high',
        assigned_to: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
        due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        assignee: {
          id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
          email: 'user2@demo.com',
          full_name: 'User Two'
        }
      }
    ];

    // Filter by status if provided
    let filteredTasks = mockTasks;
    if (status) {
      filteredTasks = filteredTasks.filter(task => task.status === status);
    }

    res.json({
      success: true,
      data: filteredTasks,
      total: filteredTasks.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch tasks'
    });
  }
};

/**
 * Update Task Status
 */
export const updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    
    res.json({
      success: true,
      message: 'Task status updated successfully',
      data: {
        id,
        status,
        updated_at: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update task status'
    });
  }
};

/**
 * Update Task
 */
export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    res.json({
      success: true,
      message: 'Task updated successfully',
      data: {
        id,
        ...updates,
        updated_at: new Date().toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update task'
    });
  }
};

/**
 * Delete Task
 */
export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    
    res.json({
      success: true,
      message: 'Task deleted successfully',
      data: { id }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to delete task'
    });
  }
};