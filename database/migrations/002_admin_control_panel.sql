CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'admin_role_type') THEN
    CREATE TYPE public.admin_role_type AS ENUM ('super_admin', 'content_admin', 'support_admin');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'record_status_type') THEN
    CREATE TYPE public.record_status_type AS ENUM ('active', 'inactive', 'suspended', 'deleted', 'draft', 'published', 'failed');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'subscription_plan_type') THEN
    CREATE TYPE public.subscription_plan_type AS ENUM ('free', 'premium');
  END IF;
END $$;

ALTER TABLE public.users_profile
  ADD COLUMN IF NOT EXISTS account_status public.record_status_type NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS last_active_at TIMESTAMPTZ DEFAULT NOW();

CREATE TABLE IF NOT EXISTS public.admin_roles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name public.admin_role_type NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.admin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.admin_role_type NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS public.activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  activity_type TEXT NOT NULL,
  entity_type TEXT,
  entity_id UUID,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.system_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  type TEXT NOT NULL,
  severity TEXT NOT NULL DEFAULT 'info',
  message TEXT NOT NULL,
  metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan public.subscription_plan_type NOT NULL DEFAULT 'free',
  status public.record_status_type NOT NULL DEFAULT 'active',
  amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  renews_at TIMESTAMPTZ,
  features JSONB NOT NULL DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE TABLE IF NOT EXISTS public.payment_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  subscription_id UUID REFERENCES public.subscriptions(id) ON DELETE SET NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  provider TEXT,
  amount NUMERIC(10, 2) NOT NULL DEFAULT 0,
  currency TEXT NOT NULL DEFAULT 'INR',
  status public.record_status_type NOT NULL DEFAULT 'active',
  transaction_reference TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.horoscope_content (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  zodiac_sign TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('daily', 'weekly', 'monthly')),
  title TEXT,
  content TEXT NOT NULL,
  publish_date DATE NOT NULL,
  status public.record_status_type NOT NULL DEFAULT 'draft',
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.blog_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL,
  tags TEXT[] NOT NULL DEFAULT '{}',
  status public.record_status_type NOT NULL DEFAULT 'draft',
  published_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.ai_insights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  chart_id UUID REFERENCES public.birth_charts(id) ON DELETE SET NULL,
  report_id UUID REFERENCES public.compatibility_reports(id) ON DELETE SET NULL,
  insight_type TEXT NOT NULL,
  content TEXT NOT NULL,
  status public.record_status_type NOT NULL DEFAULT 'active',
  flagged BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.notifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  audience TEXT NOT NULL DEFAULT 'all',
  notification_type TEXT NOT NULL DEFAULT 'announcement',
  status public.record_status_type NOT NULL DEFAULT 'draft',
  scheduled_at TIMESTAMPTZ,
  sent_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO public.admin_roles (name, description)
VALUES
  ('super_admin', 'Full control over all admin resources'),
  ('content_admin', 'Manage horoscope, blog, and content records'),
  ('support_admin', 'Manage users, reports, and support operations')
ON CONFLICT (name) DO NOTHING;

CREATE OR REPLACE FUNCTION public.get_admin_role(check_user_id UUID DEFAULT auth.uid())
RETURNS public.admin_role_type
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role
  FROM public.admin_users
  WHERE user_id = check_user_id
  LIMIT 1;
$$;

CREATE OR REPLACE FUNCTION public.has_admin_role(check_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE user_id = check_user_id
  );
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin(check_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE user_id = check_user_id
      AND role = 'super_admin'
  );
$$;

CREATE OR REPLACE FUNCTION public.touch_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS set_admin_users_updated_at ON public.admin_users;
CREATE TRIGGER set_admin_users_updated_at
BEFORE UPDATE ON public.admin_users
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS set_subscriptions_updated_at ON public.subscriptions;
CREATE TRIGGER set_subscriptions_updated_at
BEFORE UPDATE ON public.subscriptions
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS set_horoscope_content_updated_at ON public.horoscope_content;
CREATE TRIGGER set_horoscope_content_updated_at
BEFORE UPDATE ON public.horoscope_content
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS set_blog_posts_updated_at ON public.blog_posts;
CREATE TRIGGER set_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

DROP TRIGGER IF EXISTS set_ai_insights_updated_at ON public.ai_insights;
CREATE TRIGGER set_ai_insights_updated_at
BEFORE UPDATE ON public.ai_insights
FOR EACH ROW EXECUTE FUNCTION public.touch_updated_at();

