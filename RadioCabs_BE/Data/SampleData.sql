-- ========================================
-- SAMPLE DATA FOR RADIOCABS DATABASE
-- ========================================
-- Thứ tự INSERT theo dependency (bảng độc lập trước, bảng phụ thuộc sau)

-- ===== 1. PROVINCES =====
INSERT INTO province (province_id, code, name) VALUES
(1, 'HN', 'Hà Nội'),
(2, 'HCM', 'Thành phố Hồ Chí Minh'),
(3, 'DN', 'Đà Nẵng'),
(4, 'HP', 'Hải Phòng'),
(5, 'BD', 'Bình Dương');

-- ===== 2. COMPANIES =====
INSERT INTO company (company_id, name, hotline, email, address, tax_code, status, contact_account_id, created_at, fax) VALUES
(1, 'RadioCabs Hà Nội', '1900-1234', 'contact@radiocabs-hn.com', '123 Lê Lợi, Hoàn Kiếm, Hà Nội', '0123456789', 'ACTIVE', NULL, NOW(), '024-1234567'),
(2, 'RadioCabs TP.HCM', '1900-5678', 'contact@radiocabs-hcm.com', '456 Nguyễn Huệ, Quận 1, TP.HCM', '0987654321', 'ACTIVE', NULL, NOW(), '028-9876543'),
(3, 'RadioCabs Đà Nẵng', '1900-9999', 'contact@radiocabs-dn.com', '789 Lê Duẩn, Hải Châu, Đà Nẵng', '0555666777', 'ACTIVE', NULL, NOW(), '0236-123456');

-- ===== 3. ACCOUNTS =====
INSERT INTO account (account_id, company_id, username, password_hash, full_name, phone, email, role, status, created_at, email_verified_at) VALUES
-- Admin accounts
(1, 1, 'admin.hn', '$2a$10$hash1', 'Nguyễn Văn Admin HN', '0901234567', 'admin.hn@radiocabs.com', 'ADMIN', 'ACTIVE', NOW(), NOW()),
(2, 2, 'admin.hcm', '$2a$10$hash2', 'Trần Thị Admin HCM', '0907654321', 'admin.hcm@radiocabs.com', 'ADMIN', 'ACTIVE', NOW(), NOW()),
(3, 3, 'admin.dn', '$2a$10$hash3', 'Lê Văn Admin DN', '0909876543', 'admin.dn@radiocabs.com', 'ADMIN', 'ACTIVE', NOW(), NOW()),

-- Manager accounts
(4, 1, 'manager.hn', '$2a$10$hash4', 'Phạm Thị Manager HN', '0901111111', 'manager.hn@radiocabs.com', 'MANAGER', 'ACTIVE', NOW(), NOW()),
(5, 2, 'manager.hcm', '$2a$10$hash5', 'Hoàng Văn Manager HCM', '0902222222', 'manager.hcm@radiocabs.com', 'MANAGER', 'ACTIVE', NOW(), NOW()),

-- Driver accounts
(6, 1, 'driver001.hn', '$2a$10$hash6', 'Nguyễn Văn Tài Xế 1', '0903333333', 'driver001.hn@radiocabs.com', 'DRIVER', 'ACTIVE', NOW(), NOW()),
(7, 1, 'driver002.hn', '$2a$10$hash7', 'Trần Thị Tài Xế 2', '0904444444', 'driver002.hn@radiocabs.com', 'DRIVER', 'ACTIVE', NOW(), NOW()),
(8, 2, 'driver001.hcm', '$2a$10$hash8', 'Lê Văn Tài Xế 3', '0905555555', 'driver001.hcm@radiocabs.com', 'DRIVER', 'ACTIVE', NOW(), NOW()),
(9, 2, 'driver002.hcm', '$2a$10$hash9', 'Phạm Thị Tài Xế 4', '0906666666', 'driver002.hcm@radiocabs.com', 'DRIVER', 'ACTIVE', NOW(), NOW()),
(10, 3, 'driver001.dn', '$2a$10$hash10', 'Hoàng Văn Tài Xế 5', '0907777777', 'driver001.dn@radiocabs.com', 'DRIVER', 'ACTIVE', NOW(), NOW()),

