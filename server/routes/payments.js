const express = require('express');
const { executeQuery } = require('../config/database');
const { validatePayment } = require('../middleware/validation');

const router = express.Router();

// Get all payments
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
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

    if (company_id) {
      paramCount++;
      whereConditions.push(`p.company_id = $${paramCount}`);
      queryParams.push(company_id);
    }

    if (driver_id) {
      paramCount++;
      whereConditions.push(`p.driver_id = $${paramCount}`);
      queryParams.push(driver_id);
    }

    if (status_id) {
      paramCount++;
      whereConditions.push(`p.status_id = $${paramCount}`);
      queryParams.push(status_id);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const countQuery = `SELECT COUNT(*) as total FROM payments p ${whereClause}`;
    const countResult = await executeQuery(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].total);

    const paymentsQuery = `
      SELECT 
        p.*,
        c.company_name,
        d.full_name as driver_name,
        pm.method_name,
        ps.status_name
      FROM payments p
      LEFT JOIN companies c ON p.company_id = c.id
      LEFT JOIN drivers d ON p.driver_id = d.id
      LEFT JOIN payment_methods pm ON p.payment_method_id = pm.id
      LEFT JOIN payment_statuses ps ON p.status_id = ps.id
      ${whereClause}
      ORDER BY p.${sort_by} ${sort_order}
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;

    queryParams.push(limit, offset);
    const result = await executeQuery(paymentsQuery, queryParams);

    res.json({
      success: true,
      data: {
        payments: result.rows,
        pagination: {
          current_page: parseInt(page),
          per_page: parseInt(limit),
          total: total,
          total_pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get payment by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await executeQuery(`
      SELECT 
        p.*,
        c.company_name,
        d.full_name as driver_name,
        pm.method_name,
        ps.status_name
      FROM payments p
      LEFT JOIN companies c ON p.company_id = c.id
      LEFT JOIN drivers d ON p.driver_id = d.id
      LEFT JOIN payment_methods pm ON p.payment_method_id = pm.id
      LEFT JOIN payment_statuses ps ON p.status_id = ps.id
      WHERE p.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Create new payment
router.post('/', validatePayment, async (req, res) => {
  try {
    const {
      amount,
      payment_method_id,
      subscription_id,
      company_id,
      driver_id,
      description,
      payment_date = new Date()
    } = req.body;

    const result = await executeQuery(`
      INSERT INTO payments (
        amount, payment_method_id, subscription_id,
        company_id, driver_id, description, payment_date,
        status_id, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, 1, NOW(), NOW())
      RETURNING *
    `, [
      amount, payment_method_id, subscription_id,
      company_id, driver_id, description, payment_date
    ]);

    res.status(201).json({
      success: true,
      message: 'Payment created successfully',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Update payment status
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status_id } = req.body;

    const result = await executeQuery(`
      UPDATE payments SET
        status_id = $1,
        updated_at = NOW()
      WHERE id = $2
      RETURNING *
    `, [status_id, id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }

    res.json({
      success: true,
      message: 'Payment status updated successfully',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

module.exports = router;