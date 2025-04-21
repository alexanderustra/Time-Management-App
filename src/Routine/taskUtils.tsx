import { Task,TaskMenuProps } from './types';

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

export const BorderStyle = (completed: boolean | null): React.CSSProperties => {
  if (completed === true) return { borderColor: '#20DBAE' };
  if (completed === false) return { borderColor: '#EC6767' };
  return {};
};


export const TaskMenu = ({ handleDeleteTask, handleEditTask }: TaskMenuProps) => (
  <div className="menu" onClick={(e)=>{
    e.stopPropagation()
  }}>
    <button onClick={handleEditTask}>Edit</button>
    <button onClick={handleDeleteTask}>Delete</button>
  </div>
);