
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import MainLayout from '@/components/layout/MainLayout';
import QuizCreator, { QuizQuestion } from '@/components/quiz/QuizCreator';
import QuizPlayer from '@/components/quiz/QuizPlayer';
import { FileText, PlusCircle, Clock, Users, Check } from 'lucide-react';
import { toast } from 'sonner';

interface Quiz {
  id: string;
  title: string;
  timeLimit: number;
  questions: QuizQuestion[];
  createdAt: string;
  completions: number;
  avgScore: number;
}

const QuizPage = () => {
  const [activeTab, setActiveTab] = useState('all-quizzes');
  const [isTeacher, setIsTeacher] = useState(true);
  const [selectedQuiz, setSelectedQuiz] = useState<Quiz | null>(null);
  const [quizzes, setQuizzes] = useState<Quiz[]>([
    {
      id: '1',
      title: 'Mathematics Fundamentals',
      timeLimit: 15,
      questions: [
        {
          id: '1',
          question: 'What is the value of π (pi) to two decimal places?',
          options: ['3.14', '3.16', '3.12', '3.18'],
          correctOption: 0,
          points: 1
        },
        {
          id: '2',
          question: 'If f(x) = 2x + 3, what is the value of f(4)?',
          options: ['7', '8', '11', '12'],
          correctOption: 2,
          points: 1
        },
        {
          id: '3',
          question: 'What is the square root of 144?',
          options: ['12', '14', '16', '18'],
          correctOption: 0,
          points: 1
        }
      ],
      createdAt: '2023-09-15',
      completions: 42,
      avgScore: 78
    },
    {
      id: '2',
      title: 'Science Quiz',
      timeLimit: 10,
      questions: [
        {
          id: '1',
          question: 'What is the chemical symbol for gold?',
          options: ['Gd', 'Au', 'Ag', 'Go'],
          correctOption: 1,
          points: 1
        },
        {
          id: '2',
          question: 'What is the largest planet in our solar system?',
          options: ['Earth', 'Saturn', 'Jupiter', 'Neptune'],
          correctOption: 2,
          points: 1
        }
      ],
      createdAt: '2023-09-10',
      completions: 35,
      avgScore: 65
    }
  ]);
  
  const handleCreateQuiz = (questions: QuizQuestion[], title: string, timeLimit: number) => {
    const newQuiz: Quiz = {
      id: Date.now().toString(),
      title,
      timeLimit,
      questions,
      createdAt: new Date().toISOString().split('T')[0],
      completions: 0,
      avgScore: 0
    };
    
    setQuizzes([newQuiz, ...quizzes]);
    setActiveTab('all-quizzes');
    toast.success('Quiz created successfully!');
  };
  
  const handleQuizClick = (quiz: Quiz) => {
    setSelectedQuiz(quiz);
    setActiveTab('take-quiz');
  };
  
  const handleQuizComplete = (score: number, totalPoints: number) => {
    if (!selectedQuiz) return;
    
    // In a real app, you would send this data to the server
    toast.success(`Quiz completed! You scored ${score} out of ${totalPoints} points.`);
    
    // Update the quiz stats
    const updatedQuizzes = quizzes.map(quiz => {
      if (quiz.id === selectedQuiz.id) {
        const newCompletions = quiz.completions + 1;
        const newTotalScore = (quiz.avgScore * quiz.completions) + (score / totalPoints * 100);
        const newAvgScore = Math.round(newTotalScore / newCompletions);
        
        return {
          ...quiz,
          completions: newCompletions,
          avgScore: newAvgScore
        };
      }
      return quiz;
    });
    
    setQuizzes(updatedQuizzes);
  };

  return (
    <MainLayout>
      <div className="container px-4 md:px-6">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-3xl font-bold">Interactive Quizzes</h1>
              <p className="text-muted-foreground">
                Create and manage educational assessments
              </p>
            </div>
            
            <motion.div 
              className="flex items-center gap-2"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Button
                variant={isTeacher ? "default" : "outline"}
                onClick={() => setIsTeacher(true)}
                className="flex items-center gap-1"
              >
                Teacher Mode
              </Button>
              <Button
                variant={!isTeacher ? "default" : "outline"}
                onClick={() => setIsTeacher(false)}
                className="flex items-center gap-1"
              >
                Student Mode
              </Button>
            </motion.div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
            <div className="flex justify-between items-center">
              <TabsList>
                <TabsTrigger value="all-quizzes" className="rounded-lg">All Quizzes</TabsTrigger>
                {isTeacher && (
                  <TabsTrigger value="create-quiz" className="rounded-lg">Create Quiz</TabsTrigger>
                )}
                {selectedQuiz && (
                  <TabsTrigger value="take-quiz" className="rounded-lg">Take Quiz</TabsTrigger>
                )}
              </TabsList>
              
              {isTeacher && activeTab === 'all-quizzes' && (
                <Button onClick={() => setActiveTab('create-quiz')} className="flex items-center gap-1">
                  <PlusCircle size={16} />
                  <span>New Quiz</span>
                </Button>
              )}
            </div>
            
            <TabsContent value="all-quizzes" className="space-y-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              >
                {quizzes.map((quiz, index) => (
                  <motion.div
                    key={quiz.id}
                    className="glass-card rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    onClick={() => handleQuizClick(quiz)}
                  >
                    <div className="p-6 space-y-4">
                      <div className="flex items-start justify-between">
                        <h3 className="text-lg font-semibold">{quiz.title}</h3>
                        <div className="p-1.5 bg-primary/10 rounded-full">
                          <FileText size={16} className="text-primary" />
                        </div>
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground gap-3">
                        <div className="flex items-center gap-1">
                          <Clock size={14} />
                          <span>{quiz.timeLimit} min</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Check size={14} />
                          <span>{quiz.questions.length} questions</span>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t border-border flex items-center justify-between">
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Users size={14} />
                          <span>{quiz.completions} completions</span>
                        </div>
                        <div className="text-sm">
                          <span className="font-medium">{quiz.avgScore}%</span> avg score
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-muted px-6 py-3 text-sm text-muted-foreground">
                      Created: {quiz.createdAt}
                    </div>
                  </motion.div>
                ))}
                
                {quizzes.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <FileText size={48} className="mx-auto text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-medium mb-2">No quizzes available</h3>
                    <p className="text-muted-foreground mb-4">Create your first quiz to get started</p>
                    {isTeacher && (
                      <Button onClick={() => setActiveTab('create-quiz')}>
                        Create Quiz
                      </Button>
                    )}
                  </div>
                )}
              </motion.div>
            </TabsContent>
            
            <TabsContent value="create-quiz" className="space-y-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                <QuizCreator onSave={handleCreateQuiz} />
              </motion.div>
            </TabsContent>
            
            <TabsContent value="take-quiz" className="space-y-4">
              {selectedQuiz && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <QuizPlayer
                    questions={selectedQuiz.questions}
                    title={selectedQuiz.title}
                    timeLimit={selectedQuiz.timeLimit}
                    onComplete={handleQuizComplete}
                  />
                </motion.div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </MainLayout>
  );
};

export default QuizPage;
