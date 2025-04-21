import { useEffect, useRef, useState } from 'react';
import { useTimer } from './TimerContext';

export const useCountdownTimer = (
  paused: boolean,
  setPaused: React.Dispatch<React.SetStateAction<boolean>>,
  setTimeLeftExternal: (val: number) => void,
  setElapsedExternal: (val: number) => void
) => {
  const { timer, setTimer } = useTimer();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const pausedRef = useRef(paused);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  const startTimer = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (pausedRef.current) return;

      setTimer(prev => {
        const newElapsed = prev.elapsed + 1;
        const newTimeLeft = prev.end * 60 - newElapsed;
        const elapsedInMinutes = newElapsed / 60;

        setTimeLeftExternal(newTimeLeft);
        setElapsedExternal(elapsedInMinutes);

        if (newTimeLeft <= 0) {
          clearInterval(intervalRef.current!);
          return { ...prev, elapsed: prev.end * 60 };
        }

        const updatedTimer = { ...prev, elapsed: newElapsed };
        localStorage.setItem('timer', JSON.stringify(updatedTimer));
        localStorage.setItem('elapsed', String(newElapsed));
        return updatedTimer;
      });
    }, 1000);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(intervalRef.current!);
  }, []);

  return { startTimer };
};
