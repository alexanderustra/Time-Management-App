import React, { useEffect, useState } from "react";
import './toDo.css';

interface Task {
  title: string;
  completed: boolean;
}

interface ToDoProps {
  handleCreateTask: (title: string) => void;
}

interface ListMenuProps {
  index: number;
  handleCompleted: (index: number) => void;
  handleDelete: (index: number) => void;
}

const AddTaskModal = ({ handleCreateTask }: ToDoProps) => {
  const [taskTitle, setTaskTitle] = useState<string>("");
  const [itsWrong,setItsWrong] = useState<boolean>(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTaskTitle(e.target.value);
  };

  const handleAddClick = () => {
    if(taskTitle === '') {
      setItsWrong(true)
    }
    else {
      handleCreateTask(taskTitle)
      setItsWrong(false)
    }
  };

  return (
    <div onClick={(e) => e.stopPropagation()} id="toDoCreationModal" className="creationModal">
      <h2>New Task</h2>
      <input style={itsWrong ? {borderColor: '#EC6767'}: {borderColor: '#EDEAE5'}} onChange={handleInputChange} type="text" value={taskTitle} />
      <button onClick={handleAddClick} className="modalButton">Add</button>
    </div>
  );
};

const ListMenu = ({ index, handleCompleted, handleDelete }: ListMenuProps) => {
  return (
    <div className="menu" onClick={(e)=>{
      e.stopPropagation()
    }}>
      <button onClick={() => handleCompleted(index)}>Completed</button>
      <button onClick={() => handleDelete(index)}>Delete</button>
    </div>
  );
};

const ToDo = () => {
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
        <AddTaskModal handleCreateTask={handleCreateTask} />
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
         className={showAddTaskModal ? 'openModalBtn' : 'closedModalBtn'}
        onClick={(e) => {
          e.stopPropagation();
          setShowAddTaskModal(!showAddTaskModal);
        }}
      >
        {showAddTaskModal ? 'Close' : 'Add Task'}
      </button>
    </section >
  );
};

export default ToDo;
