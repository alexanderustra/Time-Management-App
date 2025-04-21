interface ContextMenuProps {
    onDelete: () => void;
  }
  
  export const ContextMenu = ({ onDelete }: ContextMenuProps) => {
    return (
      <div className="menu" onClick={(e) => e.stopPropagation()}>
        <button onClick={onDelete}>Delete</button>
      </div>
    );
  };
  