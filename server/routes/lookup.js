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
      plans,
      paymentMethods,
      paymentStatuses,
      subscriptionStatuses,
      adStatuses,
      membershipTypes,
      itemTypes,
      feedbackTypes,
      billingCycles
    ] = await Promise.all([
      executeQuery('SELECT * FROM countries ORDER BY name'),
      executeQuery('SELECT * FROM states ORDER BY name'),
      executeQuery('SELECT * FROM cities ORDER BY name'),
      executeQuery('SELECT * FROM roles ORDER BY role_name'),
      executeQuery('SELECT * FROM plans ORDER BY name'),
      executeQuery('SELECT * FROM payment_methods ORDER BY name'),
      executeQuery('SELECT * FROM payment_statuses ORDER BY name'),
      executeQuery('SELECT * FROM subscription_statuses ORDER BY name'),
      executeQuery('SELECT * FROM ad_statuses ORDER BY name'),
      executeQuery('SELECT * FROM membership_types ORDER BY name'),
      executeQuery('SELECT * FROM item_types ORDER BY name'),
      executeQuery('SELECT * FROM feedback_types ORDER BY name'),
      executeQuery('SELECT * FROM billing_cycles ORDER BY name')
    ]);

    res.json({
      success: true,
      data: {
        countries: countries.rows,
        states: states.rows,
        cities: cities.rows,
        roles: roles.rows,
        plans: plans.rows,
        payment_methods: paymentMethods.rows,
        payment_statuses: paymentStatuses.rows,
        subscription_statuses: subscriptionStatuses.rows,
        ad_statuses: adStatuses.rows,
        membership_types: membershipTypes.rows,
        item_types: itemTypes.rows,
        feedback_types: feedbackTypes.rows,
        billing_cycles: billingCycles.rows
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
      'SELECT * FROM states WHERE country_id = $1 ORDER BY state_name',
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
      'SELECT * FROM cities WHERE state_id = $1 ORDER BY city_name',
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