-- Run this script in your Supabase SQL Editor
-- This will forcibly create or update your profile to have 'Admin' privileges.
-- This works even if you signed up via Google and don't have a profile row yet.

INSERT INTO public.profiles (id, email, name, role, status)
VALUES (
  '6c19e3d6-f693-4f1d-a881-8c815de3db61',
  'j.parganiha@gmail.com',
  'Admin User',
  'Admin',
  'active'
)
ON CONFLICT (id) DO UPDATE 
SET 
  role = 'Admin', 
  status = 'active';

-- Verification step
SELECT id, email, role, status 
FROM public.profiles 
WHERE id = '6c19e3d6-f693-4f1d-a881-8c815de3db61';
