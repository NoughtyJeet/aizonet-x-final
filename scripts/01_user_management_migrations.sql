-- Supabase Migration Script for Admin User Management
-- Run this script inside the Supabase SQL Editor

-- 1. Add the `status` column to existing profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS status text DEFAULT 'active';

-- Validating status
ALTER TABLE public.profiles
ADD CONSTRAINT check_status
CHECK (status IN ('active', 'suspended'));

-- Ensure RLS is enabled on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- 2. Update existing policies: Make sure Admins can do anything
-- (Drop existing admin policy if it conflicts or exists to recreate it cleanly)
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.profiles;
CREATE POLICY "Admins can manage all profiles" 
ON public.profiles 
FOR ALL 
TO authenticated 
USING (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'Admin'
)
WITH CHECK (
  (SELECT role FROM public.profiles WHERE id = auth.uid()) = 'Admin'
);

-- 3. Create a Postgres Function (RPC) that allows Admins to safely delete from `auth.users`
-- Note: Deleting from auth.users naturally cascades to delete the `public.profiles` row if the foreign key is set up with CASCADE.
CREATE OR REPLACE FUNCTION delete_user_by_admin(target_user_id uuid)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with elevated privileges so it can delete from auth schema
SET search_path = public
AS $$
BEGIN
  -- 1. Security Check: Only allow if the caller is an 'Admin' 
  -- (We check the public.profiles table for the auth.uid())
  IF (SELECT role FROM public.profiles WHERE id = auth.uid()) != 'Admin' THEN
    RAISE EXCEPTION 'Access Denied: Only Admins can delete users.';
  END IF;

  -- 2. Execute Deletion from auth.users
  -- This requires SECURITY DEFINER to work.
  DELETE FROM auth.users WHERE id = target_user_id;

  -- Note: If public.profiles id does NOT have `ON DELETE CASCADE` attached to auth.users.id, 
  -- we should manually delete it here. Usually, it's best practice to have CASCADE. 
  -- If you're unsure, uncomment the line below:
  -- DELETE FROM public.profiles WHERE id = target_user_id;
END;
$$;
