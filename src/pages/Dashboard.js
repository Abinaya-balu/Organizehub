import React, { useEffect, useState } from "react";
import "./Dashboard.css";

const Dashboard = ({ tasks }) => {
  const [taskSummary, setTaskSummary] = useState({
    total: 0,
    completed: 0,
    pending: 0,
    overdue: 0,
    upcomingTasks: [],
  });

  useEffect(() => {
    if (tasks) {
      const completedTasks = tasks.filter((task) => task.completed).length;
      const pendingTasks = tasks.filter((task) => !task.completed).length;
      const overdueTasks = tasks.filter((task) => task.dueDate && new Date(task.dueDate) < new Date()).length;

      const upcomingTasks = tasks
        .filter((task) => task.dueDate && new Date(task.dueDate) >= new Date() && !task.completed)
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 5); // Display next 5 tasks

      setTaskSummary({
        total: tasks.length,
        completed: completedTasks,
        pending: pendingTasks,
        overdue: overdueTasks,
        upcomingTasks,
      });
    }
  }, [tasks]);

  return (
    <div className="dashboard">
      <h1>Dashboard Overview</h1>

      <div className="stats-container">
        <div className="stat-box">
          <h2>Total Tasks</h2>
          <p>{taskSummary.total}</p>
        </div>
        <div className="stat-box completed">
          <h2>Completed</h2>
          <p>{taskSummary.completed}</p>
        </div>
        <div className="stat-box pending">
          <h2>Pending</h2>
          <p>{taskSummary.pending}</p>
        </div>
        <div className="stat-box overdue">
          <h2>Overdue</h2>
          <p>{taskSummary.overdue}</p>
        </div>
      </div>

      <div className="upcoming-tasks">
        <h2>Upcoming Tasks</h2>
        {taskSummary.upcomingTasks.length > 0 ? (
          <ul>
            {taskSummary.upcomingTasks.map((task) => (
              <li key={task.id}>
                <strong>{task.text}</strong> - Due: {new Date(task.dueDate).toLocaleDateString()}
              </li>
            ))}
          </ul>
        ) : (
          <p>No upcoming tasks.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
