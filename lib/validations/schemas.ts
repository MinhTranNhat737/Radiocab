// Zod validation schemas for form validation

import { z } from 'zod'

// Base schemas
export const phoneSchema = z.string()
  .min(10, 'Số điện thoại phải có ít nhất 10 số')
  .max(15, 'Số điện thoại không được quá 15 số')
  .regex(/^[0-9+\-\s()]+$/, 'Số điện thoại không hợp lệ')

export const emailSchema = z.string()
  .email('Email không hợp lệ')
  .min(1, 'Email là bắt buộc')

export const passwordSchema = z.string()
  .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số')

// User schemas
export const userSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  full_name: z.string().min(1, 'Họ tên là bắt buộc').max(100, 'Họ tên không được quá 100 ký tự'),
  phone: phoneSchema,
  role_id: z.number().min(1, 'Vai trò là bắt buộc'),
})

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Mật khẩu là bắt buộc'),
})

// Company schemas
export const companySchema = z.object({
  company_code: z.string().min(1, 'Mã công ty là bắt buộc').max(20, 'Mã công ty không được quá 20 ký tự').optional(),
  name: z.string().min(1, 'Tên công ty là bắt buộc').max(200, 'Tên công ty không được quá 200 ký tự'),
  contact_person: z.string().min(1, 'Người liên hệ là bắt buộc').max(100, 'Tên người liên hệ không được quá 100 ký tự'),
  designation: z.string().max(100, 'Chức vụ không được quá 100 ký tự').optional(),
  address_line: z.string().min(1, 'Địa chỉ là bắt buộc').max(500, 'Địa chỉ không được quá 500 ký tự'),
  city_id: z.number().min(1, 'Thành phố là bắt buộc'),
  phone: phoneSchema,
  telephone: phoneSchema.optional(),
  fax_number: z.string().max(20, 'Số fax không được quá 20 ký tự').optional(),
  email: emailSchema,
  website: z.string().url('Website không hợp lệ').optional().or(z.literal('')),
  description: z.string().max(2000, 'Mô tả không được quá 2000 ký tự').optional(),
  social_media: z.object({
    facebook: z.string().url('Facebook URL không hợp lệ').optional().or(z.literal('')),
    instagram: z.string().url('Instagram URL không hợp lệ').optional().or(z.literal('')),
    linkedin: z.string().url('LinkedIn URL không hợp lệ').optional().or(z.literal('')),
  }).optional(),
  business_hours: z.object({
    monday: z.string().max(20, 'Giờ làm việc không hợp lệ').optional(),
    tuesday: z.string().max(20, 'Giờ làm việc không hợp lệ').optional(),
    wednesday: z.string().max(20, 'Giờ làm việc không hợp lệ').optional(),
    thursday: z.string().max(20, 'Giờ làm việc không hợp lệ').optional(),
    friday: z.string().max(20, 'Giờ làm việc không hợp lệ').optional(),
    saturday: z.string().max(20, 'Giờ làm việc không hợp lệ').optional(),
    sunday: z.string().max(20, 'Giờ làm việc không hợp lệ').optional(),
  }).optional(),
})

export const updateCompanySchema = companySchema.partial().extend({
  company_id: z.number().min(1, 'ID công ty không hợp lệ'),
})

