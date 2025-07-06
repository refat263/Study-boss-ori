import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Trash2 } from "lucide-react";
import { Task } from "@shared/schema";

interface TaskItemProps {
  task: Task;
  onToggleComplete: (taskId: number, completed: boolean) => void;
  onDelete: (taskId: number) => void;
}

export default function TaskItem({ task, onToggleComplete, onDelete }: TaskItemProps) {
  const [isCompleting, setIsCompleting] = useState(false);

  const handleToggle = async (checked: boolean) => {
    setIsCompleting(true);
    try {
      await onToggleComplete(task.id, checked);
      
      // Show completion animation
      if (checked) {
        // Add some celebration effect here if needed
      }
    } finally {
      setIsCompleting(false);
    }
  };

  return (
    <div
      className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
        task.isCompleted
          ? 'border-green-500/50 bg-green-500/10'
          : task.isAdminTask
          ? 'border-[#FFD700] bg-[#FFD700]/10'
          : 'border-gray-600 bg-gray-700 hover:border-[#FFD700]/50'
      } ${isCompleting ? 'opacity-50' : ''}`}
    >
      <Checkbox
        checked={task.isCompleted}
        onCheckedChange={handleToggle}
        disabled={isCompleting}
        className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500 border-gray-500"
      />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {task.isAdminTask && (
            <Badge variant="secondary" className="bg-[#FFD700]/20 text-[#FFD700] text-xs border-[#FFD700]/30">
              إداري
            </Badge>
          )}
          <h4
            className={`font-medium truncate ${
              task.isCompleted
                ? 'line-through text-gray-400'
                : task.isAdminTask
                ? 'text-[#FFD700]'
                : 'text-white'
            }`}
          >
            {task.title}
          </h4>
        </div>
        
        {task.description && (
          <p
            className={`text-sm truncate ${
              task.isCompleted
                ? 'line-through text-gray-500'
                : task.isAdminTask
                ? 'text-[#FFD700]/80'
                : 'text-gray-300'
            }`}
          >
            {task.description}
          </p>
        )}
      </div>
      
      {!task.isAdminTask && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => onDelete(task.id)}
          className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
