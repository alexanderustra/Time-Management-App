import { useCallback } from "react";
import { Activity } from "../types/types";
import { formatTime, calculateDuration } from "../utils/utils";

export const useHandleIconClick = (setActivities: any) => {
    return useCallback(
      (activity: Activity) => {
        setActivities((prev:Activity[]) => {
          const existingActivity = prev.find((a) => a.name === activity.name);
  
          if (existingActivity) {
            if (existingActivity.active) {
              const duration = calculateDuration(existingActivity.startTime);
              return prev.map((a) =>
                a.name === activity.name
                  ? {
                      ...a,
                      active: false,
                      totalDuration: (a.totalDuration ?? 0) + duration
                    }
                  : a
              );
            }
            return prev.map((a) =>
              a.name === activity.name 
                ? {
                    ...a,
                    active: true,
                    startTime: formatTime(new Date()),
                    day: new Date().toLocaleDateString("en-US", {
                      weekday: "long",
                    }),
                  }
                : a
            );
          }
  
          return [
            ...prev,
            {
              name: activity.name,
              startTime: formatTime(new Date()),
              day: new Date().toLocaleDateString("en-US", {
                weekday: "long",
              }),
              active: true,
              totalDuration: 0,
            },
          ];
        });
      },
      [setActivities]
    );
  };