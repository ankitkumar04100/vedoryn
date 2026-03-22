
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS age integer,
  ADD COLUMN IF NOT EXISTS education_level text DEFAULT 'undergraduate',
  ADD COLUMN IF NOT EXISTS current_class text,
  ADD COLUMN IF NOT EXISTS academic_stream text,
  ADD COLUMN IF NOT EXISTS subjects text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS weak_areas text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS stress_level integer DEFAULT 5,
  ADD COLUMN IF NOT EXISTS motivation_level integer DEFAULT 7,
  ADD COLUMN IF NOT EXISTS learning_style text DEFAULT 'visual',
  ADD COLUMN IF NOT EXISTS language_preference text DEFAULT 'English',
  ADD COLUMN IF NOT EXISTS interests text[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS long_term_goal text,
  ADD COLUMN IF NOT EXISTS productivity_level text DEFAULT 'moderate';
