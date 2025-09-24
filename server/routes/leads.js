const express = require('express');
const { executeQuery } = require('../config/database');
const { validateLead, validateId, validatePagination } = require('../middleware/validation');
const { verifyToken, requireCompanyOwnerOrAdmin } = require('../middleware/auth');

const router = express.Router();

// Get all leads
router.get('/', verifyToken, validatePagination, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      search = '',
      sortBy = 'created_at',
      sortOrder = 'desc',
      status,
      companyId,
      priority
    } = req.query;
    
    const offset = (page - 1) * limit;
    
    let whereClause = 'WHERE 1=1';
    const params = { offset, limit };
    
    // Add search filter
    if (search) {
      whereClause += ' AND (l.customer_name LIKE @search OR l.customer_phone LIKE @search OR l.customer_email LIKE @search)';
      params.search = `%${search}%`;
    }
    
    // Add status filter
    if (status) {
      whereClause += ' AND l.status = @status';
      params.status = status;
    }
    
    // Add company filter
    if (companyId) {
      whereClause += ' AND l.company_id = @companyId';
      params.companyId = companyId;
    }
    
    // Add priority filter
    if (priority) {
      whereClause += ' AND l.priority = @priority';
      params.priority = priority;
    }
    
    // Get leads with pagination
    const leadsQuery = `
      SELECT l.lead_id, l.company_id, l.driver_id, l.customer_name, l.customer_phone, l.customer_email,
             l.service_type, l.pickup_location, l.destination, l.pickup_time, l.estimated_fare,
             l.status, l.notes, l.source, l.priority, l.created_at, l.updated_at,
             c.name as company_name, d.name as driver_name
      FROM leads l
      LEFT JOIN companies c ON c.company_id = l.company_id
      LEFT JOIN drivers d ON d.driver_id = l.driver_id
      ${whereClause}
      ORDER BY l.${sortBy} ${sortOrder.toUpperCase()}
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `;
    
    const leadsResult = await executeQuery(leadsQuery, params);
    
    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM leads l
      ${whereClause}
    `;
    
    const countResult = await executeQuery(countQuery, params);
    const total = countResult.recordset[0].total;
    
    res.json({
      success: true,
      data: leadsResult.recordset,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total,
        totalPages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Get leads error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to get leads'
    });
  }
});

// Get lead by ID
router.get('/:id', verifyToken, validateId, async (req, res) => {
  try {
    const { id } = req.params;
    
    const leadQuery = `
      SELECT l.lead_id, l.company_id, l.driver_id, l.customer_name, l.customer_phone, l.customer_email,
             l.service_type, l.pickup_location, l.destination, l.pickup_time, l.estimated_fare,
             l.status, l.notes, l.source, l.priority, l.created_at, l.updated_at,
             c.name as company_name, d.name as driver_name
      FROM leads l
      LEFT JOIN companies c ON c.company_id = l.company_id
      LEFT JOIN drivers d ON d.driver_id = l.driver_id
      WHERE l.lead_id = @id
    `;
    
    const leadResult = await executeQuery(leadQuery, { id });
    
    if (leadResult.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Lead not found'
      });
    }
    
    res.json({
      success: true,
      data: leadResult.recordset[0]
    });
    
  } catch (error) {
    console.error('Get lead error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to get lead'
    });
  }
});

// Create lead
router.post('/', verifyToken, validateLead, async (req, res) => {
  try {
    const {
      company_id,
      driver_id,
      customer_name,
      customer_phone,
      customer_email,
      service_type,
      pickup_location,
      destination,
      pickup_time,
      estimated_fare,
      notes,
      source,
      priority,
      status = 'new'
    } = req.body;
    
    const createLeadQuery = `
      INSERT INTO leads (
        company_id, driver_id, customer_name, customer_phone, customer_email,
        service_type, pickup_location, destination, pickup_time, estimated_fare,
        notes, source, priority, status
      )
      OUTPUT INSERTED.lead_id
      VALUES (
        @company_id, @driver_id, @customer_name, @customer_phone, @customer_email,
        @service_type, @pickup_location, @destination, @pickup_time, @estimated_fare,
        @notes, @source, @priority, @status
      )
    `;
    
    const leadResult = await executeQuery(createLeadQuery, {
      company_id,
      driver_id,
      customer_name,
      customer_phone,
      customer_email,
      service_type,
      pickup_location,
      destination,
      pickup_time,
      estimated_fare,
      notes,
      source,
      priority,
      status
    });
    
    const leadId = leadResult.recordset[0].lead_id;
    
    // Get created lead details
    const leadQuery = `
      SELECT l.lead_id, l.company_id, l.driver_id, l.customer_name, l.customer_phone, l.customer_email,
             l.service_type, l.pickup_location, l.destination, l.pickup_time, l.estimated_fare,
             l.status, l.notes, l.source, l.priority, l.created_at, l.updated_at,
             c.name as company_name, d.name as driver_name
      FROM leads l
      LEFT JOIN companies c ON c.company_id = l.company_id
      LEFT JOIN drivers d ON d.driver_id = l.driver_id
      WHERE l.lead_id = @lead_id
    `;
    
    const leadDetails = await executeQuery(leadQuery, { lead_id: leadId });
    
    res.status(201).json({
      success: true,
      data: leadDetails.recordset[0],
      message: 'Lead created successfully'
    });
    
  } catch (error) {
    console.error('Create lead error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to create lead'
    });
  }
});

// Update lead
router.put('/:id', verifyToken, validateId, validateLead, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      company_id,
      driver_id,
      customer_name,
      customer_phone,
      customer_email,
      service_type,
      pickup_location,
      destination,
      pickup_time,
      estimated_fare,
      notes,
      source,
      priority,
      status
    } = req.body;
    
    const updateLeadQuery = `
      UPDATE leads 
      SET company_id = @company_id,
          driver_id = @driver_id,
          customer_name = @customer_name,
          customer_phone = @customer_phone,
          customer_email = @customer_email,
          service_type = @service_type,
          pickup_location = @pickup_location,
          destination = @destination,
          pickup_time = @pickup_time,
          estimated_fare = @estimated_fare,
          notes = @notes,
          source = @source,
          priority = @priority,
          status = @status,
          updated_at = GETUTCDATE()
      WHERE lead_id = @id
    `;
    
    await executeQuery(updateLeadQuery, {
      id,
      company_id,
      driver_id,
      customer_name,
      customer_phone,
      customer_email,
      service_type,
      pickup_location,
      destination,
      pickup_time,
      estimated_fare,
      notes,
      source,
      priority,
      status
    });
    
    // Get updated lead details
    const leadQuery = `
      SELECT l.lead_id, l.company_id, l.driver_id, l.customer_name, l.customer_phone, l.customer_email,
             l.service_type, l.pickup_location, l.destination, l.pickup_time, l.estimated_fare,
             l.status, l.notes, l.source, l.priority, l.created_at, l.updated_at,
             c.name as company_name, d.name as driver_name
      FROM leads l
      LEFT JOIN companies c ON c.company_id = l.company_id
      LEFT JOIN drivers d ON d.driver_id = l.driver_id
      WHERE l.lead_id = @id
    `;
    
    const leadDetails = await executeQuery(leadQuery, { id });
    
    res.json({
      success: true,
      data: leadDetails.recordset[0],
      message: 'Lead updated successfully'
    });
    
  } catch (error) {
    console.error('Update lead error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to update lead'
    });
  }
});

// Delete lead
router.delete('/:id', verifyToken, validateId, async (req, res) => {
  try {
    const { id } = req.params;
    
    const deleteLeadQuery = 'DELETE FROM leads WHERE lead_id = @id';
    
    await executeQuery(deleteLeadQuery, { id });
    
    res.json({
      success: true,
      message: 'Lead deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete lead error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to delete lead'
    });
  }
});

module.exports = router;
