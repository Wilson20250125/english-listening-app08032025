-- Enhanced profiles table with additional fields
-- This migration adds new fields to support the improved registration flow

-- Add new columns to profiles table if they don't exist
DO $$ 
BEGIN
    -- Add role column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'role') THEN
        ALTER TABLE profiles ADD COLUMN role VARCHAR(50);
    END IF;

    -- Add school_or_university column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'school_or_university') THEN
        ALTER TABLE profiles ADD COLUMN school_or_university VARCHAR(255);
    END IF;

    -- Add discipline_or_subject column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'discipline_or_subject') THEN
        ALTER TABLE profiles ADD COLUMN discipline_or_subject VARCHAR(255);
    END IF;

    -- Add level_or_grade column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'level_or_grade') THEN
        ALTER TABLE profiles ADD COLUMN level_or_grade VARCHAR(100);
    END IF;

    -- Add profile_completed column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'profile_completed') THEN
        ALTER TABLE profiles ADD COLUMN profile_completed BOOLEAN DEFAULT FALSE;
    END IF;

    -- Add username column if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name = 'profiles' AND column_name = 'username') THEN
        ALTER TABLE profiles ADD COLUMN username VARCHAR(100) UNIQUE;
    END IF;
END $$;

-- Create index on username for faster lookups
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- Create index on profile_completed for faster queries
CREATE INDEX IF NOT EXISTS idx_profiles_completed ON profiles(profile_completed);

-- Update RLS policies to include new columns
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Enable RLS if not already enabled
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY; 