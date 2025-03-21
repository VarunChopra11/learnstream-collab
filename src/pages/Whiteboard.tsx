
import { useState } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import Canvas from '@/components/whiteboard/Canvas';
import WhiteboardControls from '@/components/whiteboard/WhiteboardControls';
import AudioControls from '@/components/audio/AudioControls';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Pencil, Users, Copy, CheckCheck } from 'lucide-react';
import { toast } from 'sonner';

const WhiteboardPage = () => {
  const [isTeacher, setIsTeacher] = useState(true);
  const [color, setColor] = useState('#000000');
  const [size, setSize] = useState(3);
  const [roomId, setRoomId] = useState('classroom-123');
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);
  
  const handleColorChange = (newColor: string) => {
    setColor(newColor);
  };
  
  const handleSizeChange = (newSize: number) => {
    setSize(newSize);
  };
  
  const handleClearCanvas = () => {
    // Canvas component will handle the actual clearing
    toast.success('Canvas cleared!');
  };
  
  const handleCopyRoomId = () => {
    navigator.clipboard.writeText(roomId);
    setCopiedToClipboard(true);
    toast.success('Room ID copied to clipboard!');
    
    setTimeout(() => {
      setCopiedToClipboard(false);
    }, 2000);
  };

  return (
    <MainLayout>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold">Interactive Whiteboard</h1>
              <p className="text-muted-foreground">
                Collaborate in real-time with students
              </p>
            </div>
            
            <motion.div 
              className="glass-card p-2 rounded-lg flex items-center gap-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center px-3 py-1.5 text-sm text-muted-foreground bg-muted rounded-md">
                <Users size={14} className="mr-1.5" />
                <span>Room ID:</span>
              </div>
              <Input
                value={roomId}
                onChange={(e) => setRoomId(e.target.value)}
                className="max-w-[120px] h-9"
              />
              <Button
                size="sm"
                variant="outline"
                className="h-9 px-2.5"
                onClick={handleCopyRoomId}
              >
                {copiedToClipboard ? <CheckCheck size={14} /> : <Copy size={14} />}
              </Button>
              <div className="h-6 border-l border-border mx-1"></div>
              <Label className="flex items-center">
                <span className="mr-2 text-sm">Teacher Mode</span>
                <input
                  type="checkbox"
                  checked={isTeacher}
                  onChange={(e) => setIsTeacher(e.target.checked)}
                  className="toggle toggle-primary"
                />
              </Label>
            </motion.div>
          </div>
          
          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <div className="xl:col-span-3 space-y-4">
              <WhiteboardControls
                onColorChange={handleColorChange}
                onSizeChange={handleSizeChange}
                onClear={handleClearCanvas}
                currentColor={color}
                currentSize={size}
                isTeacher={isTeacher}
              />
              
              <div className="h-[calc(100vh-380px)] min-h-[400px]">
                <Canvas isTeacher={isTeacher} roomId={roomId} />
              </div>
              
              <AudioControls isTeacher={isTeacher} roomId={roomId} />
            </div>
            
            <motion.div 
              className="glass-card rounded-lg overflow-hidden flex flex-col h-[calc(100vh-280px)] min-h-[400px]"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Tabs defaultValue="participants" className="flex flex-col h-full">
                <div className="border-b px-4">
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="participants">Participants</TabsTrigger>
                    <TabsTrigger value="chat">Chat</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent 
                  value="participants" 
                  className="flex-grow overflow-y-auto p-4 space-y-3"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="text-sm font-medium">Participants (3)</h3>
                    <Button variant="ghost" size="sm">Invite</Button>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between px-3 py-2 bg-accent rounded-lg">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <Pencil size={14} className="text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">Jane Smith</p>
                          <p className="text-xs text-muted-foreground">Teacher</p>
                        </div>
                      </div>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                        You
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-xs font-medium">JD</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">John Doe</p>
                          <p className="text-xs text-muted-foreground">Student</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between px-3 py-2 rounded-lg hover:bg-accent/50 transition-colors">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-xs font-medium">AJ</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium">Alice Johnson</p>
                          <p className="text-xs text-muted-foreground">Student</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent 
                  value="chat" 
                  className="flex flex-col h-full p-0 data-[state=active]:flex data-[state=inactive]:hidden"
                >
                  <div className="flex-grow overflow-y-auto p-4 space-y-3">
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center">
                        <Pencil size={14} className="text-primary" />
                      </div>
                      <div className="bg-accent rounded-lg p-3 max-w-[calc(100%-50px)]">
                        <p className="text-xs text-muted-foreground mb-1">Jane Smith • 10:32 AM</p>
                        <p className="text-sm">Welcome to the whiteboard session! Let me know if you have any questions.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 justify-end">
                      <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-[calc(100%-50px)]">
                        <p className="text-xs opacity-80 mb-1">You • 10:35 AM</p>
                        <p className="text-sm">Can you explain the diagram again please?</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-muted flex-shrink-0 flex items-center justify-center">
                        <span className="text-xs font-medium">JD</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center">
                        <Pencil size={14} className="text-primary" />
                      </div>
                      <div className="bg-accent rounded-lg p-3 max-w-[calc(100%-50px)]">
                        <p className="text-xs text-muted-foreground mb-1">Jane Smith • 10:37 AM</p>
                        <p className="text-sm">Of course! I'll go through it step-by-step now.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="p-4 border-t">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Type a message..."
                        className="flex-grow"
                      />
                      <Button>Send</Button>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </motion.div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default WhiteboardPage;
