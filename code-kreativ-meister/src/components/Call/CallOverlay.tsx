import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  Phone, 
  PhoneOff, 
  Mic, 
  MicOff, 
  Video, 
  VideoOff,
  Volume2,
  VolumeX
} from 'lucide-react';

interface CallOverlayProps {
  isOpen: boolean;
  callType: 'voice' | 'video';
  isIncoming?: boolean;
  isConnected: boolean;
  callerName: string;
  callerAvatar: string;
  onAccept: () => void;
  onDecline: () => void;
  onToggleMute: () => void;
  onToggleVideo: () => void;
  onToggleSpeaker: () => void;
  isMuted: boolean;
  isVideoEnabled: boolean;
  isSpeakerEnabled: boolean;
  localVideoRef: React.RefObject<HTMLVideoElement>;
  remoteVideoRef: React.RefObject<HTMLVideoElement>;
  callDuration: string;
}

const CallOverlay: React.FC<CallOverlayProps> = ({
  isOpen,
  callType,
  isIncoming = false,
  isConnected,
  callerName,
  callerAvatar,
  onAccept,
  onDecline,
  onToggleMute,
  onToggleVideo,
  onToggleSpeaker,
  isMuted,
  isVideoEnabled,
  isSpeakerEnabled,
  localVideoRef,
  remoteVideoRef,
  callDuration
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col">
      {/* Call Status */}
      <div className="flex-1 flex flex-col items-center justify-center p-6">
        {callType === 'video' && isConnected ? (
          <div className="relative w-full h-full max-w-4xl max-h-96 bg-black rounded-lg overflow-hidden">
            {/* Remote Video */}
            <video
              ref={remoteVideoRef}
              autoPlay
              playsInline
              className="w-full h-full object-cover"
            />
            
            {/* Local Video (Picture-in-Picture) */}
            <div className="absolute top-4 right-4 w-24 h-32 bg-gray-900 rounded-lg overflow-hidden border-2 border-white shadow-lg">
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </div>
            
            {/* Call Duration */}
            <div className="absolute top-4 left-4 bg-black/50 text-white px-3 py-1 rounded-full text-sm">
              {callDuration}
            </div>
          </div>
        ) : (
          <div className="text-center">
            <Avatar className="w-32 h-32 mx-auto mb-6">
              <AvatarImage src={callerAvatar} />
              <AvatarFallback className="text-4xl">{callerName.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <h2 className="text-2xl font-semibold mb-2">{callerName}</h2>
            
            <p className="text-muted-foreground mb-1">
              {isIncoming 
                ? `Incoming ${callType} call...`
                : isConnected 
                  ? callDuration
                  : `${callType} call connecting...`
              }
            </p>
            
            {isIncoming && (
              <p className="text-sm text-muted-foreground animate-pulse">
                Ringing...
              </p>
            )}
          </div>
        )}
      </div>

      {/* Call Controls */}
      <div className="p-6 bg-background/95 backdrop-blur">
        <div className="flex justify-center items-center gap-6">
          {isIncoming ? (
            <>
              {/* Incoming Call Controls */}
              <Button
                size="lg"
                variant="destructive"
                className="w-16 h-16 rounded-full"
                onClick={onDecline}
              >
                <PhoneOff className="h-6 w-6" />
              </Button>
              
              <Button
                size="lg"
                className="w-16 h-16 rounded-full bg-green-600 hover:bg-green-700"
                onClick={onAccept}
              >
                <Phone className="h-6 w-6" />
              </Button>
            </>
          ) : (
            <>
              {/* Active Call Controls */}
              <Button
                size="lg"
                variant={isSpeakerEnabled ? "default" : "outline"}
                className="w-12 h-12 rounded-full"
                onClick={onToggleSpeaker}
              >
                {isSpeakerEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
              </Button>
              
              <Button
                size="lg"
                variant={isMuted ? "destructive" : "outline"}
                className="w-12 h-12 rounded-full"
                onClick={onToggleMute}
              >
                {isMuted ? <MicOff className="h-5 w-5" /> : <Mic className="h-5 w-5" />}
              </Button>
              
              {callType === 'video' && (
                <Button
                  size="lg"
                  variant={isVideoEnabled ? "outline" : "destructive"}
                  className="w-12 h-12 rounded-full"
                  onClick={onToggleVideo}
                >
                  {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
                </Button>
              )}
              
              <Button
                size="lg"
                variant="destructive"
                className="w-16 h-16 rounded-full"
                onClick={onDecline}
              >
                <PhoneOff className="h-6 w-6" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CallOverlay;