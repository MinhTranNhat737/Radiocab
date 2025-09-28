const express = require('express');
const { executeQuery } = require('../config/database');

const router = express.Router();

// Global search
router.get('/', async (req, res) => {
  try {
    const { q, type, page = 1, limit = 10 } = req.query;
    const offset = (page - 1) * limit;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    let results = {};

    // Search companies
    if (!type || type === 'companies') {
      const companiesResult = await executeQuery(`
        SELECT 
          'company' as type,
          id,
          company_name as name,
          email,
          phone,
          created_at
        FROM companies 
        WHERE company_name ILIKE $1 OR contact_person ILIKE $1 OR email ILIKE $1
        ORDER BY company_name
        LIMIT $2 OFFSET $3
      `, [`%${q}%`, limit, offset]);
      results.companies = companiesResult.rows;
    }

    // Search drivers
    if (!type || type === 'drivers') {
      const driversResult = await executeQuery(`
        SELECT 
          'driver' as type,
          id,
          full_name as name,
          email,
          phone,
          license_number,
          created_at
        FROM drivers 
        WHERE full_name ILIKE $1 OR email ILIKE $1 OR phone ILIKE $1
        ORDER BY full_name
        LIMIT $2 OFFSET $3
      `, [`%${q}%`, limit, offset]);
      results.drivers = driversResult.rows;
    }

    // Search advertisements
    if (!type || type === 'advertisements') {
      const adsResult = await executeQuery(`
        SELECT 
          'advertisement' as type,
          a.id,
          a.title as name,
          a.description,
          c.company_name,
          a.created_at
        FROM advertisements a
        LEFT JOIN companies c ON a.company_id = c.id
        WHERE a.title ILIKE $1 OR a.description ILIKE $1
        ORDER BY a.title
        LIMIT $2 OFFSET $3
      `, [`%${q}%`, limit, offset]);
      results.advertisements = adsResult.rows;
    }

    res.json({
      success: true,
      data: results
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

module.exports = router;