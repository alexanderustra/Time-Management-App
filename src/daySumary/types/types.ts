import { Dispatch, SetStateAction } from "react";
import { FaIcons } from "react-icons/fa";

export interface CreationModalActivity {
  name: string;
  icon: string;
  color: string;
}
export type SetActivities = React.Dispatch<React.SetStateAction<Activity[]>>;

export interface CreationModalProps {
  setActive: (value: boolean) => void;
  setCreatedActivities: SetActivities;
}
export interface Activity {
  name: string;
  color: string;
  startTime: string;
  active: boolean;
  totalDuration: number;
  icon: string;
  day?: string;
}

export interface ActivityListProps {
  activities: Activity[];
  setActivities: Dispatch<SetStateAction<Activity[]>>;
  updateSummaries: (updatedActivities: Activity[]) => void;
}

export interface ActivitiesProp {
  name: string;
  color: string;
  startTime: string;
  endTime?: string;
  day: string;
  active: boolean;
  totalDuration: number;
}

export interface StoredActivity {
  name: string;
  startTime: string;
  endTime?: string;
  day: string;
  color: string;
  icon: keyof typeof FaIcons;
}