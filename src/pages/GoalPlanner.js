import React, { useState, useEffect } from "react";
import "./GoalPlanner.css";

const PRIORITIES = ["Low", "Medium", "High"];

const GoalPlanner = () => {
  const [shortTermGoals, setShortTermGoals] = useState([]);
  const [longTermGoals, setLongTermGoals] = useState([]);
  const [achievements, setAchievements] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [priority, setPriority] = useState("Medium");
  const [goalType, setGoalType] = useState("Short-Term");

  useEffect(() => {
    setShortTermGoals(JSON.parse(localStorage.getItem("shortTermGoals")) || []);
    setLongTermGoals(JSON.parse(localStorage.getItem("longTermGoals")) || []);
    setAchievements(JSON.parse(localStorage.getItem("achievements")) || []);
  }, []);

  useEffect(() => {
    localStorage.setItem("shortTermGoals", JSON.stringify(shortTermGoals));
    localStorage.setItem("longTermGoals", JSON.stringify(longTermGoals));
    localStorage.setItem("achievements", JSON.stringify(achievements));
  }, [shortTermGoals, longTermGoals, achievements]);

  const addGoal = () => {
    if (title.trim() && description.trim()) {
      const newGoal = { 
        id: Date.now(), 
        title, 
        description, 
        deadline, 
        priority, 
        completed: false, 
        progress: 0 
      };

      if (goalType === "Short-Term") {
        setShortTermGoals([...shortTermGoals, newGoal]);
      } else {
        setLongTermGoals([...longTermGoals, newGoal]);
      }

      setTitle("");
      setDescription("");
      setDeadline("");
    }
  };

  const markCompleted = (id, type) => {
    if (type === "Short-Term") {
      setAchievements([...achievements, ...shortTermGoals.filter(goal => goal.id === id)]);
      setShortTermGoals(shortTermGoals.filter(goal => goal.id !== id));
    } else {
      setAchievements([...achievements, ...longTermGoals.filter(goal => goal.id === id)]);
      setLongTermGoals(longTermGoals.filter(goal => goal.id !== id));
    }
  };

  const deleteGoal = (id, type) => {
    if (type === "Short-Term") {
      setShortTermGoals(shortTermGoals.filter(goal => goal.id !== id));
    } else {
      setLongTermGoals(longTermGoals.filter(goal => goal.id !== id));
    }
  };

  return (
    <div className="goal-planner">
      <h1>Goal Planner</h1>

      {/* Goal Input Section */}
      <div className="goal-input">
        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Enter goal title..." />
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter goal description..." />
        <input type="date" value={deadline} onChange={(e) => setDeadline(e.target.value)} />
        <select value={priority} onChange={(e) => setPriority(e.target.value)}>
          {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
        </select>
        <select value={goalType} onChange={(e) => setGoalType(e.target.value)}>
          <option value="Short-Term">Short-Term Goal</option>
          <option value="Long-Term">Long-Term Goal</option>
        </select>
        <button onClick={addGoal}>Add Goal</button>
      </div>

      {/* Short-Term Goals Section */}
      <div className="goal-section">
        <h2>Short-Term Goals</h2>
        {shortTermGoals.length > 0 ? (
          <ul>
            {shortTermGoals.map(goal => (
              <li key={goal.id} className="goal-item priority-short">
                <strong>{goal.title}</strong> - {goal.description}
                <p>Deadline: {goal.deadline ? new Date(goal.deadline).toLocaleDateString() : "No deadline set"}</p>
                <p>Priority: {goal.priority}</p>
                <button onClick={() => markCompleted(goal.id, "Short-Term")}>Mark Completed</button>
                <button onClick={() => deleteGoal(goal.id, "Short-Term")}>Delete</button>
              </li>
            ))}
          </ul>
        ) : <p>No short-term goals added.</p>}
      </div>

      {/* Long-Term Goals Section */}
      <div className="goal-section">
        <h2>Long-Term Goals</h2>
        {longTermGoals.length > 0 ? (
          <ul>
            {longTermGoals.map(goal => (
              <li key={goal.id} className="goal-item priority-long">
                <strong>{goal.title}</strong> - {goal.description}
                <p>Deadline: {goal.deadline ? new Date(goal.deadline).toLocaleDateString() : "No deadline set"}</p>
                <p>Priority: {goal.priority}</p>
                <button onClick={() => markCompleted(goal.id, "Long-Term")}>Mark Completed</button>
                <button onClick={() => deleteGoal(goal.id, "Long-Term")}>Delete</button>
              </li>
            ))}
          </ul>
        ) : <p>No long-term goals added.</p>}
      </div>

      {/* Achievements Section */}
      <div className="goal-section achievements">
        <h2>Achievements</h2>
        {achievements.length > 0 ? (
          <ul>
            {achievements.map(goal => (
              <li key={goal.id} className="goal-item completed">
                <strong>{goal.title}</strong> - {goal.description}
                <p>Completed on: {new Date().toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        ) : <p>No achievements yet.</p>}
      </div>
    </div>
  );
};

export default GoalPlanner;
