import * as FaIcons from "react-icons/fa";
import styles from './daySumary.module.css';
import { useState,useCallback } from "react";
import { Dispatch, SetStateAction } from "react";

interface Activity {
    name: string;
    color: string;
    startTime: string;
    active: boolean;
    totalDuration: number;
    icon: string; // Esto debe estar presente en la interfaz Activity
    day?: string; // Si day es opcional en Activity, podemos agregarlo como opcional
  }
  
  interface ActivityListProps {
    activities: Activity[]; // Asegúrate de que esto sea un array de Activity
    setActivities: Dispatch<SetStateAction<Activity[]>>; // Usamos la misma interfaz aquí
    updateSummaries: (updatedActivities: Activity[]) => void; // Lo mismo aquí
  }

export const ActivityList = ({ activities, setActivities, updateSummaries }: ActivityListProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [indexToDelete, setIndexToDelete] = useState<number | null>(null);

  const handleIconClick = useCallback(
    (activity: Activity) => {
      setActivities((prev) => {
        const existingActivity = prev.find((a) => a.name === activity.name);

        if (existingActivity) {
          if (existingActivity.active) {
            const duration = calculateDuration(existingActivity.startTime);
            return prev.map((a) =>
              a.name === activity.name
                ? { ...a, active: false, totalDuration: a.totalDuration + duration }
                : a
            );
          }
          return prev.map((a) =>
            a.name === activity.name
              ? { ...a, active: true, startTime: formatTime(new Date()) }
              : a
          );
        }

        return [
          ...prev,
          { ...activity, startTime: formatTime(new Date()), active: true, totalDuration: 0 }
        ];
      });
    },
    [setActivities]
  );

  const removeItem = (indexToRemove: number) => {
    setActivities((prev) => {
      const newItems = [...prev];
      newItems.splice(indexToRemove, 1);
      updateSummaries(newItems);
      return newItems;
    });
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLLIElement>, index: number) => {
    e.preventDefault();
    setShowMenu(true);
    setIndexToDelete(index);
  };

  const formatTime = (date: Date): string => {
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  const calculateDuration = (start: string, end?: string): number => {
    const convertToMinutes = (time: string): number => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
    };

    const startMinutes = convertToMinutes(start);
    const endMinutes = end ? convertToMinutes(end) : new Date().getHours() * 60 + new Date().getMinutes();

    return endMinutes >= startMinutes ? endMinutes - startMinutes : 1440 - startMinutes + endMinutes;
  };

  return (
    <div>
      <ul>
        {activities.map((activity, index) => {
          const IconComponent = FaIcons[activity.icon];
          return (
            <li key={index} onContextMenu={(e) => handleContextMenu(e, index)} className={styles.list}>
              {IconComponent && (
                <div title={activity.icon} onClick={() => handleIconClick(activity)} className={styles.iconWrapper}>
                  <IconComponent size={30} fill={activity.active ? activity.color : "gray"} />
                </div>
              )}
            </li>
          );
        })}
      </ul>
      {showMenu && (
        <div className="menu" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => removeItem(indexToDelete!)}>Delete</button>
        </div>
      )}
    </div>
  );
};

