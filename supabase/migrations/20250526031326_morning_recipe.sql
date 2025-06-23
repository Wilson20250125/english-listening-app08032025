/*
  # Create User Performance Table

  1. New Tables
    - `user_performance_table`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `category` (text, required)
      - `score` (integer, required)
      - `completed_at` (timestamp with timezone)
      - `duration` (integer, minutes)

  2. Security
    - Enable RLS on `user_performance_table`
    - Add policies for:
      - Users can read their own performance data
      - Users can create their own performance entries
*/

CREATE TABLE IF NOT EXISTS user_performance_table (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) NOT NULL,
  category text NOT NULL,
  score integer NOT NULL CHECK (score >= 0 AND score <= 100),
  completed_at timestamptz DEFAULT now(),
  duration integer NOT NULL CHECK (duration > 0),
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE user_performance_table ENABLE ROW LEVEL SECURITY;

-- Policy for reading performance data (users can only read their own)
CREATE POLICY "Users can read own performance data"
  ON user_performance_table
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy for creating performance entries (users can only create their own)
CREATE POLICY "Users can create own performance entries"
  ON user_performance_table
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Insert some sample data
INSERT INTO user_performance_table (user_id, category, score, duration)
SELECT 
  auth.uid(),
  category,
  score,
  duration
FROM (
  VALUES 
    ('vocabulary', 85, 30),
    ('grammar', 92, 45),
    ('pronunciation', 78, 25),
    ('conversation', 88, 60)
) AS samples(category, score, duration)
WHERE EXISTS (
  SELECT 1 FROM auth.users WHERE id = auth.uid()
);