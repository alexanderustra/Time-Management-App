import React from 'react';

interface ContextMenuProps {
  showMenu: boolean;
  handleDeleteActivity: (index: number) => void;
  indexToDelete: number | null;
  setIndexToDelete: (index: number) => void;
  setShowMenu: (show: boolean) => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  showMenu,
  handleDeleteActivity,
  indexToDelete,
  setIndexToDelete,
  setShowMenu,
}) => {
  if (!showMenu) return null;

  return (
    <div className="menu" onClick={(e) => e.stopPropagation()}>
      <button
        onClick={() => {
          if (indexToDelete !== null && indexToDelete !== undefined) {
            handleDeleteActivity(indexToDelete);
            setIndexToDelete(null);
            setShowMenu(false);  
          }
        }}
      >
        Delete
      </button>
    </div>
  );
};

export default ContextMenu;
