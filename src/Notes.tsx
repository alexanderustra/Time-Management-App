import { useState, useRef, useEffect, useCallback } from "react";
import './notes.css';

interface Note {
  title: string;
  description: string;
  pinned: boolean;
  color: string;
}

interface NoteModalProps {
  handleCreateNote: (title: string, description: string) => void;
}

interface NoteMenuProps {
  handleDelete: () => void;
  handlePinToggle: () => void;
  isPinned: boolean;
}

interface OpenNoteModalProps {
  note: Note;
  onClose: () => void;
  allNotes: Note[];
  setAllNotes: (notes: Note[]) => void;
  index: number;
}

const NoteModal = ({ handleCreateNote }: NoteModalProps) => {
  const [newNoteTitle, setNewNoteTitle] = useState<string>("");
  const [newNoteDescription, setNewNoteDescription] = useState<string>("");
  const [itsWrong,setItsWrong] = useState<boolean>(false)


  return (
    <div id="modal" className="creationModal" onClick={(e) => e.stopPropagation()}>
      <h2>New Note</h2>
      <input style={itsWrong ? {borderColor: '#EC6767'}: {borderColor: '#EDEAE5'}} value={newNoteTitle} onChange={(e) => setNewNoteTitle(e.target.value)} type="text" placeholder="Title" />
      <textarea style={itsWrong ? {borderColor: '#EC6767'}: {borderColor: '#EDEAE5'}} value={newNoteDescription} onChange={(e) => setNewNoteDescription(e.target.value)} placeholder="Description"></textarea>
      <button 
        onClick={() => {
          if (newNoteTitle && newNoteDescription) {
            handleCreateNote(newNoteTitle, newNoteDescription);
            setItsWrong(false)
          } else {
            setItsWrong(true)
          }
        }} 
        className="modalButton"
      >
        Add
      </button>
    </div>
  );
};

const NoteMenu = ({ handleDelete, handlePinToggle, isPinned }: NoteMenuProps) => (
  <div className="menu" onClick={(e) => e.stopPropagation()}>
    <button onClick={handlePinToggle}>{isPinned ? 'Unpin' : 'Pin Up'}</button>
    <button>Color</button>
    <button onClick={handleDelete}>Delete</button>
  </div>
);

const OpenNoteModal = ({ note, onClose, allNotes, setAllNotes, index }: OpenNoteModalProps) => {
  const [contentEditable, setContentEditable] = useState(false);
  const [editedTitle, setEditedTitle] = useState(note.title);
  const [editedDescription, setEditedDescription] = useState(note.description);

  const titleRef = useRef<HTMLHeadingElement>(null);
  const descriptionRef = useRef<HTMLParagraphElement>(null);

  const handleSave = useCallback(() => {
    setContentEditable(false);
    const updatedNotes = [...allNotes];

    const newTitle = titleRef.current?.innerText || "";
    const newDescription = descriptionRef.current?.innerText || "";

    updatedNotes[index] = { ...updatedNotes[index], title: newTitle, description: newDescription };
    setAllNotes(updatedNotes);

    setEditedTitle(newTitle); 
    setEditedDescription(newDescription); 
  }, [allNotes, index, setAllNotes]);

  const handleCancel = useCallback(() => {
    setEditedTitle(note.title);
    setEditedDescription(note.description);
    setContentEditable(false);

    if (titleRef.current) titleRef.current.innerText = note.title;
    if (descriptionRef.current) descriptionRef.current.innerText = note.description;
  }, [note]);

  return (
    <div id="openedNote">
      <h3
        ref={titleRef}
        contentEditable={contentEditable}
        suppressContentEditableWarning={true}
        onClick={() => setContentEditable(true)}
      >
        {editedTitle}
      </h3>
      <p
        ref={descriptionRef}
        contentEditable={contentEditable}
        suppressContentEditableWarning={true}
        onClick={() => setContentEditable(true)} 
      >
        {editedDescription}
      </p>
      {contentEditable ? (
        <>
          <button onClick={handleSave}>Save</button>
          <button onClick={handleCancel}>Cancel</button>
        </>
      ) : (
        <button onClick={onClose}>Close</button>
      )}
    </div>
  );
};


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
            <h3>{note.title} (Pinned)</h3>
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
      {showNoteModal && <NoteModal handleCreateNote={handleCreateNote} />}
      <button
        className={showNoteModal ? 'openModalBtn' : 'closedModalBtn'}
        onClick={(e) => {
          e.stopPropagation();
          setShowNoteModal(!showNoteModal);
        }}
      >
        {showNoteModal ? 'Close' : 'New Note'}
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
