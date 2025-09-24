const express = require('express');
const { executeQuery } = require('../config/database');
const { validateDriver, validateId, validatePagination } = require('../middleware/validation');
const { verifyToken, requireDriverOwnerOrAdmin, requireOwnership } = require('../middleware/auth');

const router = express.Router();

// Get all drivers
router.get('/', verifyToken, validatePagination, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'created_at',
      sortOrder = 'desc',
      status,
      cityId,
      experienceYears
    } = req.query;
    
    const offset = (page - 1) * limit;
    
    let whereClause = 'WHERE 1=1';
    const params = { offset, limit };
    
    // Add search filter
    if (search) {
      whereClause += ' AND (d.name LIKE @search OR d.contact_person LIKE @search OR d.email LIKE @search)';
      params.search = `%${search}%`;
    }
    
    // Add status filter
    if (status) {
      whereClause += ' AND d.status = @status';
      params.status = status;
    }
    
    // Add city filter
    if (cityId) {
      whereClause += ' AND d.city_id = @cityId';
      params.cityId = cityId;
    }
    
    // Add experience filter
    if (experienceYears) {
      whereClause += ' AND d.experience_years >= @experienceYears';
      params.experienceYears = experienceYears;
    }
    
    // Get drivers with pagination
    const driversQuery = `
      SELECT d.driver_id, d.driver_code, d.name, d.contact_person, d.address_line, d.city_id,
             d.mobile, d.telephone, d.email, d.experience_years, d.description,
             d.owner_user_id, d.status, d.created_at, d.updated_at,
             ci.name as city_name, s.name as state_name, co.name as country_name,
             u.full_name as owner_name
      FROM drivers d
      LEFT JOIN cities ci ON ci.city_id = d.city_id
      LEFT JOIN states s ON s.state_id = ci.state_id
      LEFT JOIN countries co ON co.country_id = s.country_id
      LEFT JOIN users u ON u.user_id = d.owner_user_id
      ${whereClause}
      ORDER BY d.${sortBy} ${sortOrder.toUpperCase()}
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `;
    
    const driversResult = await executeQuery(driversQuery, params);
    
    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM drivers d
      ${whereClause}
    `;
    
    const countResult = await executeQuery(countQuery, params);
    const total = countResult.recordset[0].total;
    
    res.json({
      success: true,
      data: driversResult.recordset,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total,
        totalPages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Get drivers error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to get drivers'
    });
  }
});

// Get driver by ID
router.get('/:id', verifyToken, validateId, async (req, res) => {
  try {
    const { id } = req.params;
    
    const driverQuery = `
      SELECT d.driver_id, d.driver_code, d.name, d.contact_person, d.address_line, d.city_id,
             d.mobile, d.telephone, d.email, d.experience_years, d.description,
             d.owner_user_id, d.status, d.created_at, d.updated_at,
             ci.name as city_name, s.name as state_name, co.name as country_name,
             u.full_name as owner_name
      FROM drivers d
      LEFT JOIN cities ci ON ci.city_id = d.city_id
      LEFT JOIN states s ON s.state_id = ci.state_id
      LEFT JOIN countries co ON co.country_id = s.country_id
      LEFT JOIN users u ON u.user_id = d.owner_user_id
      WHERE d.driver_id = @id
    `;
    
    const driverResult = await executeQuery(driverQuery, { id });
    
    if (driverResult.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Driver not found'
      });
    }
    
    res.json({
      success: true,
      data: driverResult.recordset[0]
    });
    
  } catch (error) {
    console.error('Get driver error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to get driver'
    });
  }
});

// Create driver
router.post('/', verifyToken, validateDriver, async (req, res) => {
  try {
    const {
      name,
      contact_person,
      address_line,
      city_id,
      mobile,
      telephone,
      email,
      experience_years,
      description,
      status = 'draft'
    } = req.body;
    
    // Generate driver code
    const driverCode = `DRV${Date.now().toString().slice(-6)}`;
    
    const createDriverQuery = `
      INSERT INTO drivers (
        driver_code, name, contact_person, address_line, city_id,
        mobile, telephone, email, experience_years, description, owner_user_id, status
      )
      OUTPUT INSERTED.driver_id
      VALUES (
        @driver_code, @name, @contact_person, @address_line, @city_id,
        @mobile, @telephone, @email, @experience_years, @description, @owner_user_id, @status
      )
    `;
    
    const driverResult = await executeQuery(createDriverQuery, {
      driver_code: driverCode,
      name,
      contact_person,
      address_line,
      city_id,
      mobile,
      telephone,
      email,
      experience_years,
      description,
      owner_user_id: req.user.user_id,
      status
    });
    
    const driverId = driverResult.recordset[0].driver_id;
    
    // Get created driver details
    const driverQuery = `
      SELECT d.driver_id, d.driver_code, d.name, d.contact_person, d.address_line, d.city_id,
             d.mobile, d.telephone, d.email, d.experience_years, d.description,
             d.owner_user_id, d.status, d.created_at, d.updated_at,
             ci.name as city_name
      FROM drivers d
      LEFT JOIN cities ci ON ci.city_id = d.city_id
      WHERE d.driver_id = @driver_id
    `;
    
    const driverDetails = await executeQuery(driverQuery, { driver_id: driverId });
    
    res.status(201).json({
      success: true,
      data: driverDetails.recordset[0],
      message: 'Driver created successfully'
    });
    
  } catch (error) {
    console.error('Create driver error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to create driver'
    });
  }
});

// Update driver
router.put('/:id', verifyToken, validateId, validateDriver, requireOwnership('driver'), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      contact_person,
      address_line,
      city_id,
      mobile,
      telephone,
      email,
      experience_years,
      description,
      status
    } = req.body;
    
    const updateDriverQuery = `
      UPDATE drivers 
      SET name = @name,
          contact_person = @contact_person,
          address_line = @address_line,
          city_id = @city_id,
          mobile = @mobile,
          telephone = @telephone,
          email = @email,
          experience_years = @experience_years,
          description = @description,
          status = @status,
          updated_at = GETUTCDATE()
      WHERE driver_id = @id
    `;
    
    await executeQuery(updateDriverQuery, {
      id,
      name,
      contact_person,
      address_line,
      city_id,
      mobile,
      telephone,
      email,
      experience_years,
      description,
      status
    });
    
    // Get updated driver details
    const driverQuery = `
      SELECT d.driver_id, d.driver_code, d.name, d.contact_person, d.address_line, d.city_id,
             d.mobile, d.telephone, d.email, d.experience_years, d.description,
             d.owner_user_id, d.status, d.created_at, d.updated_at,
             ci.name as city_name
      FROM drivers d
      LEFT JOIN cities ci ON ci.city_id = d.city_id
      WHERE d.driver_id = @id
    `;
    
    const driverDetails = await executeQuery(driverQuery, { id });
    
    res.json({
      success: true,
      data: driverDetails.recordset[0],
      message: 'Driver updated successfully'
    });
    
  } catch (error) {
    console.error('Update driver error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to update driver'
    });
  }
});

// Delete driver
router.delete('/:id', verifyToken, validateId, requireOwnership('driver'), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Soft delete by setting status to 'deleted'
    const deleteDriverQuery = `
      UPDATE drivers 
      SET status = 'deleted', updated_at = GETUTCDATE()
      WHERE driver_id = @id
    `;
    
    await executeQuery(deleteDriverQuery, { id });
    
    res.json({
      success: true,
      message: 'Driver deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete driver error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to delete driver'
    });
  }
});

// Get driver dashboard
router.get('/:id/dashboard', verifyToken, requireOwnership('driver'), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get driver basic info
    const driverQuery = `
      SELECT d.driver_id, d.driver_code, d.name, d.status, d.created_at
      FROM drivers d
      WHERE d.driver_id = @id
    `;
    
    const driverResult = await executeQuery(driverQuery, { id });
    
    if (driverResult.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Driver not found'
      });
    }
    
    const driver = driverResult.recordset[0];
    
    // Get dashboard stats
    const statsQuery = `
      SELECT 
        (SELECT COUNT(*) FROM driver_subscriptions ds 
         JOIN subscriptions s ON s.subscription_id = ds.subscription_id 
         WHERE ds.driver_id = @id AND s.status_id = 2) as active_subscriptions,
        (SELECT COUNT(*) FROM driver_subscriptions ds 
         JOIN subscriptions s ON s.subscription_id = ds.subscription_id 
         WHERE ds.driver_id = @id AND s.status_id = 1) as pending_subscriptions,
        (SELECT COUNT(*) FROM payments p
         JOIN driver_subscriptions ds ON ds.subscription_id = p.subscription_id
         WHERE ds.driver_id = @id AND p.status_id = 2) as successful_payments,
        (SELECT COUNT(*) FROM company_driver_links WHERE driver_id = @id) as company_links
    `;
    
    const statsResult = await executeQuery(statsQuery, { id });
    const stats = statsResult.recordset[0];
    
    // Get recent activity (simplified)
    const activityQuery = `
      SELECT TOP 5
        'subscription' as type,
        'Driver Subscription' as title,
        s.created_at as created_at,
        ss.name as status
      FROM driver_subscriptions ds
      JOIN subscriptions s ON s.subscription_id = ds.subscription_id
      LEFT JOIN subscription_statuses ss ON ss.status_id = s.status_id
      WHERE ds.driver_id = @id
      ORDER BY s.created_at DESC
    `;
    
    const activityResult = await executeQuery(activityQuery, { id });
    
    res.json({
      success: true,
      data: {
        driver,
        stats,
        recentActivity: activityResult.recordset
      }
    });
    
  } catch (error) {
    console.error('Get driver dashboard error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to get driver dashboard'
    });
  }
});

// Get driver stats
router.get('/:id/stats', verifyToken, requireOwnership('driver'), async (req, res) => {
  try {
    const { id } = req.params;
    
    const statsQuery = `
      SELECT 
        (SELECT COUNT(*) FROM driver_subscriptions ds 
         JOIN subscriptions s ON s.subscription_id = ds.subscription_id 
         WHERE ds.driver_id = @id AND s.status_id = 2) as active_subscriptions,
        (SELECT COUNT(*) FROM driver_subscriptions ds 
         JOIN subscriptions s ON s.subscription_id = ds.subscription_id 
         WHERE ds.driver_id = @id AND s.status_id = 1) as pending_subscriptions,
        (SELECT COUNT(*) FROM driver_subscriptions ds 
         JOIN subscriptions s ON s.subscription_id = ds.subscription_id 
         WHERE ds.driver_id = @id AND s.status_id = 4) as cancelled_subscriptions,
        (SELECT COUNT(*) FROM payments p
         JOIN driver_subscriptions ds ON ds.subscription_id = p.subscription_id
         WHERE ds.driver_id = @id AND p.status_id = 2) as successful_payments,
        (SELECT COUNT(*) FROM payments p
         JOIN driver_subscriptions ds ON ds.subscription_id = p.subscription_id
         WHERE ds.driver_id = @id AND p.status_id = 4) as refunded_payments,
        (SELECT COUNT(*) FROM company_driver_links WHERE driver_id = @id) as company_links
    `;
    
    const statsResult = await executeQuery(statsQuery, { id });
    
    res.json({
      success: true,
      data: statsResult.recordset[0]
    });
    
  } catch (error) {
    console.error('Get driver stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to get driver stats'
    });
  }
});

module.exports = router;
