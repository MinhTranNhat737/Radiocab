const express = require('express');
const { executeQuery } = require('../config/database');

const router = express.Router();

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const [
      totalUsers,
      totalCompanies,
      totalDrivers,
      totalAdvertisements,
      totalPayments,
      totalSubscriptions,
      recentUsers,
      recentCompanies,
      recentDrivers,
      paymentStats,
      subscriptionStats
    ] = await Promise.all([
      executeQuery('SELECT COUNT(*) as count FROM users'),
      executeQuery('SELECT COUNT(*) as count FROM companies'),
      executeQuery('SELECT COUNT(*) as count FROM drivers'),
      executeQuery('SELECT COUNT(*) as count FROM advertisements'),
      executeQuery('SELECT COUNT(*) as count FROM payments'),
      executeQuery('SELECT COUNT(*) as count FROM subscriptions'),
      executeQuery('SELECT * FROM users ORDER BY created_at DESC LIMIT 5'),
      executeQuery('SELECT * FROM companies ORDER BY created_at DESC LIMIT 5'),
      executeQuery('SELECT * FROM drivers ORDER BY created_at DESC LIMIT 5'),
      executeQuery(`
        SELECT 
          COALESCE(SUM(amount), 0) as total_amount,
          COUNT(*) as total_count
        FROM payments 
        WHERE status_id = 2
      `),
      executeQuery(`
        SELECT 
          COUNT(*) as active_subscriptions
        FROM subscriptions 
        WHERE status_id = 1
      `)
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          total_users: parseInt(totalUsers.rows[0].count),
          total_companies: parseInt(totalCompanies.rows[0].count),
          total_drivers: parseInt(totalDrivers.rows[0].count),
          total_advertisements: parseInt(totalAdvertisements.rows[0].count),
          total_payments: parseInt(totalPayments.rows[0].count),
          total_subscriptions: parseInt(totalSubscriptions.rows[0].count)
        },
        recent_activity: {
          recent_users: recentUsers.rows,
          recent_companies: recentCompanies.rows,
          recent_drivers: recentDrivers.rows
        },
        financial: {
          total_payment_amount: parseFloat(paymentStats.rows[0].total_amount),
          total_payment_count: parseInt(paymentStats.rows[0].total_count),
          active_subscriptions: parseInt(subscriptionStats.rows[0].active_subscriptions)
        }
      }
    });

  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

module.exports = router;