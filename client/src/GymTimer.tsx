import { useEffect, useRef, useState } from "react";

type Phase = "WORK" | "REST";

type GymTimerProps = {
  totalSets?: number;
  onWorkoutComplete?: () => void;
};

export function GymTimer({ totalSets = 5, onWorkoutComplete }: GymTimerProps) {
  const WORK_SECONDS = 45;
  const REST_SECONDS = 15;

  const [phase, setPhase] = useState<Phase>("WORK");
  const [seconds, setSeconds] = useState<number>(WORK_SECONDS);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentSet, setCurrentSet] = useState<number>(1);

  const intervalRef = useRef<number | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);

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
        if (s > 0) return s - 1;
        return 0;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [isRunning]);

  useEffect(() => {
    if (!isRunning || seconds > 0) return;

    playBeep();

    if (phase === "WORK") {
      setPhase("REST");
      setSeconds(REST_SECONDS);
    } else {
      if (currentSet < totalSets) {
        setCurrentSet(currentSet + 1); 
        setPhase("WORK");
        setSeconds(WORK_SECONDS);
      } else {
        setIsRunning(false);
        onWorkoutComplete?.();
      }
    }
  }, [isRunning, seconds, phase, currentSet, totalSets, onWorkoutComplete]);

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

  const toggleStart = () => setIsRunning((r) => !r);
  const reset = () => {
    setIsRunning(false);
    setPhase("WORK");
    setSeconds(WORK_SECONDS);
    setCurrentSet(1);
  };
  const skip = () => {
    playBeep();
    if (phase === "WORK") {
      setPhase("REST");
      setSeconds(REST_SECONDS);
    } else {
      if (currentSet < totalSets) {
        setCurrentSet((prev) => prev + 1);
        setPhase("WORK");
        setSeconds(WORK_SECONDS);
      } else {
        setIsRunning(false);
      }
    }
  };

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

  return (
    <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">Gym Interval Timer</h2>
        <div className="text-sm text-gray-500 dark:text-gray-300">
          Phase: <span className="font-medium">{phase}</span>
        </div>
      </div>

      <div className="flex flex-col items-center gap-4">
        <div className="relative flex items-center justify-center">
          <svg viewBox="0 0 120 120" className="w-48 h-48">
            <defs>
              <linearGradient id="g" x1="0%" x2="100%">
                <stop offset="0%" stopColor="#7c3aed" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
            <circle
              cx="60"
              cy="60"
              r="52"
              strokeWidth="12"
              stroke="#e6e6e6"
              fill="none"
            />
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
            <text
              x="60"
              y="64"
              textAnchor="middle"
              className="text-2xl font-bold fill-current text-gray-900 dark:text-gray-100"
              style={{ fontSize: 28 }}
            >
              {String(seconds).padStart(2, "0")}
            </text>
          </svg>
          <div className="absolute -bottom-6 text-sm text-gray-500 dark:text-gray-300">
            {totalForPhase} seconds
          </div>
        </div>

        <div className="text-lg font-semibold mt-2">
          Set {currentSet} / {totalSets}
        </div>

        <div className="w-full flex items-center gap-3">
          <button
            onClick={toggleStart}
            className="flex-1 px-4 py-2 rounded-lg shadow-sm text-white font-medium bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60"
            disabled={currentSet > totalSets}
          >
            {isRunning ? "Pause" : "Start"}
          </button>
          <button
            onClick={skip}
            className="px-4 py-2 rounded-lg border dark:border-gray-700"
          >
            Skip
          </button>
          <button
            onClick={reset}
            className="px-4 py-2 rounded-lg border dark:border-gray-700"
          >
            Reset
          </button>
        </div>

        <div className="w-full text-sm text-gray-600 dark:text-gray-300 mt-1">
          Progress: {percent}%
        </div>
      </div>
    </div>
  );
}