// Driver schemas
export const driverSchema = z.object({
  driver_code: z.string().min(1, 'Mã tài xế là bắt buộc').max(20, 'Mã tài xế không được quá 20 ký tự').optional(),
  name: z.string().min(1, 'Họ tên là bắt buộc').max(100, 'Họ tên không được quá 100 ký tự'),
  address_line: z.string().min(1, 'Địa chỉ là bắt buộc').max(500, 'Địa chỉ không được quá 500 ký tự'),
  city_id: z.number().min(1, 'Thành phố là bắt buộc'),
  phone: phoneSchema,
  telephone: phoneSchema.optional(),
  email: emailSchema,
  experience_years: z.number().min(0, 'Kinh nghiệm không được âm').max(50, 'Kinh nghiệm không được quá 50 năm'),
  license_number: z.string().min(1, 'Số bằng lái là bắt buộc').max(50, 'Số bằng lái không được quá 50 ký tự'),
  license_type: z.string().min(1, 'Loại bằng lái là bắt buộc').max(10, 'Loại bằng lái không được quá 10 ký tự'),
  license_expiry: z.string().min(1, 'Ngày hết hạn bằng lái là bắt buộc'),
  vehicle_type: z.string().min(1, 'Loại xe là bắt buộc').max(50, 'Loại xe không được quá 50 ký tự'),
  vehicle_model: z.string().min(1, 'Mẫu xe là bắt buộc').max(100, 'Mẫu xe không được quá 100 ký tự'),
  vehicle_plate: z.string().min(1, 'Biển số xe là bắt buộc').max(20, 'Biển số xe không được quá 20 ký tự'),
  languages: z.array(z.string()).optional(),
  specialties: z.array(z.string()).optional(),
})

export const updateDriverSchema = driverSchema.partial().extend({
  driver_id: z.number().min(1, 'ID tài xế không hợp lệ'),
})

// Advertisement schemas
export const advertisementSchema = z.object({
  company_id: z.number().min(1, 'Công ty là bắt buộc'),
  title: z.string().min(1, 'Tiêu đề là bắt buộc').max(200, 'Tiêu đề không được quá 200 ký tự'),
  description: z.string().min(1, 'Mô tả là bắt buộc').max(2000, 'Mô tả không được quá 2000 ký tự'),
  start_date: z.string().min(1, 'Ngày bắt đầu là bắt buộc'),
  end_date: z.string().optional(),
  budget: z.number().min(0, 'Ngân sách không được âm').optional(),
  placement: z.string().max(100, 'Vị trí không được quá 100 ký tự').optional(),
  target_audience: z.record(z.any()).optional(),
  creative_assets: z.record(z.any()).optional(),
})

export const updateAdvertisementSchema = advertisementSchema.partial().extend({
  ad_id: z.number().min(1, 'ID quảng cáo không hợp lệ'),
})

// Lead schemas
export const leadSchema = z.object({
  company_id: z.number().min(1, 'Công ty là bắt buộc').optional(),
  driver_id: z.number().min(1, 'Tài xế là bắt buộc').optional(),
  customer_name: z.string().min(1, 'Tên khách hàng là bắt buộc').max(100, 'Tên khách hàng không được quá 100 ký tự'),
  customer_phone: phoneSchema,
  customer_email: emailSchema.optional(),
  service_type: z.string().min(1, 'Loại dịch vụ là bắt buộc').max(100, 'Loại dịch vụ không được quá 100 ký tự'),
  pickup_location: z.string().max(500, 'Địa điểm đón không được quá 500 ký tự').optional(),
  destination: z.string().max(500, 'Địa điểm đến không được quá 500 ký tự').optional(),
  pickup_time: z.string().optional(),
  estimated_fare: z.number().min(0, 'Giá ước tính không được âm').optional(),
  notes: z.string().max(1000, 'Ghi chú không được quá 1000 ký tự').optional(),
  source: z.string().max(50, 'Nguồn không được quá 50 ký tự').optional(),
  priority: z.enum(['low', 'medium', 'high'], {
    required_error: 'Mức độ ưu tiên là bắt buộc',
  }),
})

export const updateLeadSchema = leadSchema.partial().extend({
  lead_id: z.number().min(1, 'ID lead không hợp lệ'),
})

// Subscription schemas
export const subscriptionSchema = z.object({
  plan_id: z.number().min(1, 'Gói dịch vụ là bắt buộc'),
  start_date: z.string().min(1, 'Ngày bắt đầu là bắt buộc'),
  end_date: z.string().min(1, 'Ngày kết thúc là bắt buộc'),
  auto_renew: z.boolean().optional(),
  billing_interval: z.number().min(1, 'Chu kỳ thanh toán phải lớn hơn 0').optional(),
  price: z.number().min(0, 'Giá không được âm').optional(),
  currency: z.string().length(3, 'Mã tiền tệ phải có 3 ký tự').optional(),
})

