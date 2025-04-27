import  { useState, useEffect} from "react";
import './routine.css';
import { NewTaskModal } from "./components/NewTaskModal";
import { Task } from './types/types';
import { TaskListItem } from "./components/TaskList";
import { useDailyReset } from "./hooks/useDailyReset";

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

  useDailyReset(allTasks,setAllTasks)
  
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

  return (
    <section onClick={()=>{
      setCurrentMenuIndex(null)
    }}>
      <h2 className="titleH2">Routine</h2>
      <ul>
      {allTasks.map((task, index) => (
          <TaskListItem
            key={index}
            task={task}
            index={index}
            currentMenuIndex={currentMenuIndex}
            setCurrentMenuIndex={setCurrentMenuIndex}
            setShowModal={setShowModal}
            allTasks={allTasks}
            setAllTasks={setAllTasks}
          />
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