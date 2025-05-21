import React, { useState, useEffect } from "react";
import "./DietPlanner.css";

const CATEGORIES = ["Breakfast", "Lunch", "Dinner", "Snacks"];

const DietPlanner = () => {
  const [meals, setMeals] = useState([]);
  const [mealName, setMealName] = useState("");
  const [calories, setCalories] = useState("");
  const [category, setCategory] = useState("Breakfast");
  const [dailyCalorieGoal, setDailyCalorieGoal] = useState(2000);

  useEffect(() => {
    const savedMeals = JSON.parse(localStorage.getItem("meals")) || [];
    setMeals(savedMeals);
  }, []);

  useEffect(() => {
    localStorage.setItem("meals", JSON.stringify(meals));
  }, [meals]);

  const addMeal = () => {
    if (mealName.trim() && calories > 0) {
      const newMeal = { id: Date.now(), name: mealName, calories: parseInt(calories), category };
      setMeals([...meals, newMeal]);
      setMealName("");
      setCalories("");
    }
  };

  const deleteMeal = (id) => {
    setMeals(meals.filter((meal) => meal.id !== id));
  };

  const totalCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const remainingCalories = dailyCalorieGoal - totalCalories;

  return (
    <div className="diet-planner">
      <h1>Diet Planner</h1>

      {/* Daily Calorie Goal Input */}
      <div className="calorie-goal">
        <label>Daily Calorie Goal:</label>
        <input
          type="number"
          value={dailyCalorieGoal}
          onChange={(e) => setDailyCalorieGoal(Number(e.target.value))}
        />
      </div>

      {/* Meal Input Section */}
      <div className="meal-input">
        <input
          type="text"
          value={mealName}
          onChange={(e) => setMealName(e.target.value)}
          placeholder="Enter meal name..."
        />
        <input
          type="number"
          value={calories}
          onChange={(e) => setCalories(e.target.value)}
          placeholder="Enter calories..."
        />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <button onClick={addMeal}>Add Meal</button>
      </div>

      {/* Display Meals */}
      <div className="meal-list">
        <h2>Tracked Meals</h2>
        {meals.length > 0 ? (
          <ul>
            {meals.map((meal) => (
              <li key={meal.id} className={`meal-item category-${meal.category.toLowerCase()}`}>
                <strong>{meal.name}</strong> - {meal.calories} cal ({meal.category})
                <button onClick={() => deleteMeal(meal.id)}>Delete</button>
              </li>
            ))}
          </ul>
        ) : (
          <p>No meals added yet.</p>
        )}
      </div>

      {/* Calorie Summary */}
      <div className="calorie-summary">
        <h2>Daily Calories</h2>
        <p><strong>Total:</strong> {totalCalories} / {dailyCalorieGoal} cal</p>
        <p className={remainingCalories < 0 ? "over-limit" : ""}>
          <strong>Remaining:</strong> {remainingCalories >= 0 ? remainingCalories : `Over limit by ${Math.abs(remainingCalories)} cal`}
        </p>
      </div>
    </div>
  );
};

export default DietPlanner;

