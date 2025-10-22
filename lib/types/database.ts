// Database types for the application

export interface Company {
  company_id: number;
  company_code: string;
  name: string;
  contact_person: string;
  designation: string;
  address_line: string;
  city_id: number;
  mobile: string;
  telephone: string | null;
  fax_number: string | null;
  email: string;
  membership_type_id: number;
  owner_user_id: number;
  status: 'active' | 'inactive' | 'suspended' | 'draft' | 'deleted' | 'pending';
  created_at: Date;
  updated_at: Date;
}

export interface Driver {
  driver_id: number;
  driver_code: string;
  name: string;
  contact_person: string;
  address_line: string;
  city_id: number;
  mobile: string;
  telephone: string | null;
  email: string;
  experience_years: number;
  description: string | null;
  owner_user_id: number;
  status: 'active' | 'inactive' | 'suspended' | 'draft' | 'deleted';
  created_at: Date;
  updated_at: Date;
  // Additional fields from driver profile
  user_id?: number;
  phone?: string;
  avatar_url?: string;
  license_number?: string;
  license_type?: string;
  license_expiry?: Date;
  vehicle_type?: string;
  vehicle_model?: string;
  vehicle_plate?: string;
  rating?: number;
  total_rides?: number;
  total_distance?: number;
  is_available?: boolean;
  languages?: string[];
  specialties?: string[];
}

export interface Subscription {
  subscription_id?: number;
  user_id: number;
  plan_id: number;
  plan: string;
  amount: string;
  currency: string;
  nextPayment: string;
  status: 'active' | 'pending' | 'cancelled' | 'expired';
  start_date: Date;
  end_date: Date;
  created_at: Date;
  updated_at: Date;
}

export interface Payment {
  payment_id: number;
  user_id: number;
  subscription_id?: number;
  amount: number;
  currency: string;
  method_id: number;
  status_id: number;
  txn_ref?: string;
  paid_at?: Date;
  created_at: Date;
  updated_at: Date;
}

export interface CompanyDashboardData {
  company: Company;
  stats: {
    profileViews: number;
    totalLeads: number;
    totalReviews: number;
    averageRating: number;
  };
  subscription: {
    plan: string;
    nextPayment: string;
    amount: string;
    status: 'active' | 'pending' | 'cancelled' | 'expired';
  };
  recentActivity: Activity[];
}

export interface DriverDashboardData {
  driver: Driver;
  stats: {
    profileViews: number;
    totalApplications: number;
    totalReviews: number;
    averageRating: number;
    totalRides: number;
  };
  subscription: {
    plan: string;
    nextPayment: string;
    amount: string;
    status: 'active' | 'pending' | 'cancelled' | 'expired';
  };
  recentActivity: Activity[];
}

export interface Activity {
  id: number;
  type: 'lead' | 'payment' | 'review' | 'application';
  title: string;
  description: string;
  time: string;
  status: 'new' | 'success' | 'pending' | 'failed';
}

export interface City {
  city_id: number;
  name: string;
  state_id: number;
  country_id: number;
  status: 'active' | 'inactive';
  code?: string;
}

export interface State {
  state_id: number;
  name: string;
  country_id: number;
  status: 'active' | 'inactive';
}

export interface Country {
  country_id: number;
  name: string;
  code: string;
  status: 'active' | 'inactive';
}

export interface MembershipType {
  membership_type_id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  features: string[];
  status: 'active' | 'inactive';
  code?: string;
}

export interface Plan {
  plan_id: number;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration_months: number;
  features: string[];
  status: 'active' | 'inactive';
}

export type SubscriptionStatus = 'active' | 'pending' | 'cancelled' | 'expired';

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';

export type PaymentMethod = 'credit_card' | 'debit_card' | 'bank_transfer' | 'paypal' | 'cash';
