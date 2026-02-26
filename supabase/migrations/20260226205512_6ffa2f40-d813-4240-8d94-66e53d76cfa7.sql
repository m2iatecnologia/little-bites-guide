
-- Create food_occurrences table
CREATE TABLE public.food_occurrences (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  baby_id UUID REFERENCES public.babies(id),
  food_name TEXT NOT NULL,
  occurrence_date DATE NOT NULL DEFAULT CURRENT_DATE,
  meal_type TEXT,
  reaction_type TEXT NOT NULL,
  reaction_other_text TEXT,
  time_after_value INTEGER NOT NULL,
  time_after_unit TEXT NOT NULL DEFAULT 'min',
  intensity TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.food_occurrences ENABLE ROW LEVEL SECURITY;

-- RLS policies
CREATE POLICY "Users read own occurrences" ON public.food_occurrences FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own occurrences" ON public.food_occurrences FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own occurrences" ON public.food_occurrences FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own occurrences" ON public.food_occurrences FOR DELETE USING (auth.uid() = user_id);
