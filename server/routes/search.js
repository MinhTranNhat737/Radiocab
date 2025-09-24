const express = require('express');
const { executeQuery } = require('../config/database');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Search across all entities
router.get('/', verifyToken, async (req, res) => {
  try {
    const {
      query: searchQuery,
      type = 'all',
      page = 1,
      limit = 10
    } = req.query;
    
    if (!searchQuery || searchQuery.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Search query must be at least 2 characters long'
      });
    }
    
    const offset = (page - 1) * limit;
    const searchTerm = `%${searchQuery.trim()}%`;
    const results = [];
    
    // Search companies
    if (type === 'all' || type === 'company') {
      const companiesQuery = `
        SELECT 'company' as type, c.company_id as id, c.name as title, c.company_code as code,
               c.status, c.created_at, ci.name as city_name
        FROM companies c
        LEFT JOIN cities ci ON ci.city_id = c.city_id
        WHERE (c.name LIKE @searchTerm OR c.company_code LIKE @searchTerm OR c.contact_person LIKE @searchTerm)
        AND c.status != 'deleted'
        ORDER BY c.name
        OFFSET @offset ROWS
        FETCH NEXT @limit ROWS ONLY
      `;
      
      const companiesResult = await executeQuery(companiesQuery, { 
        searchTerm, 
        offset: type === 'company' ? offset : 0, 
        limit: type === 'company' ? limit : 5 
      });
      
      results.push(...companiesResult.recordset);
    }
    
    // Search drivers
    if (type === 'all' || type === 'driver') {
      const driversQuery = `
        SELECT 'driver' as type, d.driver_id as id, d.name as title, d.driver_code as code,
               d.status, d.created_at, ci.name as city_name
        FROM drivers d
        LEFT JOIN cities ci ON ci.city_id = d.city_id
        WHERE (d.name LIKE @searchTerm OR d.driver_code LIKE @searchTerm OR d.contact_person LIKE @searchTerm)
        AND d.status != 'deleted'
        ORDER BY d.name
        OFFSET @offset ROWS
        FETCH NEXT @limit ROWS ONLY
      `;
      
      const driversResult = await executeQuery(driversQuery, { 
        searchTerm, 
        offset: type === 'driver' ? offset : 0, 
        limit: type === 'driver' ? limit : 5 
      });
      
      results.push(...driversResult.recordset);
    }
    
    // Search advertisements
    if (type === 'all' || type === 'ad') {
      const adsQuery = `
        SELECT 'advertisement' as type, a.ad_id as id, a.title, a.ad_id as code,
               ast.name as status, a.created_at, c.name as company_name
        FROM advertisements a
        LEFT JOIN companies c ON c.company_id = a.company_id
        LEFT JOIN ad_statuses ast ON ast.status_id = a.status_id
        WHERE (a.title LIKE @searchTerm OR a.description LIKE @searchTerm)
        ORDER BY a.title
        OFFSET @offset ROWS
        FETCH NEXT @limit ROWS ONLY
      `;
      
      const adsResult = await executeQuery(adsQuery, { 
        searchTerm, 
        offset: type === 'ad' ? offset : 0, 
        limit: type === 'ad' ? limit : 5 
      });
      
      results.push(...adsResult.recordset);
    }
    
    // Search leads
    if (type === 'all' || type === 'lead') {
      const leadsQuery = `
        SELECT 'lead' as type, l.lead_id as id, l.customer_name as title, l.lead_id as code,
               l.status, l.created_at, l.priority, c.name as company_name
        FROM leads l
        LEFT JOIN companies c ON c.company_id = l.company_id
        WHERE (l.customer_name LIKE @searchTerm OR l.customer_phone LIKE @searchTerm OR l.service_type LIKE @searchTerm)
        ORDER BY l.created_at DESC
        OFFSET @offset ROWS
        FETCH NEXT @limit ROWS ONLY
      `;
      
      const leadsResult = await executeQuery(leadsQuery, { 
        searchTerm, 
        offset: type === 'lead' ? offset : 0, 
        limit: type === 'lead' ? limit : 5 
      });
      
      results.push(...leadsResult.recordset);
    }
    
    // Get total count for pagination
    let totalCount = 0;
    if (type !== 'all') {
      const countQuery = `
        SELECT COUNT(*) as total
        FROM (
          ${type === 'company' ? `
            SELECT c.company_id FROM companies c
            WHERE (c.name LIKE @searchTerm OR c.company_code LIKE @searchTerm OR c.contact_person LIKE @searchTerm)
            AND c.status != 'deleted'
          ` : ''}
          ${type === 'driver' ? `
            SELECT d.driver_id FROM drivers d
            WHERE (d.name LIKE @searchTerm OR d.driver_code LIKE @searchTerm OR d.contact_person LIKE @searchTerm)
            AND d.status != 'deleted'
          ` : ''}
          ${type === 'ad' ? `
            SELECT a.ad_id FROM advertisements a
            WHERE (a.title LIKE @searchTerm OR a.description LIKE @searchTerm)
          ` : ''}
          ${type === 'lead' ? `
            SELECT l.lead_id FROM leads l
            WHERE (l.customer_name LIKE @searchTerm OR l.customer_phone LIKE @searchTerm OR l.service_type LIKE @searchTerm)
          ` : ''}
        ) as search_results
      `;
      
      const countResult = await executeQuery(countQuery, { searchTerm });
      totalCount = countResult.recordset[0].total;
    }
    
    res.json({
      success: true,
      data: {
        results: results,
        total: totalCount,
        page: parseInt(page),
        limit: parseInt(limit),
        query: searchQuery,
        type: type
      }
    });
    
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Search failed'
    });
  }
});

