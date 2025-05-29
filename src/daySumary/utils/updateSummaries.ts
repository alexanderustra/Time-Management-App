import { Activity } from "../types/types";
import { getWeekNumber } from "./utils";

export const updateSummaries = ({
  activities,
  weeklySummary,
  setActivities,
  setWeeklySummary,
  setDailySummary,
  groupByActivity,
}: {
  activities: Activity[];
  weeklySummary: Record<string, number>;
  setActivities: React.Dispatch<React.SetStateAction<Activity[]>>;
  setWeeklySummary: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  setDailySummary: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  groupByActivity: (acts: Activity[]) => Record<string, number>;
}) => {
  const now = new Date();
const today = now.toLocaleDateString();

const lastUpdated = localStorage.getItem("lastUpdatedDate");
const lastUpdatedWeek = localStorage.getItem("lastUpdatedWeek");

const currentWeek = getWeekNumber(now);

if (!lastUpdated || lastUpdated !== today) {
  // Actualizar actividades diarias
  setActivities((prev) =>
    prev.map((activity) =>
      activity.active
        ? { ...activity, day: today }
        : { ...activity, totalDuration: 0, active: false }
    )
  );

  // Actualizar semana si cambió la semana
  if (!lastUpdatedWeek || parseInt(lastUpdatedWeek) !== currentWeek) {
    const updatedWeekly = {}; 
    setWeeklySummary(updatedWeekly);
    localStorage.setItem("weeklySummary", JSON.stringify(updatedWeekly));
    localStorage.setItem("lastUpdatedWeek", currentWeek.toString());
  }

  localStorage.setItem("lastUpdatedDate", today);
}

if (now.getHours() === 0 && now.getMinutes() === 0) {
  setActivities((prev) =>
    prev.map((activity) => {
      if (!activity.active) {
        return {
          ...activity,
          totalDuration: 0,
          active: false,
        };
      }
      return activity;
    })
  );
  const updatedDailySummary = groupByActivity(activities);
  setDailySummary(updatedDailySummary);
  localStorage.setItem("dailySummary", JSON.stringify(updatedDailySummary));
}
  // SIEMPRE actualizar resumen diario
  const updatedDailySummary = groupByActivity(activities);
  setDailySummary(updatedDailySummary);
  localStorage.setItem("dailySummary", JSON.stringify(updatedDailySummary));

  // SOLO agregar al resumen semanal si las actividades están activas
  const activeActivities = activities.filter((a) => a.active);
  const activeSummary = groupByActivity(activeActivities);

  // Sumar al resumen semanal actual
  const newWeeklySummary = { ...weeklySummary };
  for (const [name, duration] of Object.entries(activeSummary)) {
    newWeeklySummary[name] = (newWeeklySummary[name] || 0) + duration;
  }  

  setWeeklySummary(newWeeklySummary);
  localStorage.setItem("weeklySummary", JSON.stringify(newWeeklySummary));
};
