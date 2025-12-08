-- Test script to check company data
SELECT * FROM public.company LIMIT 5;

-- Check if there are any companies
SELECT COUNT(*) as company_count FROM public.company;

-- Check company structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'company' AND table_schema = 'public'
ORDER BY ordinal_position;
