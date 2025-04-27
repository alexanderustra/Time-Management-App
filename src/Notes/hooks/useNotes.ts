import { useState, useEffect, useCallback } from "react";
import { Note } from "../types/types";

export const useNotes = () => {
    const [allNotes, setAllNotes] = useState<Note[]>(() => {
      const saved = localStorage.getItem('notes');
      return saved ? JSON.parse(saved) : [];
    });
  
    useEffect(() => {
      localStorage.setItem('notes', JSON.stringify(allNotes));
    }, [allNotes]);
  
    const createNote = useCallback((title: string, description: string) => {
      setAllNotes(prev => [...prev, { title, description, pinned: false, color: "#00638D" }]);
    }, []);
  
    const deleteNote = useCallback((index: number) => {
      setAllNotes(prev => prev.filter((_, i) => i !== index));
    }, []);
  
    const togglePin = useCallback((index: number) => {
      setAllNotes(prev => {
        const updated = [...prev];
        const note = updated[index];
        note.pinned = !note.pinned;
        updated.splice(index, 1);
        note.pinned ? updated.unshift(note) : updated.push(note);
        return updated;
      });
    }, []);
  
    return { allNotes, setAllNotes, createNote, deleteNote, togglePin };
  };