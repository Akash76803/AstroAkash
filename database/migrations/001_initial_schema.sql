-- Enable the UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. users_profile
-- ==========================================
CREATE TABLE public.users_profile (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    birth_date DATE,
    birth_time TIME,
    birth_place TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- ==========================================
-- 2. birth_charts
-- ==========================================
CREATE TABLE public.birth_charts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    chart_data JSONB NOT NULL,
    lagna TEXT NOT NULL,
    planet_positions JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 3. horoscopes
-- ==========================================
CREATE TABLE public.horoscopes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    zodiac_sign TEXT NOT NULL,
    daily TEXT NOT NULL,
    weekly TEXT NOT NULL,
    monthly TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(zodiac_sign)
);

-- ==========================================
-- 4. compatibility_reports
-- ==========================================
CREATE TABLE public.compatibility_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user1_birth_data JSONB NOT NULL,
    user2_birth_data JSONB NOT NULL,
    gun_milan_score NUMERIC(4, 2) NOT NULL,
    compatibility_analysis TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==========================================
-- 5. admin_users
-- ==========================================
CREATE TABLE public.admin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('admin', 'superadmin')),
    permissions JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- ==========================================
-- Security Functions
-- ==========================================

-- Function to check admin status (avoids RLS recursion)
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.admin_users
    WHERE user_id = auth.uid()
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- Row Level Security (RLS)
-- ==========================================

-- 1. users_profile RLS
ALTER TABLE public.users_profile ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own profile." 
    ON public.users_profile FOR SELECT 
    USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile." 
    ON public.users_profile FOR UPDATE 
    USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile." 
    ON public.users_profile FOR INSERT 
    WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Admins have full access to users_profile." 
    ON public.users_profile FOR ALL 
    USING (public.is_admin());

-- 2. birth_charts RLS
ALTER TABLE public.birth_charts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own birth charts." 
    ON public.birth_charts FOR SELECT 
    USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own birth charts." 
    ON public.birth_charts FOR INSERT 
    WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own birth charts." 
    ON public.birth_charts FOR DELETE 
    USING (auth.uid() = user_id);
CREATE POLICY "Admins have full access to birth_charts." 
    ON public.birth_charts FOR ALL 
    USING (public.is_admin());

-- 3. horoscopes RLS
ALTER TABLE public.horoscopes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view horoscopes." 
    ON public.horoscopes FOR SELECT 
    TO authenticated, anon
    USING (true);
CREATE POLICY "Only admins can insert/update horoscopes." 
    ON public.horoscopes FOR ALL 
    USING (public.is_admin());

-- 4. compatibility_reports RLS
ALTER TABLE public.compatibility_reports ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view compatibility reports they generate." 
    ON public.compatibility_reports FOR SELECT 
    TO authenticated
    USING (true);
CREATE POLICY "Only admins can modify compatibility reports." 
    ON public.compatibility_reports FOR ALL 
    USING (public.is_admin());

-- 5. admin_users RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own admin status" 
    ON public.admin_users FOR SELECT 
    USING (auth.uid() = user_id);
CREATE POLICY "Superadmins can manage all admin roles"
    ON public.admin_users FOR ALL
    USING (
      (SELECT role FROM public.admin_users WHERE user_id = auth.uid()) = 'superadmin'
    );

-- ==========================================
-- Triggers 
-- ==========================================

-- Auto-create users_profile when a new user signs up in auth.users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users_profile (user_id, name)
  VALUES (
    new.id, 
    COALESCE(
      new.raw_user_meta_data->>'name', 
      new.raw_user_meta_data->>'full_name', 
      'Stargazer'
    )
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
