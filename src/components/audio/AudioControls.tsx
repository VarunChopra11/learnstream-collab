
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Headphones 
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

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
  const [audioSourceNode, setAudioSourceNode] = useState<MediaStreamAudioSourceNode | null>(null);
  const [audioLevel, setAudioLevel] = useState(0);

  // Initialize audio
  useEffect(() => {
    if (!isTeacher && !isMicActive) return;
    
    const setupAudio = async () => {
      try {
        if (isMicActive) {
          const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
          setAudioStream(stream);
          
          // Create audio context and analyzer
          const context = new AudioContext();
          const source = context.createMediaStreamSource(stream);
          const analyzer = context.createAnalyser();
          analyzer.fftSize = 256;
          source.connect(analyzer);
          
          setAudioContext(context);
          setAudioSourceNode(source);
          
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
          
          toast.success('Microphone activated');
        } else if (audioStream) {
          // Stop all audio tracks
          audioStream.getAudioTracks().forEach(track => track.stop());
          
          // Clean up audio context
          if (audioContext) {
            audioContext.close();
          }
          
          setAudioStream(null);
          setAudioContext(null);
          setAudioSourceNode(null);
          setAudioLevel(0);
          
          toast.success('Microphone deactivated');
        }
      } catch (error) {
        console.error('Error accessing microphone:', error);
        toast.error('Failed to access microphone');
        setIsMicActive(false);
      }
    };
    
    setupAudio();
    
    return () => {
      if (audioStream) {
        audioStream.getAudioTracks().forEach(track => track.stop());
      }
      
      if (audioContext) {
        audioContext.close();
      }
    };
  }, [isMicActive]);

  const toggleMicrophone = () => {
    setIsMicActive(!isMicActive);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

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
            disabled
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
      
      <div className="hidden sm:flex items-center">
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
