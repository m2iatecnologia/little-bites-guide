
-- Table for manual food status overrides (checklist management)
CREATE TABLE public.food_status_overrides (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  baby_id UUID REFERENCES public.babies(id) ON DELETE CASCADE,
  food_name TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'outro',
  status TEXT NOT NULL DEFAULT 'to_introduce', -- 'introduced', 'rejected', 'to_introduce'
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, food_name)
);

ALTER TABLE public.food_status_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users read own overrides" ON public.food_status_overrides FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own overrides" ON public.food_status_overrides FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own overrides" ON public.food_status_overrides FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users delete own overrides" ON public.food_status_overrides FOR DELETE USING (auth.uid() = user_id);

CREATE TRIGGER update_food_status_overrides_updated_at
  BEFORE UPDATE ON public.food_status_overrides
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
