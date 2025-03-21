
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  Eraser, 
  Pencil, 
  Square, 
  Circle, 
  Type, 
  Image as ImageIcon,
  Trash2,
  Download,
  Upload,
  Undo,
  Redo,
  Palette
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';

interface WhiteboardControlsProps {
  onColorChange: (color: string) => void;
  onSizeChange: (size: number) => void;
  onClear: () => void;
  currentColor: string;
  currentSize: number;
  isTeacher: boolean;
}

export const WhiteboardControls = ({ 
  onColorChange, 
  onSizeChange, 
  onClear,
  currentColor,
  currentSize,
  isTeacher
}: WhiteboardControlsProps) => {
  const [activeToolIndex, setActiveToolIndex] = useState(0);
  
  const colors = [
    '#000000', '#FFFFFF', '#FF0000', '#00FF00', '#0000FF', 
    '#FFFF00', '#FF00FF', '#00FFFF', '#FFA500', '#800080'
  ];
  
  const tools = [
    { name: 'Pen', icon: Pencil },
    { name: 'Eraser', icon: Eraser },
    { name: 'Rectangle', icon: Square },
    { name: 'Circle', icon: Circle },
    { name: 'Text', icon: Type },
    { name: 'Image', icon: ImageIcon },
  ];
  
  const handleToolClick = (index: number) => {
    setActiveToolIndex(index);
  };

  return (
    <motion.div 
      className="glass-card p-2 rounded-xl flex flex-wrap gap-2 items-center justify-center md:justify-between"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
    >
      <div className="flex items-center gap-1 justify-center">
        {tools.map((tool, index) => (
          <Button
            key={tool.name}
            variant={activeToolIndex === index ? "default" : "outline"}
            size="icon"
            className="transition-all duration-200"
            onClick={() => handleToolClick(index)}
            disabled={!isTeacher}
          >
            <tool.icon size={18} />
          </Button>
        ))}
        
        <div className="h-6 mx-1 border-l border-border"></div>
        
        <Popover>
          <PopoverTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
              className="relative overflow-hidden"
              disabled={!isTeacher}
            >
              <div 
                className="absolute inset-2 rounded-sm" 
                style={{ backgroundColor: currentColor }}
              />
              <Palette size={18} className="text-white mix-blend-difference" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-56" align="start">
            <div className="grid grid-cols-5 gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  className={`w-8 h-8 rounded-md border transition-all ${
                    currentColor === color ? 'border-primary shadow-sm' : 'border-border'
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => onColorChange(color)}
                />
              ))}
            </div>
          </PopoverContent>
        </Popover>
        
        <div className="w-32 hidden sm:flex items-center space-x-2">
          <div className="w-4 h-4 rounded-full bg-primary/30"></div>
          <Slider
            value={[currentSize]}
            min={1}
            max={20}
            step={1}
            onValueChange={(value) => onSizeChange(value[0])}
            disabled={!isTeacher}
          />
          <div className="w-5 h-5 rounded-full bg-primary/60"></div>
        </div>
      </div>
      
      <div className="flex items-center gap-1 justify-center">
        <Button variant="outline" size="icon" disabled={!isTeacher}>
          <Undo size={18} />
        </Button>
        <Button variant="outline" size="icon" disabled={!isTeacher}>
          <Redo size={18} />
        </Button>
        
        <div className="h-6 mx-1 border-l border-border"></div>
        
        <Button variant="outline" size="icon" disabled={!isTeacher}>
          <Upload size={18} />
        </Button>
        <Button variant="outline" size="icon">
          <Download size={18} />
        </Button>
        <Button 
          variant="destructive" 
          size="icon"
          onClick={onClear}
          disabled={!isTeacher}
        >
          <Trash2 size={18} />
        </Button>
      </div>
    </motion.div>
  );
};

export default WhiteboardControls;
