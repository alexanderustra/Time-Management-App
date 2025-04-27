import { NoteMenuProps } from "../types/types";
export const NoteMenu = ({ handleDelete, handlePinToggle, isPinned }: NoteMenuProps) => (
  <div className="menu" onClick={(e) => e.stopPropagation()}>
    <button onClick={handlePinToggle}>{isPinned ? 'Unpin' : 'Pin Up'}</button>
    <button>Color</button>
    <button onClick={handleDelete}>Delete</button>
  </div>
);