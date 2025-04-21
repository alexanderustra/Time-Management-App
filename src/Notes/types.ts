export interface Note {
    title: string;
    description: string;
    pinned: boolean;
    color: string;
  }
  
  export interface NoteMenuProps {
    handleDelete: () => void;
    handlePinToggle: () => void;
    isPinned: boolean;
  }