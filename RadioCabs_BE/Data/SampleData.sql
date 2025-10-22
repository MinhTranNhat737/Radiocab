-- Sample data for RadioCabs database
-- Run this script after creating the database schema

-- Insert sample companies
INSERT INTO company (name, hotline, email, address, tax_code, fax, status, created_at) VALUES
('RadioCabs Hanoi', '1900-1234', 'contact@radiocabs-hn.com', '123 Nguyen Hue, Hoan Kiem, Hanoi', '0123456789', '024-1234-5678', 'ACTIVE', NOW()),
('RadioCabs HCMC', '1900-5678', 'contact@radiocabs-hcm.com', '456 Le Loi, District 1, HCMC', '0987654321', '028-5678-9012', 'ACTIVE', NOW()),
('RadioCabs Da Nang', '1900-9012', 'contact@radiocabs-dn.com', '789 Tran Phu, Hai Chau, Da Nang', '0555666777', '0236-9012-3456', 'ACTIVE', NOW());

-- Insert sample provinces
INSERT INTO province (province_id, code, name) VALUES
(1, 'HN', 'Hanoi'),
(2, 'HCM', 'Ho Chi Minh City'),
(3, 'DN', 'Da Nang'),
(4, 'HP', 'Hai Phong'),
(5, 'CT', 'Can Tho');

-- Insert sample wards for Hanoi
INSERT INTO ward (ward_id, province_id, code, name) VALUES
(1, 1, '001', 'Phuc Xa'),
(2, 1, '002', 'Truc Bach'),
(3, 1, '003', 'Vinh Phuc'),
(4, 1, '004', 'Cong Vi'),
(5, 1, '005', 'Lie Giai');

-- Insert sample wards for HCMC
INSERT INTO ward (ward_id, province_id, code, name) VALUES
(6, 2, '001', 'Ben Nghe'),
(7, 2, '002', 'Dakao'),
(8, 2, '003', 'Tan Dinh'),
(9, 2, '004', 'Da Kao'),
(10, 2, '005', 'Nguyen Thai Binh');