// Search companies
router.get('/companies', verifyToken, async (req, res) => {
  try {
    const {
      query: searchQuery,
      page = 1,
      limit = 10
    } = req.query;
    
    if (!searchQuery || searchQuery.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Search query must be at least 2 characters long'
      });
    }
    
    const offset = (page - 1) * limit;
    const searchTerm = `%${searchQuery.trim()}%`;
    
    const companiesQuery = `
      SELECT c.company_id, c.company_code, c.name, c.contact_person, c.status, c.created_at,
             ci.name as city_name, s.name as state_name, co.name as country_name
      FROM companies c
      LEFT JOIN cities ci ON ci.city_id = c.city_id
      LEFT JOIN states s ON s.state_id = ci.state_id
      LEFT JOIN countries co ON co.country_id = s.country_id
      WHERE (c.name LIKE @searchTerm OR c.company_code LIKE @searchTerm OR c.contact_person LIKE @searchTerm)
      AND c.status != 'deleted'
      ORDER BY c.name
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `;
    
    const companiesResult = await executeQuery(companiesQuery, { searchTerm, offset, limit });
    
    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM companies c
      WHERE (c.name LIKE @searchTerm OR c.company_code LIKE @searchTerm OR c.contact_person LIKE @searchTerm)
      AND c.status != 'deleted'
    `;
    
    const countResult = await executeQuery(countQuery, { searchTerm });
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
    console.error('Search companies error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Company search failed'
    });
  }
});

// Search drivers
router.get('/drivers', verifyToken, async (req, res) => {
  try {
    const {
      query: searchQuery,
      page = 1,
      limit = 10
    } = req.query;
    
    if (!searchQuery || searchQuery.trim().length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Search query must be at least 2 characters long'
      });
    }
    
    const offset = (page - 1) * limit;
    const searchTerm = `%${searchQuery.trim()}%`;
    
    const driversQuery = `
      SELECT d.driver_id, d.driver_code, d.name, d.contact_person, d.status, d.created_at,
             ci.name as city_name, s.name as state_name, co.name as country_name
      FROM drivers d
      LEFT JOIN cities ci ON ci.city_id = d.city_id
      LEFT JOIN states s ON s.state_id = ci.state_id
      LEFT JOIN countries co ON co.country_id = s.country_id
      WHERE (d.name LIKE @searchTerm OR d.driver_code LIKE @searchTerm OR d.contact_person LIKE @searchTerm)
      AND d.status != 'deleted'
      ORDER BY d.name
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `;
    
    const driversResult = await executeQuery(driversQuery, { searchTerm, offset, limit });
    
    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM drivers d
      WHERE (d.name LIKE @searchTerm OR d.driver_code LIKE @searchTerm OR d.contact_person LIKE @searchTerm)
      AND d.status != 'deleted'
    `;
    
    const countResult = await executeQuery(countQuery, { searchTerm });
    const total = countResult.recordset[0].total;
    
    res.json({
      success: true,
      data: driversResult.recordset,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total,
        totalPages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Search drivers error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Driver search failed'
    });
  }
});

module.exports = router;
