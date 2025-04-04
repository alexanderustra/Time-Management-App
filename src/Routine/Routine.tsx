import React, { useState, useEffect} from "react";
import { CrossIcon, CheckIcon } from '../components/Icons';
import './routine.css';
import { NewTaskModal } from "./NewTaskModal";

interface Task {
  description: string;
  hour: string;
  minutes: string;
  completed: boolean | null;
}

interface TaskMenuProps {
  handleDeleteTask: () => void;
  handleEditTask: () => void;
}

export const Routine = () => {
  const [showModal, setShowModal] = useState<boolean>(false);
  const [allTasks, setAllTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('routine');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });
  const [currentMenuIndex, setCurrentMenuIndex] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem('routine', JSON.stringify(allTasks));
  }, [allTasks]);

  useEffect(() => {
    const resetTasks = () => {
      const resetAllTasks = allTasks.map((task) => ({
        ...task,
        completed: null
      }));
      setAllTasks(resetAllTasks);
    };
  
    const checkForNewDay = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      
      if (hours === 0 && minutes === 0) {
        resetTasks();
      }
    };
  
    const intervalId = setInterval(checkForNewDay, 60000);
  
    return () => {
      clearInterval(intervalId);
    };
  }, [allTasks]); 
  
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      const currentHours = now.getHours().toString().padStart(2, '0');
      const currentMinutes = now.getMinutes().toString().padStart(2, '0');
      const currentTime = parseInt(currentHours + currentMinutes);

      const updatedTasks = allTasks.map((task) => {
        const taskTime = parseInt(task.hour + task.minutes); 
        if (taskTime <= currentTime && task.completed === null) {
          return { ...task, completed: false };
        }
        return task;
      });

      setAllTasks(updatedTasks);
    }, 60000); 

    return () => clearInterval(interval);
  }, [allTasks]);

  const handleDeleteTask = (index: number) => {
    const updatedTasks = allTasks.filter((_, i) => i !== index);
    setAllTasks(updatedTasks);
    setCurrentMenuIndex(null);
  };

  const handleEditTask = (index: number) => {
    setShowModal(true);
    setCurrentMenuIndex(index);
  };

  const handleSelectTask = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    setCurrentMenuIndex(index);
  };

  const handleCheckbox = (index: number) => {
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

  const TaskMenu = ({ handleDeleteTask, handleEditTask }: TaskMenuProps) => (
    <div className="menu" onClick={(e)=>{
      e.stopPropagation()
    }}>
      <button onClick={handleEditTask}>Edit</button>
      <button onClick={handleDeleteTask}>Delete</button>
    </div>
  );

  return (
    <section onClick={()=>{
      setCurrentMenuIndex(null)
    }}>
      <h2 className="titleH2">Routine</h2>
      <ul>
        {allTasks.map((task, index) => (
          <li key={index} onContextMenu={(e) => handleSelectTask(e, index)}>
            <div className="checkbox" onClick={() => handleCheckbox(index)}
              style={task.completed != null ? 
                { borderColor: task.completed ? '#20DBAE' : '#EC6767' } 
                : {}}> 
            {task.completed != null && (task.completed ? <CheckIcon /> : <CrossIcon />)}
            </div>
            <p  style={task.completed != null ? 
                { borderColor: task.completed ? '#20DBAE' : '#EC6767' } 
                : {}}
            >{task.description}</p>
            <div className="timeContainer"
            style={task.completed != null ? 
                { borderColor: task.completed ? '#20DBAE' : '#EC6767' } 
                : {}}>
              <h3>{task.hour}</h3>
              <h3>{task.minutes}</h3>
            </div>
            {currentMenuIndex === index && (
              <TaskMenu
                handleDeleteTask={() => handleDeleteTask(index)}
                handleEditTask={() => handleEditTask(index)}
              />
            )}
          </li>
        ))}
      </ul>
      {showModal && <NewTaskModal allTasks={allTasks} 
      setCurrentMenuIndex={currentMenuIndex} 
      setAllTasks={setAllTasks} 
      index={currentMenuIndex} 
      setShowModal={setShowModal} />}
      <button 
      className='closedModalBtn'
      onClick={()=>{
        setCurrentMenuIndex(null);
        setShowModal(!showModal);
      }}>
        New Task
      </button>
    </section>
  );
};