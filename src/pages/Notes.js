import React, { useState, useEffect } from "react";
import "./Notes.css";

const CATEGORIES = ["Personal", "Work", "Ideas", "Journal", "Study"];

const Notes = () => {
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Personal");
  const [editingNote, setEditingNote] = useState(null);

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("notes")) || [];
    setNotes(savedNotes);
  }, []);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const addNote = () => {
    if (title.trim() && content.trim()) {
      const newNote = {
        id: Date.now(),
        title,
        content,
        category,
        summary: generateSummary(content),
        createdAt: new Date().toISOString(),
      };
      setNotes([...notes, newNote]);
      setTitle("");
      setContent("");
    }
  };

  const editNote = (id) => {
    const noteToEdit = notes.find(note => note.id === id);
    setTitle(noteToEdit.title);
    setContent(noteToEdit.content);
    setCategory(noteToEdit.category);
    setEditingNote(id);
  };

  const saveEditedNote = () => {
    setNotes(notes.map(note => 
      note.id === editingNote 
        ? { ...note, title, content, category, summary: generateSummary(content) }
        : note
    ));
    setTitle("");
    setContent("");
    setEditingNote(null);
  };

  const deleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const generateSummary = (text) => {
    return text.length > 100 ? text.substring(0, 100) + "..." : text;
  };

  return (
    <div className="notes-container">
      <h1>Notes & Journals</h1>

      {/* Notes Input Section */}
      <div className="notes-input">
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter note title..." />
        <textarea value={content} onChange={(e) => setContent(e.target.value)} placeholder="Enter note content..." />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
        {editingNote ? (
          <button onClick={saveEditedNote}>Save Changes</button>
        ) : (
          <button onClick={addNote}>Add Note</button>
        )}
      </div>

      {/* Display Notes */}
      <div className="notes-list">
        <h2>Saved Notes</h2>
        {notes.length > 0 ? (
          <ul>
            {notes.map((note) => (
              <li key={note.id} className={`note-item category-${note.category.toLowerCase()}`}>
                <strong>{note.title}</strong> - {note.category}
                <p>{note.summary}</p>
                <button onClick={() => editNote(note.id)}>Edit</button>
                <button onClick={() => deleteNote(note.id)}>Delete</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No notes saved yet.</p>
        )}
      </div>
    </div>
  );
};

export default Notes;

