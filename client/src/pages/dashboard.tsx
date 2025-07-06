import { useState, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Navbar from "@/components/layout/navbar";
import WeekCard from "@/components/dashboard/week-card";
import TaskItem from "@/components/dashboard/task-item";
import PomodoroTimer from "@/components/ui/timer";
import { Task } from "@shared/schema";
import { Plus } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [currentWeek] = useState(3); // This would be calculated based on semester start

  // Fetch user tasks
  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ["/api/tasks"],
    enabled: !!user,
  });

  // Add new task mutation
  const addTaskMutation = useMutation({
    mutationFn: (taskData: { title: string }) =>
      apiRequest("POST", "/api/tasks", taskData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      setNewTaskTitle("");
      toast({
        title: "تمت الإضافة بنجاح",
        description: "تم إضافة المهمة الجديدة",
      });
    },
    onError: (error: any) => {
      toast({
        title: "خطأ في إضافة المهمة",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Toggle task completion mutation
  const toggleTaskMutation = useMutation({
    mutationFn: ({ taskId, completed }: { taskId: number; completed: boolean }) =>
      apiRequest("PATCH", `/api/tasks/${taskId}`, { isCompleted: completed }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
    },
  });

  // Delete task mutation
  const deleteTaskMutation = useMutation({
    mutationFn: (taskId: number) =>
      apiRequest("DELETE", `/api/tasks/${taskId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/tasks"] });
      toast({
        title: "تم الحذف",
        description: "تم حذف المهمة بنجاح",
      });
    },
  });

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      addTaskMutation.mutate({ title: newTaskTitle.trim() });
    }
  };

  const handleDownloadSummary = (week: number, day: number) => {
    toast({
      title: "تحميل الملخص",
      description: `جاري تحميل ملخص الأسبوع ${week} - اليوم ${day}`,
    });
    // Implement download logic here
  };

  const handleTakeQuiz = (week: number, day: number) => {
    toast({
      title: "بدء الاختبار",
      description: `سيتم توجيهك لاختبار الأسبوع ${week} - اليوم ${day}`,
    });
    // Implement quiz navigation here
  };

  const handleWeeklyQuiz = (week: number) => {
    toast({
      title: "اختبار نهاية الأسبوع",
      description: `سيتم توجيهك لاختبار نهاية الأسبوع ${week}`,
    });
    // Implement weekly quiz navigation here
  };

  const weeks = [
    { number: 1, title: "مقدمة في الرياضيات" },
    { number: 2, title: "الجبر الخطي" },
    { number: 3, title: "الديناميكا" },
    { number: 4, title: "التفاضل والتكامل" },
    { number: 5, title: "الفيزياء العامة" },
    { number: 6, title: "البرمجة الأساسية" },
    { number: 7, title: "الكيمياء العامة" },
    { number: 8, title: "امتحانات منتصف الفصل" },
    { number: 9, title: "الهندسة التحليلية" },
    { number: 10, title: "المعادلات التفاضلية" },
    { number: 11, title: "الإحصاء والاحتمالات" },
    { number: 12, title: "البرمجة المتقدمة" },
    { number: 13, title: "مراجعة شاملة" },
    { number: 14, title: "مشاريع التخرج" },
    { number: 15, title: "مراجعة نهائية" },
    { number: 16, title: "الامتحانات النهائية" },
  ];

  const completedTasks = tasks.filter((task: Task) => task.isCompleted).length;
  const totalTasks = tasks.length;
  const progressPercentage = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  if (!user) {
    return <div>جاري التحميل...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Dashboard Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 pb-6 border-b border-gray-200">
            <div>
              <h1 className="text-3xl font-bold text-[#0a1128] mb-2">
                أهلاً بك، {user.displayName || user.email} 👋
              </h1>
              <p className="text-gray-600">كلية الهندسة - السنة الثانية</p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="bg-gradient-to-r from-green-500 to-green-600 text-white px-6 py-3 rounded-lg">
                <span className="font-bold">الأسبوع {currentWeek} من 16</span>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-[#0a1128]">التقدم الأسبوعي</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>الأسبوع {currentWeek} من {weeks.length}</span>
                  <span>{Math.round((currentWeek / weeks.length) * 100)}%</span>
                </div>
                <Progress 
                  value={(currentWeek / weeks.length) * 100} 
                  className="h-3"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content - Weeks */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-bold text-[#0a1128] mb-6">
              خطة الدراسة - 16 أسبوع
            </h2>
            
            {weeks.map((week) => (
              <WeekCard
                key={week.number}
                weekNumber={week.number}
                title={week.title}
                isCurrentWeek={week.number === currentWeek}
                onDownloadSummary={handleDownloadSummary}
                onTakeQuiz={handleTakeQuiz}
                onWeeklyQuiz={handleWeeklyQuiz}
              />
            ))}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Pomodoro Timer */}
            <PomodoroTimer />

            {/* Daily Tasks */}
            <Card>
              <CardHeader>
                <CardTitle className="text-xl font-bold text-[#0a1128]">
                  المهام اليومية
                </CardTitle>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>مكتمل: {completedTasks}</span>
                  <span>المجموع: {totalTasks}</span>
                </div>
                <Progress value={progressPercentage} className="h-2" />
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Add New Task */}
                <form onSubmit={handleAddTask} className="flex gap-2">
                  <Input
                    value={newTaskTitle}
                    onChange={(e) => setNewTaskTitle(e.target.value)}
                    placeholder="أضف مهمة جديدة..."
                    className="text-right"
                  />
                  <Button
                    type="submit"
                    size="sm"
                    disabled={!newTaskTitle.trim() || addTaskMutation.isPending}
                    className="bg-[#FFD700] text-[#0a1128] hover:bg-yellow-400"
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </form>

                {/* Tasks List */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {tasksLoading ? (
                    <div className="text-center text-gray-500 py-4">
                      جاري تحميل المهام...
                    </div>
                  ) : tasks.length === 0 ? (
                    <div className="text-center text-gray-500 py-4">
                      لا توجد مهام حالياً
                    </div>
                  ) : (
                    tasks.map((task: Task) => (
                      <TaskItem
                        key={task.id}
                        task={task}
                        onToggleComplete={(taskId, completed) =>
                          toggleTaskMutation.mutate({ taskId, completed })
                        }
                        onDelete={(taskId) => deleteTaskMutation.mutate(taskId)}
                      />
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
