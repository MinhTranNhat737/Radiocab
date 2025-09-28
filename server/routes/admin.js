const express = require('express');
const { executeQuery } = require('../config/database');

const router = express.Router();

// Get admin dashboard stats
router.get('/stats', async (req, res) => {
  try {
    const [
      totalUsers,
      totalCompanies,
      totalDrivers,
      totalAdvertisements,
      totalPayments,
      totalSubscriptions,
      recentActivity
    ] = await Promise.all([
      executeQuery('SELECT COUNT(*) as count FROM users'),
      executeQuery('SELECT COUNT(*) as count FROM companies'),
      executeQuery('SELECT COUNT(*) as count FROM drivers'),
      executeQuery('SELECT COUNT(*) as count FROM advertisements'),
      executeQuery('SELECT COUNT(*) as count FROM payments'),
      executeQuery('SELECT COUNT(*) as count FROM subscriptions'),
      executeQuery(`
        SELECT 
          'user' as type,
          full_name as name,
          created_at
        FROM users 
        WHERE created_at >= NOW() - INTERVAL '7 days'
        UNION ALL
        SELECT 
          'company' as type,
          company_name as name,
          created_at
        FROM companies 
        WHERE created_at >= NOW() - INTERVAL '7 days'
        ORDER BY created_at DESC
        LIMIT 10
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
        recent_activity: recentActivity.rows
      }
    });

  } catch (error) {
    console.error('Get admin stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

module.exports = router;