-- Customer accounts
(11, NULL, 'customer001', '$2a$10$hash11', 'Nguyễn Thị Khách Hàng 1', '0908888888', 'customer001@gmail.com', 'CUSTOMER', 'ACTIVE', NOW(), NOW()),
(12, NULL, 'customer002', '$2a$10$hash12', 'Trần Văn Khách Hàng 2', '0909999999', 'customer002@gmail.com', 'CUSTOMER', 'ACTIVE', NOW(), NOW()),
(13, NULL, 'customer003', '$2a$10$hash13', 'Lê Thị Khách Hàng 3', '0910000000', 'customer003@gmail.com', 'CUSTOMER', 'ACTIVE', NOW(), NOW());

-- ===== 4. UPDATE COMPANY CONTACT_ACCOUNT_ID =====
UPDATE company SET contact_account_id = 1 WHERE company_id = 1;
UPDATE company SET contact_account_id = 2 WHERE company_id = 2;
UPDATE company SET contact_account_id = 3 WHERE company_id = 3;

-- ===== 5. WARDS =====
INSERT INTO ward (ward_id, province_id, code, name) VALUES
-- Hà Nội wards
(1, 1, '001', 'Phường Phúc Xá'),
(2, 1, '002', 'Phường Trúc Bạch'),
(3, 1, '003', 'Phường Vĩnh Phú'),
(4, 1, '004', 'Phường Cống Vị'),
(5, 1, '005', 'Phường Liễu Giai'),

-- TP.HCM wards
(6, 2, '001', 'Phường Bến Nghé'),
(7, 2, '002', 'Phường Bến Thành'),
(8, 2, '003', 'Phường Cầu Kho'),
(9, 2, '004', 'Phường Cầu Ông Lãnh'),
(10, 2, '005', 'Phường Cô Giang'),

-- Đà Nẵng wards
(11, 3, '001', 'Phường An Hải Bắc'),
(12, 3, '002', 'Phường An Hải Đông'),
(13, 3, '003', 'Phường An Hải Tây'),
(14, 3, '004', 'Phường Hòa Cường Bắc'),
(15, 3, '005', 'Phường Hòa Cường Nam');

-- ===== 6. VEHICLE_SEGMENTS =====
INSERT INTO vehicle_segment (segment_id, company_id, code, name, description, is_active) VALUES
(1, 1, 'ECONOMY', 'Hạng Phổ Thông', 'Xe 4-5 chỗ, tiết kiệm nhiên liệu', true),
(2, 1, 'COMFORT', 'Hạng Tiện Nghi', 'Xe 4-5 chỗ, tiện nghi cao', true),
(3, 1, 'PREMIUM', 'Hạng Cao Cấp', 'Xe 5-7 chỗ, cao cấp', true),
(4, 2, 'ECONOMY', 'Hạng Phổ Thông', 'Xe 4-5 chỗ, tiết kiệm nhiên liệu', true),
(5, 2, 'COMFORT', 'Hạng Tiện Nghi', 'Xe 4-5 chỗ, tiện nghi cao', true),
(6, 3, 'ECONOMY', 'Hạng Phổ Thông', 'Xe 4-5 chỗ, tiết kiệm nhiên liệu', true);

-- ===== 7. VEHICLE_MODELS =====
INSERT INTO vehicle_model (model_id, company_id, segment_id, brand, model_name, fuel_type, seat_category, image_url, description, is_active) VALUES
-- Hà Nội models
(1, 1, 1, 'Toyota', 'Vios', 'GASOLINE', 'SEDAN_5', 'https://example.com/vios.jpg', 'Xe sedan 4 chỗ, tiết kiệm nhiên liệu', true),
(2, 1, 1, 'Honda', 'City', 'GASOLINE', 'SEDAN_5', 'https://example.com/city.jpg', 'Xe sedan 4 chỗ, động cơ 1.5L', true),
(3, 1, 2, 'Toyota', 'Camry', 'GASOLINE', 'SEDAN_5', 'https://example.com/camry.jpg', 'Xe sedan cao cấp, động cơ 2.0L', true),
(4, 1, 3, 'Toyota', 'Innova', 'DIESEL', 'MPV_7', 'https://example.com/innova.jpg', 'Xe MPV 7 chỗ, phù hợp gia đình', true),

-- TP.HCM models
(5, 2, 4, 'Toyota', 'Vios', 'GASOLINE', 'SEDAN_5', 'https://example.com/vios.jpg', 'Xe sedan 4 chỗ, tiết kiệm nhiên liệu', true),
(6, 2, 4, 'Honda', 'City', 'GASOLINE', 'SEDAN_5', 'https://example.com/city.jpg', 'Xe sedan 4 chỗ, động cơ 1.5L', true),
(7, 2, 5, 'Toyota', 'Camry', 'GASOLINE', 'SEDAN_5', 'https://example.com/camry.jpg', 'Xe sedan cao cấp, động cơ 2.0L', true),

