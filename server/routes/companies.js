const express = require('express');
const { executeQuery } = require('../config/database');
const { validateCompany, validateId, validatePagination } = require('../middleware/validation');
const { verifyToken, requireCompanyOwnerOrAdmin, requireOwnership } = require('../middleware/auth');

const router = express.Router();

// Get all companies
router.get('/', verifyToken, validatePagination, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'created_at',
      sortOrder = 'desc',
      status,
      membershipType,
      cityId
    } = req.query;
    
    const offset = (page - 1) * limit;
    
    let whereClause = 'WHERE 1=1';
    const params = { offset, limit };
    
    // Add search filter
    if (search) {
      whereClause += ' AND (c.name LIKE @search OR c.contact_person LIKE @search OR c.email LIKE @search)';
      params.search = `%${search}%`;
    }
    
    // Add status filter
    if (status) {
      whereClause += ' AND c.status = @status';
      params.status = status;
    }
    
    // Add membership type filter
    if (membershipType) {
      whereClause += ' AND c.membership_type_id = @membershipType';
      params.membershipType = membershipType;
    }
    
    // Add city filter
    if (cityId) {
      whereClause += ' AND c.city_id = @cityId';
      params.cityId = cityId;
    }
    
    // Get companies with pagination
    const companiesQuery = `
      SELECT c.company_id, c.company_code, c.name, c.contact_person, c.designation,
             c.address_line, c.city_id, c.mobile, c.telephone, c.fax_number, c.email,
             c.membership_type_id, c.owner_user_id, c.status, c.created_at, c.updated_at,
             ci.name as city_name, s.name as state_name, co.name as country_name,
             mt.name as membership_type_name, u.full_name as owner_name
      FROM companies c
      LEFT JOIN cities ci ON ci.city_id = c.city_id
      LEFT JOIN states s ON s.state_id = ci.state_id
      LEFT JOIN countries co ON co.country_id = s.country_id
      LEFT JOIN membership_types mt ON mt.membership_type_id = c.membership_type_id
      LEFT JOIN users u ON u.user_id = c.owner_user_id
      ${whereClause}
      ORDER BY c.${sortBy} ${sortOrder.toUpperCase()}
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `;
    
    const companiesResult = await executeQuery(companiesQuery, params);
    
    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM companies c
      ${whereClause}
    `;
    
    const countResult = await executeQuery(countQuery, params);
    const total = countResult.recordset[0].total;
    
    res.json({
      success: true,
      data: companiesResult.recordset,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total,
        totalPages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Get companies error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to get companies'
    });
  }
});

// Get company by ID
router.get('/:id', verifyToken, validateId, async (req, res) => {
  try {
    const { id } = req.params;
    
    const companyQuery = `
      SELECT c.company_id, c.company_code, c.name, c.contact_person, c.designation,
             c.address_line, c.city_id, c.mobile, c.telephone, c.fax_number, c.email,
             c.membership_type_id, c.owner_user_id, c.status, c.created_at, c.updated_at,
             ci.name as city_name, s.name as state_name, co.name as country_name,
             mt.name as membership_type_name, u.full_name as owner_name
      FROM companies c
      LEFT JOIN cities ci ON ci.city_id = c.city_id
      LEFT JOIN states s ON s.state_id = ci.state_id
      LEFT JOIN countries co ON co.country_id = s.country_id
      LEFT JOIN membership_types mt ON mt.membership_type_id = c.membership_type_id
      LEFT JOIN users u ON u.user_id = c.owner_user_id
      WHERE c.company_id = @id
    `;
    
    const companyResult = await executeQuery(companyQuery, { id });
    
    if (companyResult.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Company not found'
      });
    }
    
    res.json({
      success: true,
      data: companyResult.recordset[0]
    });
    
  } catch (error) {
    console.error('Get company error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to get company'
    });
  }
});

// Create company
router.post('/', verifyToken, validateCompany, async (req, res) => {
  try {
    const {
      name,
      contact_person,
      designation,
      address_line,
      city_id,
      mobile,
      telephone,
      fax_number,
      email,
      membership_type_id,
      status = 'draft'
    } = req.body;
    
    // Generate company code
    const companyCode = `CAB${Date.now().toString().slice(-6)}`;
    
    const createCompanyQuery = `
      INSERT INTO companies (
        company_code, name, contact_person, designation, address_line, city_id,
        mobile, telephone, fax_number, email, membership_type_id, owner_user_id, status
      )
      OUTPUT INSERTED.company_id
      VALUES (
        @company_code, @name, @contact_person, @designation, @address_line, @city_id,
        @mobile, @telephone, @fax_number, @email, @membership_type_id, @owner_user_id, @status
      )
    `;
    
    const companyResult = await executeQuery(createCompanyQuery, {
      company_code: companyCode,
      name,
      contact_person,
      designation,
      address_line,
      city_id,
      mobile,
      telephone,
      fax_number,
      email,
      membership_type_id,
      owner_user_id: req.user.user_id,
      status
    });
    
    const companyId = companyResult.recordset[0].company_id;
    
    // Get created company details
    const companyQuery = `
      SELECT c.company_id, c.company_code, c.name, c.contact_person, c.designation,
             c.address_line, c.city_id, c.mobile, c.telephone, c.fax_number, c.email,
             c.membership_type_id, c.owner_user_id, c.status, c.created_at, c.updated_at,
             ci.name as city_name, mt.name as membership_type_name
      FROM companies c
      LEFT JOIN cities ci ON ci.city_id = c.city_id
      LEFT JOIN membership_types mt ON mt.membership_type_id = c.membership_type_id
      WHERE c.company_id = @company_id
    `;
    
    const companyDetails = await executeQuery(companyQuery, { company_id: companyId });
    
    res.status(201).json({
      success: true,
      data: companyDetails.recordset[0],
      message: 'Company created successfully'
    });
    
  } catch (error) {
    console.error('Create company error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to create company'
    });
  }
});

// Update company
router.put('/:id', verifyToken, validateId, validateCompany, requireOwnership('company'), async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      contact_person,
      designation,
      address_line,
      city_id,
      mobile,
      telephone,
      fax_number,
      email,
      membership_type_id,
      status
    } = req.body;
    
    const updateCompanyQuery = `
      UPDATE companies 
      SET name = @name,
          contact_person = @contact_person,
          designation = @designation,
          address_line = @address_line,
          city_id = @city_id,
          mobile = @mobile,
          telephone = @telephone,
          fax_number = @fax_number,
          email = @email,
          membership_type_id = @membership_type_id,
          status = @status,
          updated_at = GETUTCDATE()
      WHERE company_id = @id
    `;
    
    await executeQuery(updateCompanyQuery, {
      id,
      name,
      contact_person,
      designation,
      address_line,
      city_id,
      mobile,
      telephone,
      fax_number,
      email,
      membership_type_id,
      status
    });
    
    // Get updated company details
    const companyQuery = `
      SELECT c.company_id, c.company_code, c.name, c.contact_person, c.designation,
             c.address_line, c.city_id, c.mobile, c.telephone, c.fax_number, c.email,
             c.membership_type_id, c.owner_user_id, c.status, c.created_at, c.updated_at,
             ci.name as city_name, mt.name as membership_type_name
      FROM companies c
      LEFT JOIN cities ci ON ci.city_id = c.city_id
      LEFT JOIN membership_types mt ON mt.membership_type_id = c.membership_type_id
      WHERE c.company_id = @id
    `;
    
    const companyDetails = await executeQuery(companyQuery, { id });
    
    res.json({
      success: true,
      data: companyDetails.recordset[0],
      message: 'Company updated successfully'
    });
    
  } catch (error) {
    console.error('Update company error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to update company'
    });
  }
});

// Delete company
router.delete('/:id', verifyToken, validateId, requireOwnership('company'), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Soft delete by setting status to 'deleted'
    const deleteCompanyQuery = `
      UPDATE companies 
      SET status = 'deleted', updated_at = GETUTCDATE()
      WHERE company_id = @id
    `;
    
    await executeQuery(deleteCompanyQuery, { id });
    
    res.json({
      success: true,
      message: 'Company deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete company error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to delete company'
    });
  }
});

// Get company dashboard
router.get('/:id/dashboard', verifyToken, requireOwnership('company'), async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get company basic info
    const companyQuery = `
      SELECT c.company_id, c.company_code, c.name, c.status, c.created_at
      FROM companies c
      WHERE c.company_id = @id
    `;
    
    const companyResult = await executeQuery(companyQuery, { id });
    
    if (companyResult.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Company not found'
      });
    }
    
    const company = companyResult.recordset[0];
    
    // Get dashboard stats
    const statsQuery = `
      SELECT 
        (SELECT COUNT(*) FROM advertisements WHERE company_id = @id) as total_ads,
        (SELECT COUNT(*) FROM advertisements WHERE company_id = @id AND status_id = 2) as active_ads,
        (SELECT COUNT(*) FROM company_subscriptions cs 
         JOIN subscriptions s ON s.subscription_id = cs.subscription_id 
         WHERE cs.company_id = @id AND s.status_id = 2) as active_subscriptions,
        (SELECT COUNT(*) FROM payments p
         JOIN company_subscriptions cs ON cs.subscription_id = p.subscription_id
         WHERE cs.company_id = @id AND p.status_id = 2) as total_payments
    `;
    
    const statsResult = await executeQuery(statsQuery, { id });
    const stats = statsResult.recordset[0];
    
    // Get recent activity (simplified)
    const activityQuery = `
      SELECT TOP 5
        'advertisement' as type,
        a.title as title,
        a.created_at as created_at,
        ast.name as status
      FROM advertisements a
      LEFT JOIN ad_statuses ast ON ast.status_id = a.status_id
      WHERE a.company_id = @id
      ORDER BY a.created_at DESC
    `;
    
    const activityResult = await executeQuery(activityQuery, { id });
    
    res.json({
      success: true,
      data: {
        company,
        stats,
        recentActivity: activityResult.recordset
      }
    });
    
  } catch (error) {
    console.error('Get company dashboard error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to get company dashboard'
    });
  }
});

// Get company stats
router.get('/:id/stats', verifyToken, requireOwnership('company'), async (req, res) => {
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
    console.error('Get company stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to get company stats'
    });
  }
});

module.exports = router;
