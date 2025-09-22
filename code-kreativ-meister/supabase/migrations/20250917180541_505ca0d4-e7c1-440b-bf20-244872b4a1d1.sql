-- Create creator profiles table
CREATE TABLE public.creator_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE,
  display_name TEXT,
  bio TEXT,
  avatar_url TEXT,
  is_verified BOOLEAN DEFAULT false,
  tier TEXT DEFAULT 'bronze', -- bronze, silver, gold, diamond
  followers_count INTEGER DEFAULT 0,
  total_earnings NUMERIC DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create creator services table for dynamic pricing
CREATE TABLE public.creator_services (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  creator_id UUID NOT NULL,
  service_type TEXT NOT NULL, -- 'tip', 'gift', 'private_chat', 'extend_time', 'drink'
  service_name TEXT NOT NULL,
  price NUMERIC NOT NULL,
  duration_minutes INTEGER, -- for time-based services
  description TEXT,
  icon TEXT, -- emoji or icon identifier
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(creator_id, service_type, service_name)
);

-- Enable RLS on creator_profiles
ALTER TABLE public.creator_profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for creator_profiles
CREATE POLICY "Profiles are viewable by everyone" 
ON public.creator_profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.creator_profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.creator_profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Enable RLS on creator_services
ALTER TABLE public.creator_services ENABLE ROW LEVEL SECURITY;

-- Create policies for creator_services
CREATE POLICY "Services are viewable by everyone" 
ON public.creator_services 
FOR SELECT 
USING (true);

CREATE POLICY "Creators can manage their own services" 
ON public.creator_services 
FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.creator_profiles 
    WHERE creator_profiles.id = creator_services.creator_id 
    AND creator_profiles.user_id = auth.uid()
  )
);

-- Create transactions table for payments
CREATE TABLE public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL, -- buyer
  creator_id UUID NOT NULL, -- seller
  service_id UUID, -- references creator_services
  amount NUMERIC NOT NULL,
  currency TEXT DEFAULT 'EUR',
  transaction_type TEXT NOT NULL, -- 'tip', 'gift', 'private_chat', 'extend_time'
  status TEXT DEFAULT 'pending', -- pending, completed, failed, refunded
  payment_method TEXT, -- 'card', 'paypal', 'apple_pay', 'google_pay'
  metadata JSONB, -- store additional data like messages, gift details
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on transactions
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;

-- Create policies for transactions
CREATE POLICY "Users can view their own transactions" 
ON public.transactions 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Creators can view transactions for their services" 
ON public.transactions 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.creator_profiles 
    WHERE creator_profiles.id = transactions.creator_id 
    AND creator_profiles.user_id = auth.uid()
  )
);

CREATE POLICY "Users can create transactions" 
ON public.transactions 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Add foreign key relationships
ALTER TABLE public.creator_services 
ADD CONSTRAINT fk_creator_services_creator_id 
FOREIGN KEY (creator_id) REFERENCES public.creator_profiles(id) ON DELETE CASCADE;

ALTER TABLE public.transactions 
ADD CONSTRAINT fk_transactions_creator_id 
FOREIGN KEY (creator_id) REFERENCES public.creator_profiles(id) ON DELETE CASCADE;

ALTER TABLE public.transactions 
ADD CONSTRAINT fk_transactions_service_id 
FOREIGN KEY (service_id) REFERENCES public.creator_services(id) ON DELETE SET NULL;

-- Create trigger for updating updated_at
CREATE TRIGGER update_creator_profiles_updated_at
BEFORE UPDATE ON public.creator_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_creator_services_updated_at
BEFORE UPDATE ON public.creator_services
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at
BEFORE UPDATE ON public.transactions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default services for new creators (will be used as templates)
-- These will be created when a creator first sets up their profile