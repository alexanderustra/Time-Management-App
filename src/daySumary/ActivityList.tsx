import * as FaIcons from "react-icons/fa";
import styles from './daySumary.module.css';
import { useState,useCallback } from "react";
import { calculateDuration,formatTime } from "./utils";
import { ActivityListProps,Activity } from "./types";


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

  return (
    <div>
      <ul>
        {activities.map((activity, index) => {
          const IconComponent = FaIcons[activity.icon];
          return (
            <li key={activity.name} onContextMenu={(e) => handleContextMenu(e, index)} className={styles.list}>
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