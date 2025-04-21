import React from 'react';
import { CrossIcon, CheckIcon } from '../components/Icons';
import { handleDeleteTask, handleCheckbox, BorderStyle, TaskMenu } from './taskUtils';
import { Task } from './types';

interface TaskListItemProps {
  task: Task;
  index: number;
  currentMenuIndex: number | null;
  setCurrentMenuIndex: React.Dispatch<React.SetStateAction<number | null>>;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  allTasks: Task[];
  setAllTasks: React.Dispatch<React.SetStateAction<Task[]>>;
}

export const TaskListItem: React.FC<TaskListItemProps> = ({
  task,
  index,
  currentMenuIndex,
  setCurrentMenuIndex,
  setShowModal,
  allTasks,
  setAllTasks
}) => {
  const handleSelectTask = (e: React.MouseEvent) => {
    e.preventDefault();
    setCurrentMenuIndex(index);
  };

  const handleEditTask = () => {
    setShowModal(true);
    setCurrentMenuIndex(index);
  };

  const getBorderColor = (completed: boolean | null) => {
    if (completed == null) return {};
    return {
      borderColor: completed ? '#20DBAE' : '#EC6767'
    };
  };

  return (
    <li onContextMenu={handleSelectTask}>
      <div
        className="checkbox"
        onClick={() => handleCheckbox(index, allTasks, setAllTasks)}
        style={BorderStyle(task.completed)}
      >
        {task.completed != null && (task.completed ? <CheckIcon /> : <CrossIcon />)}
      </div>

      <p style={getBorderColor(task.completed)}>{task.description}</p>

      <div className="timeContainer" style={getBorderColor(task.completed)}>
        <h3>{task.hour}</h3>
        <h3>{task.minutes}</h3>
      </div>

      {currentMenuIndex === index && (
        <TaskMenu
          handleDeleteTask={() =>
            handleDeleteTask(index, allTasks, setAllTasks, setCurrentMenuIndex)
          }
          handleEditTask={handleEditTask}
        />
      )}
    </li>
  );
};
