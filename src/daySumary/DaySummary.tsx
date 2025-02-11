import { useState, useEffect, useCallback } from "react";
import { CreationModal } from "./CreationModal";
import * as FaIcons from "react-icons/fa";

import styles from './daySumary.module.css'
import '../App.css'

interface ActivitiesProp {
  name: string;
  color:string
  startTime: string;
  endTime?: string;
  day: string;
  active: boolean;
  totalDuration: number;
}

interface StoredActivity {
  name: string;
  startTime: string;
  endTime?: string;
  day: string;
  color:string
  icon: keyof typeof FaIcons;
}

export const DaySummary = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activities, setActivities] = useState<ActivitiesProp[]>(() => {
    const savedActivities = localStorage.getItem("savedActivities");
    return savedActivities ? JSON.parse(savedActivities) : [];
  });

  const [dailySummary, setDailySummary] = useState<Record<string, number>>(() => {
    const savedDailySummary = localStorage.getItem("dailySummary");
    return savedDailySummary ? JSON.parse(savedDailySummary) : {};
  });

  const [weeklySummary, setWeeklySummary] = useState<Record<string, number>>(() => {
    const savedSummary = localStorage.getItem("weeklySummary");
    return savedSummary ? JSON.parse(savedSummary) : {};
  });

  const [createdActivities, setCreatedActivities] = useState<StoredActivity[]>(
    () => JSON.parse(localStorage.getItem("activities") || "[]")
  );
  const [showModal, setShowModal] = useState(false);

  // Actualiza la hora actual cada segundo
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);
  
  useEffect(() => {
    const now = new Date();
    const today = now.toLocaleDateString();
    const currentDay = now.toLocaleDateString(); // Día actual en formato "MM/DD/YYYY"
    const lastUpdated = localStorage.getItem("lastUpdatedDate");
  
    // Si no hay registro o es un nuevo día
    if (!lastUpdated || lastUpdated !== today) {
      // Actualiza el resumen diario
      setActivities((prev) =>
        prev.map((activity) =>
          activity.active
            ? { ...activity, day: currentDay } // Actualiza `day` para las actividades activas
            : { ...activity, totalDuration: 0, active: false } // Limpia las inactivas
        )
      );
  
      // Limpia el resumen semanal solo una vez el domingo
      if (now.getDay() === 0) {
        setWeeklySummary((prev) =>
          Object.fromEntries(
            Object.entries(prev).filter(([name]) =>
              activities.some((activity) => activity.name === name && activity.active)
            )
          )
        );
        localStorage.setItem("weeklySummary", JSON.stringify(weeklySummary));
      }
  
      // Guarda la nueva fecha en localStorage
      localStorage.setItem("lastUpdatedDate", today);
    }
  }, [activities, weeklySummary]);
  

  // Actualiza los resúmenes diariamente y semanalmente
  useEffect(() => {
    const updateSummaries = () => {
      const updatedWeeklySummary = groupByActivity(activities);
      setWeeklySummary(updatedWeeklySummary);
      localStorage.setItem("weeklySummary", JSON.stringify(updatedWeeklySummary));
     
      const today = new Date().toLocaleDateString("en-US", { weekday: "long" });
    
      const updatedDailySummary = groupByActivity(
        activities.filter((activity) => activity.day === today)
      );
      setDailySummary(updatedDailySummary);
      localStorage.setItem("dailySummary", JSON.stringify(updatedDailySummary));
    };

    updateSummaries();
  }, [activities]);

  // Reinicia actividades al llegar la medianoche
  useEffect(() => {
    const checkMidnight = () => {
      const now = new Date();
      if (now.getHours() === 0 && now.getMinutes() === 0) {
        setActivities((prev) =>
          prev.map((activity) => ({
            ...activity,
            totalDuration: 0,
            active: false,
          }))
        );
      }
    };

    const interval = setInterval(checkMidnight, 60000);
    return () => clearInterval(interval);
  }, []);
 
  // Guarda actividades creadas en localStorage
  useEffect(() => {
    localStorage.setItem("activities", JSON.stringify(createdActivities));
  }, [createdActivities]);

  // Guarda actividades actualizadas en localStorage
  useEffect(() => {
    localStorage.setItem("savedActivities", JSON.stringify(activities));
  }, [activities]);

  // Cálculos de tiempo
  const convertToMinutes = useCallback((time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  }, []);

  const calculateDuration = useCallback(
    (start: string, end?: string): number => {
      const startMinutes = convertToMinutes(start);
      const endMinutes = end
        ? convertToMinutes(end)
        : currentTime.getHours() * 60 + currentTime.getMinutes();

      return endMinutes >= startMinutes
        ? endMinutes - startMinutes
        : 1440 - startMinutes + endMinutes;
    },
    [convertToMinutes, currentTime]
  );

  const groupByActivity = useCallback((activities: ActivitiesProp[]) => {
    return activities.reduce<Record<string, number>>((acc, activity) => {
      const totalDuration =
        (activity.totalDuration || 0) +
        (activity.active ? calculateDuration(activity.startTime) : 0);

      acc[activity.name] = (acc[activity.name] || 0) + totalDuration;
      return acc;
    }, {});
  }, [calculateDuration]);

  // Manejo de clicks en íconos
  const handleIconClick = useCallback(
    (activity: StoredActivity) => {
      setActivities((prev) => {
        const existingActivity = prev.find((a) => a.name === activity.name);

        if (existingActivity) {
          if (existingActivity.active) {
            const duration = calculateDuration(existingActivity.startTime);
            return prev.map((a) =>
              a.name === activity.name
                ? {
                    ...a,
                    active: false,
                    totalDuration: a.totalDuration + duration,
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
                  day: new Date().toLocaleDateString("en-US", { weekday: "long" }),
                }
              : a
          );          
        }

        return [
          ...prev,
          {
            name: activity.name,
            startTime: formatTime(new Date()),
            day: new Date().toLocaleDateString("en-US", { weekday: "long" }),
            active: true,
            totalDuration: 0,
          },
        ];
      });
    },
    [calculateDuration]
  );

  const formatTime = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  return (
    <section className={styles.a}>
      <ul>
        {createdActivities.map((activity, index) => {
          const isActive = activities.some((a) => a.name === activity.name && a.active);
          const IconComponent = FaIcons[activity.icon];

          return (
            <li key={index}>
              {IconComponent && (
                <div
                  title={activity.icon}
                  onClick={() => handleIconClick(activity)}
                >
                  <IconComponent size={30} fill= {isActive ? activity.color : "gray" } />
                </div>
              )}
            </li>
          );
        })}
      </ul>

      {showModal && (
        <CreationModal 
          setCreatedActivities={setCreatedActivities} 
          setActive={setShowModal} 
        />
      )}
      <button onClick={() => setShowModal(!showModal)}>
        {showModal ? "Cancel" : "New Activity"}
      </button>

      <div>
  <h2>Day Summary</h2>
  <ul>
    {(() => {
      const totalDailyTime = Object.values(dailySummary).reduce(
        (acc, duration) => acc + duration,
        0
      );

      return Object.entries(dailySummary).map(([name, duration]) => {
        const percentage = totalDailyTime ? (duration / totalDailyTime) * 100 : 0;
        const activityColor = createdActivities.find((activity) => activity.name === name)?.color || "#20DBAE";

        return (
          <li key={name} className={styles.list}>
            <h3>{name}</h3>
            <h3 className={styles.time}>
              {Math.floor(duration / 60)}h {duration % 60}m
            </h3>
            <div
              style={{
                width: `${percentage}%`,
                backgroundColor: activityColor,
              }}
            ></div>
          </li>
        );
      });
    })()}
  </ul>
</div>

<div>
  <h2>Week Summary</h2>
  <ul>
    {(() => {
      const totalWeeklyTime = Object.values(weeklySummary).reduce(
        (acc, duration) => acc + duration,
        0
      );

      return Object.entries(weeklySummary).map(([name, duration]) => {
        const percentage = totalWeeklyTime ? (duration / totalWeeklyTime) * 100 : 0;
        const activityColor = createdActivities.find((activity) => activity.name === name)?.color || "#20DBAE";

        return (
          <li key={name} className={styles.list}>
            <h3>{name}</h3>
            <h3 className={styles.time}>
              {Math.floor(duration / 60)}h {duration % 60}m
            </h3>
            <div
              style={{
                width: `${percentage}%`,
                backgroundColor: activityColor,
              }}
            ></div>
          </li>
        );
      });
    })()}
  </ul>
</div>

    </section>
  );
};