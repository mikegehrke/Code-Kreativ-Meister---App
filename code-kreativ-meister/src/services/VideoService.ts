import { supabase, Video } from "@/lib/supabase";

export class VideoService {
  static async createVideo(videoData: {
    title: string;
    description?: string;
    video_url: string;
    thumbnail: string;
    creator_id: string;
    venue_id?: string;
    tags: string[];
    is_premium: boolean;
    is_live: boolean;
  }): Promise<Video | null> {
    try {
      const { data, error } = await supabase
        .from('videos')
        .insert({
          ...videoData,
          stats: { views: 0, likes: 0, comments: 0 }
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error creating video:', error);
      return null;
    }
  }

  static async uploadVideo(file: File): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `videos/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('videos')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('videos')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading video:', error);
      return null;
    }
  }

  static async uploadThumbnail(file: File): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `thumbnails/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('thumbnails')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('thumbnails')
        .getPublicUrl(filePath);

      return data.publicUrl;
    } catch (error) {
      console.error('Error uploading thumbnail:', error);
      return null;
    }
  }

  static async deleteVideo(videoId: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('videos')
        .delete()
        .eq('id', videoId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting video:', error);
      return false;
    }
  }

  static async updateVideoStats(videoId: string, stats: {
    views?: number;
    likes?: number;
    comments?: number;
  }): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('videos')
        .update({ stats })
        .eq('id', videoId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error updating video stats:', error);
      return false;
    }
  }

  static async getVideosByUser(userId: string): Promise<Video[]> {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          creator:profiles!videos_creator_id_fkey(*),
          venue:venues(*)
        `)
        .eq('creator_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user videos:', error);
      return [];
    }
  }

  static async getLiveVideos(): Promise<Video[]> {
    try {
      const { data, error } = await supabase
        .from('videos')
        .select(`
          *,
          creator:profiles!videos_creator_id_fkey(*),
          venue:venues(*)
        `)
        .eq('is_live', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching live videos:', error);
      return [];
    }
  }
}