import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TaskProvider } from "./context/TaskContext"; // Adjust path if needed
import Navbar from "./components/Navbar";
import TaskManager from "./components/TaskManager";
import Dashboard from "./pages/Dashboard";
import DietPlanner from "./pages/DietPlanner";
import GoalPlanner from "./pages/GoalPlanner";
import HabitTracker from "./pages/HabitTracker";
import Notes from "./pages/Notes";

function App() {
  return (
    <TaskProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/taskmanager" element={<TaskManager />} />
          <Route path="/dietplanner" element={<DietPlanner />} />
          <Route path="/goalplanner" element={<GoalPlanner />} />
          <Route path="/habittracker" element={<HabitTracker />} />
          <Route path="/notes" element={<Notes />} />
        </Routes>
      </Router>
    </TaskProvider>
  );
}

export default App;

