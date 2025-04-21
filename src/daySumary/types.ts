import { Dispatch, SetStateAction } from "react";

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