-- Insert sample accounts (admin users)
INSERT INTO account (account_id, company_id, username, password_hash, full_name, phone, email, role, status, created_at, email_verified_at) VALUES
(1, 1, 'admin_hanoi', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin Hanoi', '0901234567', 'admin@radiocabs-hn.com', 'ADMIN', 'ACTIVE', NOW(), NOW()),
(2, 2, 'admin_hcmc', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Admin HCMC', '0907654321', 'admin@radiocabs-hcm.com', 'ADMIN', 'ACTIVE', NOW(), NOW()),
(3, 1, 'driver001', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Nguyen Van A', '0912345678', 'driver1@radiocabs-hn.com', 'DRIVER', 'ACTIVE', NOW(), NOW()),
(4, 1, 'driver002', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Tran Van B', '0918765432', 'driver2@radiocabs-hn.com', 'DRIVER', 'ACTIVE', NOW(), NOW()),
(5, 2, 'customer001', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Le Thi C', '0923456789', 'customer1@email.com', 'CUSTOMER', 'ACTIVE', NOW(), NOW());

-- Insert vehicle segments
INSERT INTO vehicle_segment (segment_id, company_id, code, name, description, is_active) VALUES
(1, 1, 'ECONOMY', 'Economy', 'Budget-friendly vehicles for short trips', true),
(2, 1, 'COMFORT', 'Comfort', 'Mid-range vehicles with better comfort', true),
(3, 1, 'PREMIUM', 'Premium', 'High-end vehicles for luxury travel', true),
(4, 2, 'ECONOMY', 'Economy', 'Budget-friendly vehicles for short trips', true),
(5, 2, 'COMFORT', 'Comfort', 'Mid-range vehicles with better comfort', true);

-- Insert vehicle models
INSERT INTO vehicle_model (model_id, company_id, segment_id, brand, model_name, fuel_type, seat_category, image_url, description, is_active) VALUES
(1, 1, 1, 'Toyota', 'Vios', 'GASOLINE', 'SEDAN_5', 'https://example.com/vios.jpg', 'Reliable and fuel-efficient sedan', true),
(2, 1, 2, 'Honda', 'City', 'GASOLINE', 'SEDAN_5', 'https://example.com/city.jpg', 'Comfortable mid-size sedan', true),
(3, 1, 3, 'BMW', '3 Series', 'GASOLINE', 'SEDAN_5', 'https://example.com/bmw3.jpg', 'Luxury sedan with premium features', true),
(4, 1, 2, 'Toyota', 'Innova', 'DIESEL', 'MPV_7', 'https://example.com/innova.jpg', 'Spacious 7-seater MPV', true),
(5, 2, 4, 'Hyundai', 'Accent', 'GASOLINE', 'SEDAN_5', 'https://example.com/accent.jpg', 'Modern compact sedan', true);

-- Insert vehicles
INSERT INTO vehicle (vehicle_id, company_id, model_id, plate_number, vin, color, year_manufactured, in_service_from, odometer_km, status) VALUES
(1, 1, 1, '29A-12345', '1HGBH41JXMN109186', 'White', 2020, '2020-01-01', 50000, 'ACTIVE'),
(2, 1, 2, '29A-12346', '1HGBH41JXMN109187', 'Black', 2021, '2021-03-15', 35000, 'ACTIVE'),
(3, 1, 3, '29A-12347', '1HGBH41JXMN109188', 'Silver', 2022, '2022-06-01', 20000, 'ACTIVE'),
(4, 1, 4, '29A-12348', '1HGBH41JXMN109189', 'Blue', 2021, '2021-09-10', 40000, 'ACTIVE'),
(5, 2, 5, '51A-12345', '1HGBH41JXMN109190', 'Red', 2022, '2022-02-20', 25000, 'ACTIVE');

-- Insert zones
INSERT INTO zone (zone_id, company_id, province_id, code, name, description, is_active) VALUES
(1, 1, 1, 'HN_CENTER', 'Hanoi Center', 'Central area of Hanoi', true),
(2, 1, 1, 'HN_WEST', 'Hanoi West', 'Western area of Hanoi', true),
(3, 2, 2, 'HCM_D1', 'District 1', 'Central business district', true),
(4, 2, 2, 'HCM_D2', 'District 2', 'Thao Dien area', true);

-- Insert zone-ward relationships
INSERT INTO zone_ward (zone_id, ward_id) VALUES
(1, 1), (1, 2), (1, 3),
(2, 4), (2, 5),
(3, 6), (3, 7),
(4, 8), (4, 9), (4, 10);

-- Insert model price provinces
INSERT INTO model_price_province (model_price_id, company_id, province_id, model_id, opening_fare, rate_first_20km, rate_over_20km, traffic_add_per_km, rain_add_per_trip, intercity_rate_per_km, time_start, time_end, parent_id, date_start, date_end, is_active, note) VALUES
(1, 1, 1, 1, 15000, 8000, 6000, 1000, 5000, 7000, '06:00:00', '22:00:00', NULL, '2024-01-01', '2024-12-31', true, 'Standard pricing for Vios in Hanoi'),
(2, 1, 1, 2, 20000, 10000, 8000, 1200, 6000, 8000, '06:00:00', '22:00:00', NULL, '2024-01-01', '2024-12-31', true, 'Standard pricing for City in Hanoi'),
(3, 1, 1, 3, 35000, 15000, 12000, 2000, 8000, 12000, '06:00:00', '22:00:00', NULL, '2024-01-01', '2024-12-31', true, 'Premium pricing for BMW 3 Series in Hanoi'),
(4, 2, 2, 5, 18000, 9000, 7000, 1100, 5500, 7500, '06:00:00', '22:00:00', NULL, '2024-01-01', '2024-12-31', true, 'Standard pricing for Accent in HCMC');

-- Insert driver vehicle assignments
INSERT INTO driver_vehicle_assignment (assignment_id, driver_account_id, vehicle_id, start_at) VALUES
(1, 3, 1, NOW()),
(2, 4, 2, NOW());

-- Insert sample driving orders
INSERT INTO driving_order (order_id, company_id, customer_account_id, vehicle_id, driver_account_id, model_id, price_ref_id, from_province_id, to_province_id, pickup_address, dropoff_address, pickup_time, status, total_km, inner_city_km, intercity_km, traffic_km, is_raining, wait_minutes, base_fare, traffic_unit_price, traffic_fee, rain_fee, intercity_unit_price, intercity_fee, other_fee, total_amount, created_at) VALUES
(1, 1, 5, 1, 3, 1, 1, 1, 1, 'Noi Bai Airport', 'Hanoi Old Quarter', NOW() + INTERVAL '1 hour', 'NEW', 0, 0, 0, 0, false, 0, 15000, 1000, 0, 0, 7000, 0, 0, 15000, NOW()),
(2, 1, 5, 2, 4, 2, 2, 1, 1, 'Hanoi Railway Station', 'West Lake', NOW() + INTERVAL '2 hours', 'ASSIGNED', 0, 0, 0, 0, false, 0, 20000, 1200, 0, 0, 8000, 0, 0, 20000, NOW());

-- Insert membership orders
INSERT INTO membership_order (membership_order_id, company_id, payer_account_id, unit_price, unit_months, amount, start_date, end_date, paid_at, payment_method, note) VALUES
(1, 1, 5, 500000, 12, 6000000, '2024-01-01', '2024-12-31', NOW(), 'CARD', 'Annual membership for customer001'),
(2, 2, 5, 500000, 6, 3000000, '2024-06-01', '2024-11-30', NULL, NULL, 'Pending payment for 6-month membership');

-- Update company contact accounts
UPDATE company SET contact_account_id = 1 WHERE company_id = 1;
UPDATE company SET contact_account_id = 2 WHERE company_id = 2;
