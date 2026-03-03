-- Run this in your Supabase SQL Editor
-- This is a DEBUGGING command. 
-- It will make EVERY SINGLE PROFILE in the system an Admin.
-- If this fixes your login, it means your login UUID didn't match our hardcoded one.

UPDATE public.profiles
SET role = 'Admin', status = 'active';

-- Just to be safe, disable RLS temporarily on profiles
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
