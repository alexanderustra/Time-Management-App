import { ListMenuProps } from "./types";
export const ListMenu = ({ index, handleCompleted, handleDelete }: ListMenuProps) => {
  return (
    <div className="menu" onClick={(e)=>{
      e.stopPropagation()
    }}>
      <button onClick={() => handleCompleted(index)}>Completed</button>
      <button onClick={() => handleDelete(index)}>Delete</button>
    </div>
  );
};