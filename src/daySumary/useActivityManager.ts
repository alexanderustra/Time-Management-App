import { useState, useEffect, useCallback } from "react";

interface ActivitiesProp {
  name: string;
  color: string;
  startTime: string;
  endTime?: string;
  day: string;
  active: boolean;
  totalDuration?: number; // Se hace opcional ya que puede no estar siempre presente
}

interface StoredActivity {
  name: string;
  startTime: string;
  endTime?: string;
  day: string;
  color: string;
  icon: string;
}

export const useActivityManager = () => {

  const [showModal, setShowModal] = useState(false);
const [showMenu, setShowMenu] = useState(false);
const [indexToDelete, setIndexToDelete] = useState<number | null>(null);

const handleIconClick = (index: number) => {
  setIndexToDelete(index);
  setShowModal(true);
};

const handleContextMenu = (e: React.MouseEvent, index: number) => {
  e.preventDefault();
  setIndexToDelete(index);
  setShowMenu(true);
};

const removeItem = () => {
  if (indexToDelete !== null) {
    removeActivity(indexToDelete);
    setShowModal(false);
    setShowMenu(false);
    setIndexToDelete(null);
  }
};

  const [currentTime, setCurrentTime] = useState(new Date());
  const [activities, setActivities] = useState<ActivitiesProp[]>(() => {
    const saved = localStorage.getItem("savedActivities");
    return saved ? JSON.parse(saved) : [];
  });

  const [createdActivities, setCreatedActivities] = useState<StoredActivity[]>(() => {
    return JSON.parse(localStorage.getItem("activities") || "[]");
  });

  const [dailySummary, setDailySummary] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem("dailySummary");
    return saved ? JSON.parse(saved) : {};
  });

  const [weeklySummary, setWeeklySummary] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem("weeklySummary");
    return saved ? JSON.parse(saved) : {};
  });

  // Actualiza la hora cada segundo
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

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

  const groupByActivity = useCallback((activities: ActivitiesProp[]) => {
    return activities.reduce<Record<string, number>>((acc, activity) => {
      const total = (activity.totalDuration || 0) +
        (activity.active ? calculateDuration(activity.startTime) : 0);

      acc[activity.name] = (acc[activity.name] || 0) + total;
      return acc;
    }, {});
  }, [calculateDuration]);

  // Actualiza resumen diario y semanal
  useEffect(() => {
    const updateSummaries = () => {
      const weekly = groupByActivity(activities);
      setWeeklySummary(weekly);
      localStorage.setItem("weeklySummary", JSON.stringify(weekly));

      const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
      const daily = groupByActivity(
        activities.filter((a) => a.day === today)
      );
      setDailySummary(daily);
      localStorage.setItem("dailySummary", JSON.stringify(daily));
    };
    updateSummaries();
  }, [activities, groupByActivity]);

  // Limpia a medianoche
  useEffect(() => {
    const checkMidnight = () => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        setActivities((prev) =>
          prev.map((a) => ({ ...a, totalDuration: 0, active: false }))
        );
      }
    };
    const interval = setInterval(checkMidnight, 60000);
    return () => clearInterval(interval);
  }, []);

  // Actualiza día
  useEffect(() => {
    const now = new Date();
    const today = now.toLocaleDateString();
    const currentDay = now.toLocaleDateString();
    const lastUpdated = localStorage.getItem("lastUpdatedDate");

    if (!lastUpdated || lastUpdated !== today) {
      setActivities((prev) =>
        prev.map((a) =>
          a.active
            ? { ...a, day: currentDay }
            : { ...a, totalDuration: 0, active: false }
        )
      );

      if (now.getDay() === 0) {
        const filtered = Object.fromEntries(
          Object.entries(weeklySummary).filter(([name]) =>
            activities.some((a) => a.name === name && a.active)
          )
        );
        setWeeklySummary(filtered);
        localStorage.setItem("weeklySummary", JSON.stringify(filtered));
      }

      localStorage.setItem("lastUpdatedDate", today);
    }
  }, [activities, weeklySummary]);

  // Persistencia
  useEffect(() => {
    localStorage.setItem("activities", JSON.stringify(createdActivities));
  }, [createdActivities]);

  useEffect(() => {
    localStorage.setItem("savedActivities", JSON.stringify(activities));
  }, [activities]);

  // Agregar o actualizar actividad
  const formatTime = (date: Date) =>
    `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;

  const toggleActivity = useCallback((activity: StoredActivity) => {
    setActivities((prev) => {
      const found = prev.find((a) => a.name === activity.name);
      const now = new Date();
      const currentTime = formatTime(now);
      const day = now.toLocaleDateString("en-US", { weekday: "long" });

      if (found) {
        if (found.active) {
          const duration = calculateDuration(found.startTime);
          return prev.map((a) =>
            a.name === activity.name
              ? {
                  ...a,
                  active: false,
                  totalDuration: a.totalDuration ? a.totalDuration + duration : duration,
                }
              : a
          );
        } else {
          return prev.map((a) =>
            a.name === activity.name
              ? { ...a, active: true, startTime: currentTime, day }
              : a
          );
        }
      }

      return [
        ...prev,
        {
          name: activity.name,
          startTime: currentTime,
          day,
          active: true,
          totalDuration: 0,
          color: activity.color,
        },
      ];
    });
  }, [calculateDuration]);

  const removeActivity = (index: number) => {
    setActivities((prev) => {
      const newArr = [...prev];
      newArr[index].active = false;
      newArr.splice(index, 1);
      return newArr;
    });
    setCreatedActivities((prev) => {
      const newArr = [...prev];
      newArr.splice(index, 1);
      return newArr;
    });
  };

  return {
    currentTime,
    activities,
    createdActivities,
    setCreatedActivities,
    toggleActivity,
    removeActivity,
    dailySummary,
    weeklySummary,
    formatTime,
    showModal,
    setShowModal,
    showMenu,
    setShowMenu,
    indexToDelete,
    setIndexToDelete,
    handleIconClick,
    handleContextMenu,
    removeItem,
  }
};
