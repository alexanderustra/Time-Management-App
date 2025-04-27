// NotesList.tsx
import { FC } from "react";
import { Note } from "../types/types";
import { NoteMenu } from "./NoteUtils";
import '../notes.css'

interface NotesListProps {
  pinnedNotes: Note[];
  unpinnedNotes: Note[];
  currentMenuIndex: number | null;
  handleNoteClick: (index: number) => void;
  handleNoteMenu: (e: React.MouseEvent, index: number) => void;
  handleDelete: (index: number) => void;
  handlePinToggle: (index: number) => void;
}

const NotesList: FC<NotesListProps> = ({
  pinnedNotes,
  unpinnedNotes,
  currentMenuIndex,
  handleNoteClick,
  handleNoteMenu,
  handleDelete,
  handlePinToggle,
}) => (
  <ul id="notesContainer">
    {pinnedNotes.map((note, index) => (
      <li key={index} onClick={() => handleNoteClick(index)} onContextMenu={(e) => handleNoteMenu(e, index)}>
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
      <li key={pinnedNotes.length + index} onClick={() => handleNoteClick(pinnedNotes.length + index)} onContextMenu={(e) => handleNoteMenu(e, pinnedNotes.length + index)}>
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
);

export default NotesList;