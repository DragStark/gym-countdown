import { useEffect, useRef, useState } from "react";

type Phase = "WORK" | "REST";

// Thêm cấu trúc dữ liệu cho bài tập
type Exercise = {
  name: string;
  caloriesPerSet: number; // Lượng calo đốt được cho MỘT set (45s)
};

type GymTimerProps = {
  exercise: Exercise; // Thêm prop bài tập
  onWorkoutComplete?: (totalCalories: number) => void; // Cập nhật callback để trả về tổng calo
};

/**
 * GymTimer - Bộ đếm thời gian và tính toán calo cho bài tập
 *
 * @param {Exercise} exercise - Bài tập
 * @param {function} onWorkoutComplete - Callback khi hoàn thành và truyền tổng calo
 *
 * @returns {JSX.Element} - Giao diện GymTimer
 */

export function GymTimer({
  exercise,
  onWorkoutComplete,
}: GymTimerProps) {
  const TOTAL_SETS = 5;
  const WORK_SECONDS = 45;
  const REST_SECONDS = 15;

  // Lượng calo đốt được mỗi giây trong pha WORK
  const CALORIES_PER_SECOND = exercise.caloriesPerSet / WORK_SECONDS;
  // Khoảng thời gian cập nhật calo (5 giây)
  const CALORIE_UPDATE_INTERVAL = 5;

  const [phase, setPhase] = useState<Phase>("WORK");
  const [seconds, setSeconds] = useState<number>(WORK_SECONDS);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentSet, setCurrentSet] = useState<number>(1);
  const [totalCaloriesBurned, setTotalCaloriesBurned] = useState<number>(0); // State mới cho tổng calo

  const intervalRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

  // --- Hàm phát tiếng bíp (Không thay đổi) ---
  const playBeep = (frequency = 880, duration = 0.15) => {
    try {
      if (!audioCtxRef.current)
        audioCtxRef.current = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
      const ctx = audioCtxRef.current;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = frequency;
      g.gain.value = 0.0001;
      o.connect(g);
      g.connect(ctx.destination);
      const now = ctx.currentTime;
      g.gain.setValueAtTime(0.0001, now);
      g.gain.exponentialRampToValueAtTime(0.2, now + 0.01);
      o.start(now);
      g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      o.stop(now + duration + 0.02);
    } catch (e) {
      const a = new Audio();
      a.src =
        "data:audio/wav;base64,UklGRiQAAABXQVZFZm10IBAAAAABAAEAESsAACJWAAACABAAZGF0YQAAAAA=";
      a.play().catch(() => {});
    }
  };

  // --- useEffect cho Bộ đếm thời gian (Cập nhật logic đếm ngược & calo) ---
  useEffect(() => {
    if (!isRunning) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    intervalRef.current = setInterval(() => {
      setSeconds((s) => {
        const nextSeconds = s - 1;

        // Logic cập nhật calo: chỉ trong pha WORK và mỗi 5 giây
        if (phase === "WORK" && s > 0 && nextSeconds > 0 && nextSeconds % CALORIE_UPDATE_INTERVAL === 0) {
          // Calo đốt trong 5 giây
          const caloriesToAdd = CALORIES_PER_SECOND * CALORIE_UPDATE_INTERVAL;
          // Sử dụng Math.round hoặc toFixed để làm tròn calo
          setTotalCaloriesBurned((prev) => prev + Math.round(caloriesToAdd));
        }
        
        // Xử lý giây cuối cùng của pha WORK (tính toán calo còn lại)
        if (phase === "WORK" && s === 1) {
             const caloriesToAdd = CALORIES_PER_SECOND * 1;
             setTotalCaloriesBurned((prev) => prev + Math.round(caloriesToAdd));
        }

        if (nextSeconds >= 0) return nextSeconds;
        return 0;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning, phase, CALORIES_PER_SECOND]);

  // --- useEffect cho Chuyển pha/Set (Không thay đổi nhiều) ---
  useEffect(() => {
    if (!isRunning || seconds > 0) return;

    playBeep();

    if (phase === "WORK") {
      setPhase("REST");
      setSeconds(REST_SECONDS);
    } else {
      if (currentSet < TOTAL_SETS) {
        setCurrentSet(currentSet + 1);
        setPhase("WORK");
        setSeconds(WORK_SECONDS);
      } else {
        setIsRunning(false);
        // Gọi callback khi hoàn thành và truyền tổng calo
        onWorkoutComplete?.(totalCaloriesBurned); 
      }
    }
  }, [isRunning, seconds, phase, currentSet, TOTAL_SETS, onWorkoutComplete, totalCaloriesBurned]);

  // --- useEffect Clean-up (Không thay đổi) ---
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        try {
          audioCtxRef.current.close();
        } catch (e) {}
      }
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // --- Hàm Xử lý (Cập nhật Reset/Skip để đặt lại Calo) ---
  const toggleStart = () => setIsRunning((r) => !r);

  const reset = () => {
    setIsRunning(false);
    setPhase("WORK");
    setSeconds(WORK_SECONDS);
    setCurrentSet(1);
    setTotalCaloriesBurned(0); // Đặt lại calo
  };

  const skip = () => {
    playBeep();
    if (phase === "WORK") {
      // Khi skip pha WORK, calo của set này đã được tính toán trong useEffect (sẽ tính phần còn lại)
      setPhase("REST");
      setSeconds(REST_SECONDS);
    } else {
      if (currentSet < TOTAL_SETS) {
        setCurrentSet((prev) => prev + 1);
        setPhase("WORK");
        setSeconds(WORK_SECONDS);
      } else {
        setIsRunning(false);
      }
    }
  };

  // --- Tính toán UI ---
  const totalForPhase = phase === "WORK" ? WORK_SECONDS : REST_SECONDS;
  const percent =
    Number(totalForPhase) === 0
      ? 0
      : Math.max(
          0,
          Math.min(
            100,
            Math.round(((totalForPhase - seconds) / totalForPhase) * 100)
          )
        );

  // --- Giao diện (Thêm tên bài tập và Calo) ---
  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <div className="flex flex-col items-start mb-4">
        <h2 className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
          {exercise.name} 🏋️‍♂️
        </h2>
        <div className="text-lg font-medium text-gray-700 dark:text-gray-300">
          Phase:{" "}
          <span className="font-bold">
            {phase === "WORK" ? "TẬP LUYỆN" : "NGHỈ GIẢI LAO"}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        {/* Vòng tròn Timer */}
        <div className="relative flex items-center justify-center">
          <svg viewBox="0 0 120 120" className="w-48 h-48">
            <defs>
              <linearGradient id="g" x1="0%" x2="100%">
                <stop offset="0%" stopColor={phase === 'WORK' ? "#7c3aed" : "#10b981"} />
                <stop offset="100%" stopColor={phase === 'WORK' ? "#06b6d4" : "#34d399"} />
              </linearGradient>
            </defs>
            {/* Đường nền */}
            <circle
              cx="60"
              cy="60"
              r="52"
              strokeWidth="12"
              stroke="#e6e6e6"
              fill="none"
            />
            {/* Đường tiến độ */}
            <circle
              cx="60"
              cy="60"
              r="52"
              strokeWidth="12"
              stroke="url(#g)"
              fill="none"
              strokeDasharray={Math.PI * 2 * 52}
              strokeDashoffset={Math.PI * 2 * 52 * (1 - percent / 100)}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
            />
            {/* Thời gian */}
            <text
              x="60"
              y="64"
              textAnchor="middle"
              className="font-extrabold fill-current text-gray-900 dark:text-gray-100"
              style={{ fontSize: 32 }} // Tăng kích thước font
            >
              {String(seconds).padStart(2, "0")}
            </text>
          </svg>
          <div className="absolute -bottom-6 text-sm text-gray-500 dark:text-gray-300">
            Tổng thời gian: {totalForPhase} giây
          </div>
        </div>

        {/* Thông tin Set và Calo */}
        <div className="flex justify-between w-full mt-4 p-2 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <div className="text-base font-semibold">
                Set: {currentSet} / {TOTAL_SETS}
            </div>
            <div className="text-base font-semibold text-red-500 dark:text-red-400">
                🔥 Calo: {totalCaloriesBurned} kcal
            </div>
        </div>


        {/* Nút điều khiển */}
        <div className="w-full flex items-center gap-3">
          <button
            onClick={toggleStart}
            className={`flex-1 px-4 py-3 rounded-xl shadow-md text-white font-bold transition-colors ${
              isRunning ? "bg-red-500 hover:bg-red-600" : "bg-indigo-600 hover:bg-indigo-700"
            } disabled:opacity-60`}
            disabled={currentSet > TOTAL_SETS}
          >
            {isRunning ? "Tạm Dừng" : "BẮT ĐẦU"}
          </button>
          <button
            onClick={skip}
            className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Bỏ Qua
          </button>
          <button
            onClick={reset}
            className="px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Thiết Lập Lại
          </button>
        </div>
      </div>
    </div>
  );
}