-- Run this script in your Supabase SQL Editor
-- This will elevate your specific user account to have 'Admin' privileges

UPDATE public.profiles
SET role = 'Admin'
WHERE id = '6c19e3d6-f693-4f1d-a881-8c815de3db61';

-- Optional verification step to confirm the role updated
SELECT id, email, role, status 
FROM public.profiles 
WHERE id = '6c19e3d6-f693-4f1d-a881-8c815de3db61';
