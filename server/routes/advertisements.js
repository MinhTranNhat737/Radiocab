const express = require('express');
const { executeQuery } = require('../config/database');
const { validateAdvertisement, validateId, validatePagination } = require('../middleware/validation');
const { verifyToken, requireCompanyOwnerOrAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all advertisements
router.get('/', verifyToken, validatePagination, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'created_at',
      sortOrder = 'desc',
      status,
      companyId
    } = req.query;
    
    const offset = (page - 1) * limit;
    
    let whereClause = 'WHERE 1=1';
    const params = { offset, limit };
    
    // Add search filter
    if (search) {
      whereClause += ' AND (a.title LIKE @search OR a.description LIKE @search)';
      params.search = `%${search}%`;
    }
    
    // Add status filter
    if (status) {
      whereClause += ' AND a.status_id = @status';
      params.status = status;
    }
    
    // Add company filter
    if (companyId) {
      whereClause += ' AND a.company_id = @companyId';
      params.companyId = companyId;
    }
    
    // Get advertisements with pagination
    const adsQuery = `
      SELECT a.ad_id, a.company_id, a.title, a.description, a.status_id, 
             a.start_date, a.end_date, a.created_at, a.updated_at,
             c.name as company_name, c.company_code,
             ast.name as status_name
      FROM advertisements a
      LEFT JOIN companies c ON c.company_id = a.company_id
      LEFT JOIN ad_statuses ast ON ast.status_id = a.status_id
      ${whereClause}
      ORDER BY a.${sortBy} ${sortOrder.toUpperCase()}
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `;
    
    const adsResult = await executeQuery(adsQuery, params);
    
    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM advertisements a
      ${whereClause}
    `;
    
    const countResult = await executeQuery(countQuery, params);
    const total = countResult.recordset[0].total;
    
    res.json({
      success: true,
      data: adsResult.recordset,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total,
        totalPages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Get advertisements error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to get advertisements'
    });
  }
});

// Get advertisement by ID
router.get('/:id', verifyToken, validateId, async (req, res) => {
  try {
    const { id } = req.params;
    
    const adQuery = `
      SELECT a.ad_id, a.company_id, a.title, a.description, a.status_id, 
             a.start_date, a.end_date, a.created_at, a.updated_at,
             c.name as company_name, c.company_code,
             ast.name as status_name
      FROM advertisements a
      LEFT JOIN companies c ON c.company_id = a.company_id
      LEFT JOIN ad_statuses ast ON ast.status_id = a.status_id
      WHERE a.ad_id = @id
    `;
    
    const adResult = await executeQuery(adQuery, { id });
    
    if (adResult.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Advertisement not found'
      });
    }
    
    res.json({
      success: true,
      data: adResult.recordset[0]
    });
    
  } catch (error) {
    console.error('Get advertisement error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to get advertisement'
    });
  }
});

// Create advertisement
router.post('/', verifyToken, validateAdvertisement, requireCompanyOwnerOrAdmin, async (req, res) => {
  try {
    const {
      company_id,
      title,
      description,
      status_id,
      start_date,
      end_date
    } = req.body;
    
    const createAdQuery = `
      INSERT INTO advertisements (
        company_id, title, description, status_id, start_date, end_date
      )
      OUTPUT INSERTED.ad_id
      VALUES (
        @company_id, @title, @description, @status_id, @start_date, @end_date
      )
    `;
    
    const adResult = await executeQuery(createAdQuery, {
      company_id,
      title,
      description,
      status_id,
      start_date,
      end_date
    });
    
    const adId = adResult.recordset[0].ad_id;
    
    // Get created advertisement details
    const adQuery = `
      SELECT a.ad_id, a.company_id, a.title, a.description, a.status_id, 
             a.start_date, a.end_date, a.created_at, a.updated_at,
             c.name as company_name, c.company_code,
             ast.name as status_name
      FROM advertisements a
      LEFT JOIN companies c ON c.company_id = a.company_id
      LEFT JOIN ad_statuses ast ON ast.status_id = a.status_id
      WHERE a.ad_id = @ad_id
    `;
    
    const adDetails = await executeQuery(adQuery, { ad_id: adId });
    
    res.status(201).json({
      success: true,
      data: adDetails.recordset[0],
      message: 'Advertisement created successfully'
    });
    
  } catch (error) {
    console.error('Create advertisement error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to create advertisement'
    });
  }
});

// Update advertisement
router.put('/:id', verifyToken, validateId, validateAdvertisement, requireCompanyOwnerOrAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      status_id,
      start_date,
      end_date
    } = req.body;
    
    const updateAdQuery = `
      UPDATE advertisements 
      SET title = @title,
          description = @description,
          status_id = @status_id,
          start_date = @start_date,
          end_date = @end_date,
          updated_at = GETUTCDATE()
      WHERE ad_id = @id
    `;
    
    await executeQuery(updateAdQuery, {
      id,
      title,
      description,
      status_id,
      start_date,
      end_date
    });
    
    // Get updated advertisement details
    const adQuery = `
      SELECT a.ad_id, a.company_id, a.title, a.description, a.status_id, 
             a.start_date, a.end_date, a.created_at, a.updated_at,
             c.name as company_name, c.company_code,
             ast.name as status_name
      FROM advertisements a
      LEFT JOIN companies c ON c.company_id = a.company_id
      LEFT JOIN ad_statuses ast ON ast.status_id = a.status_id
      WHERE a.ad_id = @id
    `;
    
    const adDetails = await executeQuery(adQuery, { id });
    
    res.json({
      success: true,
      data: adDetails.recordset[0],
      message: 'Advertisement updated successfully'
    });
    
  } catch (error) {
    console.error('Update advertisement error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to update advertisement'
    });
  }
});

// Delete advertisement
router.delete('/:id', verifyToken, validateId, requireCompanyOwnerOrAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    
    const deleteAdQuery = 'DELETE FROM advertisements WHERE ad_id = @id';
    
    await executeQuery(deleteAdQuery, { id });
    
    res.json({
      success: true,
      message: 'Advertisement deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete advertisement error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to delete advertisement'
    });
  }
});

module.exports = router;
