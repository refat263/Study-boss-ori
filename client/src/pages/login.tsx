import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import Navbar from "@/components/layout/navbar";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn } = useAuth();
  const { toast } = useToast();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signIn(email, password);
      toast({
        title: "تم تسجيل الدخول بنجاح",
        description: "مرحباً بك في Study Boss",
      });
      setLocation("/dashboard");
    } catch (error: any) {
      toast({
        title: "خطأ في تسجيل الدخول",
        description: error.message || "تأكد من البريد الإلكتروني وكلمة المرور",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="flex items-center justify-center py-20 px-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold text-[#0a1128]">
              تسجيل الدخول
            </CardTitle>
            <p className="text-gray-600 mt-2">
              أدخل بياناتك للوصول إلى حسابك
            </p>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="email" className="text-right block mb-2">
                  البريد الإلكتروني
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  required
                  className="text-right"
                />
              </div>
              
              <div>
                <Label htmlFor="password" className="text-right block mb-2">
                  كلمة المرور
                </Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="text-right"
                />
              </div>
              
              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-[#0a1128] hover:bg-opacity-90 text-white py-3"
              >
                {loading ? "جاري تسجيل الدخول..." : "تسجيل الدخول"}
              </Button>
            </form>
            
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                ليس لديك حساب؟{" "}
                <Link href="/register">
                  <a className="text-[#FFD700] hover:underline font-medium">
                    سجل الآن
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
