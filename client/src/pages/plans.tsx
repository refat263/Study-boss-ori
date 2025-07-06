import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/layout/navbar";
import { CheckCircle, XCircle } from "lucide-react";

export default function Plans() {
  const plans = [
    {
      id: "basic",
      name: "الباقة الأساسية",
      price: "99 ج.م",
      period: "/شهر",
      description: "للطلاب المبتدئين",
      features: [
        { text: "خطة دراسية كاملة لـ 16 أسبوع", included: true },
        { text: "ملخصات يومية أساسية", included: true },
        { text: "كويزات يومية وأسبوعية", included: true },
        { text: "مؤقت بومودورو", included: true },
        { text: "دعم فني محدود", included: true },
      ],
      buttonText: "اشترك الآن",
      buttonVariant: "outline" as const,
      popular: false,
    },
    {
      id: "premium",
      name: "الباقة المتقدمة",
      price: "199 ج.م",
      period: "/شهر",
      description: "للطلاب الجادين",
      features: [
        { text: "كل مميزات الباقة الأساسية", included: true },
        { text: "ملخصات متقدمة مع ملفات", included: true },
        { text: "كويزات متطورة مع تحليلات", included: true },
        { text: "إدارة مهام ذكية", included: true },
        { text: "دعم فني على مدار الساعة", included: true },
      ],
      buttonText: "اشترك الآن",
      buttonVariant: "default" as const,
      popular: true,
    },
    {
      id: "vip",
      name: "باقة VIP",
      price: "399 ج.م",
      period: "/شهر",
      description: "للطلاب المتفوقين",
      features: [
        { text: "كل مميزات الباقة المتقدمة", included: true },
        { text: "جلسات مراجعة شخصية", included: true },
        { text: "محتوى حصري ومتقدم", included: true },
        { text: "أولوية في الدعم الفني", included: true },
        { text: "شهادة إتمام معتمدة", included: true },
      ],
      buttonText: "اشترك في VIP",
      buttonVariant: "secondary" as const,
      popular: false,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header */}
          <div className="text-center mb-16 animate-fadeInUp">
            <h1 className="text-4xl md:text-5xl font-bold text-[#0a1128] mb-6">
              اختر الباقة 
              <span className="text-[#FFD700]"> المناسبة لك</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              باقات مرنة تناسب احتياجاتك الدراسية وميزانيتك
            </p>
          </div>

          {/* Plans Grid */}
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card 
                key={plan.id}
                className={`card-hover animate-fadeInUp relative ${
                  plan.popular 
                    ? 'border-[#FFD700] bg-gradient-to-br from-[#0a1128] to-[#1e293b] text-white' 
                    : 'border-gray-200'
                }`}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-[#FFD700] text-[#0a1128] px-4 py-1 font-bold">
                      الأكثر شيوعاً
                    </Badge>
                  </div>
                )}
                
                <CardHeader className="text-center pb-4">
                  <CardTitle className={`text-2xl font-bold mb-2 ${plan.popular ? 'text-white' : 'text-[#0a1128]'}`}>
                    {plan.name}
                  </CardTitle>
                  <div className={`text-4xl font-bold mb-4 ${plan.popular ? 'text-[#FFD700]' : 'text-[#0a1128]'}`}>
                    {plan.price}
                    {plan.period && (
                      <span className={`text-lg ${plan.popular ? 'text-gray-300' : 'text-gray-500'}`}>
                        {plan.period}
                      </span>
                    )}
                  </div>
                  <p className={plan.popular ? 'text-gray-300' : 'text-gray-600'}>
                    {plan.description}
                  </p>
                </CardHeader>
                
                <CardContent>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center gap-3">
                        {feature.included ? (
                          <CheckCircle className={`w-5 h-5 ${plan.popular ? 'text-[#FFD700]' : 'text-green-500'}`} />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                        <span className={feature.included ? '' : 'text-gray-400'}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                  
                  <Link href="/register">
                    <Button
                      variant={plan.buttonVariant}
                      className={`w-full py-3 font-medium transition-all duration-300 ${
                        plan.popular
                          ? 'bg-[#FFD700] text-[#0a1128] hover:bg-yellow-400 btn-glow'
                          : plan.buttonVariant === 'outline'
                          ? 'border-[#0a1128] text-[#0a1128] hover:bg-[#0a1128] hover:text-white'
                          : 'bg-gradient-to-r from-[#0a1128] to-[#1e293b] text-white hover:from-[#1e293b] hover:to-[#0a1128]'
                      }`}
                    >
                      {plan.buttonText}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Payment Instructions */}
          <div className="mt-16 text-center">
            <Card className="max-w-2xl mx-auto">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-[#0a1128] mb-6">
                  تعليمات الدفع
                </h3>
                <div className="bg-[#FFD700] bg-opacity-20 border border-[#FFD700] rounded-xl p-6">
                  <p className="text-[#0a1128] leading-relaxed">
                    بعد التسجيل، قم بتحويل المبلغ على رقم فودافون كاش{" "}
                    <span className="font-bold text-[#FFD700] bg-[#0a1128] px-2 py-1 rounded">
                      01234567890
                    </span>
                    ، ثم أرسل إثبات الدفع على واتساب على نفس الرقم لتفعيل حسابك.
                  </p>
                </div>
                
                <div className="mt-6 grid md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">📱</span>
                    <span>واتساب: 01234567890</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">⏰</span>
                    <span>تفعيل خلال 24 ساعة</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">🔒</span>
                    <span>دفع آمن ومضمون</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
