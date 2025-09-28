const express = require('express');
const { executeQuery } = require('../config/database');

const router = express.Router();

// Get all lookup data
router.get('/', async (req, res) => {
  try {
    const [
      countries,
      states,
      cities,
      roles,
      membershipTypes
    ] = await Promise.all([
      executeQuery('SELECT * FROM countries ORDER BY name'),
      executeQuery('SELECT * FROM states ORDER BY name'),
      executeQuery('SELECT * FROM cities ORDER BY name'),
      executeQuery('SELECT * FROM roles ORDER BY role_name'),
      executeQuery('SELECT * FROM membership_types ORDER BY name')
    ]);

    res.json({
      success: true,
      data: {
        countries: countries.rows,
        states: states.rows,
        cities: cities.rows,
        roles: roles.rows,
        membership_types: membershipTypes.rows
      }
    });

  } catch (error) {
    console.error('Get lookup data error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get states by country
router.get('/states/:country_id', async (req, res) => {
  try {
    const { country_id } = req.params;
    const result = await executeQuery(
      'SELECT * FROM states WHERE country_id = $1 ORDER BY name',
      [country_id]
    );

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Get states error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

// Get cities by state
router.get('/cities/:state_id', async (req, res) => {
  try {
    const { state_id } = req.params;
    const result = await executeQuery(
      'SELECT * FROM cities WHERE state_id = $1 ORDER BY name',
      [state_id]
    );

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Get cities error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    });
  }
});

module.exports = router;

