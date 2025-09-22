import { useRef, useState, useCallback, useEffect } from 'react';

interface UseWebRTCProps {
  onRemoteStream?: (stream: MediaStream) => void;
  onCallEnd?: () => void;
}

export const useWebRTC = ({ onRemoteStream, onCallEnd }: UseWebRTCProps = {}) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStream, setRemoteStream] = useState<MediaStream | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const peerConnectionRef = useRef<RTCPeerConnection | null>(null);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const remoteVideoRef = useRef<HTMLVideoElement>(null);

  // ICE servers configuration (STUN servers)
  const iceServers = [
    { urls: 'stun:stun.l.google.com:19302' },
    { urls: 'stun:stun1.l.google.com:19302' },
  ];

  // Initialize peer connection
  const initializePeerConnection = useCallback(() => {
    const peerConnection = new RTCPeerConnection({ iceServers });
    
    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        // TODO: Send ICE candidate to remote peer via signaling server
        console.log('ICE candidate:', event.candidate);
      }
    };

    peerConnection.ontrack = (event) => {
      const [stream] = event.streams;
      setRemoteStream(stream);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = stream;
      }
      onRemoteStream?.(stream);
    };

    peerConnection.onconnectionstatechange = () => {
      const state = peerConnection.connectionState;
      console.log('Connection state:', state);
      
      if (state === 'connected') {
        setIsConnected(true);
      } else if (state === 'disconnected' || state === 'failed' || state === 'closed') {
        setIsConnected(false);
        if (state === 'failed' || state === 'closed') {
          onCallEnd?.();
        }
      }
    };

    peerConnectionRef.current = peerConnection;
    return peerConnection;
  }, [onRemoteStream, onCallEnd]);

  // Get user media (camera/microphone)
  const getUserMedia = useCallback(async (video: boolean = true, audio: boolean = true) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video, audio });
      setLocalStream(stream);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }
      
      return stream;
    } catch (err) {
      console.error('Error accessing media devices:', err);
      setError('Failed to access camera/microphone');
      throw err;
    }
  }, []);

  // Start call (create offer)
  const startCall = useCallback(async (isVideoCall: boolean = true) => {
    try {
      const stream = await getUserMedia(isVideoCall, true);
      const peerConnection = initializePeerConnection();
      
      // Add local stream to peer connection
      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream);
      });

      // Create offer
      const offer = await peerConnection.createOffer();
      await peerConnection.setLocalDescription(offer);
      
      // TODO: Send offer to remote peer via signaling server
      console.log('Created offer:', offer);
      
      return offer;
    } catch (err) {
      console.error('Error starting call:', err);
      setError('Failed to start call');
      throw err;
    }
  }, [getUserMedia, initializePeerConnection]);

  // Answer call (create answer)
  const answerCall = useCallback(async (offer: RTCSessionDescriptionInit, isVideoCall: boolean = true) => {
    try {
      const stream = await getUserMedia(isVideoCall, true);
      const peerConnection = initializePeerConnection();
      
      // Add local stream to peer connection
      stream.getTracks().forEach(track => {
        peerConnection.addTrack(track, stream);
      });

      // Set remote description (offer)
      await peerConnection.setRemoteDescription(offer);
      
      // Create answer
      const answer = await peerConnection.createAnswer();
      await peerConnection.setLocalDescription(answer);
      
      // TODO: Send answer to remote peer via signaling server
      console.log('Created answer:', answer);
      
      return answer;
    } catch (err) {
      console.error('Error answering call:', err);
      setError('Failed to answer call');
      throw err;
    }
  }, [getUserMedia, initializePeerConnection]);

  // Handle received answer
  const handleAnswer = useCallback(async (answer: RTCSessionDescriptionInit) => {
    try {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.setRemoteDescription(answer);
      }
    } catch (err) {
      console.error('Error handling answer:', err);
      setError('Failed to handle answer');
    }
  }, []);

  // Handle received ICE candidate
  const handleIceCandidate = useCallback(async (candidate: RTCIceCandidateInit) => {
    try {
      if (peerConnectionRef.current) {
        await peerConnectionRef.current.addIceCandidate(candidate);
      }
    } catch (err) {
      console.error('Error handling ICE candidate:', err);
    }
  }, []);

  // Toggle mute
  const toggleMute = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsMuted(!audioTrack.enabled);
      }
    }
  }, [localStream]);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
      }
    }
  }, [localStream]);

  // End call
  const endCall = useCallback(() => {
    // Stop local stream
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }

    // Close peer connection
    if (peerConnectionRef.current) {
      peerConnectionRef.current.close();
      peerConnectionRef.current = null;
    }

    // Reset states
    setRemoteStream(null);
    setIsConnected(false);
    setIsMuted(false);
    setIsVideoEnabled(true);
    setError(null);

    // Clear video elements
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }

    onCallEnd?.();
  }, [localStream, onCallEnd]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      endCall();
    };
  }, [endCall]);

  return {
    localStream,
    remoteStream,
    isConnected,
    isMuted,
    isVideoEnabled,
    error,
    localVideoRef,
    remoteVideoRef,
    startCall,
    answerCall,
    handleAnswer,
    handleIceCandidate,
    toggleMute,
    toggleVideo,
    endCall
  };
};