-- Đà Nẵng models
(8, 3, 6, 'Toyota', 'Vios', 'GASOLINE', 'SEDAN_5', 'https://example.com/vios.jpg', 'Xe sedan 4 chỗ, tiết kiệm nhiên liệu', true),
(9, 3, 6, 'Honda', 'City', 'GASOLINE', 'SEDAN_5', 'https://example.com/city.jpg', 'Xe sedan 4 chỗ, động cơ 1.5L', true);

-- ===== 8. VEHICLES =====
INSERT INTO vehicle (vehicle_id, company_id, model_id, plate_number, vin, color, year_manufactured, in_service_from, odometer_km, status) VALUES
-- Hà Nội vehicles
(1, 1, 1, '29A-12345', 'VIN1234567890', 'Trắng', 2023, '2023-01-01', 15000, 'ACTIVE'),
(2, 1, 1, '29A-12346', 'VIN1234567891', 'Đen', 2023, '2023-01-15', 12000, 'ACTIVE'),
(3, 1, 2, '29A-12347', 'VIN1234567892', 'Bạc', 2023, '2023-02-01', 18000, 'ACTIVE'),
(4, 1, 3, '29A-12348', 'VIN1234567893', 'Trắng', 2023, '2023-02-15', 10000, 'ACTIVE'),
(5, 1, 4, '29A-12349', 'VIN1234567894', 'Đen', 2023, '2023-03-01', 8000, 'ACTIVE'),

-- TP.HCM vehicles
(6, 2, 5, '51A-56789', 'VIN5678901234', 'Trắng', 2023, '2023-01-01', 20000, 'ACTIVE'),
(7, 2, 5, '51A-56790', 'VIN5678901235', 'Đỏ', 2023, '2023-01-15', 16000, 'ACTIVE'),
(8, 2, 6, '51A-56791', 'VIN5678901236', 'Bạc', 2023, '2023-02-01', 14000, 'ACTIVE'),
(9, 2, 7, '51A-56792', 'VIN5678901237', 'Trắng', 2023, '2023-02-15', 11000, 'ACTIVE'),

-- Đà Nẵng vehicles
(10, 3, 8, '43A-99999', 'VIN9999999999', 'Trắng', 2023, '2023-01-01', 9000, 'ACTIVE'),
(11, 3, 9, '43A-99998', 'VIN9999999998', 'Đen', 2023, '2023-01-15', 7500, 'ACTIVE');

-- ===== 9. ZONES =====
INSERT INTO zone (zone_id, company_id, province_id, code, name, description, is_active) VALUES
-- Hà Nội zones
(1, 1, 1, 'HN_CENTER', 'Trung Tâm Hà Nội', 'Khu vực trung tâm thành phố', true),
(2, 1, 1, 'HN_AIRPORT', 'Sân Bay Nội Bài', 'Khu vực sân bay Nội Bài', true),
(3, 1, 1, 'HN_WEST', 'Tây Hà Nội', 'Khu vực phía Tây thành phố', true),

-- TP.HCM zones
(4, 2, 2, 'HCM_CENTER', 'Trung Tâm TP.HCM', 'Khu vực trung tâm thành phố', true),
(5, 2, 2, 'HCM_AIRPORT', 'Sân Bay Tân Sơn Nhất', 'Khu vực sân bay Tân Sơn Nhất', true),
(6, 2, 2, 'HCM_EAST', 'Đông TP.HCM', 'Khu vực phía Đông thành phố', true),

-- Đà Nẵng zones
(7, 3, 3, 'DN_CENTER', 'Trung Tâm Đà Nẵng', 'Khu vực trung tâm thành phố', true),
(8, 3, 3, 'DN_AIRPORT', 'Sân Bay Đà Nẵng', 'Khu vực sân bay Đà Nẵng', true);

-- ===== 10. ZONE_WARDS =====
INSERT INTO zone_ward (zone_id, ward_id) VALUES
-- Hà Nội zone-ward assignments
(1, 1), (1, 2), (1, 3),
(2, 4), (2, 5),
(3, 1), (3, 3),

