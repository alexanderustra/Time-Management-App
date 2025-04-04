import { useState, useEffect, useCallback } from "react";
import './notes.css';
import { NoteModal } from "./CreationModal";
import { OpenNoteModal } from "./OpenNoteModal";

interface Note {
  title: string;
  description: string;
  pinned: boolean;
  color: string;
}

interface NoteMenuProps {
  handleDelete: () => void;
  handlePinToggle: () => void;
  isPinned: boolean;
}

const NoteMenu = ({ handleDelete, handlePinToggle, isPinned }: NoteMenuProps) => (
  <div className="menu" onClick={(e) => e.stopPropagation()}>
    <button onClick={handlePinToggle}>{isPinned ? 'Unpin' : 'Pin Up'}</button>
    <button>Color</button>
    <button onClick={handleDelete}>Delete</button>
  </div>
);


export const Notes = () => {
  const [showNoteModal, setShowNoteModal] = useState<boolean>(false);
  const [allNotes, setAllNotes] = useState<Note[]>(() => JSON.parse(localStorage.getItem('notes') || '[]'));
  const [currentMenuIndex, setCurrentMenuIndex] = useState<number | null>(null);
  const [openNoteIndex, setOpenNoteIndex] = useState<number | null>(null); 

  useEffect(() => {
    localStorage.setItem('notes', JSON.stringify(allNotes));
  }, [allNotes]);

  const handleCreateNote = useCallback((title: string, description: string) => {
    setShowNoteModal(false);
    setAllNotes((prevNotes) => [
      ...prevNotes,
      { title, description, pinned: false, color: "#00638D" }
    ]);
  }, []);

  const handleDelete = useCallback((index: number) => {
    setCurrentMenuIndex(null);
    setOpenNoteIndex(null);
    setAllNotes((prevNotes) => prevNotes.filter((_, i) => i !== index));
  }, []);

  const handlePinToggle = useCallback((index: number) => {
    setAllNotes((prevNotes) => {
      const updatedNotes = [...prevNotes];
      const note = updatedNotes[index];
      note.pinned = !note.pinned;
      updatedNotes.splice(index, 1);
      note.pinned ? updatedNotes.unshift(note) : updatedNotes.push(note);
      return updatedNotes;
    });
    setCurrentMenuIndex(null);
  }, []);

  const handleNoteMenu = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    setCurrentMenuIndex(index);
    setOpenNoteIndex(null); 
  };

  const handleNoteClick = (index: number) => {
    setOpenNoteIndex(index);
    setCurrentMenuIndex(null); 
  };

  const handleCloseNote = useCallback(() => {
    setOpenNoteIndex(null);
  }, []);

  const pinnedNotes = allNotes.filter(note => note.pinned);
  const unpinnedNotes = allNotes.filter(note => !note.pinned);

  return (
    <div onClick={() => setCurrentMenuIndex(null)}>
      <h2 className="titleH2">Notes</h2>
      <ul id="notesContainer">
        {pinnedNotes.map((note, index) => (
          <li key={index}
            onClick={() => handleNoteClick(index)} 
            onContextMenu={(e) => handleNoteMenu(e, index)}
          >
            <h3>{note.title}</h3>
            <hr />
            <p>{note.description}</p>
            {currentMenuIndex === index && (
              <NoteMenu
                handleDelete={() => handleDelete(index)}
                handlePinToggle={() => handlePinToggle(index)}
                isPinned={true}
              />
            )}
          </li>
        ))}

        {unpinnedNotes.map((note, index) => (
          <li key={pinnedNotes.length + index}
            onClick={() => handleNoteClick(pinnedNotes.length + index)} 
            onContextMenu={(e) => handleNoteMenu(e, pinnedNotes.length + index)}
          >
            <h3>{note.title}</h3>
            <hr />
            <p>{note.description}</p>
            {currentMenuIndex === pinnedNotes.length + index && (
              <NoteMenu
                handleDelete={() => handleDelete(pinnedNotes.length + index)}
                handlePinToggle={() => handlePinToggle(pinnedNotes.length + index)}
                isPinned={false}
              />
            )}
          </li>
        ))}
      </ul>
      {showNoteModal && <NoteModal showModal={setShowNoteModal} handleCreateNote={handleCreateNote} />}
      <button
        className="closedModalBtn"
        onClick={(e) => {
          e.stopPropagation();
          setShowNoteModal(!showNoteModal);
        }}
      >
        New Note
      </button>
      {openNoteIndex !== null && allNotes[openNoteIndex] && (
        <OpenNoteModal
          note={allNotes[openNoteIndex]}
          onClose={handleCloseNote}
          allNotes={allNotes}
          setAllNotes={setAllNotes}
          index={openNoteIndex}
        />
      )}
    </div>
  );
};