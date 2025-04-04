import { useState,useRef,useCallback } from "react";

interface Note {
    title: string;
    description: string;
    pinned: boolean;
    color: string;
  }
interface OpenNoteModalProps {
    note: Note;
    onClose: () => void;
    allNotes: Note[];
    setAllNotes: (notes: Note[]) => void;
    index: number;
  }

export const OpenNoteModal = ({ note, onClose, allNotes, setAllNotes, index }: OpenNoteModalProps) => {
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