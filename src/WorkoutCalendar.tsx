export function WorkoutCalendar({
  completedDates,
  progressByDate,
}: {
  completedDates: string[];
  progressByDate: Record<string, number>;
}) {
  const today = new Date().toISOString().split("T")[0];
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();
  const monthName = now.toLocaleString("default", { month: "long" });
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mt-6">
      <h2 className="text-xl font-semibold mb-2">Workout Calendar</h2>
      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
        {monthName} {year}
      </p>
      <div className="grid grid-cols-7 gap-2">
        {days.map((d) => {
          const dateStr = `${year}-${String(month + 1).padStart(
            2,
            "0"
          )}-${String(d).padStart(2, "0")}`;
          const completed = completedDates.includes(dateStr);
          const isToday = dateStr === today;
          const progress = progressByDate[dateStr] || 0;

          return (
            <div
              key={d}
              className={`group relative flex items-center justify-center h-10 w-10 rounded-full text-sm font-medium cursor-default border transition-colors duration-200 ${
                completed
                  ? "bg-green-500 text-white"
                  : isToday
                  ? "border-indigo-600 text-indigo-600"
                  : "border-gray-300 dark:border-gray-600 text-gray-800 dark:text-gray-200"
              }`}
            >
              {completed ? "✓" : d}
              <div className="absolute bottom-[-1.5rem] left-1/2 -translate-x-1/2 text-xs text-gray-600 dark:text-gray-300 opacity-0 group-hover:opacity-100 pointer-events-none">
                {progress} sets
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
