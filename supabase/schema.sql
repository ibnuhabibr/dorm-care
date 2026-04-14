-- ============================================
-- DORM CARE DATABASE SCHEMA
-- ============================================
-- Run this SQL in Supabase Dashboard > SQL Editor
-- ============================================

-- 1. PROFILES (extend auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  phone TEXT UNIQUE,
  avatar_url TEXT,
  member_level TEXT DEFAULT 'bronze' CHECK (member_level IN ('bronze', 'silver', 'gold')),
  total_orders INT DEFAULT 0,
  total_spent INT DEFAULT 0,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. SERVICES
CREATE TABLE IF NOT EXISTS services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('utama', 'bundling', 'lainnya')),
  price_min INT NOT NULL,
  price_max INT,
  features TEXT[],
  badge TEXT CHECK (badge IN ('TERLARIS', 'HEMAT', 'PREMIUM', 'BUNDLING', NULL)),
  icon TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROMO CODES
CREATE TABLE IF NOT EXISTS promo_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT UNIQUE NOT NULL,
  name TEXT,
  description TEXT,
  type TEXT NOT NULL CHECK (type IN ('percentage', 'nominal')),
  value INT NOT NULL,
  min_transaction INT DEFAULT 0,
  max_uses INT,
  used_count INT DEFAULT 0,
  applicable_level TEXT CHECK (applicable_level IN ('bronze', 'silver', 'gold', NULL)),
  starts_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. ORDERS
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number TEXT UNIQUE NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  service_id UUID REFERENCES services(id),
  service_name TEXT NOT NULL,
  service_price INT NOT NULL,
  address TEXT NOT NULL,
  area TEXT,
  scheduled_date DATE NOT NULL,
  scheduled_time TEXT NOT NULL,
  notes TEXT,
  status TEXT DEFAULT 'pending_confirmation' CHECK (
    status IN ('pending_confirmation', 'confirmed', 'on_the_way', 'in_progress', 'completed', 'cancelled')
  ),
  mitra_name TEXT,
  mitra_phone TEXT,
  promo_code TEXT,
  discount_amount INT DEFAULT 0,
  total_amount INT NOT NULL,
  rating INT CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5)),
  review TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. TRANSACTIONS
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  payment_method TEXT NOT NULL CHECK (
    payment_method IN ('qris', 'gopay', 'shopeepay', 'dana', 'transfer_bank')
  ),
  amount INT NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'failed')),
  proof_url TEXT,
  bank_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. NOTIFICATIONS
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT,
  type TEXT CHECK (type IN ('order', 'promo', 'system', 'level_up')),
  related_order_id UUID REFERENCES orders(id) ON DELETE SET NULL,
  is_read BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. CONTACT MESSAGES
CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  email TEXT,
  phone TEXT,
  topic TEXT,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. FAQs
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT CHECK (category IN ('layanan', 'pembayaran', 'jadwal', 'area', 'akun')),
  sort_order INT DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. TESTIMONIALS
CREATE TABLE IF NOT EXISTS testimonials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT,
  member_level TEXT CHECK (member_level IN ('bronze', 'silver', 'gold')),
  rating INT CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  service_used TEXT,
  is_visible BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_scheduled_date ON orders(scheduled_date);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_order_id ON transactions(order_id);
CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_is_read ON notifications(is_read);
CREATE INDEX idx_promo_codes_code ON promo_codes(code);
CREATE INDEX idx_promo_codes_is_active ON promo_codes(is_active);

-- ============================================
-- RLS (ROW LEVEL SECURITY)
-- ============================================

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE services ENABLE ROW LEVEL SECURITY;
ALTER TABLE promo_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- PROFILES RLS
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Admins can view all profiles" ON profiles
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- SERVICES RLS (public read, admin write)
CREATE POLICY "Anyone can view services" ON services
  FOR SELECT USING (true);
CREATE POLICY "Admins can insert services" ON services
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Admins can update services" ON services
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Admins can delete services" ON services
  FOR DELETE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- PROMO_CODES RLS (public read, admin write)
CREATE POLICY "Anyone can view active promos" ON promo_codes
  FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can view all promos" ON promo_codes
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Admins can manage promos" ON promo_codes
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Admins can update promos" ON promo_codes
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ORDERS RLS (users see own, admins see all)
CREATE POLICY "Users can view own orders" ON orders
  FOR SELECT USING (auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Users can insert own orders" ON orders
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own pending orders" ON orders
  FOR UPDATE USING (auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Admins can update all orders" ON orders
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- TRANSACTIONS RLS
CREATE POLICY "Users can view own transactions" ON transactions
  FOR SELECT USING (auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );
CREATE POLICY "Users can insert own transactions" ON transactions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- NOTIFICATIONS RLS
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (auth.uid() = user_id);

-- CONTACT_MESSAGES RLS (anyone can insert, admin can read)
CREATE POLICY "Anyone can submit contact form" ON contact_messages
  FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can read contact messages" ON contact_messages
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- FAQs RLS (public read, admin write)
CREATE POLICY "Anyone can view active FAQs" ON faqs
  FOR SELECT USING (is_active = true);
CREATE POLICY "Admins can manage FAQs" ON faqs
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- TESTIMONIALS RLS (public read visible, admin write)
CREATE POLICY "Anyone can view visible testimonials" ON testimonials
  FOR SELECT USING (is_visible = true);
CREATE POLICY "Admins can manage testimonials" ON testimonials
  FOR ALL USING (
    EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_services_updated_at BEFORE UPDATE ON services
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_promo_codes_updated_at BEFORE UPDATE ON promo_codes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_orders_updated_at BEFORE UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Note: For auto-profile creation on signup, use Supabase Authentication > Hooks
-- OR manually create profile via client after signup
-- The trigger below may not work due to Supabase auth.users restrictions
-- Recommended: Use client-side hook in your app to INSERT profiles after signup

-- Function to auto-create profile on auth signup (alternative approach)
-- CREATE OR REPLACE FUNCTION public.handle_new_user()
-- RETURNS TRIGGER AS $$
-- BEGIN
--   INSERT INTO public.profiles (id, first_name)
--   VALUES (NEW.id, NEW.email);
--   RETURN NEW;
-- END;
-- $$ LANGUAGE plpgsql SECURITY DEFINER;

-- CREATE OR REPLACE TRIGGER on_auth_user_created
--   AFTER INSERT ON auth.users
--   FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update member level after order completion
CREATE OR REPLACE FUNCTION public.update_member_level_on_order_complete()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    UPDATE profiles 
    SET 
      total_orders = total_orders + 1,
      member_level = 
        CASE 
          WHEN (total_orders + 1) >= 15 THEN 'gold'
          WHEN (total_orders + 1) >= 5 THEN 'silver'
          ELSE 'bronze'
        END
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER on_order_completed
  AFTER UPDATE ON orders
  FOR EACH ROW EXECUTE FUNCTION public.update_member_level_on_order_complete();
