/*
  # Initial Schema Setup for BP Monitor App

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `created_at` (timestamp with time zone)
      - `updated_at` (timestamp with time zone)
      - `full_name` (text)
      - `age` (integer)
      - `gender` (text)
      - `email` (text)
      - `phone` (text)
      - `emergency_contact` (text)
    
    - `bp_readings`
      - `id` (uuid, primary key)
      - `created_at` (timestamp with time zone)
      - `user_id` (uuid, references profiles.id)
      - `systolic` (integer)
      - `diastolic` (integer)
      - `diagnosis` (text)
      - `notes` (text)
    
    - `recommendations`
      - `id` (uuid, primary key)
      - `created_at` (timestamp with time zone)
      - `user_id` (uuid, references profiles.id)
      - `bp_reading_id` (uuid, references bp_readings.id)
      - `content` (jsonb)
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to manage their own data
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  full_name TEXT,
  age INTEGER,
  gender TEXT,
  email TEXT,
  phone TEXT,
  emergency_contact TEXT
);

-- Create blood pressure readings table
CREATE TABLE IF NOT EXISTS bp_readings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  systolic INTEGER NOT NULL,
  diastolic INTEGER NOT NULL,
  diagnosis TEXT NOT NULL,
  notes TEXT
);

-- Create recommendations table
CREATE TABLE IF NOT EXISTS recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMPTZ DEFAULT now(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  bp_reading_id UUID REFERENCES bp_readings(id) ON DELETE CASCADE NOT NULL,
  content JSONB NOT NULL
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE bp_readings ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Users can view their own profile"
  ON profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON profiles
  FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create policies for bp_readings
CREATE POLICY "Users can view their own BP readings"
  ON bp_readings
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own BP readings"
  ON bp_readings
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own BP readings"
  ON bp_readings
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own BP readings"
  ON bp_readings
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for recommendations
CREATE POLICY "Users can view their own recommendations"
  ON recommendations
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own recommendations"
  ON recommendations
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own recommendations"
  ON recommendations
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own recommendations"
  ON recommendations
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update the updated_at column for profiles
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();