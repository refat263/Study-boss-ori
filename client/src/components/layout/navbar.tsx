import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";

export default function Navbar() {
  const [location] = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b-2 border-[#FFD700] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo Section */}
          <Link href="/">
            <div className="flex items-center space-x-4 space-x-reverse cursor-pointer">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-gradient-to-br from-[#FFD700] to-yellow-500 rounded-lg flex items-center justify-center">
                  <span className="text-[#0a1128] font-bold text-lg">👑</span>
                </div>
                <span className="mr-3 text-xl font-bold text-[#0a1128]">Study Boss</span>
              </div>
            </div>
          </Link>
          
          {/* Navigation Links */}
          <div className="hidden md:flex items-center space-x-8 space-x-reverse">
            <Link href="/">
              <a className={`transition-colors duration-300 font-medium ${
                location === "/" ? "text-[#FFD700]" : "text-[#0a1128] hover:text-[#FFD700]"
              }`}>
                الرئيسية
              </a>
            </Link>
            <Link href="/plans">
              <a className={`transition-colors duration-300 font-medium ${
                location === "/plans" ? "text-[#FFD700]" : "text-[#0a1128] hover:text-[#FFD700]"
              }`}>
                الباقات
              </a>
            </Link>
            {user && (
              <Link href="/dashboard">
                <a className={`transition-colors duration-300 font-medium ${
                  location === "/dashboard" ? "text-[#FFD700]" : "text-[#0a1128] hover:text-[#FFD700]"
                }`}>
                  لوحة التحكم
                </a>
              </Link>
            )}
          </div>
          
          {/* Auth Section */}
          <div className="flex items-center">
            {user ? (
              <div className="flex items-center gap-4">
                <span className="text-[#0a1128] font-medium">
                  مرحباً {user.email}
                </span>
                <Button
                  onClick={handleLogout}
                  variant="outline"
                  className="border-[#0a1128] text-[#0a1128] hover:bg-[#0a1128] hover:text-white"
                >
                  تسجيل الخروج
                </Button>
              </div>
            ) : (
              <Link href="/login">
                <Button className="bg-[#0a1128] text-white hover:bg-opacity-90">
                  تسجيل الدخول
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
