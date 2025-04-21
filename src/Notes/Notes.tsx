import { useState} from "react";
import './notes.css';
import { useNotes } from "./useNotes";
import { NoteModal } from "./CreationModal";
import { OpenNoteModal } from "./OpenNoteModal";
import NotesList from "./NotesList";


export const Notes = () => {
  const { allNotes, setAllNotes, createNote, deleteNote, togglePin } = useNotes();
  
  const [showNoteModal, setShowNoteModal] = useState<boolean>(false);
  const [currentMenuIndex, setCurrentMenuIndex] = useState<number | null>(null);
  const [openNoteIndex, setOpenNoteIndex] = useState<number | null>(null);

  const handleNoteMenu = (e: React.MouseEvent, index: number) => {
    e.preventDefault();
    setCurrentMenuIndex(index);
    setOpenNoteIndex(null);
  };

  const handleNoteClick = (index: number) => {
    setOpenNoteIndex(index);
    setCurrentMenuIndex(null);
  };

  const handleCloseNote = () => {
    setOpenNoteIndex(null);
  };

  const pinnedNotes = allNotes.filter(note => note.pinned);
  const unpinnedNotes = allNotes.filter(note => !note.pinned);

  return (
    <div onClick={() => setCurrentMenuIndex(null)}>
      <h2 className="titleH2">Notes</h2>
      
      <NotesList
        pinnedNotes={pinnedNotes}
        unpinnedNotes={unpinnedNotes}
        currentMenuIndex={currentMenuIndex}
        handleNoteClick={handleNoteClick}
        handleNoteMenu={handleNoteMenu}
        handleDelete={deleteNote}
        handlePinToggle={togglePin}
      />
      
      {showNoteModal && <NoteModal showModal={setShowNoteModal} handleCreateNote={createNote} />}
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
