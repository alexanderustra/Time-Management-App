import * as FaIcons from "react-icons/fa";
import styles from '../daySumary.module.css'
import { Activity } from "../types/types";

interface ActivitiesProp {
  name: string;
  color: string;
  startTime: string;
  endTime?: string;
  day: string;
  active: boolean;
  totalDuration: number;
  icon: keyof typeof FaIcons; 
}

interface StoredActivity {
  name: string;
  startTime: string;
  endTime?: string;
  day: string;
  color: string;
  icon: keyof typeof FaIcons;
}

interface Props {
  createdActivities: StoredActivity[];
  activities: Activity[];
  onIconClick: (activity: StoredActivity) => void;
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
        const IconComponent = FaIcons[activity.icon];

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