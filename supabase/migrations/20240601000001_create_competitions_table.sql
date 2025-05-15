-- Create competitions table
CREATE TABLE IF NOT EXISTS competitions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('directory', 'custom')),
  category TEXT NOT NULL,
  difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
  imageUrl TEXT,
  deadline TIMESTAMP WITH TIME ZONE NOT NULL,
  startDate TIMESTAMP WITH TIME ZONE NOT NULL,
  prizeValue TEXT NOT NULL,
  tldr TEXT NOT NULL,
  requirements TEXT[] NOT NULL,
  rules TEXT NOT NULL,
  entryUrl TEXT,
  isArchived BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable row level security
ALTER TABLE competitions ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Allow public read access" ON competitions
  FOR SELECT USING (NOT isArchived);

CREATE POLICY "Allow authenticated users to create competitions" ON competitions
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to update competitions" ON competitions
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Allow authenticated users to delete competitions" ON competitions
  FOR DELETE USING (auth.role() = 'authenticated');

-- Enable realtime
alter publication supabase_realtime add table competitions;