import { Task } from "../types/types";

export const handleDeleteTask = (
  index: number,
  allTasks: Task[],
  setAllTasks: React.Dispatch<React.SetStateAction<Task[]>>,
  setCurrentMenuIndex: React.Dispatch<React.SetStateAction<number | null>>
) => {
  const updatedTasks = allTasks.filter((_, i) => i !== index);
  setAllTasks(updatedTasks);
  setCurrentMenuIndex(null);
};

export const handleCheckbox = (
  index: number,
  allTasks: Task[],
  setAllTasks: React.Dispatch<React.SetStateAction<Task[]>>
) => {
  const updatedTasks = allTasks.map((task, i) => {
    if (i === index) {
      let newCompletedState;
      if (task.completed === true) {
        newCompletedState = false;
      } else if (task.completed === false) {
        newCompletedState = null;
      } else {
        newCompletedState = true;
      }

      return { ...task, completed: newCompletedState };
    }
    return task;
  });

  setAllTasks(updatedTasks);
};