import { useEffect, useRef, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CallSignalingProps {
  roomId: string;
  userId: string;
  onOffer: (offer: RTCSessionDescriptionInit) => void;
  onAnswer: (answer: RTCSessionDescriptionInit) => void;
  onIceCandidate: (candidate: RTCIceCandidateInit) => void;
  onCallEnd: () => void;
}

export const CallSignaling = ({ 
  roomId, 
  userId, 
  onOffer, 
  onAnswer, 
  onIceCandidate,
  onCallEnd 
}: CallSignalingProps) => {
  const channelRef = useRef<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const setupSignaling = async () => {
      try {
        // Create realtime channel for signaling
        const channel = supabase.channel(`call-${roomId}`, {
          config: {
            broadcast: { self: true },
          },
        });

        channel
          .on('broadcast', { event: 'webrtc-offer' }, ({ payload }) => {
            if (payload.from !== userId) {
              console.log('Received offer:', payload.offer);
              onOffer(payload.offer);
            }
          })
          .on('broadcast', { event: 'webrtc-answer' }, ({ payload }) => {
            if (payload.from !== userId) {
              console.log('Received answer:', payload.answer);
              onAnswer(payload.answer);
            }
          })
          .on('broadcast', { event: 'webrtc-candidate' }, ({ payload }) => {
            if (payload.from !== userId) {
              console.log('Received ICE candidate:', payload.candidate);
              onIceCandidate(payload.candidate);
            }
          })
          .on('broadcast', { event: 'call-end' }, ({ payload }) => {
            if (payload.from !== userId) {
              console.log('Call ended by peer');
              onCallEnd();
            }
          })
          .subscribe((status) => {
            if (status === 'SUBSCRIBED') {
              setIsConnected(true);
              console.log('Signaling connected for room:', roomId);
            } else if (status === 'CHANNEL_ERROR') {
              toast.error('Verbindungsfehler beim Signaling');
              setIsConnected(false);
            }
          });

        channelRef.current = channel;
      } catch (error) {
        console.error('Error setting up signaling:', error);
        toast.error('Fehler beim Einrichten der Verbindung');
      }
    };

    setupSignaling();

    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
        channelRef.current = null;
      }
    };
  }, [roomId, userId, onOffer, onAnswer, onIceCandidate, onCallEnd]);

  const sendOffer = async (offer: RTCSessionDescriptionInit) => {
    if (!channelRef.current || !isConnected) {
      toast.error('Signaling nicht verbunden');
      return;
    }

    try {
      await channelRef.current.send({
        type: 'broadcast',
        event: 'webrtc-offer',
        payload: { offer, from: userId, timestamp: Date.now() }
      });
      console.log('Offer sent:', offer);
    } catch (error) {
      console.error('Error sending offer:', error);
      toast.error('Fehler beim Senden des Angebots');
    }
  };

  const sendAnswer = async (answer: RTCSessionDescriptionInit) => {
    if (!channelRef.current || !isConnected) {
      toast.error('Signaling nicht verbunden');
      return;
    }

    try {
      await channelRef.current.send({
        type: 'broadcast',
        event: 'webrtc-answer',
        payload: { answer, from: userId, timestamp: Date.now() }
      });
      console.log('Answer sent:', answer);
    } catch (error) {
      console.error('Error sending answer:', error);
      toast.error('Fehler beim Senden der Antwort');
    }
  };

  const sendIceCandidate = async (candidate: RTCIceCandidateInit) => {
    if (!channelRef.current || !isConnected) {
      return; // ICE candidates can be sent silently
    }

    try {
      await channelRef.current.send({
        type: 'broadcast',
        event: 'webrtc-candidate',
        payload: { candidate, from: userId, timestamp: Date.now() }
      });
      console.log('ICE candidate sent:', candidate);
    } catch (error) {
      console.error('Error sending ICE candidate:', error);
    }
  };

  const sendCallEnd = async () => {
    if (!channelRef.current || !isConnected) {
      return;
    }

    try {
      await channelRef.current.send({
        type: 'broadcast',
        event: 'call-end',
        payload: { from: userId, timestamp: Date.now() }
      });
      console.log('Call end sent');
    } catch (error) {
      console.error('Error sending call end:', error);
    }
  };

  return {
    sendOffer,
    sendAnswer,
    sendIceCandidate,
    sendCallEnd,
    isConnected
  };
};