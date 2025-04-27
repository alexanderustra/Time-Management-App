import { TaskMenuProps } from "../types/types";

export const TaskMenu = ({ handleDeleteTask, handleEditTask }: TaskMenuProps) => (
    <div className="menu" onClick={(e)=>{
      e.stopPropagation()
    }}>
      <button onClick={handleEditTask}>Edit</button>
      <button onClick={handleDeleteTask}>Delete</button>
    </div>
  );