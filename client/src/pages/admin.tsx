import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Navbar from "@/components/layout/navbar";
import { useAuth } from "@/hooks/use-auth";
import { User } from "@shared/schema";
import { Search, Upload, Users, BookOpen, CheckCircle } from "lucide-react";

export default function Admin() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [newSummary, setNewSummary] = useState({
    week: 1,
    day: 1,
    title: "",
    content: "",
  });
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
  });

  // Check if user is admin (this should be properly validated on backend)
  const isAdmin = user?.email === "admin@studyboss.com"; // This is a simple check for demo

  // Fetch all users
  const { data: users = [], isLoading: usersLoading } = useQuery({
    queryKey: ["/api/admin/users"],
    enabled: isAdmin,
  });

  // Fetch summaries
  const { data: summaries = [] } = useQuery({
    queryKey: ["/api/admin/summaries"],
    enabled: isAdmin,
  });

  // Add summary mutation
  const addSummaryMutation = useMutation({
    mutationFn: (summaryData: typeof newSummary) =>
      apiRequest("POST", "/api/admin/summaries", summaryData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/summaries"] });
      setNewSummary({ week: 1, day: 1, title: "", content: "" });
      toast({
        title: "تم إضافة الملخص",
        description: "تم رفع الملخص بنجاح",
      });
    },
  });

  // Add admin task mutation
  const addAdminTaskMutation = useMutation({
    mutationFn: (taskData: typeof newTask) =>
      apiRequest("POST", "/api/admin/tasks", { ...taskData, isAdminTask: true }),
    onSuccess: () => {
      setNewTask({ title: "", description: "" });
      toast({
        title: "تم إضافة المهمة",
        description: "تم إضافة المهمة الإدارية لجميع الطلاب",
      });
    },
  });

  // Activate user plan mutation
  const activateUserMutation = useMutation({
    mutationFn: ({ userId, planType }: { userId: number; planType: string }) =>
      apiRequest("PATCH", `/api/admin/users/${userId}/activate`, { planType }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: "تم تفعيل الحساب",
        description: "تم تفعيل حساب الطالب بنجاح",
      });
    },
  });

  const handleAddSummary = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSummary.title && newSummary.content) {
      addSummaryMutation.mutate(newSummary);
    }
  };

  const handleAddAdminTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTask.title) {
      addAdminTaskMutation.mutate(newTask);
    }
  };

  const filteredUsers = users.filter((user: User) =>
    user.fullName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.studentCode?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center py-20">
          <Card className="w-full max-w-md">
            <CardContent className="pt-6 text-center">
              <h2 className="text-2xl font-bold text-red-600 mb-4">
                غير مصرح لك بالوصول
              </h2>
              <p className="text-gray-600">
                هذه الصفحة مخصصة للمشرفين فقط
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#0a1128] mb-2">
            لوحة تحكم المشرف 👨‍💼
          </h1>
          <p className="text-gray-600">
            إدارة المحتوى والطلاب والمهام
          </p>
        </div>

        {/* Admin Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              الطلاب
            </TabsTrigger>
            <TabsTrigger value="summaries" className="flex items-center gap-2">
              <Upload className="w-4 h-4" />
              الملخصات
            </TabsTrigger>
            <TabsTrigger value="tasks" className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              المهام
            </TabsTrigger>
            <TabsTrigger value="quizzes" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              الاختبارات
            </TabsTrigger>
          </TabsList>

          {/* Users Management */}
          <TabsContent value="users">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-[#0a1128]">
                  إدارة الطلاب
                </CardTitle>
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="البحث بالاسم أو البريد أو كود الطالب..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                {usersLoading ? (
                  <div className="text-center py-8">جاري تحميل الطلاب...</div>
                ) : filteredUsers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    لا يوجد طلاب
                  </div>
                ) : (
                  <div className="space-y-4">
                    {filteredUsers.map((student: User) => (
                      <div
                        key={student.id}
                        className="flex items-center justify-between p-4 border rounded-lg hover:border-[#FFD700] transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-medium text-[#0a1128]">
                              {student.fullName}
                            </h3>
                            <Badge
                              variant={student.isActive ? "default" : "secondary"}
                              className={student.isActive ? "bg-green-500" : ""}
                            >
                              {student.isActive ? "نشط" : "غير نشط"}
                            </Badge>
                            <Badge variant="outline">
                              {student.planType || "مجاني"}
                            </Badge>
                          </div>
                          
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm text-gray-600">
                            <span>📧 {student.email}</span>
                            <span>📱 {student.phone}</span>
                            <span>🏫 {student.college}</span>
                            <span>🆔 {student.studentCode}</span>
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Select
                            onValueChange={(planType) =>
                              activateUserMutation.mutate({
                                userId: student.id,
                                planType,
                              })
                            }
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue placeholder="تفعيل" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="free">مجاني</SelectItem>
                              <SelectItem value="premium">متقدم</SelectItem>
                              <SelectItem value="vip">VIP</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Summaries Management */}
          <TabsContent value="summaries">
            <div className="grid lg:grid-cols-2 gap-6">
              
              {/* Add Summary Form */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-[#0a1128]">
                    إضافة ملخص جديد
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <form onSubmit={handleAddSummary} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>الأسبوع</Label>
                        <Select
                          value={newSummary.week.toString()}
                          onValueChange={(value) =>
                            setNewSummary(prev => ({ ...prev, week: parseInt(value) }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 16 }, (_, i) => (
                              <SelectItem key={i + 1} value={(i + 1).toString()}>
                                الأسبوع {i + 1}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <Label>اليوم</Label>
                        <Select
                          value={newSummary.day.toString()}
                          onValueChange={(value) =>
                            setNewSummary(prev => ({ ...prev, day: parseInt(value) }))
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {[
                              "السبت",
                              "الأحد",
                              "الاثنين",
                              "الثلاثاء",
                              "الأربعاء",
                              "الخميس",
                            ].map((day, index) => (
                              <SelectItem key={index + 1} value={(index + 1).toString()}>
                                {day}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div>
                      <Label>عنوان الملخص</Label>
                      <Input
                        value={newSummary.title}
                        onChange={(e) =>
                          setNewSummary(prev => ({ ...prev, title: e.target.value }))
                        }
                        placeholder="أدخل عنوان الملخص"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label>محتوى الملخص</Label>
                      <Textarea
                        value={newSummary.content}
                        onChange={(e) =>
                          setNewSummary(prev => ({ ...prev, content: e.target.value }))
                        }
                        placeholder="أدخل محتوى الملخص"
                        rows={6}
                        required
                      />
                    </div>
                    
                    <Button
                      type="submit"
                      disabled={addSummaryMutation.isPending}
                      className="w-full bg-[#0a1128] hover:bg-opacity-90"
                    >
                      {addSummaryMutation.isPending ? "جاري الإضافة..." : "إضافة الملخص"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Summaries List */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-[#0a1128]">
                    الملخصات المرفوعة
                  </CardTitle>
                </CardHeader>
                
                <CardContent>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {summaries.length === 0 ? (
                      <div className="text-center text-gray-500 py-4">
                        لا توجد ملخصات حالياً
                      </div>
                    ) : (
                      summaries.map((summary: any) => (
                        <div
                          key={summary.id}
                          className="p-3 border rounded-lg hover:border-[#FFD700] transition-colors"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-[#0a1128]">
                              {summary.title}
                            </h4>
                            <Badge variant="outline">
                              أسبوع {summary.week} - يوم {summary.day}
                            </Badge>
                          </div>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {summary.content}
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tasks Management */}
          <TabsContent value="tasks">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-[#0a1128]">
                  إضافة مهمة إدارية
                </CardTitle>
                <p className="text-gray-600">
                  المهام الإدارية تظهر لجميع الطلاب ولا يمكنهم حذفها
                </p>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleAddAdminTask} className="space-y-4">
                  <div>
                    <Label>عنوان المهمة</Label>
                    <Input
                      value={newTask.title}
                      onChange={(e) =>
                        setNewTask(prev => ({ ...prev, title: e.target.value }))
                      }
                      placeholder="أدخل عنوان المهمة"
                      required
                    />
                  </div>
                  
                  <div>
                    <Label>وصف المهمة (اختياري)</Label>
                    <Textarea
                      value={newTask.description}
                      onChange={(e) =>
                        setNewTask(prev => ({ ...prev, description: e.target.value }))
                      }
                      placeholder="أدخل تفاصيل المهمة"
                      rows={3}
                    />
                  </div>
                  
                  <Button
                    type="submit"
                    disabled={addAdminTaskMutation.isPending}
                    className="bg-[#FFD700] text-[#0a1128] hover:bg-yellow-400"
                  >
                    {addAdminTaskMutation.isPending ? "جاري الإضافة..." : "إضافة مهمة إدارية"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Quizzes Management */}
          <TabsContent value="quizzes">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-[#0a1128]">
                  إدارة الاختبارات
                </CardTitle>
                <p className="text-gray-600">
                  قريباً - إضافة وإدارة الاختبارات اليومية والأسبوعية
                </p>
              </CardHeader>
              
              <CardContent>
                <div className="text-center py-12 text-gray-500">
                  <BookOpen className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">قيد التطوير</h3>
                  <p>سيتم إضافة نظام إدارة الاختبارات قريباً</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