ALTER TABLE public.admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.system_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.horoscope_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins can view roles" ON public.admin_roles;
CREATE POLICY "Admins can view roles"
ON public.admin_roles FOR SELECT
USING (public.has_admin_role());

DROP POLICY IF EXISTS "Super admins can manage roles" ON public.admin_roles;
CREATE POLICY "Super admins can manage roles"
ON public.admin_roles FOR ALL
USING (public.is_super_admin())
WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "Users can view their own admin assignment" ON public.admin_users;
CREATE POLICY "Users can view their own admin assignment"
ON public.admin_users FOR SELECT
USING (auth.uid() = user_id OR public.has_admin_role());

DROP POLICY IF EXISTS "Super admins can manage admin assignments" ON public.admin_users;
CREATE POLICY "Super admins can manage admin assignments"
ON public.admin_users FOR ALL
USING (public.is_super_admin())
WITH CHECK (public.is_super_admin());

DROP POLICY IF EXISTS "Admins can read activity logs" ON public.activity_logs;
CREATE POLICY "Admins can read activity logs"
ON public.activity_logs FOR SELECT
USING (public.has_admin_role());

DROP POLICY IF EXISTS "Admins can write activity logs" ON public.activity_logs;
CREATE POLICY "Admins can write activity logs"
ON public.activity_logs FOR INSERT
WITH CHECK (public.has_admin_role());

DROP POLICY IF EXISTS "Admins can manage system logs" ON public.system_logs;
CREATE POLICY "Admins can manage system logs"
ON public.system_logs FOR ALL
USING (public.has_admin_role())
WITH CHECK (public.has_admin_role());

DROP POLICY IF EXISTS "Users can view own subscription" ON public.subscriptions;
CREATE POLICY "Users can view own subscription"
ON public.subscriptions FOR SELECT
USING (auth.uid() = user_id OR public.has_admin_role());

DROP POLICY IF EXISTS "Admins can manage subscriptions" ON public.subscriptions;
CREATE POLICY "Admins can manage subscriptions"
ON public.subscriptions FOR ALL
USING (public.has_admin_role())
WITH CHECK (public.has_admin_role());

DROP POLICY IF EXISTS "Users can view own transactions" ON public.payment_transactions;
CREATE POLICY "Users can view own transactions"
ON public.payment_transactions FOR SELECT
USING (auth.uid() = user_id OR public.has_admin_role());

DROP POLICY IF EXISTS "Admins can manage transactions" ON public.payment_transactions;
CREATE POLICY "Admins can manage transactions"
ON public.payment_transactions FOR ALL
USING (public.has_admin_role())
WITH CHECK (public.has_admin_role());

DROP POLICY IF EXISTS "Anyone can view published horoscope content" ON public.horoscope_content;
CREATE POLICY "Anyone can view published horoscope content"
ON public.horoscope_content FOR SELECT
TO authenticated, anon
USING (status = 'published' OR public.has_admin_role());

DROP POLICY IF EXISTS "Content admins can manage horoscope content" ON public.horoscope_content;
CREATE POLICY "Content admins can manage horoscope content"
ON public.horoscope_content FOR ALL
USING (public.get_admin_role() IN ('super_admin', 'content_admin'))
WITH CHECK (public.get_admin_role() IN ('super_admin', 'content_admin'));

DROP POLICY IF EXISTS "Anyone can view published blog posts" ON public.blog_posts;
CREATE POLICY "Anyone can view published blog posts"
ON public.blog_posts FOR SELECT
TO authenticated, anon
USING (status = 'published' OR public.has_admin_role());

DROP POLICY IF EXISTS "Content admins can manage blog posts" ON public.blog_posts;
CREATE POLICY "Content admins can manage blog posts"
ON public.blog_posts FOR ALL
USING (public.get_admin_role() IN ('super_admin', 'content_admin'))
WITH CHECK (public.get_admin_role() IN ('super_admin', 'content_admin'));

DROP POLICY IF EXISTS "Admins can manage AI insights" ON public.ai_insights;
CREATE POLICY "Admins can manage AI insights"
ON public.ai_insights FOR ALL
USING (public.has_admin_role())
WITH CHECK (public.has_admin_role());

DROP POLICY IF EXISTS "Admins can manage notifications" ON public.notifications;
CREATE POLICY "Admins can manage notifications"
ON public.notifications FOR ALL
USING (public.has_admin_role())
WITH CHECK (public.has_admin_role());
