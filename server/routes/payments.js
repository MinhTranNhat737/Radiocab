const express = require('express');
const { executeQuery } = require('../config/database');
const { validatePayment, validateId, validatePagination } = require('../middleware/validation');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Get all payments
router.get('/', verifyToken, validatePagination, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'created_at',
      sortOrder = 'desc',
      status,
      methodId,
      subscriptionId,
      dateFrom,
      dateTo
    } = req.query;
    
    const offset = (page - 1) * limit;
    
    let whereClause = 'WHERE 1=1';
    const params = { offset, limit };
    
    // Add status filter
    if (status) {
      whereClause += ' AND p.status_id = @status';
      params.status = status;
    }
    
    // Add method filter
    if (methodId) {
      whereClause += ' AND p.method_id = @methodId';
      params.methodId = methodId;
    }
    
    // Add subscription filter
    if (subscriptionId) {
      whereClause += ' AND p.subscription_id = @subscriptionId';
      params.subscriptionId = subscriptionId;
    }
    
    // Add date filters
    if (dateFrom) {
      whereClause += ' AND p.created_at >= @dateFrom';
      params.dateFrom = dateFrom;
    }
    
    if (dateTo) {
      whereClause += ' AND p.created_at <= @dateTo';
      params.dateTo = dateTo;
    }
    
    // Get payments with pagination
    const paymentsQuery = `
      SELECT p.payment_id, p.subscription_id, p.amount, p.currency, p.method_id, p.status_id,
             p.txn_ref, p.paid_at, p.created_at,
             ps.name as status_name, pm.name as method_name,
             s.start_date, s.end_date
      FROM payments p
      LEFT JOIN payment_statuses ps ON ps.status_id = p.status_id
      LEFT JOIN payment_methods pm ON pm.method_id = p.method_id
      LEFT JOIN subscriptions s ON s.subscription_id = p.subscription_id
      ${whereClause}
      ORDER BY p.${sortBy} ${sortOrder.toUpperCase()}
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `;
    
    const paymentsResult = await executeQuery(paymentsQuery, params);
    
    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM payments p
      ${whereClause}
    `;
    
    const countResult = await executeQuery(countQuery, params);
    const total = countResult.recordset[0].total;
    
    res.json({
      success: true,
      data: paymentsResult.recordset,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total,
        totalPages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to get payments'
    });
  }
});

// Get payment by ID
router.get('/:id', verifyToken, validateId, async (req, res) => {
  try {
    const { id } = req.params;
    
    const paymentQuery = `
      SELECT p.payment_id, p.subscription_id, p.amount, p.currency, p.method_id, p.status_id,
             p.txn_ref, p.paid_at, p.created_at,
             ps.name as status_name, pm.name as method_name,
             s.start_date, s.end_date
      FROM payments p
      LEFT JOIN payment_statuses ps ON ps.status_id = p.status_id
      LEFT JOIN payment_methods pm ON pm.method_id = p.method_id
      LEFT JOIN subscriptions s ON s.subscription_id = p.subscription_id
      WHERE p.payment_id = @id
    `;
    
    const paymentResult = await executeQuery(paymentQuery, { id });
    
    if (paymentResult.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Payment not found'
      });
    }
    
    res.json({
      success: true,
      data: paymentResult.recordset[0]
    });
    
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to get payment'
    });
  }
});

// Create payment
router.post('/', verifyToken, validatePayment, async (req, res) => {
  try {
    const {
      subscription_id,
      amount,
      currency,
      method_id,
      status_id,
      txn_ref
    } = req.body;
    
    const createPaymentQuery = `
      INSERT INTO payments (subscription_id, amount, currency, method_id, status_id, txn_ref, paid_at)
      OUTPUT INSERTED.payment_id
      VALUES (@subscription_id, @amount, @currency, @method_id, @status_id, @txn_ref, 
              CASE WHEN @status_id = 2 THEN GETUTCDATE() ELSE NULL END)
    `;
    
    const paymentResult = await executeQuery(createPaymentQuery, {
      subscription_id,
      amount,
      currency,
      method_id,
      status_id,
      txn_ref
    });
    
    const paymentId = paymentResult.recordset[0].payment_id;
    
    // Get created payment details
    const paymentQuery = `
      SELECT p.payment_id, p.subscription_id, p.amount, p.currency, p.method_id, p.status_id,
             p.txn_ref, p.paid_at, p.created_at,
             ps.name as status_name, pm.name as method_name
      FROM payments p
      LEFT JOIN payment_statuses ps ON ps.status_id = p.status_id
      LEFT JOIN payment_methods pm ON pm.method_id = p.method_id
      WHERE p.payment_id = @payment_id
    `;
    
    const paymentDetails = await executeQuery(paymentQuery, { payment_id: paymentId });
    
    res.status(201).json({
      success: true,
      data: paymentDetails.recordset[0],
      message: 'Payment created successfully'
    });
    
  } catch (error) {
    console.error('Create payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to create payment'
    });
  }
});

// Update payment
router.put('/:id', verifyToken, validateId, validatePayment, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      subscription_id,
      amount,
      currency,
      method_id,
      status_id,
      txn_ref
    } = req.body;
    
    const updatePaymentQuery = `
      UPDATE payments 
      SET subscription_id = @subscription_id,
          amount = @amount,
          currency = @currency,
          method_id = @method_id,
          status_id = @status_id,
          txn_ref = @txn_ref,
          paid_at = CASE WHEN @status_id = 2 AND paid_at IS NULL THEN GETUTCDATE() ELSE paid_at END
      WHERE payment_id = @id
    `;
    
    await executeQuery(updatePaymentQuery, {
      id,
      subscription_id,
      amount,
      currency,
      method_id,
      status_id,
      txn_ref
    });
    
    // Get updated payment details
    const paymentQuery = `
      SELECT p.payment_id, p.subscription_id, p.amount, p.currency, p.method_id, p.status_id,
             p.txn_ref, p.paid_at, p.created_at,
             ps.name as status_name, pm.name as method_name
      FROM payments p
      LEFT JOIN payment_statuses ps ON ps.status_id = p.status_id
      LEFT JOIN payment_methods pm ON pm.method_id = p.method_id
      WHERE p.payment_id = @id
    `;
    
    const paymentDetails = await executeQuery(paymentQuery, { id });
    
    res.json({
      success: true,
      data: paymentDetails.recordset[0],
      message: 'Payment updated successfully'
    });
    
  } catch (error) {
    console.error('Update payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to update payment'
    });
  }
});

// Refund payment
router.post('/:id/refund', verifyToken, validateId, async (req, res) => {
  try {
    const { id } = req.params;
    const { amount, reason } = req.body;
    
    // Get current payment details
    const paymentQuery = 'SELECT amount, status_id FROM payments WHERE payment_id = @id';
    const paymentResult = await executeQuery(paymentQuery, { id });
    
    if (paymentResult.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Payment not found'
      });
    }
    
    const currentPayment = paymentResult.recordset[0];
    
    if (currentPayment.status_id !== 2) {
      return res.status(400).json({
        success: false,
        error: 'Bad Request',
        message: 'Only paid payments can be refunded'
      });
    }
    
    const refundAmount = amount || currentPayment.amount;
    
    const refundPaymentQuery = `
      UPDATE payments 
      SET status_id = 4, updated_at = GETUTCDATE()
      WHERE payment_id = @id
    `;
    
    await executeQuery(refundPaymentQuery, { id });
    
    res.json({
      success: true,
      message: 'Payment refunded successfully',
      data: {
        refundAmount,
        reason
      }
    });
    
  } catch (error) {
    console.error('Refund payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to refund payment'
    });
  }
});

// Delete payment
router.delete('/:id', verifyToken, validateId, async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletePaymentQuery = 'DELETE FROM payments WHERE payment_id = @id';
    
    await executeQuery(deletePaymentQuery, { id });
    
    res.json({
      success: true,
      message: 'Payment deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete payment error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to delete payment'
    });
  }
});

module.exports = router;
