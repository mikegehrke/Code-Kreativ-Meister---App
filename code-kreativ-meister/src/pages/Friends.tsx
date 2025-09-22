import React from 'react';
import { FriendRecommendationSystem } from '@/components/Social/FriendRecommendationSystem';

const Friends: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        <FriendRecommendationSystem />
      </div>
    </div>
  );
};

export default Friends;
