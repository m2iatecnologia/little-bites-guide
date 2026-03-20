
-- Table to store user's pantry (available foods at home)
CREATE TABLE public.user_pantry (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  baby_id uuid REFERENCES public.babies(id) ON DELETE CASCADE,
  foods jsonb NOT NULL DEFAULT '[]'::jsonb,
  updated_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Unique constraint: one pantry per user+baby
ALTER TABLE public.user_pantry ADD CONSTRAINT user_pantry_user_baby_unique UNIQUE (user_id, baby_id);

ALTER TABLE public.user_pantry ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own pantry" ON public.user_pantry FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own pantry" ON public.user_pantry FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own pantry" ON public.user_pantry FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own pantry" ON public.user_pantry FOR DELETE USING (auth.uid() = user_id);

-- Table to store generated meal plans
CREATE TABLE public.meal_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  baby_id uuid REFERENCES public.babies(id) ON DELETE CASCADE,
  week_start date NOT NULL,
  plan jsonb NOT NULL DEFAULT '{}'::jsonb,
  diet_mode text NOT NULL DEFAULT 'Tradicional',
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.meal_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own plans" ON public.meal_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own plans" ON public.meal_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own plans" ON public.meal_plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own plans" ON public.meal_plans FOR DELETE USING (auth.uid() = user_id);
