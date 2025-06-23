/*
  # Create Learning Modules Table

  1. New Tables
    - `learning_modules`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `description` (text, required)
      - `created_at` (timestamp with timezone, auto-generated)
      - `user_id` (uuid, references auth.users)

  2. Security
    - Enable RLS on `learning_modules` table
    - Add policies for:
      - Authenticated users can read all modules
      - Users can only create/update/delete their own modules
*/

CREATE TABLE IF NOT EXISTS learning_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE learning_modules ENABLE ROW LEVEL SECURITY;

-- Policy for reading modules (all authenticated users can read)
CREATE POLICY "Anyone can read learning modules"
  ON learning_modules
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy for inserting modules (users can only create their own)
CREATE POLICY "Users can create their own modules"
  ON learning_modules
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Policy for updating modules (users can only update their own)
CREATE POLICY "Users can update their own modules"
  ON learning_modules
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policy for deleting modules (users can only delete their own)
CREATE POLICY "Users can delete their own modules"
  ON learning_modules
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);