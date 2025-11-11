import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw } from 'lucide-react';

function App() {
  const [sessionTime, setSessionTime] = useState(40);
  const [breakTime, setBreakTime] = useState(10);
  const [iterations, setIterations] = useState(6);
  const [isRunning, setIsRunning] = useState(false);
  const [currentIteration, setCurrentIteration] = useState(1);
  const [isBreak, setIsBreak] = useState(false);
  const [timeLeft, setTimeLeft] = useState(40);
  const [completedSets, setCompletedSets] = useState(0);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    if (isRunning) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            if (isBreak) {
              if (currentIteration >= iterations) {
                setIsRunning(false);
                setCompletedSets((c) => c + 1);
                setCurrentIteration(1);
                setIsBreak(false);
                return sessionTime;
              } else {
                setCurrentIteration((i) => i + 1);
                setIsBreak(false);
                return sessionTime;
              }
            } else {
              if (currentIteration === iterations) {
                setCompletedSets((c) => c + 1);
                setCurrentIteration(1);
                setIsBreak(false);
                setIsRunning(false);
                return sessionTime;
              } else {
                setIsBreak(true);
                return breakTime;
              }
            }
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, isBreak, currentIteration, iterations, sessionTime, breakTime]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setCurrentIteration(1);
    setIsBreak(false);
    setTimeLeft(sessionTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = isBreak
    ? ((breakTime - timeLeft) / breakTime) * 100
    : ((sessionTime - timeLeft) / sessionTime) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-white/20">
          <h1 className="text-4xl font-bold text-white text-center mb-8">
            Interval Timer
          </h1>

          {!isRunning && currentIteration === 1 && !isBreak && (
            <div className="space-y-6 mb-8">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Session Time (seconds)
                </label>
                <input
                  type="number"
                  value={sessionTime}
                  onChange={(e) => {
                    const val = parseInt(e.target.value) || 1;
                    setSessionTime(val);
                    setTimeLeft(val);
                  }}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Break Time (seconds)
                </label>
                <input
                  type="number"
                  value={breakTime}
                  onChange={(e) => setBreakTime(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                  min="1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">
                  Iterations
                </label>
                <input
                  type="number"
                  value={iterations}
                  onChange={(e) => setIterations(parseInt(e.target.value) || 1)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white text-lg focus:outline-none focus:ring-2 focus:ring-emerald-400 focus:border-transparent"
                  min="1"
                />
              </div>
            </div>
          )}

          <div className="mb-8">
            <div className="relative w-64 h-64 mx-auto mb-6">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="128"
                  cy="128"
                  r="112"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="16"
                  fill="none"
                />
                <circle
                  cx="128"
                  cy="128"
                  r="112"
                  stroke={isBreak ? '#fbbf24' : '#10b981'}
                  strokeWidth="16"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 112}`}
                  strokeDashoffset={`${2 * Math.PI * 112 * (1 - progress / 100)}`}
                  strokeLinecap="round"
                  className="transition-all duration-300"
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="text-6xl font-bold text-white mb-2">
                  {formatTime(timeLeft)}
                </div>
                <div className={`text-sm font-medium uppercase tracking-wider ${isBreak ? 'text-amber-400' : 'text-emerald-400'}`}>
                  {isBreak ? 'Break' : 'Session'}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4 mb-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{currentIteration}</div>
                <div className="text-xs text-white/60 uppercase tracking-wider">Current</div>
              </div>
              <div className="text-white/40 text-2xl">/</div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white/70">{iterations}</div>
                <div className="text-xs text-white/60 uppercase tracking-wider">Total</div>
              </div>
            </div>

            {completedSets > 0 && (
              <div className="text-center mb-6">
                <div className="inline-block bg-emerald-500/20 border border-emerald-400/30 rounded-full px-4 py-2">
                  <span className="text-emerald-400 font-semibold">
                    {completedSets} {completedSets === 1 ? 'Set' : 'Sets'} Completed
                  </span>
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-3">
            {!isRunning ? (
              <button
                onClick={handleStart}
                className="flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-emerald-500/50"
              >
                <Play size={20} />
                Start
              </button>
            ) : (
              <button
                onClick={handlePause}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-amber-500/50"
              >
                <Pause size={20} />
                Pause
              </button>
            )}
            <button
              onClick={handleReset}
              className="bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-200 flex items-center justify-center border border-white/20"
            >
              <RotateCcw size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
