import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Navbar from "@/components/layout/navbar";
import studyBossLogo from "@assets/studyboss_banner_vertical_framed_1751788405411.jpg";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 overflow-x-hidden">
      <Navbar />
      
      {/* Hero Section */}
      <section className="hero-bg min-h-screen flex items-center relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-64 h-64 bg-[#FFD700] rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute top-40 right-10 w-64 h-64 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 left-1/2 w-64 h-64 bg-[#FFD700] rounded-full mix-blend-multiply filter blur-xl animate-pulse"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            
            {/* Content Column */}
            <div className="text-center lg:text-right animate-fadeInUp">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                <span className="text-glow">مشكلتك مش في المذاكرة...</span>
                <br />
                <span className="text-[#FFD700] text-glow">مشكلتك في إنك تبدأ صح</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-300 mb-8 leading-relaxed">
                وده دورنا إحنا 💪
              </p>
              
              <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed">
                من غير توتر، Study Boss هينظملك الترم كله من أول محاضرة لحد آخر سؤال في الفاينال.
              </p>
              
              {/* CTA Button */}
              <div className="mb-8">
                <Link href="/plans">
                  <Button className="inline-flex items-center px-8 py-4 bg-[#FFD700] text-[#0a1128] text-xl font-bold rounded-full btn-glow animate-pulse-gold hover:scale-105 transition-all duration-300">
                    <span className="mr-3">🚀</span>
                    ابدأ الآن
                    <span className="mr-3">←</span>
                  </Button>
                </Link>
              </div>
              
              {/* Goal Box */}
              <div className="border-2 border-[#FFD700] bg-[#0a1128] bg-opacity-20 backdrop-blur-sm rounded-xl p-6 animate-fadeIn">
                <p className="text-white text-lg leading-relaxed">
                  <span className="text-[#FFD700] font-bold">هدفنا:</span>
                  نكلم الطالب بلغته ونوفر احتياجاته من بيئة متكاملة ليه كطالب جامعي
                </p>
              </div>
            </div>
            
            {/* Logo Column */}
            <div className="text-center animate-fadeInUp">
              <div className="relative inline-block">
                {/* Glow Effect Background */}
                <div className="absolute inset-0 bg-[#FFD700] opacity-20 rounded-3xl filter blur-2xl animate-glow"></div>
                
                {/* Main Logo Image */}
                <img 
                  src={studyBossLogo}
                  alt="Study Boss Logo" 
                  className="relative z-10 w-full max-w-md mx-auto rounded-3xl glow-effect shadow-2xl animate-glow"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center mb-16 animate-fadeInUp">
            <h2 className="text-4xl md:text-5xl font-bold text-[#0a1128] mb-6">
              ليه تختار 
              <span className="text-[#FFD700]"> Study Boss</span>؟
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              منصة متكاملة تجمع كل احتياجاتك الدراسية في مكان واحد بطريقة منظمة وذكية
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            <Card className="card-hover animate-fadeInUp">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-[#FFD700] to-yellow-500 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-3xl">📅</span>
                </div>
                <h3 className="text-2xl font-bold text-[#0a1128] mb-4">خطة دراسية ذكية</h3>
                <p className="text-gray-600 leading-relaxed">
                  تنظيم الترم كله في 16 أسبوع بخطة مرنة تناسب جدولك وتخصصك الدراسي
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover animate-fadeInUp">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-3xl">📚</span>
                </div>
                <h3 className="text-2xl font-bold text-[#0a1128] mb-4">ملخصات يومية</h3>
                <p className="text-gray-600 leading-relaxed">
                  ملخصات مركزة ومنظمة لكل محاضرة مع إمكانية التحميل والمراجعة السريعة
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover animate-fadeInUp">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-3xl">🧠</span>
                </div>
                <h3 className="text-2xl font-bold text-[#0a1128] mb-4">اختبارات تفاعلية</h3>
                <p className="text-gray-600 leading-relaxed">
                  اختبارات يومية وأسبوعية لقياس مستواك وتحسين نقاط الضعف
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover animate-fadeInUp">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-3xl">✅</span>
                </div>
                <h3 className="text-2xl font-bold text-[#0a1128] mb-4">إدارة المهام</h3>
                <p className="text-gray-600 leading-relaxed">
                  قوائم مهام شخصية مع مهام إدارية لضمان عدم تفويت أي شيء مهم
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover animate-fadeInUp">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-3xl">⏱️</span>
                </div>
                <h3 className="text-2xl font-bold text-[#0a1128] mb-4">مؤقت بومودورو</h3>
                <p className="text-gray-600 leading-relaxed">
                  تقنية مجربة لزيادة التركيز والإنتاجية مع تتبع الجلسات اليومية
                </p>
              </CardContent>
            </Card>

            <Card className="card-hover animate-fadeInUp">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-[#FFD700] to-yellow-500 rounded-2xl flex items-center justify-center mb-6">
                  <span className="text-3xl">📊</span>
                </div>
                <h3 className="text-2xl font-bold text-[#0a1128] mb-4">تتبع التقدم</h3>
                <p className="text-gray-600 leading-relaxed">
                  رؤية واضحة لتقدمك الأسبوعي والشهري مع تحليلات تساعدك على التحسن
                </p>
              </CardContent>
            </Card>

          </div>
        </div>
      </section>

      {/* Dashboard Preview Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-[#0a1128] to-[#1e2937]">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              شوف شكل <span className="text-[#FFD700]">لوحة التحكم</span> بتاعتك
            </h2>
            <p className="text-xl text-gray-300">
              ده مثال على الواجهة اللي هتستخدمها كل يوم في رحلتك الدراسية
            </p>
          </div>

          {/* Dashboard Mock */}
          <div className="bg-[#0a1128] border-2 border-[#FFD700]/30 rounded-2xl p-6 shadow-2xl">
            {/* Mock Header */}
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-600">
              <div>
                <h3 className="text-2xl font-bold text-white">مرحباً أحمد! 👋</h3>
                <p className="text-gray-300">أسبوع 5 من 16 - كلية الهندسة</p>
              </div>
              <div className="flex gap-4">
                <div className="bg-green-500/20 border border-green-500 rounded-lg px-4 py-2">
                  <p className="text-green-400 text-sm">المهام المكتملة</p>
                  <p className="text-green-300 text-xl font-bold">12/15</p>
                </div>
                <div className="bg-[#FFD700]/20 border border-[#FFD700] rounded-lg px-4 py-2">
                  <p className="text-[#FFD700] text-sm">التقدم الأسبوعي</p>
                  <p className="text-[#FFD700] text-xl font-bold">80%</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Week Progress */}
              <div className="bg-gray-800 rounded-xl p-6">
                <h4 className="text-[#FFD700] font-bold text-lg mb-4">الأسبوع الحالي</h4>
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5, 6].map((day) => (
                    <div key={day} className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        day <= 4 ? 'bg-green-500 text-white' : day === 5 ? 'bg-[#FFD700] text-[#0a1128]' : 'bg-gray-600 text-gray-300'
                      }`}>
                        {day}
                      </div>
                      <div className="flex-1">
                        <p className={`text-sm ${day <= 4 ? 'text-green-300' : day === 5 ? 'text-[#FFD700]' : 'text-gray-400'}`}>
                          {day <= 4 ? '✓ مكتمل' : day === 5 ? 'جاري العمل...' : 'لم يبدأ'}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Today's Tasks */}
              <div className="bg-gray-800 rounded-xl p-6">
                <h4 className="text-[#FFD700] font-bold text-lg mb-4">مهام اليوم</h4>
                <div className="space-y-3">
                  <div className="flex items-center gap-3 p-3 bg-green-500/10 border border-green-500 rounded-lg">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                    <span className="text-green-300 line-through">مراجعة ملخص الفيزياء</span>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-[#FFD700]/10 border border-[#FFD700] rounded-lg">
                    <div className="w-5 h-5 bg-[#FFD700] rounded-full"></div>
                    <span className="text-[#FFD700] font-bold">مهمة إدارية</span>
                    <span className="text-white">حل كويز الرياضيات</span>
                  </div>
                  
                  <div className="flex items-center gap-3 p-3 bg-gray-700 border border-gray-600 rounded-lg">
                    <div className="w-5 h-5 border-2 border-gray-500 rounded-full"></div>
                    <span className="text-gray-300">مراجعة محاضرة الكيمياء</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pomodoro Timer Mock */}
            <div className="mt-6 bg-gray-800 rounded-xl p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-[#FFD700] font-bold text-lg">مؤقت بومودورو</h4>
                  <p className="text-gray-300">ركز 25 دقيقة، استريح 5 دقائق</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-3xl font-bold text-[#FFD700]">15:23</p>
                    <p className="text-gray-400 text-sm">متبقي</p>
                  </div>
                  <button className="bg-[#FFD700] text-[#0a1128] px-6 py-2 rounded-lg font-bold">
                    إيقاف مؤقت
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link href="/plans">
              <Button className="bg-[#FFD700] text-[#0a1128] hover:bg-yellow-400 text-lg px-8 py-3 font-bold">
                ابدأ رحلتك الدراسية الآن
                <span className="mr-3">←</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#0a1128] text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            
            {/* Logo & Description */}
            <div className="md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-[#FFD700] to-yellow-500 rounded-lg flex items-center justify-center ml-3">
                  <span className="text-[#0a1128] font-bold text-xl">👑</span>
                </div>
                <span className="text-2xl font-bold">Study Boss</span>
              </div>
              <p className="text-gray-300 leading-relaxed mb-6">
                منصة تعليمية مصرية متخصصة في مساعدة طلاب الجامعات على تنظيم دراستهم وتحقيق أهدافهم الأكاديمية بطريقة ذكية ومنظمة.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-lg mb-4">روابط سريعة</h4>
              <ul className="space-y-3">
                <li><Link href="/"><a className="text-gray-300 hover:text-[#FFD700] transition-colors">الرئيسية</a></Link></li>
                <li><Link href="/plans"><a className="text-gray-300 hover:text-[#FFD700] transition-colors">الباقات</a></Link></li>
                <li><Link href="/login"><a className="text-gray-300 hover:text-[#FFD700] transition-colors">تسجيل الدخول</a></Link></li>
              </ul>
            </div>

            {/* Support */}
            <div>
              <h4 className="font-bold text-lg mb-4">الدعم</h4>
              <ul className="space-y-3">
                <li><a href="#" className="text-gray-300 hover:text-[#FFD700] transition-colors">الأسئلة الشائعة</a></li>
                <li><a href="#" className="text-gray-300 hover:text-[#FFD700] transition-colors">تواصل معنا</a></li>
                <li><a href="#" className="text-gray-300 hover:text-[#FFD700] transition-colors">سياسة الخصوصية</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8 text-center">
            <p className="text-gray-400">
              © 2025 Study Boss. جميع الحقوق محفوظة. 
              <span className="text-[#FFD700]"> صُنع بـ ❤️ للطلاب المصريين</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
