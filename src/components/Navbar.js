import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      <div className="logo">Task Manager</div>
      <ul className="nav-links">
        <li><NavLink to="/" exact="true" className={({ isActive }) => isActive ? "active" : ""}>Dashboard</NavLink></li>
        <li><NavLink to="/taskmanager" className={({ isActive }) => isActive ? "active" : ""}>Task Manager</NavLink></li>
        <li><NavLink to="/dietplanner" className={({ isActive }) => isActive ? "active" : ""}>Diet Planner</NavLink></li>
        <li><NavLink to="/goalplanner" className={({ isActive }) => isActive ? "active" : ""}>Goal Planner</NavLink></li>
        <li><NavLink to="/habittracker" className={({ isActive }) => isActive ? "active" : ""}>Habit Tracker</NavLink></li>
        <li><NavLink to="/notes" className={({ isActive }) => isActive ? "active" : ""}>Notes</NavLink></li>
      </ul>
    </nav>
  );
}

export default Navbar;
