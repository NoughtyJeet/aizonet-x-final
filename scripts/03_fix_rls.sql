-- Run this in your Supabase SQL Editor to fix the Admin Lockout
-- The lockout is caused by an infinite recursion in Postgres Row Level Security!

-- 1. Create a secure function to bypass RLS recursion when checking for 'Admin' role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
DECLARE
  user_role TEXT;
BEGIN
  -- Security Definer allows this to run as the owner, ignoring RLS for this specific check
  SELECT role INTO user_role FROM public.profiles WHERE id = auth.uid();
  RETURN user_role = 'Admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Drop the original recursive policy
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;

-- 3. Create the safe Admin policy using the new function
CREATE POLICY "Admins can manage all profiles" 
ON public.profiles 
FOR ALL 
TO authenticated 
USING ( public.is_admin() )
WITH CHECK ( public.is_admin() );

-- 4. CRITICAL: Allow users to read their OWN profile safely so the frontend check succeeds
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
CREATE POLICY "Users can view own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated 
USING ( id = auth.uid() );
