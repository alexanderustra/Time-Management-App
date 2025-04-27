import { useState } from "react";
import { ToDoProps } from "../types/types";

export const AddTaskModal = ({ handleCreateTask,showModal }: ToDoProps) => {
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
      <div id="buttonsContainer">
      <button onClick={handleAddClick}>Add</button>
      <button onClick={()=>showModal(false)}>Cancel</button>
      </div>
    </div>
  );
};