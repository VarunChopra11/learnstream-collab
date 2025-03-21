
import { useRef, useEffect, useState } from 'react';
import { useWebSocket } from '@/hooks/useWebSocket';
import { WEBSOCKET_URL } from '@/lib/socket';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { AlertCircle } from 'lucide-react';

interface CanvasProps {
  isTeacher?: boolean;
  roomId: string;
}

type DrawOperation = {
  type: 'start' | 'move' | 'end';
  x: number;
  y: number;
  color: string;
  size: number;
};

export const Canvas = ({ isTeacher = false, roomId }: CanvasProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#000000');
  const [size, setSize] = useState(3);
  
  const { isConnected, send, isReconnecting } = useWebSocket({
    url: `${WEBSOCKET_URL}?room=${roomId}-whiteboard`,
    onOpen: () => {
      toast.success('Connected to whiteboard session!');
    },
    onMessage: (message) => {
      if (message.type === 'draw_operation' && !isTeacher) {
        handleRemoteDrawOperation(message.payload);
      } else if (message.type === 'clear_canvas') {
        clearCanvas();
      }
    },
    onError: (error) => {
      console.error('WebSocket error in Canvas:', error);
    },
    maxReconnectAttempts: 3,
  });

  // Initial canvas setup
  useEffect(() => {
    if (!canvasRef.current) return;
    
    const canvas = canvasRef.current;
    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    canvas.style.width = `${canvas.offsetWidth}px`;
    canvas.style.height = `${canvas.offsetHeight}px`;
    
    const context = canvas.getContext('2d');
    if (context) {
      context.scale(window.devicePixelRatio, window.devicePixelRatio);
      context.lineCap = 'round';
      context.lineJoin = 'round';
      context.strokeStyle = color;
      context.lineWidth = size;
      contextRef.current = context;
    }
    
    // Handle window resize
    const handleResize = () => {
      if (!canvasRef.current || !contextRef.current) return;
      
      const imageData = contextRef.current.getImageData(0, 0, canvas.width, canvas.height);
      
      canvas.width = canvas.offsetWidth * window.devicePixelRatio;
      canvas.height = canvas.offsetHeight * window.devicePixelRatio;
      canvas.style.width = `${canvas.offsetWidth}px`;
      canvas.style.height = `${canvas.offsetHeight}px`;
      
      contextRef.current.putImageData(imageData, 0, 0);
      contextRef.current.scale(window.devicePixelRatio, window.devicePixelRatio);
      contextRef.current.lineCap = 'round';
      contextRef.current.lineJoin = 'round';
      contextRef.current.strokeStyle = color;
      contextRef.current.lineWidth = size;
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Update context when color or size changes
  useEffect(() => {
    if (contextRef.current) {
      contextRef.current.strokeStyle = color;
      contextRef.current.lineWidth = size;
    }
  }, [color, size]);

  const handleRemoteDrawOperation = (operation: DrawOperation) => {
    const context = contextRef.current;
    if (!context) return;

    // Save current context state
    const currentColor = context.strokeStyle;
    const currentSize = context.lineWidth;
    
    // Apply remote operation styles
    context.strokeStyle = operation.color;
    context.lineWidth = operation.size;

    switch (operation.type) {
      case 'start':
        context.beginPath();
        context.moveTo(operation.x, operation.y);
        break;
      case 'move':
        context.lineTo(operation.x, operation.y);
        context.stroke();
        break;
      case 'end':
        context.closePath();
        break;
    }
    
    // Restore original styles
    context.strokeStyle = currentColor;
    context.lineWidth = currentSize;
  };

  const startDrawing = ({ nativeEvent }: React.MouseEvent | React.TouchEvent) => {
    if (!isTeacher || !contextRef.current || !isConnected) return;
    
    const { offsetX, offsetY } = nativeEvent instanceof MouseEvent 
      ? nativeEvent 
      : { 
          offsetX: nativeEvent.touches[0].clientX - canvasRef.current!.getBoundingClientRect().left,
          offsetY: nativeEvent.touches[0].clientY - canvasRef.current!.getBoundingClientRect().top
        };
    
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
    
    // Send draw operation to WebSocket server
    send('draw_operation', {
      type: 'start',
      x: offsetX,
      y: offsetY,
      color,
      size
    });
  };

  const draw = ({ nativeEvent }: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !isTeacher || !contextRef.current || !isConnected) return;
    
    const { offsetX, offsetY } = nativeEvent instanceof MouseEvent 
      ? nativeEvent 
      : { 
          offsetX: nativeEvent.touches[0].clientX - canvasRef.current!.getBoundingClientRect().left,
          offsetY: nativeEvent.touches[0].clientY - canvasRef.current!.getBoundingClientRect().top
        };
    
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
    
    // Send draw operation to WebSocket server
    send('draw_operation', {
      type: 'move',
      x: offsetX,
      y: offsetY,
      color,
      size
    });
  };

  const endDrawing = () => {
    if (!isTeacher || !contextRef.current || !isConnected) return;
    
    contextRef.current.closePath();
    setIsDrawing(false);
    
    // Send draw operation to WebSocket server
    send('draw_operation', {
      type: 'end',
      x: 0,
      y: 0,
      color,
      size
    });
  };

  const clearCanvas = () => {
    if (!contextRef.current || !canvasRef.current) return;
    
    contextRef.current.clearRect(
      0, 
      0, 
      canvasRef.current.width / window.devicePixelRatio, 
      canvasRef.current.height / window.devicePixelRatio
    );
    
    // If teacher initiated the clear, send clear operation to WebSocket server
    if (isTeacher && isConnected) {
      send('clear_canvas', {});
    }
  };

  return (
    <div className="flex flex-col w-full h-full">
      <motion.div 
        className="relative w-full flex-grow bg-white rounded-lg shadow-lg border border-border overflow-hidden"
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full touch-none"
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={endDrawing}
        />
        
        {!isConnected && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/80 backdrop-blur-sm">
            <div className="text-center">
              {isReconnecting ? (
                <>
                  <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Reconnecting to whiteboard session...</p>
                </>
              ) : (
                <>
                  <AlertCircle className="h-8 w-8 text-amber-500 mx-auto mb-4" />
                  <p className="text-muted-foreground">Connection failed. Please refresh the page.</p>
                </>
              )}
            </div>
          </div>
        )}
        
        {!isTeacher && (
          <div className="absolute top-2 left-2 glass px-3 py-1.5 rounded-full text-xs font-medium z-10">
            Viewing mode - Teacher is presenting
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default Canvas;
