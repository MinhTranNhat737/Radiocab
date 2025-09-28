const express = require('express');
const { executeQuery } = require('../config/database');

const router = express.Router();

// Get all companies with pagination and filters
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      city_id,
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
      whereConditions.push(`(c.name ILIKE $${paramCount} OR c.email ILIKE $${paramCount})`);
      queryParams.push(`%${search}%`);
    }

    if (city_id) {
      paramCount++;
      whereConditions.push(`c.city_id = $${paramCount}`);
      queryParams.push(city_id);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM companies c
      ${whereClause}
    `;
    const countResult = await executeQuery(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].total);

    // Get companies with details
    const companiesQuery = `
      SELECT 
        c.*,
        ci.name as city_name,
        s.name as state_name,
        co.name as country_name
      FROM companies c
      LEFT JOIN cities ci ON c.city_id = ci.id
      LEFT JOIN states s ON ci.state_id = s.id
      LEFT JOIN countries co ON s.country_id = co.id
      ${whereClause}
      ORDER BY c.${sort_by} ${sort_order}
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;

    queryParams.push(limit, offset);
    const result = await executeQuery(companiesQuery, queryParams);

    res.json({
      success: true,
      data: {
        companies: result.rows,
        pagination: {
          current_page: parseInt(page),
          per_page: parseInt(limit),
          total: total,
          total_pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get company by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await executeQuery(`
      SELECT 
        c.*,
        ci.name as city_name,
        s.name as state_name,
        co.name as country_name
      FROM companies c
      LEFT JOIN cities ci ON c.city_id = ci.id
      LEFT JOIN states s ON ci.state_id = s.id
      LEFT JOIN countries co ON s.country_id = co.id
      WHERE c.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Get company drivers
    const driversResult = await executeQuery(`
      SELECT 
        d.id, d.license_number, d.license_expiry, d.is_active,
        u.username, u.email, u.first_name, u.last_name, u.phone
      FROM drivers d
      JOIN users u ON d.user_id = u.id
      WHERE d.company_id = $1
      ORDER BY d.created_at DESC
    `, [id]);

    // Get company subscriptions
    const subscriptionsResult = await executeQuery(`
      SELECT 
        s.*, p.plan_name, p.price, ss.name as status_name
      FROM subscriptions s
      JOIN plans p ON s.plan_id = p.id
      JOIN subscription_statuses ss ON s.status_id = ss.id
      WHERE s.company_id = $1
      ORDER BY s.created_at DESC
    `, [id]);

    res.json({
      success: true,
      data: {
        company: result.rows[0],
        drivers: driversResult.rows,
        subscriptions: subscriptionsResult.rows
      }
    });

  } catch (error) {
    console.error('Get company error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Create new company
router.post('/', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      address,
      city_id,
      website,
      description
    } = req.body;

    // Check if company with same email exists
    const existingCompany = await executeQuery(
      'SELECT id FROM companies WHERE email = $1',
      [email]
    );

    if (existingCompany.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Company with this email already exists'
      });
    }

    const result = await executeQuery(`
      INSERT INTO companies (
        name, email, phone, address, city_id, website, description,
        created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW(), NOW())
      RETURNING *
    `, [
      name, email, phone, address, city_id, website, description
    ]);

    res.status(201).json({
      success: true,
      message: 'Company created successfully',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Create company error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Update company
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      phone,
      address,
      city_id,
      website,
      description
    } = req.body;

    // Check if company exists
    const existingCompany = await executeQuery(
      'SELECT id FROM companies WHERE id = $1',
      [id]
    );

    if (existingCompany.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Check if email is already used by another company
    const emailCheck = await executeQuery(
      'SELECT id FROM companies WHERE email = $1 AND id != $2',
      [email, id]
    );

    if (emailCheck.rows.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Email already used by another company'
      });
    }

    const result = await executeQuery(`
      UPDATE companies SET
        name = $1,
        email = $2,
        phone = $3,
        address = $4,
        city_id = $5,
        website = $6,
        description = $7,
        updated_at = NOW()
      WHERE id = $8
      RETURNING *
    `, [
      name, email, phone, address, city_id, website, description, id
    ]);

    res.json({
      success: true,
      message: 'Company updated successfully',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Update company error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Delete company
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Check if company exists
    const existingCompany = await executeQuery(
      'SELECT id FROM companies WHERE id = $1',
      [id]
    );

    if (existingCompany.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Company not found'
      });
    }

    // Delete company (cascade will handle related records)
    await executeQuery('DELETE FROM companies WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Company deleted successfully'
    });

  } catch (error) {
    console.error('Delete company error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

module.exports = router;