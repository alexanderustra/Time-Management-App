import { ActivitiesProp } from "../types/types";

export const updateSummaries = ({
  activities,
  weeklySummary,
  setActivities,
  setWeeklySummary,
  setDailySummary,
  groupByActivity,
}: {
  activities: ActivitiesProp[];
  weeklySummary: Record<string, number>;
  setActivities: React.Dispatch<React.SetStateAction<ActivitiesProp[]>>;
  setWeeklySummary: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  setDailySummary: React.Dispatch<React.SetStateAction<Record<string, number>>>;
  groupByActivity: (acts: ActivitiesProp[]) => Record<string, number>;
}) => {
  const now = new Date();
  const today = now.toLocaleDateString();
  const lastUpdated = localStorage.getItem("lastUpdatedDate");

  if (!lastUpdated || lastUpdated !== today) {
    // Solo actualizar actividades si es nuevo día
    setActivities((prev) =>
      prev.map((activity) =>
        activity.active
          ? { ...activity, day: today }
          : { ...activity, totalDuration: 0, active: false }
      )
    );

    if (now.getDay() === 0 && now.getHours() === 0) {
      const updatedWeekly = {}; 
      setWeeklySummary(updatedWeekly);
      localStorage.setItem("weeklySummary", JSON.stringify(updatedWeekly));
    }

    localStorage.setItem("lastUpdatedDate", today);
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
