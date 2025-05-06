const { executeQuery } = require('../config/db');

// Helper function to get user permissions
const getUserPermissions = async (userId) => {
  try {
    // First check if user exists
    const user = await executeQuery(
      'SELECT id FROM users WHERE id = ?',
      [userId]
    );

    if (user.length === 0) {
      console.error('User not found:', userId);
      return null;
    }

    // Check if user_permissions table exists and create if not
    await executeQuery(`
      CREATE TABLE IF NOT EXISTS user_permissions (
        user_id INT NOT NULL,
        access_dashboard BOOLEAN DEFAULT FALSE,
        manage_users BOOLEAN DEFAULT FALSE,
        manage_contents BOOLEAN DEFAULT FALSE,
        can_update_content BOOLEAN DEFAULT FALSE,
        can_view_analytics BOOLEAN DEFAULT FALSE,
        can_create_events BOOLEAN DEFAULT FALSE,
        can_edit_events BOOLEAN DEFAULT FALSE,
        can_delete_events BOOLEAN DEFAULT FALSE,
        can_create_resources BOOLEAN DEFAULT FALSE,
        can_edit_resources BOOLEAN DEFAULT FALSE,
        can_delete_resources BOOLEAN DEFAULT FALSE,
        can_view_audit_logs BOOLEAN DEFAULT FALSE,
        can_manage_permissions BOOLEAN DEFAULT FALSE,
        can_export_data BOOLEAN DEFAULT FALSE,
        PRIMARY KEY (user_id),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    const permissions = await executeQuery(
      `SELECT * FROM user_permissions WHERE user_id = ?`,
      [userId]
    );

    if (permissions.length === 0) {
      // Create default permissions if none exist
      try {
        await executeQuery(
          `INSERT INTO user_permissions (
            user_id,
            access_dashboard,
            manage_users,
            manage_contents,
            can_update_content,
            can_view_analytics,
            can_create_events,
            can_edit_events,
            can_delete_events,
            can_create_resources,
            can_edit_resources,
            can_delete_resources,
            can_view_audit_logs,
            can_manage_permissions,
            can_export_data
          ) VALUES (?, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE, FALSE)`,
          [userId]
        );
      } catch (insertError) {
        console.error('Error creating default permissions:', insertError);
        return null;
      }
      return {
        canAccessDashboard: false,
        canManageUsers: false,
        canManageContents: false,
        canUpdateContent: false,
        canViewAnalytics: false,
        canCreateEvents: false,
        canEditEvents: false,
        canDeleteEvents: false,
        canCreateResources: false,
        canEditResources: false,
        canDeleteResources: false,
        canViewAuditLogs: false,
        canManagePermissions: false,
        canExportData: false
      };
    }

    // Map database fields to permission object
    return {
      canAccessDashboard: Boolean(permissions[0].access_dashboard),
      canManageUsers: Boolean(permissions[0].manage_users),
      canManageContents: Boolean(permissions[0].manage_contents),
      canUpdateContent: Boolean(permissions[0].can_update_content),
      canViewAnalytics: Boolean(permissions[0].can_view_analytics),
      canCreateEvents: Boolean(permissions[0].can_create_events),
      canEditEvents: Boolean(permissions[0].can_edit_events),
      canDeleteEvents: Boolean(permissions[0].can_delete_events),
      canCreateResources: Boolean(permissions[0].can_create_resources),
      canEditResources: Boolean(permissions[0].can_edit_resources),
      canDeleteResources: Boolean(permissions[0].can_delete_resources),
      canViewAuditLogs: Boolean(permissions[0].can_view_audit_logs),
      canManagePermissions: Boolean(permissions[0].can_manage_permissions),
      canExportData: Boolean(permissions[0].can_export_data)
    };
  } catch (error) {
    console.error('Error getting user permissions:', error);
    return null;
  }
};

// Middleware to add permissions to user object
const attachPermissions = async (req, res, next) => {
  if (!req.user) {
    return next();
  }

  try {
    const permissions = await getUserPermissions(req.user.id);

    if (!permissions) {
      console.error('Failed to get permissions for user:', req.user.id);
      // For admin users, provide default full permissions
      if (req.user.role === 'admin') {
        req.user.permissions = {
          canAccessDashboard: true,
          canUpdateContent: true,
          canManageUsers: true,
          canViewAnalytics: true,
          canCreateEvents: true,
          canEditEvents: true,
          canDeleteEvents: true,
          canCreateResources: true,
          canEditResources: true,
          canDeleteResources: true,
          canViewAuditLogs: true,
          canManagePermissions: true,
          canExportData: true
        };
        return next();
      }
      return res.status(500).json({ message: 'Error retrieving user permissions' });
    }

    req.user.permissions = permissions;
    next();
  } catch (error) {
    console.error('Permission middleware error:', error);
    res.status(500).json({ message: 'Server error getting permissions' });
  }
};

// Admin role check
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ message: 'Admin access required' });
  }

  next();
};

// Check if user can access dashboard
const canAccessDashboard = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  if (req.user.role === 'admin' || req.user.permissions.canAccessDashboard) {
    return next();
  }

  res.status(403).json({ message: 'Access to dashboard denied' });
};

// Check if user can manage users
const canManageUsers = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  if (req.user.role === 'admin' || req.user.permissions.canManageUsers) {
    return next();
  }

  res.status(403).json({ message: 'Permission to manage users denied' });
};

// Check if user can view analytics
const canViewAnalytics = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  if (req.user.role === 'admin' || req.user.permissions.canViewAnalytics) {
    return next();
  }

  res.status(403).json({ message: 'Permission to view analytics denied' });
};

// Check if user can update content
const canUpdateContent = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }

  if (req.user.role === 'admin' || req.user.permissions.canUpdateContent) {
    return next();
  }

  res.status(403).json({ message: 'Permission to update content denied' });
};

// Flexible permission check creator
const hasPermission = (permissionName) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    if (req.user.role === 'admin' || req.user.permissions[permissionName]) {
      return next();
    }

    res.status(403).json({ message: `Permission ${permissionName} denied` });
  };
};

// Resource owner check - for API endpoints that allow creators to edit their own content
const isResourceOwner = (resourceType) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authenticated' });
    }

    const resourceId = req.params.id;
    if (!resourceId) {
      return res.status(400).json({ message: 'Resource ID is required' });
    }

    try {
      let tableName;
      switch (resourceType) {
        case 'resource':
          tableName = 'resources';
          break;
        case 'event':
          tableName = 'events';
          break;
        case 'article':
          tableName = 'articles';
          break;
        case 'project':
          tableName = 'projects';
          break;
        case 'lecture':
          tableName = 'lectures';
          break;
        default:
          return res.status(400).json({ message: 'Invalid resource type' });
      }

      const resource = await executeQuery(
        `SELECT created_by FROM ${tableName} WHERE id = ?`,
        [resourceId]
      );

      if (resource.length === 0) {
        return res.status(404).json({ message: 'Resource not found' });
      }

      if (resource[0].created_by === req.user.id || req.user.role === 'admin') {
        return next();
      }

      // Check for specific permission based on action and resource type
      const action = req.method === 'DELETE' ? 'Delete' : 'Edit';
      const permissionName = `can${action}${resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}s`;

      if (req.user.permissions[permissionName]) {
        return next();
      }

      res.status(403).json({ message: 'You do not have permission to modify this resource' });
    } catch (error) {
      console.error('Permission check error:', error);
      res.status(500).json({ message: 'Server error checking permissions' });
    }
  };
};

module.exports = {
  getUserPermissions,
  attachPermissions,
  isAdmin,
  canAccessDashboard,
  canManageUsers,
  canViewAnalytics,
  canUpdateContent,
  hasPermission,
  isResourceOwner
};
