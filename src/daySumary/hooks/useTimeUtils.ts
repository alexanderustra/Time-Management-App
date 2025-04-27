import { useCallback } from "react";
import { ActivitiesProp } from "../types/types";

export const useTimeUtils = (currentTime: Date) => {
  const convertToMinutes = useCallback((time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  }, []);

  const calculateDuration = useCallback(
    (start: string, end?: string): number => {
      const startMin = convertToMinutes(start);
      const endMin = end
        ? convertToMinutes(end)
        : currentTime.getHours() * 60 + currentTime.getMinutes();

      return endMin >= startMin
        ? endMin - startMin
        : 1440 - startMin + endMin;
    },
    [convertToMinutes, currentTime]
  );

  const groupByActivity = useCallback(
    (activities: ActivitiesProp[]) => {
      return activities.reduce<Record<string, number>>((acc, activity) => {
        const duration = (activity.totalDuration || 0) + 
          (activity.active ? calculateDuration(activity.startTime) : 0);
        acc[activity.name] = (acc[activity.name] || 0) + duration;
        return acc;
      }, {});
    },
    [calculateDuration]
  );

  return { convertToMinutes, calculateDuration, groupByActivity };
};