export const updateSubscriptionSchema = subscriptionSchema.partial().extend({
  subscription_id: z.number().min(1, 'ID đăng ký không hợp lệ'),
})

// Payment schemas
export const paymentSchema = z.object({
  subscription_id: z.number().min(1, 'Đăng ký là bắt buộc'),
  amount: z.number().min(0.01, 'Số tiền phải lớn hơn 0'),
  currency: z.string().length(3, 'Mã tiền tệ phải có 3 ký tự'),
  method_id: z.number().min(1, 'Phương thức thanh toán là bắt buộc'),
  ref_id: z.string().min(1, 'Mã tham chiếu là bắt buộc').max(100, 'Mã tham chiếu không được quá 100 ký tự'),
  gateway_response: z.record(z.any()).optional(),
})

export const updatePaymentSchema = paymentSchema.partial().extend({
  payment_id: z.number().min(1, 'ID thanh toán không hợp lệ'),
})

// Review schemas
export const reviewSchema = z.object({
  reviewer_id: z.number().min(1, 'Người đánh giá là bắt buộc'),
  reviewee_id: z.number().min(1, 'Người được đánh giá là bắt buộc'),
  reviewee_type: z.enum(['company', 'driver'], {
    required_error: 'Loại đánh giá là bắt buộc',
  }),
  rating: z.number().min(1, 'Đánh giá phải từ 1-5 sao').max(5, 'Đánh giá phải từ 1-5 sao'),
  title: z.string().max(200, 'Tiêu đề không được quá 200 ký tự').optional(),
  comment: z.string().max(1000, 'Bình luận không được quá 1000 ký tự').optional(),
})

export const updateReviewSchema = reviewSchema.partial().extend({
  review_id: z.number().min(1, 'ID đánh giá không hợp lệ'),
})

// Search schemas
export const searchSchema = z.object({
  query: z.string().min(1, 'Từ khóa tìm kiếm là bắt buộc'),
  type: z.enum(['company', 'driver', 'ad', 'lead']).optional(),
  filters: z.record(z.any()).optional(),
  page: z.number().min(1, 'Trang phải lớn hơn 0').optional(),
  limit: z.number().min(1, 'Giới hạn phải lớn hơn 0').max(100, 'Giới hạn không được quá 100').optional(),
})

// File upload schemas
export const fileUploadSchema = z.object({
  file: z.instanceof(File, 'File là bắt buộc'),
  type: z.enum(['logo', 'avatar', 'ad_creative'], {
    required_error: 'Loại file là bắt buộc',
  }),
})

// Admin approval schemas
export const approvalSchema = z.object({
  id: z.number().min(1, 'ID không hợp lệ'),
  reason: z.string().max(500, 'Lý do không được quá 500 ký tự').optional(),
})

// Export all schemas
export const schemas = {
  // Base
  phone: phoneSchema,
  email: emailSchema,
  password: passwordSchema,
  
  // Auth
  user: userSchema,
  login: loginSchema,
  
  // Company
  company: companySchema,
  updateCompany: updateCompanySchema,
  
  // Driver
  driver: driverSchema,
  updateDriver: updateDriverSchema,
  
  // Advertisement
  advertisement: advertisementSchema,
  updateAdvertisement: updateAdvertisementSchema,
  
  // Lead
  lead: leadSchema,
  updateLead: updateLeadSchema,
  
  // Subscription
  subscription: subscriptionSchema,
  updateSubscription: updateSubscriptionSchema,
  
  // Payment
  payment: paymentSchema,
  updatePayment: updatePaymentSchema,
  
  // Review
  review: reviewSchema,
  updateReview: updateReviewSchema,
  
  // Search
  search: searchSchema,
  
  // File upload
  fileUpload: fileUploadSchema,
  
  // Admin
  approval: approvalSchema,
}
