import React from 'react';
import { ContentModerationSystem } from '@/components/ContentModeration/ContentModerationSystem';
import { useParams } from 'react-router-dom';

const ContentModeration: React.FC = () => {
  const { contentId } = useParams<{ contentId: string }>();

  const handleModerationComplete = (rating: any, flags: any) => {
    console.log('Moderation completed:', { rating, flags, contentId });
    // Handle moderation completion
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <ContentModerationSystem
        contentId={contentId}
        contentType="video"
        onModerationComplete={handleModerationComplete}
      />
    </div>
  );
};

export default ContentModeration;
