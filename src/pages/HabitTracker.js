import React, { useState, useEffect } from "react";
import "./HabitTracker.css";

const SOCIAL_MEDIA = ["Instagram", "Twitter", "YouTube", "TikTok", "Facebook", "Reddit"];

const HabitTracker = () => {
  const [habits, setHabits] = useState([]);
  const [habitName, setHabitName] = useState("");
  const [habitType, setHabitType] = useState("Lifestyle");
  const [startDate, setStartDate] = useState("");
  const [dailyLimit, setDailyLimit] = useState(60); // Default limit in minutes

  useEffect(() => {
    const savedHabits = JSON.parse(localStorage.getItem("habits")) || [];
    setHabits(savedHabits);
  }, []);

  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  const addHabit = () => {
    if (habitName.trim()) {
      const newHabit = { 
        id: Date.now(), 
        name: habitName, 
        type: habitType, 
        startDate, 
        dailyLimit, 
        usage: 0,
        completedDays: []
      };
      setHabits([...habits, newHabit]);
      setHabitName("");
      setStartDate("");
    }
  };

  const logUsage = (id, minutes) => {
    setHabits(habits.map(habit => {
      if (habit.id === id) {
        habit.usage += minutes;
        if (habit.usage >= habit.dailyLimit) {
          alert(`Warning: You've exceeded your daily limit for ${habit.name}!`);
        }
      }
      return habit;
    }));
  };

  const deleteHabit = (id) => {
    setHabits(habits.filter(habit => habit.id !== id));
  };

  return (
    <div className="habit-tracker">
      <h1>Habit & Screen Time Tracker</h1>

      {/* Habit Input Section */}
      <div className="habit-input">
        <input
          type="text"
          value={habitName}
          onChange={(e) => setHabitName(e.target.value)}
          placeholder="Enter habit name..."
        />
        <select value={habitType} onChange={(e) => setHabitType(e.target.value)}>
          <option value="Lifestyle">Lifestyle</option>
          <option value="Social Media">Social Media</option>
        </select>
        {habitType === "Social Media" && (
          <>
            <select onChange={(e) => setHabitName(e.target.value)}>
              {SOCIAL_MEDIA.map(app => (
                <option key={app} value={app}>{app}</option>
              ))}
            </select>
            <input
              type="number"
              value={dailyLimit}
              onChange={(e) => setDailyLimit(Number(e.target.value))}
              placeholder="Set daily limit (minutes)"
            />
          </>
        )}
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        <button onClick={addHabit}>Add Habit</button>
      </div>

      {/* Display Habits */}
      <div className="habit-list">
        <h2>Tracked Habits</h2>
        {habits.length > 0 ? (
          <ul>
            {habits.map((habit) => (
              <li key={habit.id} className="habit-item">
                <strong>{habit.name}</strong> ({habit.type})
                <p>Start Date: {habit.startDate ? new Date(habit.startDate).toLocaleDateString() : "No start date set"}</p>
                {habit.type === "Social Media" && (
                  <>
                    <p>Daily Limit: {habit.dailyLimit} min</p>
                    <p>Usage Today: {habit.usage} min</p>
                    <button onClick={() => logUsage(habit.id, 10)}>+10 min</button>
                    <button onClick={() => logUsage(habit.id, 30)}>+30 min</button>
                  </>
                )}
                <button onClick={() => deleteHabit(habit.id)}>Delete</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No habits added yet.</p>
        )}
      </div>
    </div>
  );
};

export default HabitTracker;
