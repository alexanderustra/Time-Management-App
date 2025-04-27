import { useEffect, useState } from "react";
import './toDo.css';
import { Task } from "./types/types";
import { AddTaskModal } from "./components/AddTaskModal";
import { ListMenu } from "./components/ListMenu";

export const ToDo = () => {
  const [showAddTaskModal, setShowAddTaskModal] = useState<boolean>(false);
  const [allTasks, setAllTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('toDo');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  const [currentMenuIndex, setCurrentMenuIndex] = useState<number | null>(null);

  useEffect(() => {
    localStorage.setItem('toDo', JSON.stringify(allTasks));
  }, [allTasks]);

  const handleCreateTask = (title: string) => {
    if (title === '') {
      alert('Cannot create empty Task');
    } else {
      const newTask: Task = {
        title: title,
        completed: false
      };
      setAllTasks([...allTasks, newTask]);
      setShowAddTaskModal(false);
    }
  };

  const handleCompleted = (index: number) => {
    const updatedTasks = [...allTasks];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setAllTasks(updatedTasks);
    setCurrentMenuIndex(null)
  };

  const handleDelete = (index: number) => {
    const updatedTasks = allTasks.filter((_, i) => i !== index);
    setAllTasks(updatedTasks);
  };

  return (
    <section onClick={()=>{
      setCurrentMenuIndex(null)
    }} >
      <h2 className="titleH2">ToDo</h2>
      {showAddTaskModal && (
        <AddTaskModal showModal={setShowAddTaskModal} handleCreateTask={handleCreateTask} />
      )}
      <ul id="toDoContainer">
        {allTasks.map((task, index) => (
          <li
            onContextMenu={(e) => {
              e.preventDefault();
              setCurrentMenuIndex(index);
            }}
            key={index}
            style={task.completed ? { border: '1px solid #20DBAE' } : { border: '1px solid #00638D' }}
          >
            {task.title}
            {currentMenuIndex === index && (
              <ListMenu index={index} handleCompleted={handleCompleted} handleDelete={handleDelete} />
            )}
          </li>
        ))}
      </ul>
      <button
         className='closeModalBtn'
        onClick={(e) => {
          e.stopPropagation();
          setShowAddTaskModal(!showAddTaskModal);
        }}
      >
        Add Task
      </button>
    </section >
  );
};