const express = require('express');
const { executeQuery } = require('../config/database');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Get dashboard stats
router.get('/stats', verifyToken, async (req, res) => {
  try {
    const statsQuery = `
      SELECT 
        (SELECT COUNT(*) FROM companies WHERE status != 'deleted') as total_companies,
        (SELECT COUNT(*) FROM drivers WHERE status != 'deleted') as total_drivers,
        (SELECT COUNT(*) FROM advertisements WHERE status_id = 2) as total_ads,
        (SELECT COUNT(*) FROM subscriptions WHERE status_id = 2) as active_subscriptions,
        (SELECT COUNT(*) FROM payments WHERE status_id = 2) as total_payments,
        (SELECT SUM(amount) FROM payments WHERE status_id = 2) as total_revenue,
        (SELECT COUNT(*) FROM companies WHERE status = 'pending') as pending_approvals
    `;
    
    const statsResult = await executeQuery(statsQuery);
    const stats = statsResult.recordset[0];
    
    // Get monthly growth
    const growthQuery = `
      SELECT 
        (SELECT COUNT(*) FROM companies WHERE created_at >= DATEADD(month, -1, GETUTCDATE())) as companies_growth,
        (SELECT COUNT(*) FROM drivers WHERE created_at >= DATEADD(month, -1, GETUTCDATE())) as drivers_growth,
        (SELECT COUNT(*) FROM advertisements WHERE created_at >= DATEADD(month, -1, GETUTCDATE())) as ads_growth,
        (SELECT SUM(amount) FROM payments WHERE status_id = 2 AND created_at >= DATEADD(month, -1, GETUTCDATE())) as revenue_growth
    `;
    
    const growthResult = await executeQuery(growthQuery);
    const growth = growthResult.recordset[0];
    
    res.json({
      success: true,
      data: {
        ...stats,
        monthlyGrowth: growth
      }
    });
    
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to get dashboard stats'
    });
  }
});

// Get company dashboard stats
router.get('/company/:id/stats', verifyToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const statsQuery = `
      SELECT 
        (SELECT COUNT(*) FROM advertisements WHERE company_id = @id) as total_ads,
        (SELECT COUNT(*) FROM advertisements WHERE company_id = @id AND status_id = 2) as active_ads,
        (SELECT COUNT(*) FROM advertisements WHERE company_id = @id AND status_id = 1) as draft_ads,
        (SELECT COUNT(*) FROM advertisements WHERE company_id = @id AND status_id = 4) as expired_ads,
        (SELECT COUNT(*) FROM company_subscriptions cs 
         JOIN subscriptions s ON s.subscription_id = cs.subscription_id 
         WHERE cs.company_id = @id AND s.status_id = 2) as active_subscriptions,
        (SELECT COUNT(*) FROM company_subscriptions cs 
         JOIN subscriptions s ON s.subscription_id = cs.subscription_id 
         WHERE cs.company_id = @id AND s.status_id = 1) as pending_subscriptions,
        (SELECT COUNT(*) FROM payments p
         JOIN company_subscriptions cs ON cs.subscription_id = p.subscription_id
         WHERE cs.company_id = @id AND p.status_id = 2) as successful_payments,
        (SELECT COUNT(*) FROM payments p
         JOIN company_subscriptions cs ON cs.subscription_id = p.subscription_id
         WHERE cs.company_id = @id AND p.status_id = 4) as refunded_payments
    `;
    
    const statsResult = await executeQuery(statsQuery, { id });
    
    res.json({
      success: true,
      data: statsResult.recordset[0]
    });
    
  } catch (error) {
    console.error('Get company dashboard stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to get company dashboard stats'
    });
  }
});

// Get driver dashboard stats
router.get('/driver/:id/stats', verifyToken, async (req, res) => {
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
    console.error('Get driver dashboard stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to get driver dashboard stats'
    });
  }
});

module.exports = router;
