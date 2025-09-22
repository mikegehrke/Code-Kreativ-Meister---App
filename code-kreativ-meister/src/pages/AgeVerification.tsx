import React from 'react';
import { AgeVerificationSystem } from '@/components/AgeVerification/AgeVerificationSystem';
import { useNavigate } from 'react-router-dom';
import { AgeVerificationData } from '@/components/AgeVerification/AgeVerificationSystem';

const AgeVerification: React.FC = () => {
  const navigate = useNavigate();

  const handleVerificationComplete = (data: AgeVerificationData) => {
    // Store verification data
    localStorage.setItem('age_verification', JSON.stringify(data));
    
    // Redirect to home or requested page
    const redirectTo = new URLSearchParams(window.location.search).get('redirect') || '/';
    navigate(redirectTo);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AgeVerificationSystem
        onVerificationComplete={handleVerificationComplete}
        requiredLevel="general"
        showContentRatings={true}
      />
    </div>
  );
};

export default AgeVerification;
