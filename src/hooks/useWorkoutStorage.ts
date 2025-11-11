import { useState, useEffect, useCallback } from 'react';

export interface WorkoutDay {
  date: string;
  completedSets: number;
}

const STORAGE_KEY = 'workout_history';

export function useWorkoutStorage() {
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutDay[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setWorkoutHistory(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Failed to load workout history:', error);
    }
    setIsLoaded(true);
  }, []);

  const addWorkout = useCallback(
    (completedSets: number) => {
      const today = new Date().toISOString().split('T')[0];

      setWorkoutHistory((prev) => {
        const updated = [...prev];
        const existingIndex = updated.findIndex((day) => day.date === today);

        if (existingIndex >= 0) {
          updated[existingIndex].completedSets += completedSets;
        } else {
          updated.push({ date: today, completedSets });
        }

        try {
          localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
        } catch (error) {
          console.error('Failed to save workout history:', error);
        }

        return updated;
      });
    },
    []
  );

  const getTodayStats = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    return workoutHistory.find((day) => day.date === today) || { date: today, completedSets: 0 };
  }, [workoutHistory]);

  const getStreak = useCallback(() => {
    if (workoutHistory.length === 0) return 0;

    let streak = 0;
    let currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);

    const sortedDays = [...workoutHistory]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    for (const day of sortedDays) {
      const dayDate = new Date(day.date);
      dayDate.setHours(0, 0, 0, 0);

      if (currentDate.getTime() - dayDate.getTime() === 0 || currentDate.getTime() - dayDate.getTime() === 24 * 60 * 60 * 1000) {
        streak++;
        currentDate = new Date(dayDate);
        currentDate.setDate(currentDate.getDate() - 1);
      } else {
        break;
      }
    }

    return streak;
  }, [workoutHistory]);

  return {
    workoutHistory,
    isLoaded,
    addWorkout,
    getTodayStats,
    getStreak,
  };
}
