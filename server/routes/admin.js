const express = require('express');
const { executeQuery } = require('../config/database');
const { validateId } = require('../middleware/validation');
const { verifyToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Approve company
router.post('/companies/:id/approve', verifyToken, requireAdmin, validateId, async (req, res) => {
  try {
    const { id } = req.params;
    
    const approveCompanyQuery = `
      UPDATE companies 
      SET status = 'active', updated_at = GETUTCDATE()
      WHERE company_id = @id AND status = 'pending'
    `;
    
    const result = await executeQuery(approveCompanyQuery, { id });
    
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Company not found or not pending approval'
      });
    }
    
    res.json({
      success: true,
      message: 'Company approved successfully'
    });
    
  } catch (error) {
    console.error('Approve company error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to approve company'
    });
  }
});

// Reject company
router.post('/companies/:id/reject', verifyToken, requireAdmin, validateId, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    if (!reason) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Rejection reason is required'
      });
    }
    
    const rejectCompanyQuery = `
      UPDATE companies 
      SET status = 'suspended', updated_at = GETUTCDATE()
      WHERE company_id = @id AND status = 'pending'
    `;
    
    const result = await executeQuery(rejectCompanyQuery, { id });
    
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Company not found or not pending approval'
      });
    }
    
    res.json({
      success: true,
      message: 'Company rejected successfully',
      data: { reason }
    });
    
  } catch (error) {
    console.error('Reject company error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to reject company'
    });
  }
});

// Approve driver
router.post('/drivers/:id/approve', verifyToken, requireAdmin, validateId, async (req, res) => {
  try {
    const { id } = req.params;
    
    const approveDriverQuery = `
      UPDATE drivers 
      SET status = 'active', updated_at = GETUTCDATE()
      WHERE driver_id = @id AND status = 'pending'
    `;
    
    const result = await executeQuery(approveDriverQuery, { id });
    
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Driver not found or not pending approval'
      });
    }
    
    res.json({
      success: true,
      message: 'Driver approved successfully'
    });
    
  } catch (error) {
    console.error('Approve driver error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to approve driver'
    });
  }
});

// Reject driver
router.post('/drivers/:id/reject', verifyToken, requireAdmin, validateId, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    if (!reason) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Rejection reason is required'
      });
    }
    
    const rejectDriverQuery = `
      UPDATE drivers 
      SET status = 'suspended', updated_at = GETUTCDATE()
      WHERE driver_id = @id AND status = 'pending'
    `;
    
    const result = await executeQuery(rejectDriverQuery, { id });
    
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Driver not found or not pending approval'
      });
    }
    
    res.json({
      success: true,
      message: 'Driver rejected successfully',
      data: { reason }
    });
    
  } catch (error) {
    console.error('Reject driver error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to reject driver'
    });
  }
});

// Approve advertisement
router.post('/advertisements/:id/approve', verifyToken, requireAdmin, validateId, async (req, res) => {
  try {
    const { id } = req.params;
    
    const approveAdQuery = `
      UPDATE advertisements 
      SET status_id = 2, updated_at = GETUTCDATE()
      WHERE ad_id = @id AND status_id = 1
    `;
    
    const result = await executeQuery(approveAdQuery, { id });
    
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Advertisement not found or not pending approval'
      });
    }
    
    res.json({
      success: true,
      message: 'Advertisement approved successfully'
    });
    
  } catch (error) {
    console.error('Approve advertisement error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to approve advertisement'
    });
  }
});

// Reject advertisement
router.post('/advertisements/:id/reject', verifyToken, requireAdmin, validateId, async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;
    
    if (!reason) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Rejection reason is required'
      });
    }
    
    const rejectAdQuery = `
      UPDATE advertisements 
      SET status_id = 4, updated_at = GETUTCDATE()
      WHERE ad_id = @id AND status_id = 1
    `;
    
    const result = await executeQuery(rejectAdQuery, { id });
    
    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Advertisement not found or not pending approval'
      });
    }
    
    res.json({
      success: true,
      message: 'Advertisement rejected successfully',
      data: { reason }
    });
    
  } catch (error) {
    console.error('Reject advertisement error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to reject advertisement'
    });
  }
});

// Get pending approvals
router.get('/pending', verifyToken, requireAdmin, async (req, res) => {
  try {
    const pendingQuery = `
      SELECT 
        'company' as type,
        c.company_id as id,
        c.name as title,
        c.company_code as code,
        c.created_at,
        c.contact_person
      FROM companies c
      WHERE c.status = 'pending'
      
      UNION ALL
      
      SELECT 
        'driver' as type,
        d.driver_id as id,
        d.name as title,
        d.driver_code as code,
        d.created_at,
        d.contact_person
      FROM drivers d
      WHERE d.status = 'pending'
      
      UNION ALL
      
      SELECT 
        'advertisement' as type,
        a.ad_id as id,
        a.title,
        a.ad_id as code,
        a.created_at,
        c.name as contact_person
      FROM advertisements a
      LEFT JOIN companies c ON c.company_id = a.company_id
      WHERE a.status_id = 1
      
      ORDER BY created_at DESC
    `;
    
    const pendingResult = await executeQuery(pendingQuery);
    
    res.json({
      success: true,
      data: pendingResult.recordset
    });
    
  } catch (error) {
    console.error('Get pending approvals error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to get pending approvals'
    });
  }
});

// Get admin dashboard stats
router.get('/dashboard', verifyToken, requireAdmin, async (req, res) => {
  try {
    const statsQuery = `
      SELECT 
        (SELECT COUNT(*) FROM companies WHERE status = 'pending') as pending_companies,
        (SELECT COUNT(*) FROM drivers WHERE status = 'pending') as pending_drivers,
        (SELECT COUNT(*) FROM advertisements WHERE status_id = 1) as pending_ads,
        (SELECT COUNT(*) FROM companies WHERE status = 'active') as active_companies,
        (SELECT COUNT(*) FROM drivers WHERE status = 'active') as active_drivers,
        (SELECT COUNT(*) FROM advertisements WHERE status_id = 2) as active_ads,
        (SELECT COUNT(*) FROM subscriptions WHERE status_id = 2) as active_subscriptions,
        (SELECT SUM(amount) FROM payments WHERE status_id = 2) as total_revenue
    `;
    
    const statsResult = await executeQuery(statsQuery);
    
    res.json({
      success: true,
      data: statsResult.recordset[0]
    });
    
  } catch (error) {
    console.error('Get admin dashboard error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to get admin dashboard'
    });
  }
});

module.exports = router;
