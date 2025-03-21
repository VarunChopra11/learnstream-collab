
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { motion } from 'framer-motion';
import { 
  PlusCircle, 
  MinusCircle, 
  Clock, 
  Save, 
  Copy, 
  Trash2, 
  MoveUp, 
  MoveDown,
  CheckCircle,
  X
} from 'lucide-react';
import { toast } from 'sonner';

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOption: number;
  points: number;
}

interface QuizCreatorProps {
  onSave: (questions: QuizQuestion[], title: string, timeLimit: number) => void;
}

export const QuizCreator = ({ onSave }: QuizCreatorProps) => {
  const [title, setTitle] = useState('New Quiz');
  const [timeLimit, setTimeLimit] = useState(10); // Time limit in minutes
  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: '1',
      question: '',
      options: ['', '', '', ''],
      correctOption: 0,
      points: 1
    }
  ]);
  
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: Date.now().toString(),
        question: '',
        options: ['', '', '', ''],
        correctOption: 0,
        points: 1
      }
    ]);
  };
  
  const removeQuestion = (index: number) => {
    if (questions.length === 1) {
      toast.error('Quiz must have at least one question');
      return;
    }
    
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    setQuestions(newQuestions);
  };
  
  const updateQuestion = (index: number, field: keyof QuizQuestion, value: any) => {
    const newQuestions = [...questions];
    newQuestions[index] = { ...newQuestions[index], [field]: value };
    setQuestions(newQuestions);
  };
  
  const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
    const newQuestions = [...questions];
    newQuestions[questionIndex].options[optionIndex] = value;
    setQuestions(newQuestions);
  };
  
  const moveQuestion = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) || 
      (direction === 'down' && index === questions.length - 1)
    ) {
      return;
    }
    
    const newQuestions = [...questions];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    
    [newQuestions[index], newQuestions[targetIndex]] = [newQuestions[targetIndex], newQuestions[index]];
    
    setQuestions(newQuestions);
  };
  
  const duplicateQuestion = (index: number) => {
    const questionToDuplicate = questions[index];
    
    setQuestions([
      ...questions.slice(0, index + 1),
      {
        ...questionToDuplicate,
        id: Date.now().toString()
      },
      ...questions.slice(index + 1)
    ]);
  };
  
  const handleSave = () => {
    // Validate quiz data
    if (!title.trim()) {
      toast.error('Please provide a quiz title');
      return;
    }
    
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      
      if (!q.question.trim()) {
        toast.error(`Question ${i + 1} is empty`);
        return;
      }
      
      for (let j = 0; j < q.options.length; j++) {
        if (!q.options[j].trim()) {
          toast.error(`Option ${j + 1} in question ${i + 1} is empty`);
          return;
        }
      }
    }
    
    onSave(questions, title, timeLimit);
    toast.success('Quiz saved successfully!');
  };

  return (
    <div className="w-full space-y-6">
      <div className="glass-card p-4 rounded-lg space-y-4">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex-grow">
            <Label htmlFor="quiz-title">Quiz Title</Label>
            <Input
              id="quiz-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter quiz title"
              className="text-lg font-medium"
            />
          </div>
          
          <div className="w-36">
            <Label htmlFor="time-limit" className="flex items-center gap-1">
              <Clock size={14} /> Time Limit
            </Label>
            <div className="flex items-center">
              <Input
                id="time-limit"
                type="number"
                min={1}
                max={120}
                value={timeLimit}
                onChange={(e) => setTimeLimit(parseInt(e.target.value) || 1)}
                className="rounded-r-none"
              />
              <span className="bg-muted px-3 py-2 border border-l-0 border-input rounded-r-md text-sm text-muted-foreground">
                min
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-6">
        {questions.map((question, qIndex) => (
          <motion.div
            key={question.id}
            className="glass-card p-4 rounded-lg space-y-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <h3 className="text-md font-medium">Question {qIndex + 1}</h3>
              
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => moveQuestion(qIndex, 'up')}
                  disabled={qIndex === 0}
                >
                  <MoveUp size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => moveQuestion(qIndex, 'down')}
                  disabled={qIndex === questions.length - 1}
                >
                  <MoveDown size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => duplicateQuestion(qIndex)}
                >
                  <Copy size={16} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive"
                  onClick={() => removeQuestion(qIndex)}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor={`question-${qIndex}`}>Question</Label>
                <Textarea
                  id={`question-${qIndex}`}
                  value={question.question}
                  onChange={(e) => updateQuestion(qIndex, 'question', e.target.value)}
                  placeholder="Enter your question"
                  className="resize-none"
                />
              </div>
              
              <div>
                <div className="flex justify-between mb-2">
                  <Label>Options</Label>
                  <Label>Correct Answer</Label>
                </div>
                
                <RadioGroup
                  value={question.correctOption.toString()}
                  onValueChange={(value) => updateQuestion(qIndex, 'correctOption', parseInt(value))}
                >
                  {question.options.map((option, oIndex) => (
                    <div key={oIndex} className="flex items-center space-x-2 mb-2">
                      <div className="flex-grow flex items-center space-x-2">
                        <div className="flex items-center justify-center w-6 h-6 rounded-full bg-muted text-xs font-medium">
                          {String.fromCharCode(65 + oIndex)}
                        </div>
                        <Input
                          value={option}
                          onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                          placeholder={`Option ${oIndex + 1}`}
                        />
                      </div>
                      <RadioGroupItem value={oIndex.toString()} id={`option-${qIndex}-${oIndex}`} />
                    </div>
                  ))}
                </RadioGroup>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="w-24">
                  <Label htmlFor={`points-${qIndex}`}>Points</Label>
                  <Input
                    id={`points-${qIndex}`}
                    type="number"
                    min={1}
                    max={100}
                    value={question.points}
                    onChange={(e) => updateQuestion(qIndex, 'points', parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={addQuestion}
          className="flex items-center gap-1"
        >
          <PlusCircle size={16} />
          Add Question
        </Button>
        
        <Button
          onClick={handleSave}
          className="flex items-center gap-1"
        >
          <Save size={16} />
          Save Quiz
        </Button>
      </div>
    </div>
  );
};

export default QuizCreator;
