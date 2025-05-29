import * as FaIcons from "react-icons/fa";
import styles from '../daySumary.module.css'
import { Activity } from "../types/types";

interface Props {
  createdActivities: Activity[]; 
  activities: Activity[]; 
  onIconClick: (activity: Activity) => void;
  onContextMenu: (index: number, event: React.MouseEvent<HTMLElement>) => void; 
}

export const ActivityIconList = ({
  createdActivities,
  activities,
  onIconClick,
  onContextMenu,
}: Props) => {
  return (
    <ul className={styles.activitieIconsContainer}>
      {createdActivities.map((activity, index) => {
        const isActive = activities.some(
          (a) => a.name === activity.name && a.active
        );
        const IconComponent = FaIcons[activity.icon as keyof typeof FaIcons] as React.ElementType;

        return (
          <li key={index} onContextMenu={(e) => onContextMenu(index, e)}>
            {IconComponent && (
              <div
                title={activity.icon}
                onClick={() => onIconClick(activity)}
              >
                <IconComponent
                  size={30}
                  fill={isActive ? activity.color : "gray"}
                />
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
};