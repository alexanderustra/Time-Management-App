import { useState } from "react";

interface NoteModalProps {
    showModal: (value: boolean) => void;
    handleCreateNote: (title: string, description: string) => void;
  }

export const NoteModal = ({ handleCreateNote,showModal }: NoteModalProps) => {
  const [newNoteTitle, setNewNoteTitle] = useState<string>("");
  const [newNoteDescription, setNewNoteDescription] = useState<string>("");
  const [itsWrong,setItsWrong] = useState<boolean>(false)

  const handleClick = ()=>{
    if (newNoteTitle && newNoteDescription) {
        handleCreateNote(newNoteTitle, newNoteDescription);
        setItsWrong(false)
        showModal(false)
      } else {
        setItsWrong(true)
      }
  }

  return (
    <div id="notesModal" className="creationModal" onClick={(e) => e.stopPropagation()}>
      <h2>New Note</h2>
      <input style={itsWrong ? {borderColor: '#EC6767'}: {borderColor: '#EDEAE5'}} value={newNoteTitle} onChange={(e) => setNewNoteTitle(e.target.value)} type="text" placeholder="Title" />
      <textarea style={itsWrong ? {borderColor: '#EC6767'}: {borderColor: '#EDEAE5'}} value={newNoteDescription} onChange={(e) => setNewNoteDescription(e.target.value)} placeholder="Description"></textarea>
      <div id="buttonsContainer">
      <button 
        onClick={handleClick} 
      >
        Add
      </button>
      <button onClick={()=>showModal(false)}>Cancel</button>
      </div>
    </div>
  );
};