
ALTER TABLE public.recipes 
  ADD COLUMN IF NOT EXISTS blw_mode text DEFAULT '',
  ADD COLUMN IF NOT EXISTS cutting_instructions text DEFAULT '',
  ADD COLUMN IF NOT EXISTS ideal_texture text DEFAULT '';
