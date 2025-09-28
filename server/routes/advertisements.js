const express = require('express');
const { executeQuery } = require('../config/database');
const { validateAdvertisement } = require('../middleware/validation');

const router = express.Router();

// Get all advertisements
router.get('/', async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 10, 
      search = '', 
      company_id,
      status_id,
      sort_by = 'created_at',
      sort_order = 'DESC'
    } = req.query;

    const offset = (page - 1) * limit;
    let whereConditions = [];
    let queryParams = [];
    let paramCount = 0;

    if (search) {
      paramCount++;
      whereConditions.push(`(a.title ILIKE $${paramCount} OR a.description ILIKE $${paramCount})`);
      queryParams.push(`%${search}%`);
    }

    if (company_id) {
      paramCount++;
      whereConditions.push(`a.company_id = $${paramCount}`);
      queryParams.push(company_id);
    }

    if (status_id) {
      paramCount++;
      whereConditions.push(`a.status_id = $${paramCount}`);
      queryParams.push(status_id);
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    const countQuery = `SELECT COUNT(*) as total FROM advertisements a ${whereClause}`;
    const countResult = await executeQuery(countQuery, queryParams);
    const total = parseInt(countResult.rows[0].total);

    const adsQuery = `
      SELECT 
        a.*,
        c.company_name,
        c.contact_person,
        c.email as company_email,
        ast.status_name
      FROM advertisements a
      LEFT JOIN companies c ON a.company_id = c.id
      LEFT JOIN ad_statuses ast ON a.status_id = ast.id
      ${whereClause}
      ORDER BY a.${sort_by} ${sort_order}
      LIMIT $${paramCount + 1} OFFSET $${paramCount + 2}
    `;

    queryParams.push(limit, offset);
    const result = await executeQuery(adsQuery, queryParams);

    res.json({
      success: true,
      data: {
        advertisements: result.rows,
        pagination: {
          current_page: parseInt(page),
          per_page: parseInt(limit),
          total: total,
          total_pages: Math.ceil(total / limit)
        }
      }
    });

  } catch (error) {
    console.error('Get advertisements error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get advertisement by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await executeQuery(`
      SELECT 
        a.*,
        c.company_name,
        c.contact_person,
        c.email as company_email,
        ast.status_name
      FROM advertisements a
      LEFT JOIN companies c ON a.company_id = c.id
      LEFT JOIN ad_statuses ast ON a.status_id = ast.id
      WHERE a.id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Advertisement not found'
      });
    }

    res.json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Get advertisement error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Create new advertisement
router.post('/', validateAdvertisement, async (req, res) => {
  try {
    const {
      title,
      description,
      company_id,
      ad_type_id,
      start_date,
      end_date,
      budget,
      target_audience,
      status_id = 1
    } = req.body;

    const result = await executeQuery(`
      INSERT INTO advertisements (
        title, description, company_id, ad_type_id,
        start_date, end_date, budget, target_audience,
        status_id, created_at, updated_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, NOW(), NOW())
      RETURNING *
    `, [
      title, description, company_id, ad_type_id,
      start_date, end_date, budget, target_audience, status_id
    ]);

    res.status(201).json({
      success: true,
      message: 'Advertisement created successfully',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Create advertisement error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Update advertisement
router.put('/:id', validateAdvertisement, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      description,
      company_id,
      ad_type_id,
      start_date,
      end_date,
      budget,
      target_audience,
      status_id
    } = req.body;

    const result = await executeQuery(`
      UPDATE advertisements SET
        title = $1,
        description = $2,
        company_id = $3,
        ad_type_id = $4,
        start_date = $5,
        end_date = $6,
        budget = $7,
        target_audience = $8,
        status_id = $9,
        updated_at = NOW()
      WHERE id = $10
      RETURNING *
    `, [
      title, description, company_id, ad_type_id,
      start_date, end_date, budget, target_audience, status_id, id
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Advertisement not found'
      });
    }

    res.json({
      success: true,
      message: 'Advertisement updated successfully',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Update advertisement error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Delete advertisement
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await executeQuery('DELETE FROM advertisements WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Advertisement not found'
      });
    }

    res.json({
      success: true,
      message: 'Advertisement deleted successfully'
    });

  } catch (error) {
    console.error('Delete advertisement error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

module.exports = router;