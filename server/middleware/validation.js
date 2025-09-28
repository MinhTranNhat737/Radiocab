const Joi = require('joi');

// Auth validation schemas
const registerSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  full_name: Joi.string().min(2).max(100).required(),
  phone: Joi.string().pattern(/^[0-9+\-\s()]+$/).min(10).max(20).required(),
  role_id: Joi.number().integer().min(1).max(4).optional()
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required()
});

// Company validation schemas
const companySchema = Joi.object({
  company_name: Joi.string().min(2).max(100).required(),
  contact_person: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^[0-9+\-\s()]+$/).min(10).max(20).required(),
  address: Joi.string().min(10).max(500).required(),
  city_id: Joi.number().integer().positive().required(),
  state_id: Joi.number().integer().positive().required(),
  country_id: Joi.number().integer().positive().required(),
  website: Joi.string().uri().optional(),
  description: Joi.string().max(1000).optional()
});

// Driver validation schemas
const driverSchema = Joi.object({
  full_name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  phone: Joi.string().pattern(/^[0-9+\-\s()]+$/).min(10).max(20).required(),
  license_number: Joi.string().min(5).max(20).required(),
  license_expiry: Joi.date().greater('now').required(),
  address: Joi.string().min(10).max(500).required(),
  city_id: Joi.number().integer().positive().required(),
  state_id: Joi.number().integer().positive().required(),
  country_id: Joi.number().integer().positive().required(),
  experience_years: Joi.number().integer().min(0).max(50).optional(),
  vehicle_type: Joi.string().max(50).optional()
});

// Advertisement validation schemas
const advertisementSchema = Joi.object({
  title: Joi.string().min(5).max(200).required(),
  description: Joi.string().min(10).max(2000).required(),
  company_id: Joi.number().integer().positive().required(),
  ad_type_id: Joi.number().integer().positive().required(),
  start_date: Joi.date().greater('now').required(),
  end_date: Joi.date().greater(Joi.ref('start_date')).required(),
  budget: Joi.number().positive().required(),
  target_audience: Joi.string().max(500).optional(),
  status_id: Joi.number().integer().positive().optional()
});

// Payment validation schemas
const paymentSchema = Joi.object({
  amount: Joi.number().positive().required(),
  payment_method_id: Joi.number().integer().positive().required(),
  subscription_id: Joi.number().integer().positive().optional(),
  company_id: Joi.number().integer().positive().optional(),
  driver_id: Joi.number().integer().positive().optional(),
  description: Joi.string().max(500).optional(),
  payment_date: Joi.date().optional()
});

// Subscription validation schemas
const subscriptionSchema = Joi.object({
  user_id: Joi.number().integer().positive().required(),
  plan_id: Joi.number().integer().positive().required(),
  start_date: Joi.date().required(),
  end_date: Joi.date().greater(Joi.ref('start_date')).required(),
  status_id: Joi.number().integer().positive().optional(),
  billing_cycle_id: Joi.number().integer().positive().optional()
});

// Validation middleware
const validateAuth = (req, res, next) => {
  const { error } = registerSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => detail.message)
    });
  }
  next();
};

const validateLogin = (req, res, next) => {
  const { error } = loginSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => detail.message)
    });
  }
  next();
};

const validateCompany = (req, res, next) => {
  const { error } = companySchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => detail.message)
    });
  }
  next();
};

const validateDriver = (req, res, next) => {
  const { error } = driverSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => detail.message)
    });
  }
  next();
};

const validateAdvertisement = (req, res, next) => {
  const { error } = advertisementSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => detail.message)
    });
  }
  next();
};

const validatePayment = (req, res, next) => {
  const { error } = paymentSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => detail.message)
    });
  }
  next();
};

const validateSubscription = (req, res, next) => {
  const { error } = subscriptionSchema.validate(req.body);
  if (error) {
    return res.status(400).json({
      success: false,
      message: 'Validation error',
      errors: error.details.map(detail => detail.message)
    });
  }
  next();
};

module.exports = {
  validateAuth,
  validateLogin,
  validateCompany,
  validateDriver,
  validateAdvertisement,
  validatePayment,
  validateSubscription
};