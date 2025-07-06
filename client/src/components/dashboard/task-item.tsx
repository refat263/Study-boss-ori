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
          ? 'border-green-200 bg-green-50'
          : task.isAdminTask
          ? 'border-blue-200 bg-blue-50'
          : 'border-gray-200 bg-white hover:border-[#FFD700]'
      } ${isCompleting ? 'opacity-50' : ''}`}
    >
      <Checkbox
        checked={task.isCompleted}
        onCheckedChange={handleToggle}
        disabled={isCompleting || task.isAdminTask}
        className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
      />
      
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          {task.isAdminTask && (
            <Badge variant="secondary" className="bg-blue-100 text-blue-800 text-xs">
              إداري
            </Badge>
          )}
          <h4
            className={`font-medium truncate ${
              task.isCompleted
                ? 'line-through text-gray-500'
                : task.isAdminTask
                ? 'text-blue-800'
                : 'text-gray-700'
            }`}
          >
            {task.title}
          </h4>
        </div>
        
        {task.description && (
          <p
            className={`text-sm truncate ${
              task.isCompleted
                ? 'line-through text-gray-400'
                : task.isAdminTask
                ? 'text-blue-600'
                : 'text-gray-600'
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
          className="text-red-500 hover:text-red-700 hover:bg-red-50"
        >
          <Trash2 className="w-4 h-4" />
        </Button>
      )}
    </div>
  );
}
