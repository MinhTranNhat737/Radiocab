const { body, param, query, validationResult } = require('express-validator');

// Handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      error: 'Validation Error',
      message: 'Invalid input data',
      details: errors.array()
    });
  }
  next();
};

// Auth validation rules
const validateLogin = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  handleValidationErrors
];

const validateRegister = [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),
  body('full_name')
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage('Full name must be between 2 and 150 characters'),
  body('phone')
    .trim()
    .isLength({ min: 10, max: 30 })
    .withMessage('Phone number must be between 10 and 30 characters'),
  body('role_id')
    .isInt({ min: 1 })
    .withMessage('Valid role ID is required'),
  handleValidationErrors
];

// Company validation rules
const validateCompany = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Company name must be between 2 and 200 characters'),
  body('contact_person')
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage('Contact person name must be less than 150 characters'),
  body('designation')
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage('Designation must be less than 150 characters'),
  body('address_line')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Address must be less than 255 characters'),
  body('city_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Valid city ID is required'),
  body('mobile')
    .optional()
    .trim()
    .isLength({ min: 10, max: 30 })
    .withMessage('Mobile number must be between 10 and 30 characters'),
  body('telephone')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('Telephone number must be less than 30 characters'),
  body('fax_number')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('Fax number must be less than 30 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('membership_type_id')
    .isInt({ min: 1 })
    .withMessage('Valid membership type ID is required'),
  body('status')
    .optional()
    .isIn(['draft', 'pending', 'active', 'suspended', 'deleted'])
    .withMessage('Invalid status value'),
  handleValidationErrors
];

// Driver validation rules
const validateDriver = [
  body('name')
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage('Driver name must be between 2 and 150 characters'),
  body('contact_person')
    .optional()
    .trim()
    .isLength({ max: 150 })
    .withMessage('Contact person name must be less than 150 characters'),
  body('address_line')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Address must be less than 255 characters'),
  body('city_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Valid city ID is required'),
  body('mobile')
    .optional()
    .trim()
    .isLength({ min: 10, max: 30 })
    .withMessage('Mobile number must be between 10 and 30 characters'),
  body('telephone')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('Telephone number must be less than 30 characters'),
  body('email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('experience_years')
    .isInt({ min: 0, max: 50 })
    .withMessage('Experience years must be between 0 and 50'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must be less than 2000 characters'),
  body('status')
    .optional()
    .isIn(['draft', 'pending', 'active', 'suspended', 'deleted'])
    .withMessage('Invalid status value'),
  handleValidationErrors
];

// Advertisement validation rules
const validateAdvertisement = [
  body('company_id')
    .isInt({ min: 1 })
    .withMessage('Valid company ID is required'),
  body('title')
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Title must be between 2 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description must be less than 2000 characters'),
  body('status_id')
    .isInt({ min: 1, max: 4 })
    .withMessage('Valid status ID is required'),
  body('start_date')
    .optional()
    .isISO8601()
    .withMessage('Valid start date is required'),
  body('end_date')
    .optional()
    .isISO8601()
    .withMessage('Valid end date is required'),
  handleValidationErrors
];

// Lead validation rules
const validateLead = [
  body('company_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Valid company ID is required'),
  body('driver_id')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Valid driver ID is required'),
  body('customer_name')
    .trim()
    .isLength({ min: 2, max: 150 })
    .withMessage('Customer name must be between 2 and 150 characters'),
  body('customer_phone')
    .trim()
    .isLength({ min: 10, max: 30 })
    .withMessage('Customer phone must be between 10 and 30 characters'),
  body('customer_email')
    .optional()
    .isEmail()
    .normalizeEmail()
    .withMessage('Valid email is required'),
  body('service_type')
    .trim()
    .isLength({ min: 2, max: 100 })
    .withMessage('Service type must be between 2 and 100 characters'),
  body('pickup_location')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Pickup location must be less than 255 characters'),
  body('destination')
    .optional()
    .trim()
    .isLength({ max: 255 })
    .withMessage('Destination must be less than 255 characters'),
  body('pickup_time')
    .optional()
    .isISO8601()
    .withMessage('Valid pickup time is required'),
  body('estimated_fare')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Estimated fare must be a positive number'),
  body('notes')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Notes must be less than 1000 characters'),
  body('source')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Source must be less than 100 characters'),
  body('priority')
    .isIn(['low', 'medium', 'high'])
    .withMessage('Priority must be low, medium, or high'),
  body('status')
    .optional()
    .isIn(['new', 'contacted', 'quoted', 'confirmed', 'completed', 'cancelled'])
    .withMessage('Invalid status value'),
  handleValidationErrors
];

// Subscription validation rules
const validateSubscription = [
  body('plan_id')
    .isInt({ min: 1 })
    .withMessage('Valid plan ID is required'),
  body('status_id')
    .isInt({ min: 1, max: 4 })
    .withMessage('Valid status ID is required'),
  body('start_date')
    .isISO8601()
    .withMessage('Valid start date is required'),
  body('end_date')
    .isISO8601()
    .withMessage('Valid end date is required'),
  handleValidationErrors
];

// Payment validation rules
const validatePayment = [
  body('subscription_id')
    .isInt({ min: 1 })
    .withMessage('Valid subscription ID is required'),
  body('amount')
    .isFloat({ min: 0 })
    .withMessage('Amount must be a positive number'),
  body('currency')
    .isLength({ min: 3, max: 3 })
    .withMessage('Currency must be 3 characters'),
  body('method_id')
    .isInt({ min: 1, max: 3 })
    .withMessage('Valid payment method ID is required'),
  body('status_id')
    .isInt({ min: 1, max: 4 })
    .withMessage('Valid status ID is required'),
  body('txn_ref')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Transaction reference must be less than 100 characters'),
  handleValidationErrors
];

// Review validation rules
const validateReview = [
  body('reviewer_id')
    .isInt({ min: 1 })
    .withMessage('Valid reviewer ID is required'),
  body('reviewee_id')
    .isInt({ min: 1 })
    .withMessage('Valid reviewee ID is required'),
  body('reviewee_type')
    .isIn(['company', 'driver'])
    .withMessage('Reviewee type must be company or driver'),
  body('rating')
    .isInt({ min: 1, max: 5 })
    .withMessage('Rating must be between 1 and 5'),
  body('title')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Title must be less than 200 characters'),
  body('comment')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Comment must be less than 1000 characters'),
  handleValidationErrors
];

// ID parameter validation
const validateId = [
  param('id')
    .isInt({ min: 1 })
    .withMessage('Valid ID is required'),
  handleValidationErrors
];

// Pagination validation
const validatePagination = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('sortBy')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Sort field must be less than 50 characters'),
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
  handleValidationErrors
];

module.exports = {
  handleValidationErrors,
  validateLogin,
  validateRegister,
  validateCompany,
  validateDriver,
  validateAdvertisement,
  validateLead,
  validateSubscription,
  validatePayment,
  validateReview,
  validateId,
  validatePagination
};
