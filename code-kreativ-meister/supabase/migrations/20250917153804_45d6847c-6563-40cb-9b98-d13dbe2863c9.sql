-- Marketing Videos Table
CREATE TABLE public.marketing_videos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  package_type TEXT NOT NULL CHECK (package_type IN ('for_you_boost', 'video_campaign', 'viral_package')),
  video_url TEXT,
  thumbnail_url TEXT,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected', 'active', 'completed')),
  review_notes TEXT,
  start_date TIMESTAMP WITH TIME ZONE,
  end_date TIMESTAMP WITH TIME ZONE,
  target_audience TEXT,
  budget_used DECIMAL(10,2) DEFAULT 0,
  total_budget DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Marketing Analytics Table
CREATE TABLE public.marketing_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  marketing_video_id UUID NOT NULL REFERENCES public.marketing_videos(id) ON DELETE CASCADE,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  views INTEGER DEFAULT 0,
  likes INTEGER DEFAULT 0,
  shares INTEGER DEFAULT 0,
  comments INTEGER DEFAULT 0,
  saves INTEGER DEFAULT 0,
  followers_gained INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  impressions INTEGER DEFAULT 0,
  engagement_rate DECIMAL(5,2) DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(marketing_video_id, date)
);

-- User Analytics Summary Table
CREATE TABLE public.user_analytics_summary (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  total_marketing_videos INTEGER DEFAULT 0,
  total_views INTEGER DEFAULT 0,
  total_likes INTEGER DEFAULT 0,
  total_followers_gained INTEGER DEFAULT 0,
  total_spent DECIMAL(10,2) DEFAULT 0,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.marketing_videos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.marketing_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_analytics_summary ENABLE ROW LEVEL SECURITY;

-- RLS Policies for marketing_videos
CREATE POLICY "Users can view their own marketing videos" 
ON public.marketing_videos 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own marketing videos" 
ON public.marketing_videos 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own marketing videos" 
ON public.marketing_videos 
FOR UPDATE 
USING (auth.uid() = user_id);

-- RLS Policies for marketing_analytics
CREATE POLICY "Users can view analytics for their marketing videos" 
ON public.marketing_analytics 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.marketing_videos mv 
  WHERE mv.id = marketing_video_id AND mv.user_id = auth.uid()
));

-- RLS Policies for user_analytics_summary
CREATE POLICY "Users can view their own analytics summary" 
ON public.user_analytics_summary 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own analytics summary" 
ON public.user_analytics_summary 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own analytics summary" 
ON public.user_analytics_summary 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Function to update analytics summary
CREATE OR REPLACE FUNCTION public.update_user_analytics_summary()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_analytics_summary (user_id, total_marketing_videos, total_views, total_likes, total_followers_gained, total_spent, last_updated)
  SELECT 
    mv.user_id,
    COUNT(DISTINCT mv.id) as total_marketing_videos,
    COALESCE(SUM(ma.views), 0) as total_views,
    COALESCE(SUM(ma.likes), 0) as total_likes,
    COALESCE(SUM(ma.followers_gained), 0) as total_followers_gained,
    COALESCE(SUM(mv.budget_used), 0) as total_spent,
    now()
  FROM public.marketing_videos mv
  LEFT JOIN public.marketing_analytics ma ON mv.id = ma.marketing_video_id
  WHERE mv.user_id = COALESCE(NEW.user_id, OLD.user_id)
  GROUP BY mv.user_id
  ON CONFLICT (user_id) 
  DO UPDATE SET
    total_marketing_videos = EXCLUDED.total_marketing_videos,
    total_views = EXCLUDED.total_views,
    total_likes = EXCLUDED.total_likes,
    total_followers_gained = EXCLUDED.total_followers_gained,
    total_spent = EXCLUDED.total_spent,
    last_updated = EXCLUDED.last_updated;
  
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Triggers
CREATE TRIGGER update_marketing_videos_updated_at
BEFORE UPDATE ON public.marketing_videos
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_analytics_on_video_change
AFTER INSERT OR UPDATE OR DELETE ON public.marketing_videos
FOR EACH ROW
EXECUTE FUNCTION public.update_user_analytics_summary();

CREATE TRIGGER update_user_analytics_on_analytics_change
AFTER INSERT OR UPDATE OR DELETE ON public.marketing_analytics
FOR EACH ROW
EXECUTE FUNCTION public.update_user_analytics_summary();