-- TP.HCM zone-ward assignments
(4, 6), (4, 7), (4, 8),
(5, 9), (5, 10),
(6, 6), (6, 8),

-- Đà Nẵng zone-ward assignments
(7, 11), (7, 12), (7, 13),
(8, 14), (8, 15);

-- ===== 11. VEHICLE_IN_PROVINCE =====
INSERT INTO vehicle_in_province (vehicle_id, province_id, allowed, since_date) VALUES
-- All vehicles allowed in their respective provinces
(1, 1, true, '2023-01-01'), (2, 1, true, '2023-01-15'), (3, 1, true, '2023-02-01'), (4, 1, true, '2023-02-15'), (5, 1, true, '2023-03-01'),
(6, 2, true, '2023-01-01'), (7, 2, true, '2023-01-15'), (8, 2, true, '2023-02-01'), (9, 2, true, '2023-02-15'),
(10, 3, true, '2023-01-01'), (11, 3, true, '2023-01-15');

-- ===== 12. VEHICLE_ZONE_PREFERENCE =====
INSERT INTO vehicle_zone_preference (vehicle_id, zone_id, priority) VALUES
-- Vehicle zone preferences (priority: lower number = higher priority)
(1, 1, 10), (1, 2, 20),
(2, 1, 10), (2, 3, 20),
(3, 1, 10), (3, 2, 15),
(4, 1, 10), (4, 3, 20),
(5, 2, 10), (5, 1, 20),
(6, 4, 10), (6, 5, 20),
(7, 4, 10), (7, 6, 20),
(8, 4, 10), (8, 5, 15),
(9, 4, 10), (9, 6, 20),
(10, 7, 10), (10, 8, 20),
(11, 7, 10), (11, 8, 15);

-- ===== 13. MODEL_PRICE_PROVINCE =====
INSERT INTO model_price_province (model_price_id, company_id, province_id, model_id, opening_fare, rate_first20_km, rate_over20_km, traffic_add_per_km, rain_add_per_trip, intercity_rate_per_km, time_start, time_end, parent_id, date_start, date_end, is_active, note) VALUES
-- Hà Nội pricing
(1, 1, 1, 1, 15000.00, 12000.00, 10000.00, 2000.00, 5000.00, 15000.00, '06:00:00', '22:00:00', NULL, '2024-01-01', '2024-12-31', true, 'Giá ban ngày'),
(2, 1, 1, 1, 20000.00, 15000.00, 12000.00, 3000.00, 5000.00, 18000.00, '22:00:00', '06:00:00', 1, '2024-01-01', '2024-12-31', true, 'Giá ban đêm'),
(3, 1, 1, 2, 18000.00, 14000.00, 11000.00, 2500.00, 5000.00, 16000.00, '06:00:00', '22:00:00', NULL, '2024-01-01', '2024-12-31', true, 'Giá Honda City'),
(4, 1, 1, 3, 25000.00, 18000.00, 15000.00, 3000.00, 8000.00, 20000.00, '06:00:00', '22:00:00', NULL, '2024-01-01', '2024-12-31', true, 'Giá Camry'),
(5, 1, 1, 4, 30000.00, 20000.00, 18000.00, 3500.00, 10000.00, 25000.00, '06:00:00', '22:00:00', NULL, '2024-01-01', '2024-12-31', true, 'Giá Innova'),

-- TP.HCM pricing
(6, 2, 2, 5, 16000.00, 13000.00, 11000.00, 2200.00, 6000.00, 16000.00, '06:00:00', '22:00:00', NULL, '2024-01-01', '2024-12-31', true, 'Giá ban ngày'),
(7, 2, 2, 5, 22000.00, 16000.00, 13000.00, 3200.00, 6000.00, 19000.00, '22:00:00', '06:00:00', 6, '2024-01-01', '2024-12-31', true, 'Giá ban đêm'),
(8, 2, 2, 6, 19000.00, 15000.00, 12000.00, 2700.00, 6000.00, 17000.00, '06:00:00', '22:00:00', NULL, '2024-01-01', '2024-12-31', true, 'Giá Honda City'),
(9, 2, 2, 7, 26000.00, 19000.00, 16000.00, 3200.00, 9000.00, 21000.00, '06:00:00', '22:00:00', NULL, '2024-01-01', '2024-12-31', true, 'Giá Camry'),

