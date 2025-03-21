
import { useState } from 'react';
import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/MainLayout';
import VideoPlayer from '@/components/video/VideoPlayer';
import AudioControls from '@/components/audio/AudioControls';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Video, 
  Upload, 
  List, 
  MessageSquare, 
  PlusCircle, 
  Clock,
  PlayCircle, 
  ThumbsUp,
  BookmarkCheck,
  Users
} from 'lucide-react';

const VideoLecturePage = () => {
  const [isTeacher, setIsTeacher] = useState(true);
  const [roomId, setRoomId] = useState('lecture-123');
  
  // Mock video lectures data
  const lectures = [
    {
      id: '1',
      title: 'Introduction to Mathematics',
      duration: '45:22',
      thumbnail: '/placeholder.svg',
      date: '2023-09-15',
      views: 342
    },
    {
      id: '2',
      title: 'Advanced Biology Concepts',
      duration: '37:15',
      thumbnail: '/placeholder.svg',
      date: '2023-09-12',
      views: 287
    },
    {
      id: '3',
      title: 'Physics and Applied Sciences',
      duration: '52:08',
      thumbnail: '/placeholder.svg',
      date: '2023-09-10',
      views: 421
    }
  ];

  return (
    <MainLayout>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold">Video Lectures</h1>
              <p className="text-muted-foreground">
                Stream and manage educational video content
              </p>
            </div>
            
            <motion.div 
              className="glass-card p-3 rounded-lg flex items-center gap-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
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
              <motion.div
                className="relative glass-card rounded-lg overflow-hidden h-[calc(100vh-320px)] min-h-[400px]"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <VideoPlayer
                  src="https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4"
                  title="Introduction to Mathematics"
                />
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div 
                  className="glass-card p-4 rounded-lg col-span-2"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <h2 className="text-xl font-semibold mb-2">Introduction to Mathematics</h2>
                  <p className="text-muted-foreground text-sm mb-4">
                    This lecture covers the fundamental concepts of mathematics, including algebra, 
                    geometry, and calculus basics. Perfect for beginners and students who need a refresher.
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-4">
                    <span className="bg-accent text-accent-foreground text-xs font-medium px-2.5 py-1 rounded-full">
                      Mathematics
                    </span>
                    <span className="bg-accent text-accent-foreground text-xs font-medium px-2.5 py-1 rounded-full">
                      Algebra
                    </span>
                    <span className="bg-accent text-accent-foreground text-xs font-medium px-2.5 py-1 rounded-full">
                      Beginner
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center">
                        <Clock size={14} className="text-muted-foreground mr-1" />
                        <span className="text-xs text-muted-foreground">45:22</span>
                      </div>
                      <div className="flex items-center">
                        <Users size={14} className="text-muted-foreground mr-1" />
                        <span className="text-xs text-muted-foreground">342 views</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm" className="h-8 gap-1">
                        <ThumbsUp size={14} />
                        <span className="text-xs">152</span>
                      </Button>
                      <Button variant="ghost" size="sm" className="h-8">
                        <BookmarkCheck size={14} />
                      </Button>
                    </div>
                  </div>
                </motion.div>
                
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <AudioControls isTeacher={isTeacher} roomId={roomId} />
                </motion.div>
              </div>
            </div>
            
            <motion.div 
              className="glass-card rounded-lg overflow-hidden flex flex-col h-[calc(100vh-280px)] min-h-[400px]"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Tabs defaultValue="videos" className="flex flex-col h-full">
                <div className="border-b px-4">
                  <TabsList className="grid grid-cols-2">
                    <TabsTrigger value="videos">Videos</TabsTrigger>
                    <TabsTrigger value="chat">Chat</TabsTrigger>
                  </TabsList>
                </div>
                
                <TabsContent 
                  value="videos" 
                  className="flex-grow overflow-y-auto p-4 space-y-4"
                >
                  {isTeacher && (
                    <Button className="w-full flex items-center gap-1 mb-2">
                      <Upload size={14} />
                      <span>Upload New Lecture</span>
                    </Button>
                  )}
                  
                  <div className="space-y-3">
                    {lectures.map((lecture) => (
                      <div 
                        key={lecture.id}
                        className="flex gap-3 p-2 rounded-lg hover:bg-accent transition-colors cursor-pointer"
                      >
                        <div className="relative w-20 h-14 rounded-md overflow-hidden bg-muted">
                          <img 
                            src={lecture.thumbnail} 
                            alt={lecture.title}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 hover:opacity-100 transition-opacity">
                            <PlayCircle size={20} className="text-white" />
                          </div>
                          <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs px-1 rounded">
                            {lecture.duration}
                          </div>
                        </div>
                        
                        <div className="flex flex-col justify-between flex-grow">
                          <h3 className="text-sm font-medium line-clamp-2">{lecture.title}</h3>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-muted-foreground">{lecture.date}</span>
                            <span className="text-xs text-muted-foreground">{lecture.views} views</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </TabsContent>
                
                <TabsContent 
                  value="chat" 
                  className="flex flex-col h-full p-0 data-[state=active]:flex data-[state=inactive]:hidden"
                >
                  <div className="flex-grow overflow-y-auto p-4 space-y-3">
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center">
                        <span className="text-xs font-medium">JS</span>
                      </div>
                      <div className="bg-accent rounded-lg p-3 max-w-[calc(100%-50px)]">
                        <p className="text-xs text-muted-foreground mb-1">Jane Smith • 10:32 AM</p>
                        <p className="text-sm">Welcome to the video lecture! Feel free to ask questions as we go.</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 justify-end">
                      <div className="bg-primary text-primary-foreground rounded-lg p-3 max-w-[calc(100%-50px)]">
                        <p className="text-xs opacity-80 mb-1">You • 10:35 AM</p>
                        <p className="text-sm">Could you explain more about the quadratic formula?</p>
                      </div>
                      <div className="w-8 h-8 rounded-full bg-muted flex-shrink-0 flex items-center justify-center">
                        <span className="text-xs font-medium">JD</span>
                      </div>
                    </div>
                    
                    <div className="flex gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex-shrink-0 flex items-center justify-center">
                        <span className="text-xs font-medium">JS</span>
                      </div>
                      <div className="bg-accent rounded-lg p-3 max-w-[calc(100%-50px)]">
                        <p className="text-xs text-muted-foreground mb-1">Jane Smith • 10:37 AM</p>
                        <p className="text-sm">Great question! The quadratic formula is used to solve equations of the form ax² + bx + c = 0, where a, b, and c are coefficients.</p>
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

export default VideoLecturePage;
