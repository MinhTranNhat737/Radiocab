const express = require('express');
const { executeQuery } = require('../config/database');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Get all lookup data
router.get('/', verifyToken, async (req, res) => {
  try {
    // Get cities
    const citiesQuery = `
      SELECT ci.city_id, ci.name, ci.state_id, s.name as state_name, s.country_id, co.name as country_name
      FROM cities ci
      LEFT JOIN states s ON s.state_id = ci.state_id
      LEFT JOIN countries co ON co.country_id = s.country_id
      ORDER BY co.name, s.name, ci.name
    `;
    
    const citiesResult = await executeQuery(citiesQuery);
    
    // Get states
    const statesQuery = `
      SELECT s.state_id, s.name, s.country_id, co.name as country_name
      FROM states s
      LEFT JOIN countries co ON co.country_id = s.country_id
      ORDER BY co.name, s.name
    `;
    
    const statesResult = await executeQuery(statesQuery);
    
    // Get countries
    const countriesQuery = 'SELECT country_id, name, iso_code FROM countries ORDER BY name';
    const countriesResult = await executeQuery(countriesQuery);
    
    // Get membership types
    const membershipTypesQuery = 'SELECT membership_type_id, code, name FROM membership_types ORDER BY name';
    const membershipTypesResult = await executeQuery(membershipTypesQuery);
    
    // Get subscription statuses
    const subscriptionStatusesQuery = 'SELECT status_id, code, name FROM subscription_statuses ORDER BY name';
    const subscriptionStatusesResult = await executeQuery(subscriptionStatusesQuery);
    
    // Get payment statuses
    const paymentStatusesQuery = 'SELECT status_id, code, name FROM payment_statuses ORDER BY name';
    const paymentStatusesResult = await executeQuery(paymentStatusesQuery);
    
    // Get payment methods
    const paymentMethodsQuery = 'SELECT method_id, code, name FROM payment_methods ORDER BY name';
    const paymentMethodsResult = await executeQuery(paymentMethodsQuery);
    
    // Get ad statuses
    const adStatusesQuery = 'SELECT status_id, code, name FROM ad_statuses ORDER BY name';
    const adStatusesResult = await executeQuery(adStatusesQuery);
    
    // Get plans
    const plansQuery = `
      SELECT p.plan_id, p.name, p.price, p.currency, p.billing_cycle_id,
             bc.name as billing_cycle_name, it.name as item_type_name
      FROM plans p
      LEFT JOIN billing_cycles bc ON bc.billing_cycle_id = p.billing_cycle_id
      LEFT JOIN item_types it ON it.item_type_id = p.item_type_id
      WHERE p.is_active = 1
      ORDER BY it.name, bc.name, p.name
    `;
    
    const plansResult = await executeQuery(plansQuery);
    
    // Get billing cycles
    const billingCyclesQuery = 'SELECT billing_cycle_id, code, name, months FROM billing_cycles ORDER BY months, name';
    const billingCyclesResult = await executeQuery(billingCyclesQuery);
    
    // Get roles
    const rolesQuery = 'SELECT role_id, role_code, role_name FROM roles ORDER BY role_name';
    const rolesResult = await executeQuery(rolesQuery);
    
    res.json({
      success: true,
      data: {
        cities: citiesResult.recordset,
        states: statesResult.recordset,
        countries: countriesResult.recordset,
        membershipTypes: membershipTypesResult.recordset,
        subscriptionStatuses: subscriptionStatusesResult.recordset,
        paymentStatuses: paymentStatusesResult.recordset,
        paymentMethods: paymentMethodsResult.recordset,
        adStatuses: adStatusesResult.recordset,
        plans: plansResult.recordset,
        billingCycles: billingCyclesResult.recordset,
        roles: rolesResult.recordset
      }
    });
    
  } catch (error) {
    console.error('Get lookup data error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to get lookup data'
    });
  }
});

// Get cities by state
router.get('/cities/:stateId', verifyToken, async (req, res) => {
  try {
    const { stateId } = req.params;
    
    const citiesQuery = `
      SELECT ci.city_id, ci.name, ci.state_id, s.name as state_name
      FROM cities ci
      LEFT JOIN states s ON s.state_id = ci.state_id
      WHERE ci.state_id = @stateId
      ORDER BY ci.name
    `;
    
    const citiesResult = await executeQuery(citiesQuery, { stateId });
    
    res.json({
      success: true,
      data: citiesResult.recordset
    });
    
  } catch (error) {
    console.error('Get cities error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to get cities'
    });
  }
});

// Get states by country
router.get('/states/:countryId', verifyToken, async (req, res) => {
  try {
    const { countryId } = req.params;
    
    const statesQuery = `
      SELECT s.state_id, s.name, s.country_id, co.name as country_name
      FROM states s
      LEFT JOIN countries co ON co.country_id = s.country_id
      WHERE s.country_id = @countryId
      ORDER BY s.name
    `;
    
    const statesResult = await executeQuery(statesQuery, { countryId });
    
    res.json({
      success: true,
      data: statesResult.recordset
    });
    
  } catch (error) {
    console.error('Get states error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to get states'
    });
  }
});

module.exports = router;
