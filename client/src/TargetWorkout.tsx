export function TargetWorkout({
  todayProgress,
  targetSets,
  onTargetChange,
}: {
  todayProgress: number;
  targetSets: number;
  onTargetChange: (newTarget: number) => void;
}) {
  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mt-4">
      <h2 className="text-xl font-semibold mb-2">Target Workout</h2>
      <div className="flex items-center justify-between mb-2">
        <span className="text-gray-700 dark:text-gray-200">Daily Target:</span>
        <div className="flex items-center gap-2">
          <button
            onClick={() => onTargetChange(Math.max(1, targetSets - 1))}
            className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
          >
            -
          </button>
          <span className="font-bold text-indigo-600 dark:text-indigo-400">
            {targetSets} sets
          </span>
          <button
            onClick={() => onTargetChange(targetSets + 1)}
            className="px-2 py-1 bg-gray-200 dark:bg-gray-700 rounded"
          >
            +
          </button>
        </div>
      </div>
      <div className="mt-3 w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4 overflow-hidden">
        <div
          className="bg-green-500 h-4 transition-all duration-300"
          style={{ width: `${(todayProgress / targetSets) * 100}%` }}
        ></div>
      </div>
      <div className="mt-2 text-right text-sm text-gray-600 dark:text-gray-300">
        {todayProgress} / {targetSets} sets completed
      </div>
    </div>
  );
}
