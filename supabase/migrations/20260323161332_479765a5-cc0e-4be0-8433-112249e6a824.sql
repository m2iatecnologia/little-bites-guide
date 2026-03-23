ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS status text NOT NULL DEFAULT 'pending_email_verification';

UPDATE public.profiles SET status = 'active' WHERE status = 'pending_email_verification';