const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { executeQuery } = require('../config/database');
const { validateLogin, validateRegister } = require('../middleware/validation');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Login
router.post('/login', validateLogin, async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Get user from database
    const userQuery = `
      SELECT u.user_id, u.email, u.password_hash, u.full_name, u.phone, u.role_id, u.is_active,
             r.role_code, r.role_name
      FROM users u
      INNER JOIN roles r ON r.role_id = u.role_id
      WHERE u.email = @email
    `;
    
    const userResult = await executeQuery(userQuery, { email });
    
    if (userResult.recordset.length === 0) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Invalid email or password'
      });
    }
    
    const user = userResult.recordset[0];
    
    // Check if user is active
    if (!user.is_active) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Account is inactive'
      });
    }
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password_hash);
    
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Invalid email or password'
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        user_id: user.user_id,
        email: user.email,
        role_id: user.role_id,
        role_code: user.role_code
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    
    // Generate refresh token
    const refreshToken = jwt.sign(
      { user_id: user.user_id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
    );
    
    // Store refresh token in database (optional)
    const storeRefreshTokenQuery = `
      INSERT INTO auth_sessions (user_id, expires_at)
      VALUES (@user_id, DATEADD(day, 30, GETUTCDATE()))
    `;
    
    await executeQuery(storeRefreshTokenQuery, { user_id: user.user_id });
    
    res.json({
      success: true,
      data: {
        user: {
          user_id: user.user_id,
          email: user.email,
          full_name: user.full_name,
          phone: user.phone,
          role_id: user.role_id,
          role_code: user.role_code,
          role_name: user.role_name
        },
        token,
        refreshToken
      },
      message: 'Login successful'
    });
    
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Login failed'
    });
  }
});

// Register
router.post('/register', validateRegister, async (req, res) => {
  try {
    const { email, password, full_name, phone, role_id } = req.body;
    
    // Check if user already exists
    const existingUserQuery = 'SELECT user_id FROM users WHERE email = @email';
    const existingUser = await executeQuery(existingUserQuery, { email });
    
    if (existingUser.recordset.length > 0) {
      return res.status(409).json({
        success: false,
        error: 'Conflict',
        message: 'User with this email already exists'
      });
    }
    
    // Hash password
    const saltRounds = 12;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    
    // Create user
    const createUserQuery = `
      INSERT INTO users (email, password_hash, full_name, phone, role_id, is_active)
      OUTPUT INSERTED.user_id
      VALUES (@email, @password_hash, @full_name, @phone, @role_id, 1)
    `;
    
    const userResult = await executeQuery(createUserQuery, {
      email,
      password_hash: passwordHash,
      full_name,
      phone,
      role_id
    });
    
    const userId = userResult.recordset[0].user_id;
    
    // Get user details
    const userQuery = `
      SELECT u.user_id, u.email, u.full_name, u.phone, u.role_id,
             r.role_code, r.role_name
      FROM users u
      INNER JOIN roles r ON r.role_id = u.role_id
      WHERE u.user_id = @user_id
    `;
    
    const userDetails = await executeQuery(userQuery, { user_id: userId });
    const user = userDetails.recordset[0];
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        user_id: user.user_id,
        email: user.email,
        role_id: user.role_id,
        role_code: user.role_code
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    
    // Generate refresh token
    const refreshToken = jwt.sign(
      { user_id: user.user_id },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d' }
    );
    
    res.status(201).json({
      success: true,
      data: {
        user: {
          user_id: user.user_id,
          email: user.email,
          full_name: user.full_name,
          phone: user.phone,
          role_id: user.role_id,
          role_code: user.role_code,
          role_name: user.role_name
        },
        token,
        refreshToken
      },
      message: 'Registration successful'
    });
    
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Registration failed'
    });
  }
});

// Logout
router.post('/logout', verifyToken, async (req, res) => {
  try {
    // In a real application, you might want to blacklist the token
    // For now, we'll just return success
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Logout failed'
    });
  }
});

// Refresh token
router.post('/refresh', async (req, res) => {
  try {
    const { refreshToken } = req.body;
    
    if (!refreshToken) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Refresh token required'
      });
    }
    
    // Verify refresh token
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    
    // Get user details
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
    
    const user = userResult.recordset[0];
    
    // Generate new access token
    const newToken = jwt.sign(
      { 
        user_id: user.user_id,
        email: user.email,
        role_id: user.role_id,
        role_code: user.role_code
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    
    res.json({
      success: true,
      data: {
        token: newToken
      },
      message: 'Token refreshed successfully'
    });
    
  } catch (error) {
    console.error('Token refresh error:', error);
    res.status(401).json({
      success: false,
      error: 'Unauthorized',
      message: 'Invalid refresh token'
    });
  }
});

// Get current user
router.get('/me', verifyToken, async (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        user: req.user
      }
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to get user information'
    });
  }
});

// Change password
router.post('/change-password', verifyToken, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Current password and new password are required'
      });
    }
    
    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'New password must be at least 6 characters long'
      });
    }
    
    // Get current user's password hash
    const userQuery = 'SELECT password_hash FROM users WHERE user_id = @user_id';
    const userResult = await executeQuery(userQuery, { user_id: req.user.user_id });
    
    if (userResult.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'User not found'
      });
    }
    
    // Verify current password
    const isCurrentPasswordValid = await bcrypt.compare(
      currentPassword, 
      userResult.recordset[0].password_hash
    );
    
    if (!isCurrentPasswordValid) {
      return res.status(401).json({
        success: false,
        error: 'Unauthorized',
        message: 'Current password is incorrect'
      });
    }
    
    // Hash new password
    const saltRounds = 12;
    const newPasswordHash = await bcrypt.hash(newPassword, saltRounds);
    
    // Update password
    const updatePasswordQuery = `
      UPDATE users 
      SET password_hash = @new_password_hash, updated_at = GETUTCDATE()
      WHERE user_id = @user_id
    `;
    
    await executeQuery(updatePasswordQuery, {
      new_password_hash: newPasswordHash,
      user_id: req.user.user_id
    });
    
    res.json({
      success: true,
      message: 'Password changed successfully'
    });
    
  } catch (error) {
    console.error('Change password error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Password change failed'
    });
  }
});

module.exports = router;
