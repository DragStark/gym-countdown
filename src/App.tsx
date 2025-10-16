import { useEffect, useState } from "react";
import { WorkoutCalendar } from "./WorkoutCalendar";
import { GymTimer } from "./GymTimer";
import { TargetWorkout } from "./TargetWorkout";

export default function GymPage() {
  const [completedDates, setCompletedDates] = useState<string[]>([]);
  const [progressByDate, setProgressByDate] = useState<Record<string, number>>(
    {}
  );
  const [targetSets, setTargetSets] = useState<number>(5);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const savedProgress = localStorage.getItem("progressByDate");
    const savedTarget = localStorage.getItem("targetSets");
    if (savedProgress) setProgressByDate(JSON.parse(savedProgress));
    if (savedTarget) setTargetSets(Number(savedTarget));
  }, []);

  useEffect(() => {
    localStorage.setItem("progressByDate", JSON.stringify(progressByDate));
  }, [progressByDate]);

  useEffect(() => {
    localStorage.setItem("targetSets", targetSets.toString());
  }, [targetSets]);

  const handleWorkoutComplete = () => {
    const todayProgress = progressByDate[today] || 0;
    const updatedProgress = {
      ...progressByDate,
      [today]: Math.min(todayProgress + 1, targetSets),
    };
    setProgressByDate(updatedProgress);

    if (todayProgress + 1 === targetSets && !completedDates.includes(today)) {
      setCompletedDates([...completedDates, today]);
    }
  };

  return (
    <div className="min-h-screen flex flex-row items-start justify-center gap-6 bg-gray-50 dark:bg-gray-900 p-6">
      <div className="w-1/2 flex flex-col items-center">
        <WorkoutCalendar
          completedDates={completedDates}
          progressByDate={progressByDate}
        />
        <TargetWorkout
          todayProgress={progressByDate[today] || 0}
          targetSets={targetSets}
          onTargetChange={setTargetSets}
        />
      </div>
      <div className="w-1/2 flex justify-center">
        <GymTimer
          totalSets={targetSets}
          onWorkoutComplete={handleWorkoutComplete}
        />
      </div>
    </div>
  );
}
