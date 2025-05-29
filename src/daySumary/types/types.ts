import { Dispatch, SetStateAction } from "react";
import { FaIcons } from "react-icons/fa";


export interface ActivityListProps {
  activities: Activity[];
  setActivities: Dispatch<SetStateAction<Activity[]>>;
  updateSummaries: (updatedActivities: Activity[]) => void;
}

export interface Activity {
  name: string;
  color: string;
  startTime: string;
  endTime?: string;
  day: string;
  active?: boolean;
  totalDuration?: number;
  icon: keyof typeof FaIcons; 
}

export interface StoredActivity {
  name: string;
  color: string;
  icon: keyof typeof FaIcons;
}
