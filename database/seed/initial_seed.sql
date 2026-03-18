-- ==========================================
-- Initial Seed Data
-- ==========================================

-- Insert some dummy horoscopes for testing
INSERT INTO public.horoscopes (zodiac_sign, daily, weekly, monthly)
VALUES
    ('Aries', 'Today is a good day for a new beginning.', 'This week focuses on career.', 'A transformative month ahead.'),
    ('Taurus', 'A focus on financial stability today.', 'You will find harmony in relationships soon.', 'Patience brings rewards this month.'),
    ('Gemini', 'Communication is key today.', 'Expect a burst of social energy', 'Creative endeavors will flourish this month.'),
    ('Cancer', 'Focus on home and family today.', 'Emotional depth will guide your decisions this week.', 'Nurture your inner self this month.'),
    ('Leo', 'Your leadership skills are highlighted today.', 'A week for bold moves and creativity.', 'Romance and passion take center stage.'),
    ('Virgo', 'Attention to detail will pay off today.', 'A productive work week awaits.', 'Focus on health and routines this month.'),
    ('Libra', 'Balance and harmony are your focus.', 'Social connections bring joy this week.', 'A month for partnerships and aesthetic pursuits.'),
    ('Scorpio', 'Your intuition is strong today.', 'Uncovering hidden truths will be your theme this week.', 'A month of deep transformation and rebirth.'),
    ('Sagittarius', 'Adventure calls today.', 'Expansion and learning are highlighted this week.', 'A month for travel and philosophical exploration.'),
    ('Capricorn', 'Discipline and focus are your allies today.', 'Career advancements are possible this week.', 'A month of building long-term goals.'),
    ('Aquarius', 'Innovative ideas flow today.', 'Community and networking are key this week.', 'A month for social causes and uniqueness.'),
    ('Pisces', 'Your creativity is boundless today.', 'Spiritual insights guide you this week.', 'A month for dreams, healing, and compassion.')
ON CONFLICT (zodiac_sign) DO NOTHING;

-- Note: In a real environment, you would seed auth.users using the Supabase GoTrue API or dashboard,
-- and then let the trigger `on_auth_user_created` handle inserting into `users_profile`.
-- For testing admin roles, you might manually insert a user_id into `admin_users`.
-- Example:
-- INSERT INTO public.admin_users (user_id, role, permissions) 
-- VALUES ('<uuid-from-auth-users>', 'superadmin', '{"all": true}'::jsonb);
