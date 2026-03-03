-- Run this in your Supabase SQL Editor
-- This script completely opens "SELECT" (read) permissions on profiles.
-- This bypasses any bugs with `auth.uid()` casting or session races on page refresh!

-- 1. Drop the strict policy
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;

-- 2. Create an open Read-Only policy so the frontend never gets blocked from checking a role!
CREATE POLICY "Anyone can view profiles" 
ON public.profiles 
FOR SELECT 
USING ( true );

-- Ensure RLS is still on for updates/deletes!
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Finally, guarantee your user role is set just in case
UPDATE public.profiles 
SET role = 'Admin', status = 'active'
WHERE id = '6c19e3d6-f693-4f1d-a881-8c815de3db61' OR email = 'j.parganiha@gmail.com';
