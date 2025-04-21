import { useEffect } from "react";
import { Task } from "./types";

export const useDailyReset = (allTasks: Task[], setAllTasks: React.Dispatch<React.SetStateAction<Task[]>>) => {
    useEffect(() => {
      const savedDate = localStorage.getItem('routine-date');
      const today = new Date().toDateString();
  
      if (savedDate !== today) {
        const resetTasks = allTasks.map(task => ({ ...task, completed: null }));
        setAllTasks(resetTasks);
        localStorage.setItem('routine-date', today);
      }
  
      const interval = setInterval(() => {
        const currentDate = new Date().toDateString();
        if (localStorage.getItem('routine-date') !== currentDate) {
          const resetTasks = allTasks.map(task => ({ ...task, completed: null }));
          setAllTasks(resetTasks);
          localStorage.setItem('routine-date', currentDate);
        }
      }, 60000);
  
      return () => clearInterval(interval);
    }, [allTasks, setAllTasks]);
  };
  