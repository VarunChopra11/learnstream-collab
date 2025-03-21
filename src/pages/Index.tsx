
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { 
  PencilRuler, 
  Video, 
  BookOpen, 
  Users, 
  MessageSquare, 
  CheckCircle,
  ArrowRight
} from 'lucide-react';
import MainLayout from '@/components/layout/MainLayout';

const Index = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState('student');
  const [classCode, setClassCode] = useState('');
  
  const features = [
    {
      title: 'Interactive Whiteboard',
      description: 'Real-time collaborative whiteboard with advanced drawing tools.',
      icon: PencilRuler,
      delay: 0.1
    },
    {
      title: 'Video Lectures',
      description: 'Stream and record high-quality video lessons with interactive features.',
      icon: Video,
      delay: 0.2
    },
    {
      title: 'Interactive Quizzes',
      description: 'Create engaging quizzes to assess student understanding.',
      icon: BookOpen,
      delay: 0.3
    },
    {
      title: 'Real-time Collaboration',
      description: 'Connect students and teachers in real-time virtual classrooms.',
      icon: Users,
      delay: 0.4
    },
    {
      title: 'Audio Streaming',
      description: 'Crystal-clear audio for lectures and discussions.',
      icon: MessageSquare,
      delay: 0.5
    }
  ];
  
  const handleJoinClass = () => {
    if (classCode.trim()) {
      navigate('/whiteboard');
    }
  };
  
  const handleCreateClass = () => {
    navigate('/whiteboard');
  };

  return (
    <MainLayout>
      <section className="container px-4 md:px-6 py-12 md:py-24">
        <div className="flex flex-col md:flex-row gap-12 items-center">
          <div className="flex-1 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="inline-block rounded-full bg-primary/10 px-3 py-1 text-sm text-primary mb-4">
                Welcome to EduCollab
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tighter mb-4">
                Real-time Education
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70 block">
                  Collaboration Platform
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground max-w-md">
                Connect teachers and students through interactive whiteboards, video lectures, and real-time collaboration tools.
              </p>
            </motion.div>
            
            <motion.div
              className="glass-card p-6 rounded-lg space-y-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="space-y-2">
                <h3 className="text-lg font-medium">Join or Create a Class</h3>
                <RadioGroup
                  defaultValue="student"
                  value={selectedRole}
                  onValueChange={setSelectedRole}
                  className="flex gap-4"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="student" id="student" />
                    <Label htmlFor="student">Student</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="teacher" id="teacher" />
                    <Label htmlFor="teacher">Teacher</Label>
                  </div>
                </RadioGroup>
              </div>
              
              {selectedRole === 'student' ? (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="class-code">Class Code</Label>
                    <div className="flex gap-2">
                      <Input
                        id="class-code"
                        placeholder="Enter class code"
                        value={classCode}
                        onChange={(e) => setClassCode(e.target.value)}
                      />
                      <Button onClick={handleJoinClass} className="shrink-0">
                        Join <ArrowRight size={16} className="ml-2" />
                      </Button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <Button onClick={handleCreateClass} className="w-full">
                    Create a New Class
                  </Button>
                </div>
              )}
            </motion.div>
          </div>
          
          <motion.div 
            className="flex-1 flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative w-full max-w-md aspect-square">
              <div className="absolute inset-0 rounded-full bg-primary/10 animate-float"></div>
              <div className="absolute inset-4 rounded-full bg-primary/20 animate-float" style={{ animationDelay: '1s' }}></div>
              <div className="absolute inset-8 rounded-full bg-primary/30 animate-float" style={{ animationDelay: '2s' }}></div>
              <img 
                src="/placeholder.svg" 
                alt="Education illustration" 
                className="absolute inset-12 rounded-full object-cover"
              />
            </div>
          </motion.div>
        </div>
      </section>
      
      <section className="bg-muted/30 py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <motion.div 
            className="text-center max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl font-bold mb-4">Powerful Features for Education</h2>
            <p className="text-muted-foreground text-lg">
              Everything you need to create an engaging learning experience
            </p>
          </motion.div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="glass-card p-6 rounded-lg flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: feature.delay }}
              >
                <div className="p-3 bg-primary/10 rounded-full w-fit mb-4">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-muted-foreground flex-grow">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      <section className="container px-4 md:px-6 py-12 md:py-24">
        <motion.div 
          className="glass-card p-8 lg:p-12 rounded-lg grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="space-y-6">
            <h2 className="text-3xl font-bold tracking-tighter">
              Ready to transform your classroom experience?
            </h2>
            <p className="text-muted-foreground">
              Join thousands of educators and students already using EduCollab to create engaging learning environments.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button size="lg" className="font-medium">
                Get Started <ArrowRight size={16} className="ml-2" />
              </Button>
              <Button size="lg" variant="outline" className="font-medium">
                See Demo
              </Button>
            </div>
          </div>
          <div className="relative">
            <img 
              src="/placeholder.svg" 
              alt="Classroom illustration" 
              className="rounded-lg w-full"
            />
            <div className="absolute top-4 right-4 glass px-4 py-2 rounded-full flex items-center space-x-2">
              <CheckCircle size={16} className="text-green-500" />
              <span className="text-sm font-medium">Trusted by 500+ schools</span>
            </div>
          </div>
        </motion.div>
      </section>
    </MainLayout>
  );
};

export default Index;
