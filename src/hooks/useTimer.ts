import { useCallback, useEffect, useRef, useState } from 'react';

export interface UseTimerResult {
  seconds: number;
  reset: () => void;
}

/** A plain elapsed-seconds stopwatch. Ticks while `isRunning` is true, frozen otherwise. */
export function useTimer(isRunning: boolean): UseTimerResult {
  const [seconds, setSeconds] = useState(0);
  const intervalId = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!isRunning) return undefined;

    intervalId.current = setInterval(() => setSeconds((current) => current + 1), 1000);
    return () => {
      if (intervalId.current !== null) {
        clearInterval(intervalId.current);
        intervalId.current = null;
      }
    };
  }, [isRunning]);

  const reset = useCallback(() => setSeconds(0), []);

  return { seconds, reset };
}
