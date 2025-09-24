const express = require('express');
const { executeQuery } = require('../config/database');
const { validateSubscription, validateId, validatePagination } = require('../middleware/validation');
const { verifyToken, requireCompanyOwnerOrAdmin, requireDriverOwnerOrAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all subscriptions
router.get('/', verifyToken, validatePagination, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'created_at',
      sortOrder = 'desc',
      status,
      planId,
      companyId,
      driverId
    } = req.query;
    
    const offset = (page - 1) * limit;
    
    let whereClause = 'WHERE 1=1';
    const params = { offset, limit };
    
    // Add status filter
    if (status) {
      whereClause += ' AND s.status_id = @status';
      params.status = status;
    }
    
    // Add plan filter
    if (planId) {
      whereClause += ' AND s.plan_id = @planId';
      params.planId = planId;
    }
    
    // Add company filter
    if (companyId) {
      whereClause += ' AND cs.company_id = @companyId';
      params.companyId = companyId;
    }
    
    // Add driver filter
    if (driverId) {
      whereClause += ' AND ds.driver_id = @driverId';
      params.driverId = driverId;
    }
    
    // Get subscriptions with pagination
    const subscriptionsQuery = `
      SELECT s.subscription_id, s.plan_id, s.status_id, s.start_date, s.end_date, s.created_at, s.updated_at,
             p.name as plan_name, p.price, p.currency,
             ss.name as status_name,
             c.name as company_name, d.name as driver_name
      FROM subscriptions s
      LEFT JOIN plans p ON p.plan_id = s.plan_id
      LEFT JOIN subscription_statuses ss ON ss.status_id = s.status_id
      LEFT JOIN company_subscriptions cs ON cs.subscription_id = s.subscription_id
      LEFT JOIN companies c ON c.company_id = cs.company_id
      LEFT JOIN driver_subscriptions ds ON ds.subscription_id = s.subscription_id
      LEFT JOIN drivers d ON d.driver_id = ds.driver_id
      ${whereClause}
      ORDER BY s.${sortBy} ${sortOrder.toUpperCase()}
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `;
    
    const subscriptionsResult = await executeQuery(subscriptionsQuery, params);
    
    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM subscriptions s
      LEFT JOIN company_subscriptions cs ON cs.subscription_id = s.subscription_id
      LEFT JOIN driver_subscriptions ds ON ds.subscription_id = s.subscription_id
      ${whereClause}
    `;
    
    const countResult = await executeQuery(countQuery, params);
    const total = countResult.recordset[0].total;
    
    res.json({
      success: true,
      data: subscriptionsResult.recordset,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total,
        totalPages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Get subscriptions error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to get subscriptions'
    });
  }
});

// Get subscription by ID
router.get('/:id', verifyToken, validateId, async (req, res) => {
  try {
    const { id } = req.params;
    
    const subscriptionQuery = `
      SELECT s.subscription_id, s.plan_id, s.status_id, s.start_date, s.end_date, s.created_at, s.updated_at,
             p.name as plan_name, p.price, p.currency,
             ss.name as status_name,
             c.name as company_name, d.name as driver_name
      FROM subscriptions s
      LEFT JOIN plans p ON p.plan_id = s.plan_id
      LEFT JOIN subscription_statuses ss ON ss.status_id = s.status_id
      LEFT JOIN company_subscriptions cs ON cs.subscription_id = s.subscription_id
      LEFT JOIN companies c ON c.company_id = cs.company_id
      LEFT JOIN driver_subscriptions ds ON ds.subscription_id = s.subscription_id
      LEFT JOIN drivers d ON d.driver_id = ds.driver_id
      WHERE s.subscription_id = @id
    `;
    
    const subscriptionResult = await executeQuery(subscriptionQuery, { id });
    
    if (subscriptionResult.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Subscription not found'
      });
    }
    
    res.json({
      success: true,
      data: subscriptionResult.recordset[0]
    });
    
  } catch (error) {
    console.error('Get subscription error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to get subscription'
    });
  }
});

// Create subscription
router.post('/', verifyToken, validateSubscription, async (req, res) => {
  try {
    const {
      plan_id,
      status_id,
      start_date,
      end_date,
      company_id,
      driver_id
    } = req.body;
    
    // Create subscription
    const createSubscriptionQuery = `
      INSERT INTO subscriptions (plan_id, status_id, start_date, end_date)
      OUTPUT INSERTED.subscription_id
      VALUES (@plan_id, @status_id, @start_date, @end_date)
    `;
    
    const subscriptionResult = await executeQuery(createSubscriptionQuery, {
      plan_id,
      status_id,
      start_date,
      end_date
    });
    
    const subscriptionId = subscriptionResult.recordset[0].subscription_id;
    
    // Link to company or driver
    if (company_id) {
      const linkCompanyQuery = `
        INSERT INTO company_subscriptions (subscription_id, company_id)
        VALUES (@subscription_id, @company_id)
      `;
      await executeQuery(linkCompanyQuery, { subscription_id: subscriptionId, company_id });
    }
    
    if (driver_id) {
      const linkDriverQuery = `
        INSERT INTO driver_subscriptions (subscription_id, driver_id)
        VALUES (@subscription_id, @driver_id)
      `;
      await executeQuery(linkDriverQuery, { subscription_id: subscriptionId, driver_id });
    }
    
    // Get created subscription details
    const subscriptionQuery = `
      SELECT s.subscription_id, s.plan_id, s.status_id, s.start_date, s.end_date, s.created_at, s.updated_at,
             p.name as plan_name, p.price, p.currency,
             ss.name as status_name
      FROM subscriptions s
      LEFT JOIN plans p ON p.plan_id = s.plan_id
      LEFT JOIN subscription_statuses ss ON ss.status_id = s.status_id
      WHERE s.subscription_id = @subscription_id
    `;
    
    const subscriptionDetails = await executeQuery(subscriptionQuery, { subscription_id: subscriptionId });
    
    res.status(201).json({
      success: true,
      data: subscriptionDetails.recordset[0],
      message: 'Subscription created successfully'
    });
    
  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to create subscription'
    });
  }
});

// Update subscription
router.put('/:id', verifyToken, validateId, validateSubscription, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      plan_id,
      status_id,
      start_date,
      end_date
    } = req.body;
    
    const updateSubscriptionQuery = `
      UPDATE subscriptions 
      SET plan_id = @plan_id,
          status_id = @status_id,
          start_date = @start_date,
          end_date = @end_date,
          updated_at = GETUTCDATE()
      WHERE subscription_id = @id
    `;
    
    await executeQuery(updateSubscriptionQuery, {
      id,
      plan_id,
      status_id,
      start_date,
      end_date
    });
    
    // Get updated subscription details
    const subscriptionQuery = `
      SELECT s.subscription_id, s.plan_id, s.status_id, s.start_date, s.end_date, s.created_at, s.updated_at,
             p.name as plan_name, p.price, p.currency,
             ss.name as status_name
      FROM subscriptions s
      LEFT JOIN plans p ON p.plan_id = s.plan_id
      LEFT JOIN subscription_statuses ss ON ss.status_id = s.status_id
      WHERE s.subscription_id = @id
    `;
    
    const subscriptionDetails = await executeQuery(subscriptionQuery, { id });
    
    res.json({
      success: true,
      data: subscriptionDetails.recordset[0],
      message: 'Subscription updated successfully'
    });
    
  } catch (error) {
    console.error('Update subscription error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to update subscription'
    });
  }
});

// Cancel subscription
router.post('/:id/cancel', verifyToken, validateId, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    const cancelSubscriptionQuery = `
      UPDATE subscriptions 
      SET status_id = 4, updated_at = GETUTCDATE()
      WHERE subscription_id = @id
    `;
    
    await executeQuery(cancelSubscriptionQuery, { id });
    
    res.json({
      success: true,
      message: 'Subscription cancelled successfully'
    });
    
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to cancel subscription'
    });
  }
});

// Delete subscription
router.delete('/:id', verifyToken, validateId, async (req, res) => {
  try {
    const { id } = req.params;
    
    const deleteSubscriptionQuery = 'DELETE FROM subscriptions WHERE subscription_id = @id';
    
    await executeQuery(deleteSubscriptionQuery, { id });
    
    res.json({
      success: true,
      message: 'Subscription deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete subscription error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to delete subscription'
    });
  }
});

module.exports = router;
