
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, Clock, Flag, CheckCircle, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import type { QuizQuestion } from './QuizCreator';

interface QuizPlayerProps {
  questions: QuizQuestion[];
  title: string;
  timeLimit: number; // Time limit in minutes
  onComplete: (score: number, totalPoints: number) => void;
}

export const QuizPlayer = ({ questions, title, timeLimit, onComplete }: QuizPlayerProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOptions, setSelectedOptions] = useState<number[]>(Array(questions.length).fill(-1));
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(timeLimit * 60); // Convert to seconds
  
  const totalPoints = questions.reduce((sum, q) => sum + q.points, 0);
  const score = questions.reduce((sum, q, index) => {
    return sum + (selectedOptions[index] === q.correctOption ? q.points : 0);
  }, 0);
  
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  
  // Timer countdown effect
  useEffect(() => {
    if (isSubmitted || timeRemaining <= 0) return;
    
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          submitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    
    return () => clearInterval(timer);
  }, [isSubmitted, timeRemaining]);
  
  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };
  
  const handleOptionSelect = (value: string) => {
    const newSelectedOptions = [...selectedOptions];
    newSelectedOptions[currentQuestionIndex] = parseInt(value);
    setSelectedOptions(newSelectedOptions);
  };
  
  const submitQuiz = () => {
    // Check if all questions are answered
    const unansweredCount = selectedOptions.filter(opt => opt === -1).length;
    
    if (unansweredCount > 0 && timeRemaining > 0) {
      toast.warning(`You have ${unansweredCount} unanswered question${unansweredCount > 1 ? 's' : ''}!`);
      return;
    }
    
    setIsSubmitted(true);
    onComplete(score, totalPoints);
    
    if (timeRemaining <= 0) {
      toast.error('Time has expired! Quiz automatically submitted.');
    } else {
      toast.success('Quiz submitted successfully!');
    }
  };
  
  const renderQuizContent = () => {
    if (isSubmitted) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="space-y-6"
        >
          <div className="text-center space-y-3">
            <h2 className="text-2xl font-bold">Quiz Results</h2>
            <p className="text-muted-foreground">Your score: {score} / {totalPoints} points</p>
            
            <div className="w-32 h-32 mx-auto relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold">
                  {Math.round((score / totalPoints) * 100)}%
                </span>
              </div>
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="#E5E7EB"
                  strokeWidth="16"
                  fill="transparent"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="16"
                  strokeDasharray={2 * Math.PI * 56}
                  strokeDashoffset={2 * Math.PI * 56 * (1 - score / totalPoints)}
                  fill="transparent"
                  className="text-primary transition-all duration-1000 ease-out"
                />
              </svg>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Review Your Answers</h3>
            
            {questions.map((question, index) => (
              <div 
                key={index}
                className={`p-4 rounded-lg border ${
                  selectedOptions[index] === question.correctOption
                    ? 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/20'
                    : 'border-red-200 bg-red-50 dark:border-red-900 dark:bg-red-900/20'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium">{index + 1}. {question.question}</p>
                    <p className="text-sm mt-1 text-muted-foreground">
                      Your answer: {selectedOptions[index] === -1 ? 'Not answered' : question.options[selectedOptions[index]]}
                    </p>
                    <p className="text-sm mt-1 text-green-600 dark:text-green-400">
                      Correct answer: {question.options[question.correctOption]}
                    </p>
                  </div>
                  
                  <div>
                    {selectedOptions[index] === question.correctOption ? (
                      <CheckCircle className="text-green-600 dark:text-green-400" />
                    ) : (
                      <AlertTriangle className="text-red-600 dark:text-red-400" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex justify-center pt-4">
            <Button onClick={() => window.location.reload()}>
              Try Another Quiz
            </Button>
          </div>
        </motion.div>
      );
    }
    
    const currentQuestion = questions[currentQuestionIndex];
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium">
              Question {currentQuestionIndex + 1} of {questions.length}
            </span>
            <span className="text-sm text-muted-foreground">
              {currentQuestion.points} point{currentQuestion.points > 1 ? 's' : ''}
            </span>
          </div>
          
          <div className={`flex items-center space-x-1 px-3 py-1 rounded-full text-sm ${
            timeRemaining < 60 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : 'bg-muted text-muted-foreground'
          }`}>
            <Clock size={14} />
            <span>{formatTime(timeRemaining)}</span>
          </div>
        </div>
        
        <Progress value={progress} className="h-1.5" />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestionIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <h2 className="text-xl font-medium">{currentQuestion.question}</h2>
            
            <RadioGroup
              value={selectedOptions[currentQuestionIndex].toString()}
              onValueChange={handleOptionSelect}
            >
              {currentQuestion.options.map((option, index) => (
                <Label
                  key={index}
                  htmlFor={`option-${index}`}
                  className="flex items-center space-x-3 p-3 rounded-lg border border-border hover:bg-accent transition-colors cursor-pointer"
                >
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium">
                      {String.fromCharCode(65 + index)}
                    </div>
                    <span>{option}</span>
                  </div>
                </Label>
              ))}
            </RadioGroup>
          </motion.div>
        </AnimatePresence>
        
        <div className="flex items-center justify-between pt-4">
          <Button
            variant="outline"
            onClick={goToPrevQuestion}
            disabled={currentQuestionIndex === 0}
            className="flex items-center space-x-1"
          >
            <ChevronLeft size={16} />
            <span>Previous</span>
          </Button>
          
          {currentQuestionIndex < questions.length - 1 ? (
            <Button
              onClick={goToNextQuestion}
              className="flex items-center space-x-1"
            >
              <span>Next</span>
              <ChevronRight size={16} />
            </Button>
          ) : (
            <Button
              onClick={submitQuiz}
              className="flex items-center space-x-1"
              variant="default"
            >
              <Flag size={16} />
              <span>Submit Quiz</span>
            </Button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="glass-card p-6 rounded-lg max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{title}</h1>
      </div>
      
      {renderQuizContent()}
    </div>
  );
};

export default QuizPlayer;
