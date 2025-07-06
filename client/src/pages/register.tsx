import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Navbar from "@/components/layout/navbar";

export default function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    college: "",
    academicYear: "",
    governorate: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const { signUp } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const egyptianGovernorates = [
    "القاهرة", "الجيزة", "الإسكندرية", "أسوان", "أسيوط", "البحيرة", "بني سويف",
    "البحر الأحمر", "الدقهلية", "دمياط", "الفيوم", "الغربية", "الإسماعيلية",
    "كفر الشيخ", "الأقصر", "مطروح", "المنيا", "المنوفية", "الوادي الجديد",
    "شمال سيناء", "بورسعيد", "القليوبية", "قنا", "البحر الأحمر", "الشرقية",
    "سوهاج", "جنوب سيناء", "السويس"
  ];

  const academicYears = [
    "السنة الأولى", "السنة الثانية", "السنة الثالثة", "السنة الرابعة", "السنة الخامسة"
  ];

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const generateStudentCode = () => {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `STB-${year}-${random}`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "خطأ في كلمة المرور",
        description: "كلمة المرور وتأكيد كلمة المرور غير متطابقتين",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Create Firebase account
      await signUp(formData.email, formData.password);
      
      // Create user record in our database
      const studentCode = generateStudentCode();
      await apiRequest("POST", "/api/users", {
        ...formData,
        studentCode,
        planType: "free",
        isActive: false,
      });

      setShowSuccess(true);
      
      toast({
        title: "تم التسجيل بنجاح",
        description: "تم إنشاء حسابك بنجاح. يرجى اتباع تعليمات الدفع لتفعيل حسابك.",
      });

    } catch (error: any) {
      toast({
        title: "خطأ في التسجيل",
        description: error.message || "حدث خطأ أثناء التسجيل. يرجى المحاولة مرة أخرى.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (showSuccess) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        
        <div className="flex items-center justify-center py-20 px-4">
          <Card className="w-full max-w-2xl">
            <CardHeader className="text-center">
              <CardTitle className="text-3xl font-bold text-[#0a1128] mb-4">
                تم التسجيل بنجاح! 🎉
              </CardTitle>
            </CardHeader>
            
            <CardContent className="text-center space-y-6">
              <div className="bg-[#FFD700] bg-opacity-20 border border-[#FFD700] rounded-xl p-6">
                <h3 className="text-xl font-bold text-[#0a1128] mb-4">
                  تعليمات تفعيل الحساب
                </h3>
                <p className="text-[#0a1128] leading-relaxed mb-4">
                  قم بتحويل المبلغ على رقم فودافون كاش{" "}
                  <span className="font-bold text-[#FFD700] bg-[#0a1128] px-2 py-1 rounded">
                    01234567890
                  </span>
                  ، ثم أرسل إثبات الدفع على واتساب على نفس الرقم مع ذكر البريد الإلكتروني المسجل به.
                </p>
                <p className="text-sm text-gray-600">
                  سيتم تفعيل حسابك خلال 24 ساعة من استلام إثبات الدفع.
                </p>
              </div>
              
              <div className="space-y-4">
                <Button
                  onClick={() => setLocation("/login")}
                  className="w-full bg-[#0a1128] hover:bg-opacity-90 text-white"
                >
                  انتقل إلى صفحة تسجيل الدخول
                </Button>
                
                <Button
                  variant="outline"
                  onClick={() => setLocation("/")}
                  className="w-full border-[#0a1128] text-[#0a1128] hover:bg-[#0a1128] hover:text-white"
                >
                  العودة إلى الرئيسية
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex items-center justify-center py-20 px-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-[#0a1128]">
              إنشاء حساب جديد
            </CardTitle>
            <p className="text-gray-600 mt-2">
              أكمل البيانات التالية لإنشاء حسابك في Study Boss
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fullName" className="text-right block mb-2">
                    الاسم الكامل *
                  </Label>
                  <Input
                    id="fullName"
                    value={formData.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    placeholder="أدخل اسمك الكامل"
                    required
                    className="text-right"
                  />
                </div>
                
                <div>
                  <Label htmlFor="email" className="text-right block mb-2">
                    البريد الإلكتروني *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    placeholder="your@email.com"
                    required
                    className="text-right"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone" className="text-right block mb-2">
                    رقم الهاتف *
                  </Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    placeholder="01234567890"
                    required
                    className="text-right"
                  />
                </div>
                
                <div>
                  <Label htmlFor="college" className="text-right block mb-2">
                    الكلية *
                  </Label>
                  <Input
                    id="college"
                    value={formData.college}
                    onChange={(e) => handleChange("college", e.target.value)}
                    placeholder="كلية الهندسة"
                    required
                    className="text-right"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label className="text-right block mb-2">
                    السنة الدراسية *
                  </Label>
                  <Select onValueChange={(value) => handleChange("academicYear", value)}>
                    <SelectTrigger className="text-right">
                      <SelectValue placeholder="اختر السنة الدراسية" />
                    </SelectTrigger>
                    <SelectContent>
                      {academicYears.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <Label className="text-right block mb-2">
                    المحافظة *
                  </Label>
                  <Select onValueChange={(value) => handleChange("governorate", value)}>
                    <SelectTrigger className="text-right">
                      <SelectValue placeholder="اختر المحافظة" />
                    </SelectTrigger>
                    <SelectContent>
                      {egyptianGovernorates.map((gov) => (
                        <SelectItem key={gov} value={gov}>
                          {gov}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password" className="text-right block mb-2">
                    كلمة المرور *
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    placeholder="••••••••"
                    required
                    className="text-right"
                  />
                </div>
                
                <div>
                  <Label htmlFor="confirmPassword" className="text-right block mb-2">
                    تأكيد كلمة المرور *
                  </Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) => handleChange("confirmPassword", e.target.value)}
                    placeholder="••••••••"
                    required
                    className="text-right"
                  />
                </div>
              </div>
              
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0a1128] hover:bg-opacity-90 text-white py-3"
              >
                {loading ? "جاري إنشاء الحساب..." : "إنشاء حساب"}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                لديك حساب بالفعل؟{" "}
                <Link href="/login">
                  <a className="text-[#FFD700] hover:underline font-medium">
                    سجل الدخول
                  </a>
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
