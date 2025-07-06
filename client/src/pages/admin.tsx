import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PlusCircle, Search, Users, FileText, Brain, Upload, CheckCircle, XCircle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { type User } from "@shared/schema";
import Navbar from "@/components/layout/navbar";
import { useAuth } from "@/hooks/use-auth";

export default function Admin() {
  const { user } = useAuth();
  const [searchEmail, setSearchEmail] = useState("");
  const queryClient = useQueryClient();

  // Fetch all users
  const { data: users = [], isLoading } = useQuery({
    queryKey: ["/api/admin/users"],
  });

  // Fetch all summaries
  const { data: summaries = [] } = useQuery({
    queryKey: ["/api/admin/summaries"],
  });

  // Fetch all quizzes
  const { data: quizzes = [] } = useQuery({
    queryKey: ["/api/admin/quizzes"],
  });

  // Create admin task mutation
  const createAdminTaskMutation = useMutation({
    mutationFn: async (taskData: { title: string; description?: string }) => {
      return await apiRequest("/api/admin/tasks", {
        method: "POST",
        body: JSON.stringify(taskData),
      });
    },
    onSuccess: () => {
      toast({ title: "تم إنشاء المهمة بنجاح وإرسالها لجميع الطلاب" });
    },
    onError: () => {
      toast({ title: "حدث خطأ في إنشاء المهمة", variant: "destructive" });
    },
  });

  // Update user plan mutation
  const updateUserPlanMutation = useMutation({
    mutationFn: async ({ userId, isActive }: { userId: number; isActive: boolean }) => {
      return await apiRequest(`/api/admin/users/${userId}`, {
        method: "PATCH",
        body: JSON.stringify({ isActive }),
      });
    },
    onSuccess: () => {
      toast({ title: "تم تحديث حالة الطالب بنجاح" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
    onError: () => {
      toast({ title: "حدث خطأ في تحديث حالة الطالب", variant: "destructive" });
    },
  });

  // Create summary mutation
  const createSummaryMutation = useMutation({
    mutationFn: async (summaryData: { title: string; content: string; week: number; day: number; fileUrl?: string }) => {
      return await apiRequest("/api/admin/summaries", {
        method: "POST",
        body: JSON.stringify(summaryData),
      });
    },
    onSuccess: () => {
      toast({ title: "تم إنشاء الملخص بنجاح" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/summaries"] });
    },
    onError: () => {
      toast({ title: "حدث خطأ في إنشاء الملخص", variant: "destructive" });
    },
  });

  // Create quiz mutation
  const createQuizMutation = useMutation({
    mutationFn: async (quizData: { title: string; week: number; day?: number; questions: any; isWeekly: boolean }) => {
      return await apiRequest("/api/admin/quizzes", {
        method: "POST",
        body: JSON.stringify(quizData),
      });
    },
    onSuccess: () => {
      toast({ title: "تم إنشاء الكويز بنجاح" });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/quizzes"] });
    },
    onError: () => {
      toast({ title: "حدث خطأ في إنشاء الكويز", variant: "destructive" });
    },
  });

  const filteredUsers = users.filter((user: User) =>
    user.email.toLowerCase().includes(searchEmail.toLowerCase())
  );

  if (!user) {
    return <div>يجب تسجيل الدخول أولاً</div>;
  }

  return (
    <div className="min-h-screen bg-[#0a1128] text-white">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-[#FFD700]">لوحة تحكم الإدمن</h1>
        
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-gray-800">
            <TabsTrigger value="users">
              <Users className="mr-2 h-4 w-4" />
              الطلاب
            </TabsTrigger>
            <TabsTrigger value="content">
              <FileText className="mr-2 h-4 w-4" />
              المحتوى
            </TabsTrigger>
            <TabsTrigger value="quizzes">
              <Brain className="mr-2 h-4 w-4" />
              الكويزات
            </TabsTrigger>
            <TabsTrigger value="tasks">
              <PlusCircle className="mr-2 h-4 w-4" />
              المهام
            </TabsTrigger>
          </TabsList>

          {/* Students Tab */}
          <TabsContent value="users">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-[#FFD700]">إدارة الطلاب ({users.length} طالب)</CardTitle>
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      placeholder="البحث بالإيميل..."
                      value={searchEmail}
                      onChange={(e) => setSearchEmail(e.target.value)}
                      className="pl-10 bg-gray-700 border-gray-600"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div>جاري التحميل...</div>
                ) : (
                  <div className="space-y-4">
                    {filteredUsers.map((student: User) => (
                      <div key={student.id} className="flex items-center justify-between p-4 bg-gray-700 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-semibold">{student.fullName}</h3>
                            {student.isActive ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <XCircle className="h-5 w-5 text-red-500" />
                            )}
                          </div>
                          <p className="text-gray-300">{student.email}</p>
                          <p className="text-sm text-gray-400">{student.studentCode}</p>
                          <div className="flex gap-4 mt-1">
                            <p className="text-sm">الكلية: {student.college}</p>
                            <p className="text-sm">السنة: {student.academicYear}</p>
                            <p className="text-sm">المحافظة: {student.governorate}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <Badge 
                            variant={student.subscriptionPlan === 'free' ? 'secondary' : 'default'} 
                            className="mb-2"
                          >
                            {student.subscriptionPlan === 'free' ? 'مجاني' : 
                             student.subscriptionPlan === 'premium' ? 'بريميوم' : 'VIP'}
                          </Badge>
                          <div className="space-y-1">
                            <Button 
                              size="sm" 
                              variant={student.isActive ? "destructive" : "default"}
                              onClick={() => updateUserPlanMutation.mutate({
                                userId: student.id,
                                isActive: !student.isActive
                              })}
                              disabled={updateUserPlanMutation.isPending}
                            >
                              {student.isActive ? "إلغاء التفعيل" : "تفعيل الخطة"}
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content">
            <div className="grid gap-6">
              {/* Upload Summary Form */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-[#FFD700]">رفع ملخص جديد</CardTitle>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      createSummaryMutation.mutate({
                        title: formData.get("title") as string,
                        content: formData.get("content") as string,
                        week: parseInt(formData.get("week") as string),
                        day: parseInt(formData.get("day") as string),
                        fileUrl: formData.get("fileUrl") as string || undefined,
                      });
                      e.currentTarget.reset();
                    }}
                    className="space-y-4"
                  >
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="title">عنوان الملخص</Label>
                        <Input
                          id="title"
                          name="title"
                          placeholder="عنوان الملخص..."
                          required
                          className="bg-gray-700 border-gray-600"
                        />
                      </div>
                      <div>
                        <Label htmlFor="fileUrl">رابط الملف (اختياري)</Label>
                        <Input
                          id="fileUrl"
                          name="fileUrl"
                          placeholder="https://example.com/file.pdf"
                          className="bg-gray-700 border-gray-600"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="week">الأسبوع</Label>
                        <Select name="week" required>
                          <SelectTrigger className="bg-gray-700 border-gray-600">
                            <SelectValue placeholder="اختر الأسبوع" />
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
                        <Label htmlFor="day">اليوم</Label>
                        <Select name="day" required>
                          <SelectTrigger className="bg-gray-700 border-gray-600">
                            <SelectValue placeholder="اختر اليوم" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 6 }, (_, i) => (
                              <SelectItem key={i + 1} value={(i + 1).toString()}>
                                اليوم {i + 1}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="content">محتوى الملخص</Label>
                      <Textarea
                        id="content"
                        name="content"
                        placeholder="محتوى الملخص..."
                        required
                        className="bg-gray-700 border-gray-600"
                        rows={6}
                      />
                    </div>
                    <Button type="submit" disabled={createSummaryMutation.isPending}>
                      <Upload className="mr-2 h-4 w-4" />
                      {createSummaryMutation.isPending ? "جاري الرفع..." : "رفع الملخص"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Existing Summaries */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-[#FFD700]">الملخصات الموجودة ({summaries.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {summaries.map((summary: any) => (
                      <div key={summary.id} className="p-4 bg-gray-700 rounded-lg">
                        <h3 className="font-semibold">{summary.title}</h3>
                        <p className="text-gray-300">الأسبوع {summary.week} - اليوم {summary.day}</p>
                        {summary.fileUrl && (
                          <a 
                            href={summary.fileUrl} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[#FFD700] text-sm underline"
                          >
                            رابط الملف
                          </a>
                        )}
                        <div className="mt-2 flex gap-2">
                          <Button size="sm" variant="outline">تعديل</Button>
                          <Button size="sm" variant="destructive">حذف</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Quizzes Tab */}
          <TabsContent value="quizzes">
            <div className="grid gap-6">
              {/* Create Quiz Form */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-[#FFD700]">إنشاء كويز جديد</CardTitle>
                </CardHeader>
                <CardContent>
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      const formData = new FormData(e.currentTarget);
                      const isWeekly = formData.get("isWeekly") === "true";
                      
                      // Simple question format
                      const questions = [
                        {
                          question: formData.get("question1") as string,
                          options: [
                            formData.get("q1_option1") as string,
                            formData.get("q1_option2") as string,
                            formData.get("q1_option3") as string,
                            formData.get("q1_option4") as string,
                          ],
                          correct: parseInt(formData.get("q1_correct") as string),
                        }
                      ];

                      createQuizMutation.mutate({
                        title: formData.get("title") as string,
                        week: parseInt(formData.get("week") as string),
                        day: isWeekly ? undefined : parseInt(formData.get("day") as string),
                        isWeekly,
                        questions,
                      });
                      e.currentTarget.reset();
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <Label htmlFor="title">عنوان الكويز</Label>
                      <Input
                        id="title"
                        name="title"
                        placeholder="عنوان الكويز..."
                        required
                        className="bg-gray-700 border-gray-600"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor="week">الأسبوع</Label>
                        <Select name="week" required>
                          <SelectTrigger className="bg-gray-700 border-gray-600">
                            <SelectValue placeholder="اختر الأسبوع" />
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
                        <Label htmlFor="isWeekly">نوع الكويز</Label>
                        <Select name="isWeekly" required>
                          <SelectTrigger className="bg-gray-700 border-gray-600">
                            <SelectValue placeholder="اختر النوع" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="false">كويز يومي</SelectItem>
                            <SelectItem value="true">كويز أسبوعي</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="day">اليوم (للكويز اليومي)</Label>
                        <Select name="day">
                          <SelectTrigger className="bg-gray-700 border-gray-600">
                            <SelectValue placeholder="اختر اليوم" />
                          </SelectTrigger>
                          <SelectContent>
                            {Array.from({ length: 6 }, (_, i) => (
                              <SelectItem key={i + 1} value={(i + 1).toString()}>
                                اليوم {i + 1}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    {/* Simple question form */}
                    <div className="space-y-4 border-t border-gray-600 pt-4">
                      <h4 className="font-semibold text-[#FFD700]">السؤال الأول</h4>
                      <div>
                        <Label htmlFor="question1">نص السؤال</Label>
                        <Input
                          id="question1"
                          name="question1"
                          placeholder="اكتب السؤال هنا..."
                          required
                          className="bg-gray-700 border-gray-600"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="q1_option1">الخيار الأول</Label>
                          <Input
                            id="q1_option1"
                            name="q1_option1"
                            placeholder="الخيار الأول"
                            required
                            className="bg-gray-700 border-gray-600"
                          />
                        </div>
                        <div>
                          <Label htmlFor="q1_option2">الخيار الثاني</Label>
                          <Input
                            id="q1_option2"
                            name="q1_option2"
                            placeholder="الخيار الثاني"
                            required
                            className="bg-gray-700 border-gray-600"
                          />
                        </div>
                        <div>
                          <Label htmlFor="q1_option3">الخيار الثالث</Label>
                          <Input
                            id="q1_option3"
                            name="q1_option3"
                            placeholder="الخيار الثالث"
                            required
                            className="bg-gray-700 border-gray-600"
                          />
                        </div>
                        <div>
                          <Label htmlFor="q1_option4">الخيار الرابع</Label>
                          <Input
                            id="q1_option4"
                            name="q1_option4"
                            placeholder="الخيار الرابع"
                            required
                            className="bg-gray-700 border-gray-600"
                          />
                        </div>
                      </div>
                      <div>
                        <Label htmlFor="q1_correct">الإجابة الصحيحة</Label>
                        <Select name="q1_correct" required>
                          <SelectTrigger className="bg-gray-700 border-gray-600">
                            <SelectValue placeholder="اختر الإجابة الصحيحة" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">الخيار الأول</SelectItem>
                            <SelectItem value="1">الخيار الثاني</SelectItem>
                            <SelectItem value="2">الخيار الثالث</SelectItem>
                            <SelectItem value="3">الخيار الرابع</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <Button type="submit" disabled={createQuizMutation.isPending}>
                      <Brain className="mr-2 h-4 w-4" />
                      {createQuizMutation.isPending ? "جاري الإنشاء..." : "إنشاء الكويز"}
                    </Button>
                  </form>
                </CardContent>
              </Card>

              {/* Existing Quizzes */}
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-[#FFD700]">الكويزات الموجودة ({quizzes.length})</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {quizzes.map((quiz: any) => (
                      <div key={quiz.id} className="p-4 bg-gray-700 rounded-lg">
                        <h3 className="font-semibold">{quiz.title}</h3>
                        <p className="text-gray-300">
                          الأسبوع {quiz.week}
                          {quiz.day ? ` - اليوم ${quiz.day}` : " - كويز أسبوعي"}
                        </p>
                        <div className="mt-2 flex gap-2">
                          <Button size="sm" variant="outline">تعديل</Button>
                          <Button size="sm" variant="destructive">حذف</Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Tasks Tab */}
          <TabsContent value="tasks">
            <Card className="bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-[#FFD700]">إدارة المهام العامة</CardTitle>
                <p className="text-gray-300">المهام التي تضيفها هنا سيتم إرسالها تلقائياً لجميع الطلاب</p>
              </CardHeader>
              <CardContent>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const formData = new FormData(e.currentTarget);
                    createAdminTaskMutation.mutate({
                      title: formData.get("title") as string,
                      description: formData.get("description") as string,
                    });
                    e.currentTarget.reset();
                  }}
                  className="space-y-4 mb-6"
                >
                  <div>
                    <Label htmlFor="title">عنوان المهمة</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="عنوان المهمة..."
                      required
                      className="bg-gray-700 border-gray-600"
                    />
                  </div>
                  <div>
                    <Label htmlFor="description">وصف المهمة</Label>
                    <Textarea
                      id="description"
                      name="description"
                      placeholder="وصف المهمة (اختياري)..."
                      className="bg-gray-700 border-gray-600"
                      rows={3}
                    />
                  </div>
                  <Button type="submit" disabled={createAdminTaskMutation.isPending}>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    {createAdminTaskMutation.isPending ? "جاري الإرسال..." : "إرسال المهمة لجميع الطلاب"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}