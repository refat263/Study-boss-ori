import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, Download, BookOpen } from "lucide-react";

interface WeekCardProps {
  weekNumber: number;
  title: string;
  isCurrentWeek?: boolean;
  onDownloadSummary: (week: number, day: number) => void;
  onTakeQuiz: (week: number, day: number) => void;
  onWeeklyQuiz: (week: number) => void;
}

export default function WeekCard({
  weekNumber,
  title,
  isCurrentWeek = false,
  onDownloadSummary,
  onTakeQuiz,
  onWeeklyQuiz,
}: WeekCardProps) {
  const [isOpen, setIsOpen] = useState(isCurrentWeek);

  const days = [
    { name: "السبت", available: true },
    { name: "الأحد", available: true },
    { name: "الاثنين", available: false },
    { name: "الثلاثاء", available: false },
    { name: "الأربعاء", available: false },
    { name: "الخميس", available: false },
  ];

  return (
    <Card className={`card-hover ${isCurrentWeek ? 'border-[#FFD700] bg-gradient-to-r from-[#FFD700]/5 to-[#FFD700]/10' : ''}`}>
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-gray-50 transition-colors">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                {isCurrentWeek && (
                  <div className="w-3 h-3 bg-[#FFD700] rounded-full animate-pulse"></div>
                )}
                <CardTitle className="text-xl font-bold text-[#0a1128]">
                  الأسبوع {weekNumber} - {title}
                </CardTitle>
              </div>
              <ChevronDown className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </CardHeader>
        </CollapsibleTrigger>
        
        <CollapsibleContent>
          <CardContent className="pt-0">
            {/* Days Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
              {days.map((day, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border transition-all ${
                    day.available
                      ? 'border-gray-200 bg-white hover:border-[#FFD700] hover:shadow-md'
                      : 'border-gray-100 bg-gray-50'
                  }`}
                >
                  <div className="text-sm text-gray-600 mb-3 font-medium">
                    {day.name}
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      size="sm"
                      disabled={!day.available}
                      onClick={() => onDownloadSummary(weekNumber, index + 1)}
                      className={`text-xs ${
                        day.available
                          ? 'bg-[#FFD700] text-[#0a1128] hover:bg-yellow-400'
                          : 'bg-gray-300 text-gray-500'
                      }`}
                    >
                      <Download className="w-3 h-3 ml-1" />
                      ملخص
                    </Button>
                    <Button
                      size="sm"
                      disabled={!day.available}
                      onClick={() => onTakeQuiz(weekNumber, index + 1)}
                      className={`text-xs ${
                        day.available
                          ? 'bg-blue-500 text-white hover:bg-blue-600'
                          : 'bg-gray-300 text-gray-500'
                      }`}
                    >
                      <BookOpen className="w-3 h-3 ml-1" />
                      اختبار
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Weekly Quiz */}
            <div className="pt-4 border-t border-gray-200">
              <Button
                onClick={() => onWeeklyQuiz(weekNumber)}
                className="bg-green-500 text-white hover:bg-green-600 font-medium"
                disabled={weekNumber > 3} // Only allow for completed weeks
              >
                <BookOpen className="w-4 h-4 ml-2" />
                اختبار نهاية الأسبوع
              </Button>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