-- Đà Nẵng pricing
(10, 3, 3, 8, 14000.00, 11000.00, 9000.00, 1800.00, 4000.00, 14000.00, '06:00:00', '22:00:00', NULL, '2024-01-01', '2024-12-31', true, 'Giá ban ngày'),
(11, 3, 3, 8, 19000.00, 14000.00, 11000.00, 2800.00, 4000.00, 17000.00, '22:00:00', '06:00:00', 10, '2024-01-01', '2024-12-31', true, 'Giá ban đêm'),
(12, 3, 3, 9, 17000.00, 13000.00, 10000.00, 2300.00, 4000.00, 15000.00, '06:00:00', '22:00:00', NULL, '2024-01-01', '2024-12-31', true, 'Giá Honda City');

-- ===== 14. DRIVER_VEHICLE_ASSIGNMENT =====
INSERT INTO driver_vehicle_assignment (assignment_id, driver_account_id, vehicle_id, start_at, end_at) VALUES
(1, 6, 1, '2024-01-01 06:00:00+07', NULL), -- Active assignment
(2, 7, 2, '2024-01-01 06:00:00+07', NULL), -- Active assignment
(3, 8, 6, '2024-01-01 06:00:00+07', NULL), -- Active assignment
(4, 9, 7, '2024-01-01 06:00:00+07', NULL), -- Active assignment
(5, 10, 10, '2024-01-01 06:00:00+07', NULL), -- Active assignment
-- Historical assignments (ended)
(6, 6, 3, '2023-12-01 06:00:00+07', '2023-12-31 18:00:00+07'),
(7, 7, 4, '2023-12-01 06:00:00+07', '2023-12-31 18:00:00+07');

-- ===== 15. DRIVER_SCHEDULE_TEMPLATE =====
INSERT INTO driver_schedule_template (template_id, driver_account_id, start_date, end_date, weekday, start_time, end_time, vehicle_id, note, is_active) VALUES
-- Driver 6 (Hà Nội) - Monday to Friday
(1, 6, '2024-01-01', '2024-12-31', 1, '06:00:00', '18:00:00', 1, 'Ca ngày thứ 2-6', true),
(2, 6, '2024-01-01', '2024-12-31', 2, '06:00:00', '18:00:00', 1, 'Ca ngày thứ 2-6', true),
(3, 6, '2024-01-01', '2024-12-31', 3, '06:00:00', '18:00:00', 1, 'Ca ngày thứ 2-6', true),
(4, 6, '2024-01-01', '2024-12-31', 4, '06:00:00', '18:00:00', 1, 'Ca ngày thứ 2-6', true),
(5, 6, '2024-01-01', '2024-12-31', 5, '06:00:00', '18:00:00', 1, 'Ca ngày thứ 2-6', true),

-- Driver 7 (Hà Nội) - Weekend
(6, 7, '2024-01-01', '2024-12-31', 0, '08:00:00', '20:00:00', 2, 'Ca cuối tuần', true),
(7, 7, '2024-01-01', '2024-12-31', 6, '08:00:00', '20:00:00', 2, 'Ca cuối tuần', true),

-- Driver 8 (TP.HCM) - Monday to Friday
(8, 8, '2024-01-01', '2024-12-31', 1, '07:00:00', '19:00:00', 6, 'Ca ngày thứ 2-6', true),
(9, 8, '2024-01-01', '2024-12-31', 2, '07:00:00', '19:00:00', 6, 'Ca ngày thứ 2-6', true),
(10, 8, '2024-01-01', '2024-12-31', 3, '07:00:00', '19:00:00', 6, 'Ca ngày thứ 2-6', true),
(11, 8, '2024-01-01', '2024-12-31', 4, '07:00:00', '19:00:00', 6, 'Ca ngày thứ 2-6', true),
(12, 8, '2024-01-01', '2024-12-31', 5, '07:00:00', '19:00:00', 6, 'Ca ngày thứ 2-6', true),

-- Driver 9 (TP.HCM) - Weekend
(13, 9, '2024-01-01', '2024-12-31', 0, '09:00:00', '21:00:00', 7, 'Ca cuối tuần', true),
(14, 9, '2024-01-01', '2024-12-31', 6, '09:00:00', '21:00:00', 7, 'Ca cuối tuần', true),

