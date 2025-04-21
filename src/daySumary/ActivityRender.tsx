import { FaIcons } from "react-icons/fa";

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
  color:string
  icon: keyof typeof FaIcons;
}

interface Props {
    createdActivities: StoredActivity[];
    activities: ActivitiesProp[];
    onIconClick: (activity: StoredActivity) => void;
    onContextMenu: (index: number, event: React.MouseEvent) => void;
  }
  
  
  export const ActivityIconList = ({ createdActivities, activities, onIconClick, onContextMenu }: Props) => {
    return (
      <ul>
        {createdActivities.map((activity, index) => {
          const isActive = activities.some((a) => a.name === activity.name && a.active);
          const IconComponent = FaIcons[activity.icon];
  
          return (
            <li key={index} onContextMenu={(e) => onContextMenu(index, e)}>
              {IconComponent && (
                <div
                  title={activity.icon}
                  onClick={() => onIconClick(activity)}
                >
                  <IconComponent size={30} fill={isActive ? activity.color : "gray"} />
                </div>
              )}
            </li>
          );
        })}
      </ul>
    );
  };
  