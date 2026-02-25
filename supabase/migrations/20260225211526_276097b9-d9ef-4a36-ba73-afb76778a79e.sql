
-- Create recipes table
CREATE TABLE public.recipes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  age TEXT NOT NULL DEFAULT '+6m',
  difficulty TEXT NOT NULL DEFAULT 'Fácil',
  time_minutes INTEGER NOT NULL DEFAULT 15,
  category TEXT NOT NULL DEFAULT 'almoço',
  ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,
  instructions TEXT NOT NULL DEFAULT '',
  nutritional_tip TEXT,
  can_freeze BOOLEAN NOT NULL DEFAULT false,
  can_lunchbox BOOLEAN NOT NULL DEFAULT false,
  tags_ingredientes TEXT[] NOT NULL DEFAULT '{}',
  image_url TEXT,
  premium BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;

-- Public read access (recipes are content, not user data)
CREATE POLICY "Anyone can read recipes"
  ON public.recipes FOR SELECT
  USING (true);

-- Only service role can insert/update/delete (admin managed)
CREATE POLICY "Service role can manage recipes"
  ON public.recipes FOR ALL
  USING (auth.role() = 'service_role')
  WITH CHECK (auth.role() = 'service_role');

-- Index for fast filtering
CREATE INDEX idx_recipes_age ON public.recipes (age);
CREATE INDEX idx_recipes_category ON public.recipes (category);
CREATE INDEX idx_recipes_premium ON public.recipes (premium);
CREATE INDEX idx_recipes_tags ON public.recipes USING GIN (tags_ingredientes);
CREATE INDEX idx_recipes_name ON public.recipes USING GIN (to_tsvector('portuguese', name));

-- Trigger for updated_at
CREATE TRIGGER update_recipes_updated_at
  BEFORE UPDATE ON public.recipes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();
