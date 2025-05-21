import React, { useState, useContext } from "react";
import { TaskContext } from "../context/TaskContext";
import "./TaskManager.css";

const CATEGORIES = ["Work", "Personal", "Shopping", "Health", "Education", "Home", "Finance", "Other"];

const TaskManager = () => {
  const { tasks, setTasks } = useContext(TaskContext);
  const [newTask, setNewTask] = useState("");
  const [category, setCategory] = useState("Work");
  const [priority, setPriority] = useState("medium");
  const [dueDate, setDueDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("all");
  const [expandedTask, setExpandedTask] = useState(null);

  const [history, setHistory] = useState([[]]); // Store snapshots of tasks
  const [historyIndex, setHistoryIndex] = useState(0); // Track current state in history

  // Save history when tasks change
  const saveHistory = (newTasks) => {
    const newHistory = history.slice(0, historyIndex + 1); // Remove future states
    newHistory.push(newTasks); // Add new task state
    setHistory(newHistory);
    setHistoryIndex(newHistory.length - 1);
    setTasks(newTasks);
  };

  const addTask = () => {
    if (newTask.trim()) {
      const newTaskObj = {
        id: Date.now(),
        text: newTask,
        completed: false,
        priority,
        category,
        createdAt: new Date().toISOString(),
        dueDate: dueDate || null,
      };
      saveHistory([...tasks, newTaskObj]);
      setNewTask("");
      setDueDate("");
    }
  };

  const toggleTask = (taskId) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    saveHistory(updatedTasks);
  };

  const deleteTask = (taskId) => {
    saveHistory(tasks.filter(task => task.id !== taskId));
  };

  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setTasks(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setTasks(history[historyIndex + 1]);
    }
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.text.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "all" || 
                          (filter === "completed" && task.completed) || 
                          (filter === "pending" && !task.completed);
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="task-manager">
      <h1>Task Management System</h1>

      {/* Task Input */}
      <div className="input-group">
        <input type="text" value={newTask} onChange={(e) => setNewTask(e.target.value)} placeholder="Enter new task..." />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
        </select>
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
        <button onClick={addTask} className="add-button">Add Task</button>
      </div>

      {/* Search & Filter Controls */}
      <div className="search-filter-controls">
        <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Search tasks..." />
        <button onClick={() => setFilter("all")} className={filter === "all" ? "active" : ""}>All</button>
        <button onClick={() => setFilter("pending")} className={filter === "pending" ? "active" : ""}>Pending</button>
        <button onClick={() => setFilter("completed")} className={filter === "completed" ? "active" : ""}>Completed</button>
      </div>

      {/* Undo / Redo Controls */}
      <div className="history-controls">
        <button onClick={undo} disabled={historyIndex <= 0}>Undo</button>
        <button onClick={redo} disabled={historyIndex >= history.length - 1}>Redo</button>
      </div>

      {/* Task List */}
      <div className="task-list">
        {filteredTasks.map(task => (
          <div key={task.id} className={`task-item priority-${task.priority} ${task.completed ? "completed" : ""}`}>
            <input type="checkbox" checked={task.completed} onChange={() => toggleTask(task.id)} />
            <span>{task.text} - {task.category}</span>
            <button onClick={() => deleteTask(task.id)} className="delete-button">Delete</button>
            <button onClick={() => setExpandedTask(expandedTask === task.id ? null : task.id)} className="expand-button">
              {expandedTask === task.id ? "Collapse" : "Expand"}
            </button>

            {/* Expanded Task Details */}
            {expandedTask === task.id && (
              <div className="task-details">
                <p>Priority: {task.priority}</p>
                <p>Due Date: {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "No due date"}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskManager;
