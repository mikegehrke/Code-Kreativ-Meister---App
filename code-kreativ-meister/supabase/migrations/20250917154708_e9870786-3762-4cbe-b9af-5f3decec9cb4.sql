-- Create storage bucket for marketing videos
INSERT INTO storage.buckets (id, name, public) VALUES ('marketing-videos', 'marketing-videos', false);

-- Create policies for marketing video uploads
CREATE POLICY "Users can upload their own marketing videos" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'marketing-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can view their own marketing videos" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'marketing-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can update their own marketing videos" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'marketing-videos' AND auth.uid()::text = (storage.foldername(name))[1]);

CREATE POLICY "Users can delete their own marketing videos" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'marketing-videos' AND auth.uid()::text = (storage.foldername(name))[1]);