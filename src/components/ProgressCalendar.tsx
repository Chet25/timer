import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useMemo } from 'react';

interface WorkoutDay {
  date: string;
  completedSets: number;
}

interface ProgressCalendarProps {
  workoutHistory: WorkoutDay[];
}

export function ProgressCalendar({ workoutHistory }: ProgressCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const workoutMap = useMemo(() => {
    const map = new Map<string, number>();
    workoutHistory.forEach((day) => {
      map.set(day.date, day.completedSets);
    });
    return map;
  }, [workoutHistory]);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const days = Array.from({ length: getDaysInMonth(currentMonth) }, (_, i) => i + 1);
  const firstDay = getFirstDayOfMonth(currentMonth);
  const blanks = Array(firstDay).fill(null);

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const getDateString = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date.toISOString().split('T')[0];
  };

  const getIntensity = (sets: number) => {
    if (sets === 0) return '';
    if (sets <= 2) return 'bg-emerald-900/40';
    if (sets <= 4) return 'bg-emerald-700/60';
    if (sets <= 6) return 'bg-emerald-600/80';
    return 'bg-emerald-500';
  };

  const monthName = currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">{monthName}</h2>
        <div className="flex gap-2">
          <button
            onClick={handlePrevMonth}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} className="text-white" />
          </button>
          <button
            onClick={handleNextMonth}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          >
            <ChevronRight size={20} className="text-white" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2 mb-4">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="text-center text-xs font-semibold text-white/60 py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {blanks.map((_, i) => (
          <div key={`blank-${i}`} className="aspect-square" />
        ))}
        {days.map((day) => {
          const dateStr = getDateString(day);
          const sets = workoutMap.get(dateStr) || 0;
          const intensity = getIntensity(sets);

          return (
            <div
              key={day}
              className={`aspect-square flex flex-col items-center justify-center rounded-lg text-sm font-semibold transition-all ${
                intensity
                  ? `${intensity} text-white border border-emerald-400/30`
                  : 'bg-white/5 text-white/40 border border-white/10'
              }`}
              title={sets > 0 ? `${sets} set${sets !== 1 ? 's' : ''}` : 'No workout'}
            >
              {day}
            </div>
          );
        })}
      </div>

      <div className="mt-6 pt-4 border-t border-white/20">
        <p className="text-xs text-white/60 mb-3">Intensity:</p>
        <div className="grid grid-cols-4 gap-2 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-emerald-900/40 rounded border border-emerald-400/30"></div>
            <span className="text-white/60">1-2</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-emerald-700/60 rounded border border-emerald-400/30"></div>
            <span className="text-white/60">3-4</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-emerald-600/80 rounded border border-emerald-400/30"></div>
            <span className="text-white/60">5-6</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-emerald-500 rounded border border-emerald-400/30"></div>
            <span className="text-white/60">7+</span>
          </div>
        </div>
      </div>
    </div>
  );
}
