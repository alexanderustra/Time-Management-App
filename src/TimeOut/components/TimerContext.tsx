import { createContext, useContext, useState, ReactNode } from "react";

interface Timeline {
  title: string;
  time: number;
}

interface Pause {
  start: number;
  end: number;
}

interface TimerState {
  end: number;
  elapsed: number;
  timelines: Timeline[];
  pauses: Pause[];
}

interface TimerContextProps {
  timer: TimerState;
  setTimer: React.Dispatch<React.SetStateAction<TimerState>>;
  resetTimer: () => void;
}

const TimerContext = createContext<TimerContextProps | undefined>(undefined);

export const TimerProvider = ({ children }: { children: ReactNode }) => {
  const [timer, setTimer] = useState<TimerState>(() => {
    const savedTimer = localStorage.getItem("timer");
    return savedTimer
      ? JSON.parse(savedTimer)
      : Error('invalid')
  });

  const resetTimer = () => {
    setTimer((prev) => ({ ...prev, elapsed: 0 }));
  };

  return (
    <TimerContext.Provider value={{ timer, setTimer, resetTimer }}>
      {children}
    </TimerContext.Provider>
  );
};

export const useTimer = () => {
  const context = useContext(TimerContext);
  if (!context) {
    throw new Error("useTimer debe usarse dentro de un TimerProvider");
  }
  return context;
};

