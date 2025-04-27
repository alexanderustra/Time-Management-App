export interface Task {
    description: string;
    hour: string;
    minutes: string;
    completed: boolean | null;
  }
  
export interface TaskMenuProps {
  handleDeleteTask: () => void;
  handleEditTask: () => void;
}
  