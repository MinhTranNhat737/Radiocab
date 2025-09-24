const jwt = require('jsonwebtoken');
const { executeQuery } = require('../config/database');

// Verify JWT token
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'No token provided'
      });
    }
    
    const token = authHeader.substring(7); // Remove 'Bearer ' prefix
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if user still exists and is active
    const userQuery = `
      SELECT u.user_id, u.email, u.full_name, u.phone, u.role_id, u.is_active,
             r.role_code, r.role_name
      FROM users u
      INNER JOIN roles r ON r.role_id = u.role_id
      WHERE u.user_id = @user_id AND u.is_active = 1
    `;
    
    const userResult = await executeQuery(userQuery, { user_id: decoded.user_id });
    
    if (userResult.recordset.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'User not found or inactive'
      });
    }
    
    // Add user info to request
    req.user = {
      user_id: userResult.recordset[0].user_id,
      email: userResult.recordset[0].email,
      full_name: userResult.recordset[0].full_name,
      phone: userResult.recordset[0].phone,
      role_id: userResult.recordset[0].role_id,
      role_code: userResult.recordset[0].role_code,
      role_name: userResult.recordset[0].role_name
    };
    
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Invalid token'
      });
    }
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Token expired'
      });
    }
    
    console.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Authentication failed'
    });
  }
};

// Check if user has required role
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Authentication required'
      });
    }
    
    const userRole = req.user.role_code;
    const allowedRoles = Array.isArray(roles) ? roles : [roles];
    
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        error: 'Forbidden',
        message: 'Insufficient permissions'
      });
    }
    
    next();
  };
};

// Check if user owns the resource
const requireOwnership = (resourceType) => {
  return async (req, res, next) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          error: 'Unauthorized',
          message: 'Authentication required'
        });
      }
      
      const resourceId = req.params.id || req.params.company_id || req.params.driver_id;
      
      if (!resourceId) {
        return res.status(400).json({
          success: false,
          error: 'Bad Request',
          message: 'Resource ID required'
        });
      }
      
      let ownershipQuery = '';
      let params = { user_id: req.user.user_id, resource_id: resourceId };
      
      switch (resourceType) {
        case 'company':
          ownershipQuery = `
            SELECT company_id FROM companies 
            WHERE company_id = @resource_id AND owner_user_id = @user_id
          `;
          break;
        case 'driver':
          ownershipQuery = `
            SELECT driver_id FROM drivers 
            WHERE driver_id = @resource_id AND owner_user_id = @user_id
          `;
          break;
        default:
          return res.status(400).json({
            success: false,
            error: 'Bad Request',
            message: 'Invalid resource type'
          });
      }
      
      const result = await executeQuery(ownershipQuery, params);
      
      if (result.recordset.length === 0) {
        return res.status(403).json({
          success: false,
          error: 'Forbidden',
          message: 'You do not have permission to access this resource'
        });
      }
      
      next();
    } catch (error) {
      console.error('Ownership check error:', error);
      return res.status(500).json({
        success: false,
        error: 'Internal Server Error',
        message: 'Ownership verification failed'
      });
    }
  };
};

// Admin only middleware
const requireAdmin = requireRole(['admin']);

// Company owner or admin middleware
const requireCompanyOwnerOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Authentication required'
    });
  }
  
  if (req.user.role_code === 'admin') {
    return next();
  }
  
  if (req.user.role_code === 'company_owner') {
    return next();
  }
  
  return res.status(403).json({
    success: false,
    error: 'Forbidden',
    message: 'Company owner or admin access required'
  });
};

// Driver owner or admin middleware
const requireDriverOwnerOrAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Authentication required'
    });
  }
  
  if (req.user.role_code === 'admin') {
    return next();
  }
  
  if (req.user.role_code === 'driver_owner') {
    return next();
  }
  
  return res.status(403).json({
    success: false,
    error: 'Forbidden',
    message: 'Driver owner or admin access required'
  });
};

module.exports = {
  verifyToken,
  requireRole,
  requireOwnership,
  requireAdmin,
  requireCompanyOwnerOrAdmin,
  requireDriverOwnerOrAdmin
};
