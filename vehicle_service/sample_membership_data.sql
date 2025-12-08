-- Insert sample membership orders for company ID 3
INSERT INTO public.membership_order (
    membership_order_id,
    company_id,
    payer_account_id,
    unit_price,
    unit_months,
    amount,
    start_date,
    end_date,
    paid_at,
    payment_method,
    note
) VALUES 
(1, 3, 1, 500000.00, 6, 3000000.00, '2024-01-01', '2024-06-30', '2024-01-01T00:00:00Z', 'Bank Transfer', 'Gói thành viên cơ bản'),
(2, 3, 1, 800000.00, 12, 9600000.00, '2024-07-01', '2025-06-30', NULL, NULL, 'Gói thành viên cao cấp'),
(3, 3, 1, 1200000.00, 3, 3600000.00, '2023-10-01', '2023-12-31', '2023-10-01T00:00:00Z', 'Credit Card', 'Gói thành viên ngắn hạn')
ON CONFLICT (membership_order_id) DO NOTHING;
