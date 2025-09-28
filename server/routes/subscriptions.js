const express = require('express');
const { executeQuery } = require('../config/database');
const { validateSubscription } = require('../middleware/validation');

const router = express.Router();

// Get all subscriptions
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      user_id,
      company_id,
      driver_id,
      status_id,
      sort_by = 'created_at',
      sort_order = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    let whereConditions = [];
    let queryParams = [];
    let paramCount = 0;

    if (user_id) {
      paramCount++;
      whereConditions.push(`s.user_id = $${paramCount}`);
      queryParams.push(user_id);
    }

    if (company_id) {
      paramCount++;
      whereConditions.push(`cs.company_id = $${paramCount}`);
      queryParams.push(company_id);
    }

    if (driver_id) {
      paramCount++;
      whereConditions.push(`ds.driver_id = $${paramCount}`);
      queryParams.push(driver_id);
    }

    if (status_id) {
      paramCount++;
      whereConditions.push(`s.status_id = $${paramCount}`);
      queryParams.push(status_id);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const countQuery = `
      SELECT COUNT(*) as total 
      FROM subscriptions s
      LEFT JOIN company_subscriptions cs ON s.id = cs.subscription_id
      LEFT JOIN driver_subscriptions ds ON s.id = ds.subscription_id
      ${whereClause}
    `;
    const countResult = await executeQuery(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].total);

    const subscriptionsQuery = `
      SELECT 
        s.*,
        p.plan_name,
        p.price,
        ss.status_name,
        u.full_name as user_name,
        c.company_name,
        d.full_name as driver_name
      FROM subscriptions s
      LEFT JOIN plans p ON s.plan_id = p.id
      LEFT JOIN subscription_statuses ss ON s.status_id = ss.id
      LEFT JOIN users u ON s.user_id = u.id
      LEFT JOIN company_subscriptions cs ON s.id = cs.subscription_id
      LEFT JOIN companies c ON cs.company_id = c.id
      LEFT JOIN driver_subscriptions ds ON s.id = ds.subscription_id
      LEFT JOIN drivers d ON ds.driver_id = d.id
      ${whereClause}
      ORDER BY s.${sort_by} ${sort_order}
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;

    queryParams.push(limit, offset);
    const result = await executeQuery(subscriptionsQuery, queryParams);

    res.json({
      success: true,
      data: {
        subscriptions: result.rows,
        pagination: {
          current_page: parseInt(page),
          per_page: parseInt(limit),
          total: total,
          total_pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get subscription by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await executeQuery(`
      SELECT 
        s.*,
        p.plan_name,
        p.price,
        ss.status_name,
        u.full_name as user_name
      FROM subscriptions s
      LEFT JOIN plans p ON s.plan_id = p.id
      LEFT JOIN subscription_statuses ss ON s.status_id = ss.id
      LEFT JOIN users u ON s.user_id = u.id
      WHERE s.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Create new subscription
router.post('/', validateSubscription, async (req, res) => {
  try {
    const {
      user_id,
      plan_id,
      start_date,
      end_date,
      status_id = 1,
      billing_cycle_id = 1
    } = req.body;

    const result = await executeQuery(`
      INSERT INTO subscriptions (
        user_id, plan_id, start_date, end_date,
        status_id, billing_cycle_id, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING *
    `, [user_id, plan_id, start_date, end_date, status_id, billing_cycle_id]);

    res.status(201).json({
      success: true,
      message: 'Subscription created successfully',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Update subscription status
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status_id } = req.body;

    const result = await executeQuery(`
      UPDATE subscriptions SET
        status_id = $1,
        updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `, [status_id, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Subscription not found'
      });
    }

    res.json({
      success: true,
      message: 'Subscription status updated successfully',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Update subscription status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

module.exports = router;