-- Driver 10 (Đà Nẵng) - Monday to Friday
(15, 10, '2024-01-01', '2024-12-31', 1, '06:30:00', '18:30:00', 10, 'Ca ngày thứ 2-6', true),
(16, 10, '2024-01-01', '2024-12-31', 2, '06:30:00', '18:30:00', 10, 'Ca ngày thứ 2-6', true),
(17, 10, '2024-01-01', '2024-12-31', 3, '06:30:00', '18:30:00', 10, 'Ca ngày thứ 2-6', true),
(18, 10, '2024-01-01', '2024-12-31', 4, '06:30:00', '18:30:00', 10, 'Ca ngày thứ 2-6', true),
(19, 10, '2024-01-01', '2024-12-31', 5, '06:30:00', '18:30:00', 10, 'Ca ngày thứ 2-6', true);

-- ===== 16. DRIVER_SCHEDULE (Sample for current week) =====
INSERT INTO driver_schedule (schedule_id, driver_account_id, work_date, start_time, end_time, vehicle_id, status, note, created_at) VALUES
-- Current week schedules (January 2024)
(1, 6, '2024-01-15', '06:00:00', '18:00:00', 1, 'PLANNED', 'Ca ngày thứ 2', NOW()),
(2, 6, '2024-01-16', '06:00:00', '18:00:00', 1, 'PLANNED', 'Ca ngày thứ 3', NOW()),
(3, 6, '2024-01-17', '06:00:00', '18:00:00', 1, 'ON', 'Ca ngày thứ 4 - Đang làm việc', NOW()),
(4, 6, '2024-01-18', '06:00:00', '18:00:00', 1, 'PLANNED', 'Ca ngày thứ 5', NOW()),
(5, 6, '2024-01-19', '06:00:00', '18:00:00', 1, 'PLANNED', 'Ca ngày thứ 6', NOW()),

(6, 7, '2024-01-13', '08:00:00', '20:00:00', 2, 'COMPLETED', 'Ca cuối tuần thứ 7', NOW()),
(7, 7, '2024-01-14', '08:00:00', '20:00:00', 2, 'COMPLETED', 'Ca cuối tuần chủ nhật', NOW()),
(8, 7, '2024-01-20', '08:00:00', '20:00:00', 2, 'PLANNED', 'Ca cuối tuần thứ 7', NOW()),
(9, 7, '2024-01-21', '08:00:00', '20:00:00', 2, 'PLANNED', 'Ca cuối tuần chủ nhật', NOW()),

(10, 8, '2024-01-15', '07:00:00', '19:00:00', 6, 'PLANNED', 'Ca ngày thứ 2', NOW()),
(11, 8, '2024-01-16', '07:00:00', '19:00:00', 6, 'PLANNED', 'Ca ngày thứ 3', NOW()),
(12, 8, '2024-01-17', '07:00:00', '19:00:00', 6, 'ON', 'Ca ngày thứ 4 - Đang làm việc', NOW()),
(13, 8, '2024-01-18', '07:00:00', '19:00:00', 6, 'PLANNED', 'Ca ngày thứ 5', NOW()),
(14, 8, '2024-01-19', '07:00:00', '19:00:00', 6, 'PLANNED', 'Ca ngày thứ 6', NOW()),

(15, 9, '2024-01-13', '09:00:00', '21:00:00', 7, 'COMPLETED', 'Ca cuối tuần thứ 7', NOW()),
(16, 9, '2024-01-14', '09:00:00', '21:00:00', 7, 'COMPLETED', 'Ca cuối tuần chủ nhật', NOW()),
(17, 9, '2024-01-20', '09:00:00', '21:00:00', 7, 'PLANNED', 'Ca cuối tuần thứ 7', NOW()),
(18, 9, '2024-01-21', '09:00:00', '21:00:00', 7, 'PLANNED', 'Ca cuối tuần chủ nhật', NOW()),

(19, 10, '2024-01-15', '06:30:00', '18:30:00', 10, 'PLANNED', 'Ca ngày thứ 2', NOW()),
(20, 10, '2024-01-16', '06:30:00', '18:30:00', 10, 'PLANNED', 'Ca ngày thứ 3', NOW()),
(21, 10, '2024-01-17', '06:30:00', '18:30:00', 10, 'ON', 'Ca ngày thứ 4 - Đang làm việc', NOW()),
(22, 10, '2024-01-18', '06:30:00', '18:30:00', 10, 'PLANNED', 'Ca ngày thứ 5', NOW()),
(23, 10, '2024-01-19', '06:30:00', '18:30:00', 10, 'PLANNED', 'Ca ngày thứ 6', NOW());

