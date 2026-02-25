
-- Add gender and height_cm columns to babies table
ALTER TABLE public.babies ADD COLUMN IF NOT EXISTS gender text DEFAULT 'not_informed';
ALTER TABLE public.babies ADD COLUMN IF NOT EXISTS height_cm numeric DEFAULT NULL;
