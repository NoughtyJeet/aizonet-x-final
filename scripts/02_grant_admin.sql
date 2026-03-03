-- Run this script in your Supabase SQL Editor
-- This script safely inserts OR updates your profile to bypass the Admin lockout.

-- 1. We first ensure that the profile exists using the base confirmed columns.
-- (We omit 'name' and 'status' entirely in the INSERT to prevent schema errors)
INSERT INTO public.profiles (id, role)
VALUES (
  '6c19e3d6-f693-4f1d-a881-8c815de3db61',
  'Admin'
)
ON CONFLICT (id) DO UPDATE 
SET 
  role = 'Admin';

-- 2. Once the row is confirmed to exist, we attempt to set the status column.
-- (If 'status' doesn't exist yet, it'll fail here but the role will already be Admin)
UPDATE public.profiles 
SET status = 'active'
WHERE id = '6c19e3d6-f693-4f1d-a881-8c815de3db61';