-- ===== 17. MEMBERSHIP_ORDER =====
INSERT INTO membership_order (membership_order_id, company_id, payer_account_id, unit_months, unit_price, amount, start_date, end_date, paid_at, payment_method, note) VALUES
(1, 1, 11, 12, 500000.00, 6000000.00, '2024-01-01', '2024-12-31', '2024-01-01 10:00:00+07', 'BANK', 'Gói thành viên năm 2024'),
(2, 2, 12, 6, 550000.00, 3300000.00, '2024-01-01', '2024-06-30', '2024-01-01 11:00:00+07', 'CARD', 'Gói thành viên 6 tháng'),
(3, 1, 13, 3, 600000.00, 1800000.00, '2024-01-01', '2024-03-31', '2024-01-01 12:00:00+07', 'WALLET', 'Gói thành viên 3 tháng'),
(4, 3, 11, 1, 700000.00, 700000.00, '2024-01-01', '2024-01-31', '2024-01-01 13:00:00+07', 'CASH', 'Gói thành viên tháng'),
(5, 2, 12, 12, 480000.00, 5760000.00, '2024-01-01', '2024-12-31', NULL, NULL, 'Gói thành viên năm - chưa thanh toán');

-- ===== 18. DRIVING_ORDER =====
INSERT INTO driving_order (order_id, company_id, customer_account_id, vehicle_id, driver_account_id, model_id, price_ref_id, from_province_id, to_province_id, pickup_address, dropoff_address, pickup_time, dropoff_time, status, total_km, inner_city_km, intercity_km, traffic_km, is_raining, wait_minutes, base_fare, traffic_unit_price, traffic_fee, rain_fee, intercity_unit_price, intercity_fee, other_fee, total_amount, fare_breakdown, payment_method, paid_at, created_at) VALUES
(1, 1, 11, 1, 6, 1, 1, 1, 1, '123 Lê Lợi, Hoàn Kiếm, Hà Nội', '456 Nguyễn Huệ, Hai Bà Trưng, Hà Nội', '2024-01-15 08:00:00+07', '2024-01-15 08:30:00+07', 'DONE', 8.5, 8.5, 0.0, 2.0, false, 5, 15000.00, 2000.00, 4000.00, 0.00, 15000.00, 0.00, 0.00, 19000.00, '{"base_fare": 15000, "traffic_fee": 4000}', 'CASH', '2024-01-15 08:35:00+07', '2024-01-15 07:45:00+07'),
(2, 1, 12, 2, 7, 2, 3, 1, 1, '789 Trần Hưng Đạo, Hoàn Kiếm, Hà Nội', '321 Cầu Giấy, Cầu Giấy, Hà Nội', '2024-01-15 14:00:00+07', '2024-01-15 14:45:00+07', 'ONGOING', 15.2, 15.2, 0.0, 3.5, true, 0, 18000.00, 2500.00, 8750.00, 5000.00, 16000.00, 0.00, 0.00, 31750.00, '{"base_fare": 18000, "traffic_fee": 8750, "rain_fee": 5000}', NULL, NULL, '2024-01-15 13:30:00+07'),
(3, 2, 13, 6, 8, 5, 6, 2, 2, '111 Nguyễn Huệ, Quận 1, TP.HCM', '222 Lê Văn Việt, Quận 9, TP.HCM', '2024-01-16 09:00:00+07', NULL, 'ASSIGNED', 25.8, 25.8, 0.0, 5.2, false, 0, 16000.00, 2200.00, 11440.00, 0.00, 16000.00, 0.00, 0.00, 27440.00, '{"base_fare": 16000, "traffic_fee": 11440}', NULL, NULL, '2024-01-16 08:30:00+07'),
(4, 2, 11, 7, 9, 6, 8, 2, 2, '333 Điện Biên Phủ, Bình Thạnh, TP.HCM', '444 Nguyễn Thị Thập, Quận 7, TP.HCM', '2024-01-16 16:00:00+07', '2024-01-16 16:50:00+07', 'DONE', 18.7, 18.7, 0.0, 4.1, false, 10, 19000.00, 2700.00, 11070.00, 0.00, 17000.00, 0.00, 0.00, 30070.00, '{"base_fare": 19000, "traffic_fee": 11070}', 'CARD', '2024-01-16 17:00:00+07', '2024-01-16 15:30:00+07'),
(5, 3, 12, 10, 10, 8, 10, 3, 3, '555 Lê Duẩn, Hải Châu, Đà Nẵng', '666 Ngũ Hành Sơn, Ngũ Hành Sơn, Đà Nẵng', '2024-01-17 10:00:00+07', NULL, 'NEW', 12.3, 12.3, 0.0, 2.8, false, 0, 14000.00, 1800.00, 5040.00, 0.00, 14000.00, 0.00, 0.00, 19040.00, '{"base_fare": 14000, "traffic_fee": 5040}', NULL, NULL, '2024-01-17 09:30:00+07');

