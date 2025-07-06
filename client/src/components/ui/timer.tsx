import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Play, Pause, RotateCcw, Settings } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PomodoroTimerProps {
  className?: string;
}

export default function PomodoroTimer({ className }: PomodoroTimerProps) {
  const [workTime, setWorkTime] = useState(25); // minutes
  const [breakTime, setBreakTime] = useState(5); // minutes
  const [currentTime, setCurrentTime] = useState(25 * 60); // seconds
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const { toast } = useToast();
  const intervalRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (isRunning && currentTime > 0) {
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => prev - 1);
      }, 1000);
    } else if (currentTime === 0) {
      handleTimerComplete();
    } else {
      clearInterval(intervalRef.current);
    }

    return () => clearInterval(intervalRef.current);
  }, [isRunning, currentTime]);

  const handleTimerComplete = () => {
    setIsRunning(false);
    
    if (isBreak) {
      // Break finished, start work session
      setIsBreak(false);
      setCurrentTime(workTime * 60);
      toast({
        title: "انتهت فترة الراحة! 💪",
        description: "وقت العودة للدراسة بتركيز",
      });
    } else {
      // Work session finished, start break
      setIsBreak(true);
      setCurrentTime(breakTime * 60);
      toast({
        title: "أحسنت! 🎉",
        description: "حان وقت أخذ استراحة قصيرة",
      });
    }

    // Play notification sound (if available)
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(isBreak ? 'انتهت فترة الراحة!' : 'انتهت جلسة الدراسة!');
    }
  };

  const toggleTimer = () => {
    setIsRunning(!isRunning);
  };

  const resetTimer = () => {
    setIsRunning(false);
    setIsBreak(false);
    setCurrentTime(workTime * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgress = () => {
    const totalTime = isBreak ? breakTime * 60 : workTime * 60;
    return ((totalTime - currentTime) / totalTime) * 100;
  };

  const updateWorkTime = (minutes: number) => {
    setWorkTime(minutes);
    if (!isBreak && !isRunning) {
      setCurrentTime(minutes * 60);
    }
  };

  const updateBreakTime = (minutes: number) => {
    setBreakTime(minutes);
    if (isBreak && !isRunning) {
      setCurrentTime(minutes * 60);
    }
  };

  return (
    <Card className={className}>
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-[#0a1128]">
            مؤقت بومودورو
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="text-gray-500 hover:text-[#0a1128]"
          >
            <Settings className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-sm text-gray-600">
          {isBreak ? "فترة راحة" : "فترة دراسة"}
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {showSettings && (
          <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
            <div>
              <Label className="text-sm font-medium">وقت الدراسة (دقيقة)</Label>
              <Input
                type="number"
                value={workTime}
                onChange={(e) => updateWorkTime(parseInt(e.target.value) || 25)}
                min="1"
                max="60"
                className="mt-1"
              />
            </div>
            <div>
              <Label className="text-sm font-medium">وقت الراحة (دقيقة)</Label>
              <Input
                type="number"
                value={breakTime}
                onChange={(e) => updateBreakTime(parseInt(e.target.value) || 5)}
                min="1"
                max="30"
                className="mt-1"
              />
            </div>
          </div>
        )}

        {/* Circular Timer */}
        <div className="flex justify-center">
          <div className="relative w-48 h-48">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              {/* Background Circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
                className="text-gray-200"
              />
              {/* Progress Circle */}
              <circle
                cx="50"
                cy="50"
                r="45"
                stroke={isBreak ? "#10b981" : "#FFD700"}
                strokeWidth="4"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={283}
                strokeDashoffset={283 - (283 * getProgress()) / 100}
                className="transition-all duration-1000 ease-in-out"
              />
            </svg>
            
            {/* Timer Display */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="text-3xl font-bold text-[#0a1128]">
                  {formatTime(currentTime)}
                </div>
                <div className="text-sm text-gray-600 mt-1">
                  {isBreak ? "راحة" : "دراسة"}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Control Buttons */}
        <div className="flex gap-2 justify-center">
          <Button
            onClick={toggleTimer}
            className={`flex-1 ${isRunning 
              ? 'bg-red-500 hover:bg-red-600 text-white' 
              : 'bg-[#FFD700] hover:bg-yellow-400 text-[#0a1128]'
            }`}
          >
            {isRunning ? (
              <>
                <Pause className="w-4 h-4 ml-2" />
                إيقاف
              </>
            ) : (
              <>
                <Play className="w-4 h-4 ml-2" />
                تشغيل
              </>
            )}
          </Button>
          
          <Button
            onClick={resetTimer}
            variant="outline"
            className="border-[#0a1128] text-[#0a1128] hover:bg-[#0a1128] hover:text-white"
          >
            <RotateCcw className="w-4 h-4 ml-2" />
            إعادة تعيين
          </Button>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#0a1128]">
              {Math.floor((workTime * 60 - currentTime) / 60)}
            </div>
            <div className="text-sm text-gray-600">دقائق مكتملة</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#FFD700]">
              {isBreak ? "0" : "1"}
            </div>
            <div className="text-sm text-gray-600">جلسة اليوم</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
