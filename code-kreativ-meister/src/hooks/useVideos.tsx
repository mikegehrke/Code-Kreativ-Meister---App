import { useState, useEffect } from "react";
import { supabase, Video } from "@/lib/supabase";
import { useAuth } from "./useAuth";
import { toast } from "sonner";

export const useVideos = (category: string = "Für dich") => {
  const [videos, setVideos] = useState<Video[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchVideos();
    
    // Subscribe to real-time updates
    const subscription = supabase
      .channel('videos')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'videos' }, 
        () => {
          fetchVideos();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [category, user]);

  const fetchVideos = async () => {
    try {
      let query = supabase
        .from('videos')
        .select(`
          *,
          creator:profiles!videos_creator_id_fkey(*),
          venue:venues(*)
        `)
        .order('created_at', { ascending: false });

      // Apply category filters
      switch (category) {
        case "Go Live":
          query = query.eq('is_live', true);
          break;
        case "Gefolgt":
          if (user) {
            // Get followed users first
            const { data: follows } = await supabase
              .from('follows')
              .select('following_id')
              .eq('follower_id', user.id);
            
            if (follows && follows.length > 0) {
              const followingIds = follows.map(f => f.following_id);
              query = query.in('creator_id', followingIds);
            } else {
              // No follows, return empty
              setVideos([]);
              setLoading(false);
              return;
            }
          }
          break;
        case "Rooms":
          query = query.not('venue_id', 'is', null);
          break;
        case "👁️ Besucher":
          // This would require a profile_visitors table
          // For now, just show recent videos
          query = query.limit(10);
          break;
        case "Entdecke":
          // Sort by engagement (likes + comments)
          query = query.order('stats->likes', { ascending: false });
          break;
        default:
          // "Für dich" - personalized feed
          // Could implement recommendation algorithm here
          break;
      }

      const { data, error } = await query.limit(50);

      if (error) throw error;

      setVideos(data || []);
    } catch (error: any) {
      console.error('Error fetching videos:', error);
      toast.error("Fehler beim Laden der Videos");
    } finally {
      setLoading(false);
    }
  };

  const likeVideo = async (videoId: string, isLiked: boolean) => {
    if (!user) {
      toast.error("Bitte logge dich ein, um Videos zu liken");
      return;
    }

    try {
      if (isLiked) {
        // Remove like
        await supabase
          .from('likes')
          .delete()
          .eq('user_id', user.id)
          .eq('video_id', videoId);
        
        // Update video stats
        const video = videos.find(v => v.id === videoId);
        if (video) {
          const newStats = { ...video.stats, likes: video.stats.likes - 1 };
          await supabase
            .from('videos')
            .update({ stats: newStats })
            .eq('id', videoId);
          
          // Update local state
          setVideos(videos.map(v => 
            v.id === videoId ? { ...v, stats: newStats } : v
          ));
        }
      } else {
        // Add like
        await supabase
          .from('likes')
          .insert({ user_id: user.id, video_id: videoId });
        
        // Update video stats
        const video = videos.find(v => v.id === videoId);
        if (video) {
          const newStats = { ...video.stats, likes: video.stats.likes + 1 };
          await supabase
            .from('videos')
            .update({ stats: newStats })
            .eq('id', videoId);
          
          // Update local state
          setVideos(videos.map(v => 
            v.id === videoId ? { ...v, stats: newStats } : v
          ));
        }
      }
    } catch (error: any) {
      console.error('Error toggling like:', error);
      toast.error("Fehler beim Liken");
    }
  };

  const followUser = async (userId: string, isFollowing: boolean) => {
    if (!user) {
      toast.error("Bitte logge dich ein, um Usern zu folgen");
      return;
    }

    try {
      if (isFollowing) {
        // Unfollow
        await supabase
          .from('follows')
          .delete()
          .eq('follower_id', user.id)
          .eq('following_id', userId);
      } else {
        // Follow
        await supabase
          .from('follows')
          .insert({ follower_id: user.id, following_id: userId });
      }

      toast.success(isFollowing ? "Entfolgt" : "Jetzt folgst du diesem User!");
    } catch (error: any) {
      console.error('Error toggling follow:', error);
      toast.error("Fehler beim Folgen");
    }
  };

  const incrementViews = async (videoId: string) => {
    try {
      const video = videos.find(v => v.id === videoId);
      if (video) {
        const newStats = { ...video.stats, views: video.stats.views + 1 };
        await supabase
          .from('videos')
          .update({ stats: newStats })
          .eq('id', videoId);
        
        // Update local state
        setVideos(videos.map(v => 
          v.id === videoId ? { ...v, stats: newStats } : v
        ));
      }
    } catch (error: any) {
      console.error('Error incrementing views:', error);
    }
  };

  return {
    videos,
    loading,
    likeVideo,
    followUser,
    incrementViews,
    refetch: fetchVideos
  };
};