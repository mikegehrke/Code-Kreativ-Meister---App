-- Fix the security warning by setting proper search_path for the function
CREATE OR REPLACE FUNCTION public.update_user_analytics_summary()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
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
$$;