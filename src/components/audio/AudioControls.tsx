
import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Headphones,
  AlertCircle
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useWebSocket } from '@/hooks/useWebSocket';
import { WEBSOCKET_URL } from '@/lib/socket';

interface AudioControlsProps {
  isTeacher?: boolean;
  roomId: string;
}

export const AudioControls = ({ isTeacher = false, roomId }: AudioControlsProps) => {
  const [isMicActive, setIsMicActive] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(80);
  const [audioStream, setAudioStream] = useState<MediaStream | null>(null);
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const audioElementRef = useRef<HTMLAudioElement | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const connectionStatusRef = useRef<boolean>(false);

  // Set up WebSocket connection for audio transmission
  const { isConnected, send, messageHistory, isReconnecting } = useWebSocket({
    url: `${WEBSOCKET_URL}?room=${roomId}-audio`,
    onOpen: () => {
      connectionStatusRef.current = true;
      if (isTeacher && isMicActive) {
        startAudioTransmission();
      }
    },
    onMessage: (message) => {
      if (!isTeacher && message.type === 'audio_chunk' && message.payload) {
        handleAudioChunk(message.payload);
      }
    },
    onClose: () => {
      connectionStatusRef.current = false;
    },
    maxReconnectAttempts: 3,
  });

  // Handle incoming audio chunks for students
  const handleAudioChunk = (audioBase64: string) => {
    if (!isTeacher && audioBase64) {
      try {
        // Convert base64 to audio blob
        const binary = atob(audioBase64);
        const array = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) {
          array[i] = binary.charCodeAt(i);
        }
        const blob = new Blob([array], { type: 'audio/webm' });
        
        // Create or update audio element
        if (!audioElementRef.current) {
          audioElementRef.current = new Audio();
          audioElementRef.current.autoplay = true;
        }
        
        // Create object URL and play
        const url = URL.createObjectURL(blob);
        audioElementRef.current.src = url;
        
        if (!isMuted) {
          audioElementRef.current.volume = volume / 100;
          audioElementRef.current.play().catch(err => {
            console.error('Error playing audio:', err);
          });
        }
      } catch (error) {
        console.error('Error handling audio chunk:', error);
      }
    }
  };

  // Initialize audio for teachers
  useEffect(() => {
    if (!isTeacher || !isMicActive) return;
    
    const setupTeacherAudio = async () => {
      try {
        if (isMicActive) {
          // Request microphone access
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          setAudioStream(stream);
          
          // Create audio context and analyzer
          const context = new AudioContext();
          audioContextRef.current = context;
          setAudioContext(context);
          
          const source = context.createMediaStreamSource(stream);
          const analyzer = context.createAnalyser();
          analyzer.fftSize = 256;
          source.connect(analyzer);
          
          // Set up audio level monitoring
          const bufferLength = analyzer.frequencyBinCount;
          const dataArray = new Uint8Array(bufferLength);
          
          const updateAudioLevel = () => {
            if (!analyzer) return;
            analyzer.getByteFrequencyData(dataArray);
            const average = dataArray.reduce((acc, val) => acc + val, 0) / bufferLength;
            setAudioLevel(average / 256); // Normalize to 0-1
            requestAnimationFrame(updateAudioLevel);
          };
          
          updateAudioLevel();
          
          // Set up media recorder for transmission
          startAudioTransmission();
          
          toast.success('Microphone activated');
        }
      } catch (error) {
        console.error('Error accessing microphone:', error);
        toast.error('Failed to access microphone');
        setIsMicActive(false);
      }
    };
    
    setupTeacherAudio();
    
    // Cleanup function
    return () => {
      stopAudioTransmission();
      
      if (audioStream) {
        audioStream.getAudioTracks().forEach(track => track.stop());
      }
      
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [isMicActive]);

  // Function to start audio transmission for teachers
  const startAudioTransmission = () => {
    if (!isTeacher || !audioStream || !connectionStatusRef.current) return;
    
    try {
      // Create media recorder for the audio stream
      const options = { mimeType: 'audio/webm' };
      const recorder = new MediaRecorder(audioStream, options);
      mediaRecorderRef.current = recorder;
      
      // Send audio chunks via WebSocket when available
      recorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0 && connectionStatusRef.current) {
          const reader = new FileReader();
          reader.onloadend = () => {
            const base64data = reader.result as string;
            // Extract the base64 part
            const base64Audio = base64data.split(',')[1];
            send('audio_chunk', base64Audio);
          };
          reader.readAsDataURL(event.data);
        }
      };
      
      // Start recording with small timeslices for low latency
      recorder.start(100);
      
    } catch (error) {
      console.error('Error starting audio transmission:', error);
      toast.error('Failed to start audio transmission');
    }
  };

  // Function to stop audio transmission
  const stopAudioTransmission = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  };

  // Toggle microphone state
  const toggleMicrophone = () => {
    if (isTeacher) {
      if (isMicActive) {
        // Stop recording and transmission
        stopAudioTransmission();
        
        // Stop the audio tracks
        if (audioStream) {
          audioStream.getAudioTracks().forEach(track => track.stop());
        }
        
        // Close audio context
        if (audioContextRef.current) {
          audioContextRef.current.close();
          audioContextRef.current = null;
        }
        
        setAudioStream(null);
        setAudioContext(null);
        setAudioLevel(0);
        
        toast.success('Microphone deactivated');
      }
      
      setIsMicActive(!isMicActive);
    }
  };

  // Toggle mute state for students
  const toggleMute = () => {
    setIsMuted(!isMuted);
    
    if (audioElementRef.current) {
      if (!isMuted) {
        audioElementRef.current.volume = 0;
      } else {
        audioElementRef.current.volume = volume / 100;
      }
    }
  };

  // Update volume when it changes
  useEffect(() => {
    if (audioElementRef.current && !isMuted) {
      audioElementRef.current.volume = volume / 100;
    }
  }, [volume, isMuted]);

  return (
    <motion.div 
      className="glass-card p-3 rounded-xl flex items-center gap-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
    >
      <div className="flex items-center gap-2">
        {isTeacher ? (
          <Button
            variant={isMicActive ? "default" : "outline"}
            size="icon"
            className="relative"
            onClick={toggleMicrophone}
            disabled={isReconnecting}
          >
            {isMicActive ? <Mic size={18} /> : <MicOff size={18} />}
            {isMicActive && audioLevel > 0.05 && (
              <span className="absolute inset-0 animate-ping rounded-md bg-primary/30" />
            )}
          </Button>
        ) : (
          <Button
            variant="outline"
            size="icon"
            className="relative"
          >
            <Headphones size={18} />
          </Button>
        )}
        
        {isTeacher && (
          <div className="flex items-center h-1.5 w-20 bg-muted rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-primary"
              initial={{ width: 0 }}
              animate={{ width: `${audioLevel * 100}%` }}
              transition={{ duration: 0.1 }}
            />
          </div>
        )}
      </div>
      
      <div className="h-6 border-l border-border"></div>
      
      <div className="flex items-center gap-2 flex-grow">
        <Button
          variant={isMuted ? "default" : "outline"}
          size="icon"
          onClick={toggleMute}
        >
          {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
        </Button>
        
        <div className="flex-grow max-w-40">
          <Slider
            value={[volume]}
            min={0}
            max={100}
            step={1}
            onValueChange={(value) => setVolume(value[0])}
            disabled={isMuted}
          />
        </div>
        
        <span className="text-xs text-muted-foreground w-6">{volume}%</span>
      </div>
      
      <div className="hidden sm:flex items-center gap-2">
        {!isConnected && (
          <span className="text-xs text-amber-500 flex items-center gap-1">
            <AlertCircle size={12} />
            {isReconnecting ? 'Reconnecting...' : 'Disconnected'}
          </span>
        )}
        {isTeacher ? (
          <span className={`text-xs font-medium px-2 py-1 rounded-full ${
            isMicActive ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300' : 'bg-muted text-muted-foreground'
          }`}>
            {isMicActive ? 'Broadcasting' : 'Muted'}
          </span>
        ) : (
          <span className="text-xs text-muted-foreground">
            {isTeacher ? 'Teacher audio' : 'Student mode'}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default AudioControls;
