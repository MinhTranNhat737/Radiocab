const express = require('express');
const { executeQuery } = require('../config/database');
const { validateDriver } = require('../middleware/validation');

const router = express.Router();

// Get all drivers with pagination and filters
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      city_id, 
      state_id, 
      country_id,
      company_id,
      sort_by = 'created_at',
      sort_order = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    let whereConditions = [];
    let queryParams = [];
    let paramCount = 0;

    // Build WHERE clause
    if (search) {
      paramCount++;
      whereConditions.push(`(d.full_name ILIKE $${paramCount} OR d.email ILIKE $${paramCount} OR d.phone ILIKE $${paramCount})`);
      queryParams.push(`%${search}%`);
    }

    if (city_id) {
      paramCount++;
      whereConditions.push(`d.city_id = $${paramCount}`);
      queryParams.push(city_id);
    }

    if (state_id) {
      paramCount++;
      whereConditions.push(`d.state_id = $${paramCount}`);
      queryParams.push(state_id);
    }

    if (country_id) {
      paramCount++;
      whereConditions.push(`d.country_id = $${paramCount}`);
      queryParams.push(country_id);
    }

    if (company_id) {
      paramCount++;
      whereConditions.push(`cdl.company_id = $${paramCount}`);
      queryParams.push(company_id);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get total count
    const countQuery = `
      SELECT COUNT(DISTINCT d.id) as total
      FROM drivers d
      LEFT JOIN company_driver_links cdl ON d.id = cdl.driver_id
      ${whereClause}
    `;
    const countResult = await executeQuery(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].total);

    // Get drivers with details
    const driversQuery = `
      SELECT DISTINCT
        d.*,
        ci.city_name,
        s.state_name,
        co.country_name,
        c.company_name,
        cdl.joined_at,
        cdl.status as company_status
      FROM drivers d
      LEFT JOIN cities ci ON d.city_id = ci.id
      LEFT JOIN states s ON d.state_id = s.id
      LEFT JOIN countries co ON d.country_id = co.id
      LEFT JOIN company_driver_links cdl ON d.id = cdl.driver_id
      LEFT JOIN companies c ON cdl.company_id = c.id
      ${whereClause}
      ORDER BY d.${sort_by} ${sort_order}
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;

    queryParams.push(limit, offset);
    const result = await executeQuery(driversQuery, queryParams);

    res.json({
      success: true,
      data: {
        drivers: result.rows,
        pagination: {
          current_page: parseInt(page),
          per_page: parseInt(limit),
          total: total,
          total_pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get drivers error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get driver by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await executeQuery(`
      SELECT 
        d.*,
        ci.city_name,
        s.state_name,
        co.country_name
      FROM drivers d
      LEFT JOIN cities ci ON d.city_id = ci.id
      LEFT JOIN states s ON d.state_id = s.id
      LEFT JOIN countries co ON d.country_id = co.id
      WHERE d.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    // Get driver companies
    const companiesResult = await executeQuery(`
      SELECT 
        c.id, c.company_name, c.email, c.phone,
        cdl.joined_at, cdl.status
      FROM companies c
      JOIN company_driver_links cdl ON c.id = cdl.company_id
      WHERE cdl.driver_id = $1
      ORDER BY cdl.joined_at DESC
    `, [id]);

    // Get driver subscriptions
    const subscriptionsResult = await executeQuery(`
      SELECT 
        ds.*, p.plan_name, p.price, ss.status_name
      FROM driver_subscriptions ds
      JOIN plans p ON ds.plan_id = p.id
      JOIN subscription_statuses ss ON ds.status_id = ss.id
      WHERE ds.driver_id = $1
      ORDER BY ds.created_at DESC
    `, [id]);

    res.json({
      success: true,
      data: {
        driver: result.rows[0],
        companies: companiesResult.rows,
        subscriptions: subscriptionsResult.rows
      }
    });

  } catch (error) {
    console.error('Get driver error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Create new driver
router.post('/', validateDriver, async (req, res) => {
  try {
    const {
      full_name,
      email,
      phone,
      license_number,
      license_expiry,
      address,
      city_id,
      state_id,
      country_id,
      experience_years,
      vehicle_type
    } = req.body;

    // Check if driver with same email exists
    const existingDriver = await executeQuery(
      'SELECT id FROM drivers WHERE email = $1',
      [email]
    );

    if (existingDriver.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Driver with this email already exists'
      });
    }

    // Check if license number already exists
    const existingLicense = await executeQuery(
      'SELECT id FROM drivers WHERE license_number = $1',
      [license_number]
    );

    if (existingLicense.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Driver with this license number already exists'
      });
    }

    const result = await executeQuery(`
      INSERT INTO drivers (
        full_name, email, phone, license_number, license_expiry,
        address, city_id, state_id, country_id, experience_years,
        vehicle_type, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, NOW(), NOW())
      RETURNING *
    `, [
      full_name, email, phone, license_number, license_expiry,
      address, city_id, state_id, country_id, experience_years, vehicle_type
    ]);

    res.status(201).json({
      success: true,
      message: 'Driver created successfully',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Create driver error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Update driver
router.put('/:id', validateDriver, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      full_name,
      email,
      phone,
      license_number,
      license_expiry,
      address,
      city_id,
      state_id,
      country_id,
      experience_years,
      vehicle_type
    } = req.body;

    // Check if driver exists
    const existingDriver = await executeQuery(
      'SELECT id FROM drivers WHERE id = $1',
      [id]
    );

    if (existingDriver.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    // Check if email is already used by another driver
    const emailCheck = await executeQuery(
      'SELECT id FROM drivers WHERE email = $1 AND id != $2',
      [email, id]
    );

    if (emailCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email already used by another driver'
      });
    }

    // Check if license number is already used by another driver
    const licenseCheck = await executeQuery(
      'SELECT id FROM drivers WHERE license_number = $1 AND id != $2',
      [license_number, id]
    );

    if (licenseCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'License number already used by another driver'
      });
    }

    const result = await executeQuery(`
      UPDATE drivers SET
        full_name = $1,
        email = $2,
        phone = $3,
        license_number = $4,
        license_expiry = $5,
        address = $6,
        city_id = $7,
        state_id = $8,
        country_id = $9,
        experience_years = $10,
        vehicle_type = $11,
        updated_at = NOW()
      WHERE id = $12
      RETURNING *
    `, [
      full_name, email, phone, license_number, license_expiry,
      address, city_id, state_id, country_id, experience_years, vehicle_type, id
    ]);

    res.json({
      success: true,
      message: 'Driver updated successfully',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Update driver error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Delete driver
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if driver exists
    const existingDriver = await executeQuery(
      'SELECT id FROM drivers WHERE id = $1',
      [id]
    );

    if (existingDriver.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    // Check if driver has active subscriptions
    const activeSubscriptions = await executeQuery(`
      SELECT COUNT(*) as count FROM driver_subscriptions 
      WHERE driver_id = $1 AND status_id IN (1, 2)
    `, [id]);

    if (parseInt(activeSubscriptions.rows[0].count) > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete driver with active subscriptions'
      });
    }

    // Delete driver (cascade will handle related records)
    await executeQuery('DELETE FROM drivers WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Driver deleted successfully'
    });

  } catch (error) {
    console.error('Delete driver error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Link driver to company
router.post('/:id/companies/:company_id', async (req, res) => {
  try {
    const { id, company_id } = req.params;
    const { status = 'active' } = req.body;

    // Check if driver exists
    const driverCheck = await executeQuery(
      'SELECT id FROM drivers WHERE id = $1',
      [id]
    );

    if (driverCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Driver not found'
      });
    }

    // Check if company exists
    const companyCheck = await executeQuery(
      'SELECT id FROM companies WHERE id = $1',
      [company_id]
    );

    if (companyCheck.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Check if link already exists
    const existingLink = await executeQuery(
      'SELECT id FROM company_driver_links WHERE driver_id = $1 AND company_id = $2',
      [id, company_id]
    );

    if (existingLink.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Driver is already linked to this company'
      });
    }

    const result = await executeQuery(`
      INSERT INTO company_driver_links (driver_id, company_id, status, joined_at)
      VALUES ($1, $2, $3, NOW())
      RETURNING *
    `, [id, company_id, status]);

    res.status(201).json({
      success: true,
      message: 'Driver linked to company successfully',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Link driver to company error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Unlink driver from company
router.delete('/:id/companies/:company_id', async (req, res) => {
  try {
    const { id, company_id } = req.params;

    const result = await executeQuery(
      'DELETE FROM company_driver_links WHERE driver_id = $1 AND company_id = $2 RETURNING *',
      [id, company_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Driver-company link not found'
      });
    }

    res.json({
      success: true,
      message: 'Driver unlinked from company successfully'
    });

  } catch (error) {
    console.error('Unlink driver from company error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get driver statistics
router.get('/:id/stats', async (req, res) => {
  try {
    const { id } = req.params;

    const stats = await executeQuery(`
      SELECT 
        (SELECT COUNT(*) FROM company_driver_links WHERE driver_id = $1) as total_companies,
        (SELECT COUNT(*) FROM driver_subscriptions WHERE driver_id = $1) as total_subscriptions,
        (SELECT COALESCE(SUM(amount), 0) FROM payments WHERE driver_id = $1) as total_payments
    `, [id]);

    res.json({
      success: true,
      data: stats.rows[0]
    });

  } catch (error) {
    console.error('Get driver stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

module.exports = router;