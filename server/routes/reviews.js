const express = require('express');
const { executeQuery } = require('../config/database');
const { validateReview, validateId, validatePagination } = require('../middleware/validation');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Get all reviews
router.get('/', verifyToken, validatePagination, async (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      sortBy = 'created_at',
      sortOrder = 'desc',
      revieweeType,
      revieweeId,
      rating
    } = req.query;
    
    const offset = (page - 1) * limit;
    
    let whereClause = 'WHERE 1=1';
    const params = { offset, limit };
    
    // Add reviewee type filter
    if (revieweeType) {
      whereClause += ' AND r.reviewee_type = @revieweeType';
      params.revieweeType = revieweeType;
    }
    
    // Add reviewee ID filter
    if (revieweeId) {
      whereClause += ' AND r.reviewee_id = @revieweeId';
      params.revieweeId = revieweeId;
    }
    
    // Add rating filter
    if (rating) {
      whereClause += ' AND r.rating = @rating';
      params.rating = rating;
    }
    
    // Get reviews with pagination
    const reviewsQuery = `
      SELECT r.review_id, r.reviewer_id, r.reviewee_id, r.reviewee_type, r.rating, r.title, r.comment, r.created_at,
             u.full_name as reviewer_name, u.email as reviewer_email,
             c.name as company_name, d.name as driver_name
      FROM reviews r
      LEFT JOIN users u ON u.user_id = r.reviewer_id
      LEFT JOIN companies c ON c.company_id = r.reviewee_id AND r.reviewee_type = 'company'
      LEFT JOIN drivers d ON d.driver_id = r.reviewee_id AND r.reviewee_type = 'driver'
      ${whereClause}
      ORDER BY r.${sortBy} ${sortOrder.toUpperCase()}
      OFFSET @offset ROWS
      FETCH NEXT @limit ROWS ONLY
    `;
    
    const reviewsResult = await executeQuery(reviewsQuery, params);
    
    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM reviews r
      ${whereClause}
    `;
    
    const countResult = await executeQuery(countQuery, params);
    const total = countResult.recordset[0].total;
    
    res.json({
      success: true,
      data: reviewsResult.recordset,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: total,
        totalPages: Math.ceil(total / limit)
      }
    });
    
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to get reviews'
    });
  }
});

// Get review by ID
router.get('/:id', verifyToken, validateId, async (req, res) => {
  try {
    const { id } = req.params;
    
    const reviewQuery = `
      SELECT r.review_id, r.reviewer_id, r.reviewee_id, r.reviewee_type, r.rating, r.title, r.comment, r.created_at,
             u.full_name as reviewer_name, u.email as reviewer_email,
             c.name as company_name, d.name as driver_name
      FROM reviews r
      LEFT JOIN users u ON u.user_id = r.reviewer_id
      LEFT JOIN companies c ON c.company_id = r.reviewee_id AND r.reviewee_type = 'company'
      LEFT JOIN drivers d ON d.driver_id = r.reviewee_id AND r.reviewee_type = 'driver'
      WHERE r.review_id = @id
    `;
    
    const reviewResult = await executeQuery(reviewQuery, { id });
    
    if (reviewResult.recordset.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Not Found',
        message: 'Review not found'
      });
    }
    
    res.json({
      success: true,
      data: reviewResult.recordset[0]
    });
    
  } catch (error) {
    console.error('Get review error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to get review'
    });
  }
});

// Create review
router.post('/', verifyToken, validateReview, async (req, res) => {
  try {
    const {
      reviewer_id,
      reviewee_id,
      reviewee_type,
      rating,
      title,
      comment
    } = req.body;
    
    const createReviewQuery = `
      INSERT INTO reviews (reviewer_id, reviewee_id, reviewee_type, rating, title, comment)
      OUTPUT INSERTED.review_id
      VALUES (@reviewer_id, @reviewee_id, @reviewee_type, @rating, @title, @comment)
    `;
    
    const reviewResult = await executeQuery(createReviewQuery, {
      reviewer_id,
      reviewee_id,
      reviewee_type,
      rating,
      title,
      comment
    });
    
    const reviewId = reviewResult.recordset[0].review_id;
    
    // Get created review details
    const reviewQuery = `
      SELECT r.review_id, r.reviewer_id, r.reviewee_id, r.reviewee_type, r.rating, r.title, r.comment, r.created_at,
             u.full_name as reviewer_name, u.email as reviewer_email,
             c.name as company_name, d.name as driver_name
      FROM reviews r
      LEFT JOIN users u ON u.user_id = r.reviewer_id
      LEFT JOIN companies c ON c.company_id = r.reviewee_id AND r.reviewee_type = 'company'
      LEFT JOIN drivers d ON d.driver_id = r.reviewee_id AND r.reviewee_type = 'driver'
      WHERE r.review_id = @review_id
    `;
    
    const reviewDetails = await executeQuery(reviewQuery, { review_id: reviewId });
    
    res.status(201).json({
      success: true,
      data: reviewDetails.recordset[0],
      message: 'Review created successfully'
    });
    
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to create review'
    });
  }
});

// Update review
router.put('/:id', verifyToken, validateId, validateReview, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      reviewer_id,
      reviewee_id,
      reviewee_type,
      rating,
      title,
      comment
    } = req.body;
    
    const updateReviewQuery = `
      UPDATE reviews 
      SET reviewer_id = @reviewer_id,
          reviewee_id = @reviewee_id,
          reviewee_type = @reviewee_type,
          rating = @rating,
          title = @title,
          comment = @comment,
          updated_at = GETUTCDATE()
      WHERE review_id = @id
    `;
    
    await executeQuery(updateReviewQuery, {
      id,
      reviewer_id,
      reviewee_id,
      reviewee_type,
      rating,
      title,
      comment
    });
    
    // Get updated review details
    const reviewQuery = `
      SELECT r.review_id, r.reviewer_id, r.reviewee_id, r.reviewee_type, r.rating, r.title, r.comment, r.created_at,
             u.full_name as reviewer_name, u.email as reviewer_email,
             c.name as company_name, d.name as driver_name
      FROM reviews r
      LEFT JOIN users u ON u.user_id = r.reviewer_id
      LEFT JOIN companies c ON c.company_id = r.reviewee_id AND r.reviewee_type = 'company'
      LEFT JOIN drivers d ON d.driver_id = r.reviewee_id AND r.reviewee_type = 'driver'
      WHERE r.review_id = @id
    `;
    
    const reviewDetails = await executeQuery(reviewQuery, { id });
    
    res.json({
      success: true,
      data: reviewDetails.recordset[0],
      message: 'Review updated successfully'
    });
    
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to update review'
    });
  }
});

// Delete review
router.delete('/:id', verifyToken, validateId, async (req, res) => {
  try {
    const { id } = req.params;
    
    const deleteReviewQuery = 'DELETE FROM reviews WHERE review_id = @id';
    
    await executeQuery(deleteReviewQuery, { id });
    
    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
    
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal Server Error',
      message: 'Failed to delete review'
    });
  }
});

module.exports = router;