-- ===== 19. AUTH_EMAIL_CODE (Sample verification codes) =====
INSERT INTO auth_email_code (code_id, account_id, email, purpose, code_hash, sent_at, expires_at, consumed_at, attempt_count, max_attempts) VALUES
(1, 11, 'customer001@gmail.com', 'SIGNUP', '$2a$10$verification_hash_1', '2024-01-15 10:00:00+07', '2024-01-15 11:00:00+07', '2024-01-15 10:05:00+07', 1, 5),
(2, 12, 'customer002@gmail.com', 'PASSWORD_RESET', '$2a$10$verification_hash_2', '2024-01-15 14:00:00+07', '2024-01-15 15:00:00+07', NULL, 0, 5),
(3, 13, 'customer003@gmail.com', 'EMAIL_CHANGE', '$2a$10$verification_hash_3', '2024-01-16 09:00:00+07', '2024-01-16 10:00:00+07', NULL, 0, 5);

-- ===== 20. AUTH_REFRESH_SESSION (Sample refresh tokens) =====
INSERT INTO auth_refresh_session (session_id, account_id, token_hash, jti, created_at, expires_at, revoked_at, replaced_by, ip, user_agent) VALUES
('550e8400-e29b-41d4-a716-446655440001', 11, '$2a$10$refresh_hash_1', '550e8400-e29b-41d4-a716-446655440011', '2024-01-15 08:00:00+07', '2024-01-22 08:00:00+07', NULL, NULL, '192.168.1.100', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
('550e8400-e29b-41d4-a716-446655440002', 12, '$2a$10$refresh_hash_2', '550e8400-e29b-41d4-a716-446655440022', '2024-01-15 09:00:00+07', '2024-01-22 09:00:00+07', NULL, NULL, '192.168.1.101', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'),
('550e8400-e29b-41d4-a716-446655440003', 13, '$2a$10$refresh_hash_3', '550e8400-e29b-41d4-a716-446655440033', '2024-01-15 10:00:00+07', '2024-01-22 10:00:00+07', NULL, NULL, '192.168.1.102', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36');

-- ===== RESET SEQUENCES =====
-- Reset all sequences to continue from the highest ID
SELECT setval('province_province_id_seq', (SELECT MAX(province_id) FROM province));
SELECT setval('company_company_id_seq', (SELECT MAX(company_id) FROM company));
SELECT setval('account_account_id_seq', (SELECT MAX(account_id) FROM account));
SELECT setval('ward_ward_id_seq', (SELECT MAX(ward_id) FROM ward));
SELECT setval('vehicle_segment_segment_id_seq', (SELECT MAX(segment_id) FROM vehicle_segment));
SELECT setval('vehicle_model_model_id_seq', (SELECT MAX(model_id) FROM vehicle_model));
SELECT setval('vehicle_vehicle_id_seq', (SELECT MAX(vehicle_id) FROM vehicle));
SELECT setval('zone_zone_id_seq', (SELECT MAX(zone_id) FROM zone));
SELECT setval('model_price_province_model_price_id_seq', (SELECT MAX(model_price_id) FROM model_price_province));
SELECT setval('driver_vehicle_assignment_assignment_id_seq', (SELECT MAX(assignment_id) FROM driver_vehicle_assignment));
SELECT setval('driver_schedule_template_template_id_seq', (SELECT MAX(template_id) FROM driver_schedule_template));
SELECT setval('driver_schedule_schedule_id_seq', (SELECT MAX(schedule_id) FROM driver_schedule));
SELECT setval('membership_order_membership_order_id_seq', (SELECT MAX(membership_order_id) FROM membership_order));
SELECT setval('driving_order_order_id_seq', (SELECT MAX(order_id) FROM driving_order));
SELECT setval('auth_email_code_code_id_seq', (SELECT MAX(code_id) FROM auth_email_code));

-- ===== COMPLETION MESSAGE =====
SELECT 'Sample data insertion completed successfully!' as message;
