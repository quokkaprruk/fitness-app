import React, { useState, useEffect, useRef } from "react";
import "./styles/Progress.css";
import confetti from "canvas-confetti";

const Progress = () => {
  const [currentGoals, setCurrentGoals] = useState([]);
  const [achievedGoals, setAchievedGoals] = useState([]);
  const [newGoal, setNewGoal] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState({
    show: false,
    index: null,
    isAchieved: false,
  });

  // Workout states
  const [workoutLoggedToday, setWorkoutLoggedToday] = useState(false); // Tracks if workout is logged today
  const [workoutStreak, setWorkoutStreak] = useState(0); // Tracks workout streak
  const [lastWorkoutDate, setLastWorkoutDate] = useState(null); // Tracks last workout date
  const [workoutDuration, setWorkoutDuration] = useState(0); // Workout duration input by user
  const [logError, setLogError] = useState("");

  // Food search states
  const [foodQuery, setFoodQuery] = useState("");
  const [quantity, setQuantity] = useState("");
  const [foodResults, setFoodResults] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  const [selectedFoodIndex, setSelectedFoodIndex] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [quantityError, setQuantityError] = useState("");

  const [meals, setMeals] = useState([]);
  const [currentMealIndex, setCurrentMealIndex] = useState(null);

  const [totalNutrition, setTotalNutrition] = useState([]);

  const [currentDate, setCurrentDate] = useState(new Date());

  const workoutButtonRef = useRef(null);

  useEffect(() => {
    fetchGoals();
    checkIfWorkoutLoggedToday();

    // Update current date every minute
    const intervalId = setInterval(() => {
      setCurrentDate(new Date());
    }, 60000);

    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    // Check if a day has been missed and reset the streak
    if (lastWorkoutDate) {
      const today = new Date();
      const lastWorkout = new Date(lastWorkoutDate);
      const timeDiff = today.getTime() - lastWorkout.getTime();
      const dayDiff = Math.floor(timeDiff / (1000 * 3600 * 24));

      if (dayDiff > 1) {
        setWorkoutStreak(0);
      }
    }
  }, [lastWorkoutDate]);

  // Function to check if workout has been logged today
  const checkIfWorkoutLoggedToday = () => {
    const storedDate = localStorage.getItem("lastWorkoutDate");
    if (storedDate) {
      const storedDateObj = new Date(storedDate);
      const today = new Date();
      if (
        storedDateObj.getDate() === today.getDate() &&
        storedDateObj.getMonth() === today.getMonth() &&
        storedDateObj.getFullYear() === today.getFullYear()
      ) {
        setWorkoutLoggedToday(true);
      } else {
        setWorkoutLoggedToday(false);
      }
    }
  };

  const fetchGoals = async () => {
    setLoading(true);
    setError(null);
    try {
      // Retrieve goals from localStorage
      const storedCurrentGoals = localStorage.getItem("currentGoals");
      const storedAchievedGoals = localStorage.getItem("achievedGoals");

      // If goals are stored, parse them, otherwise use initial values
      const initialCurrentGoals = storedCurrentGoals
        ? JSON.parse(storedCurrentGoals)
        : [];
      const initialAchievedGoals = storedAchievedGoals
        ? JSON.parse(storedAchievedGoals)
        : [];

      setCurrentGoals(initialCurrentGoals);
      setAchievedGoals(initialAchievedGoals);
      setLoading(false);
    } catch (err) {
      setError("Error fetching goals: " + err.message);
      setLoading(false);
    }
  };

  const handleAddGoal = () => {
    if (newGoal.trim() !== "") {
      const updatedGoals = [...currentGoals, newGoal];
      setCurrentGoals(updatedGoals);
      setNewGoal("");
      updateGoals({ currentGoals: updatedGoals, achievedGoals });
    }
  };

  const handleCompleteGoal = (index) => {
    const goalToComplete = currentGoals[index];
    const updatedCurrentGoals = currentGoals.filter((_, i) => i !== index);
    const updatedAchievedGoals = [...achievedGoals, goalToComplete];
    setCurrentGoals(updatedCurrentGoals);
    setAchievedGoals(updatedAchievedGoals);
    updateGoals({
      currentGoals: updatedCurrentGoals,
      achievedGoals: updatedAchievedGoals,
    });
  };

  const handleRemoveGoal = (index, isAchieved = false) => {
    setShowConfirmation({ show: true, index, isAchieved });
  };

  const confirmRemoveGoal = () => {
    const { index, isAchieved } = showConfirmation;
    let updatedGoals;
    if (isAchieved) {
      updatedGoals = achievedGoals.filter((_, i) => i !== index);
      setAchievedGoals(updatedGoals);
      updateGoals({ currentGoals, achievedGoals: updatedGoals });
    } else {
      updatedGoals = currentGoals.filter((_, i) => i !== index);
      setCurrentGoals(updatedGoals);
      updateGoals({ currentGoals: updatedGoals, achievedGoals });
    }
    setShowConfirmation({ show: false, index: null, isAchieved: false });
  };

  const cancelRemoveGoal = () => {
    setShowConfirmation({ show: false, index: null, isAchieved: false });
  };

  const updateGoals = async (updatedGoals) => {
    setLoading(true);
    setError(null);
    try {
      // Convert goals to JSON strings and store in localStorage
      localStorage.setItem(
        "currentGoals",
        JSON.stringify(updatedGoals.currentGoals)
      );
      localStorage.setItem(
        "achievedGoals",
        JSON.stringify(updatedGoals.achievedGoals)
      );

      console.log("Goals updated:", updatedGoals);
      setLoading(false);
    } catch (err) {
      setError("Error updating goals: " + err.message);
      setLoading(false);
    }
  };

  // Function to handle logging a workout
  const fetchWorkoutData = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage
      const response = await axios.get(
        "http://localhost:8000/api/users/log-workout/status",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const data = response.data;
        setWorkoutLoggedToday(data.workoutLoggedToday);
        setLastWorkoutDate(data.lastWorkoutDate);
        setWorkoutStreak(data.workoutStreak);
      }
    } catch (error) {
      console.error("Error fetching workout data:", error);
    }
  };

  // Function to handle logging a workout
  const handleLogWorkout = async () => {
    try {
      const token = localStorage.getItem("token"); // Retrieve token from localStorage

      if (!workoutLoggedToday) {
        const response = await axios.post(
          "http://localhost:8000/api/users/log-workout",
          { workout: workoutDuration }, // Send workout duration to backend
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          const today = new Date();
          setWorkoutStreak(workoutStreak + 1);
          setLastWorkoutDate(today.toISOString());
          setWorkoutLoggedToday(true);
          setLogError("");

          // Trigger confetti animation
          if (workoutButtonRef.current) {
            const buttonRect = workoutButtonRef.current.getBoundingClientRect();
            const buttonCenterX = buttonRect.left + buttonRect.width / 2;
            const buttonCenterY = buttonRect.top + buttonRect.height / 2;

            confetti({
              origin: {
                x: buttonCenterX / window.innerWidth,
                y: buttonCenterY / window.innerHeight,
              },
              spread: 150,
              ticks: 60,
              gravity: 0.7,
              decay: 0.94,
              startVelocity: 50,
              colors: ["#26ccff", "#a29afd", "#ff5b5b", "#fd9644"],
              shapes: ["star", "circle"],
              scalar: 1.2,
            });
          }
        } else {
          setLogError("Failed to log workout!");
        }
      } else {
        setLogError("You have already logged your workout for today!");

        // Set a timeout to clear the error message after 3 seconds
        setTimeout(() => {
          setLogError("");
        }, 3000);
      }
    } catch (error) {
      console.error("Error logging workout:", error);
      setLogError(error.response?.data?.message || "Server error");
    }
  };

  useEffect(() => {
    fetchWorkoutData(); // Fetch initial data on component mount
  }, []);

  // Fetch food data from API
  const fetchFoodData = async () => {
    if (!foodQuery.trim()) return;
    setApiError(null);
    setFoodResults([]);
    setSelectedFood(null);
    setSelectedFoodIndex(null);

    try {
      const response = await fetch(
        `https://api.nal.usda.gov/fdc/v1/foods/search?query=${foodQuery}&api_key=zq2VTgX3oWnH5mWd0FZwmjPAIvbPwWTW95fb0qNU`
      );
      const data = await response.json();
      console.log(data);

      if (data.foods && data.foods.length > 0) {
        // Remove duplicates based on food name
        const uniqueFoods = Array.from(
          new Map(data.foods.map((food) => [food.description, food])).values()
        );
        setFoodResults(uniqueFoods.slice(0, 5)); // Store top 5 unique results
      } else {
        setApiError("No results found.");
        setFoodResults([]);
      }
    } catch (err) {
      setApiError("Error fetching food data.");
      setFoodResults([]);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setQuantity(value);

    if (!/^\d*$/.test(value)) {
      setQuantityError("Please enter a valid number");
    } else if (parseInt(value) < 1 && value !== "") {
      setQuantityError("Quantity must be at least 1 gram");
    } else {
      setQuantityError("");
    }
  };

  useEffect(() => {
    if (quantity !== "" && quantityError === "") {
      fetchFoodData();
    } else {
      setFoodResults([]);
    }
  }, [quantity, quantityError, foodQuery]);

  const getNutrientValue = (nutrientName) => {
    if (
      selectedFood &&
      selectedFood.foodNutrients &&
      selectedFood.foodNutrients.length > 0
    ) {
      const nutrient = selectedFood.foodNutrients.find(
        (n) => n.nutrientName === nutrientName
      );
      return nutrient ? (nutrient.value * (quantity / 100)).toFixed(2) : 0;
    }
    return 0;
  };

  const handleAddToTotal = () => {
    if (selectedFood) {
      const newEntry = {
        name: selectedFood.description,
        quantity: quantity,
        calories: parseFloat(getNutrientValue("Energy")),
        protein: parseFloat(getNutrientValue("Protein")),
        carbohydrates: parseFloat(
          getNutrientValue("Carbohydrate, by difference")
        ),
        cholesterol: parseFloat(getNutrientValue("Cholesterol")),
        sugars: parseFloat(getNutrientValue("Total Sugars")),
        fiber: parseFloat(getNutrientValue("Fiber, total dietary")),
      };

      setTotalNutrition([...totalNutrition, newEntry]);
      setSelectedFood(null);
      setSelectedFoodIndex(null);
      setQuantity("");
      setFoodQuery("");
    }
  };

  const handleFoodSelect = (food, index) => {
    setSelectedFood(food);
    setSelectedFoodIndex(index);
  };

  const handleRemoveFromTotal = (index) => {
    const updatedTotal = [...totalNutrition];
    updatedTotal.splice(index, 1);
    setTotalNutrition(updatedTotal);
  };

  const calculateTotals = () => {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbohydrates = 0;
    let totalCholesterol = 0;
    let totalSugars = 0;
    let totalFiber = 0;

    totalNutrition.forEach((item) => {
      totalCalories += item.calories;
      totalProtein += item.protein;
      totalCarbohydrates += item.carbohydrates;
      totalCholesterol += item.cholesterol;
      totalSugars += item.sugars;
      totalFiber += item.fiber;
    });

    return {
      calories: totalCalories.toFixed(2),
      protein: totalProtein.toFixed(2),
      carbohydrates: totalCarbohydrates.toFixed(2),
      cholesterol: totalCholesterol.toFixed(2),
      sugars: totalSugars.toFixed(2),
      fiber: totalFiber.toFixed(2),
    };
  };

  const totals = calculateTotals();

  // Date formatting options
  const dateFormatOptions = {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  };

  // Add a new meal
  const handleAddMeal = () => {
    const newMealName = `Meal ${meals.length + 1}`;
    setMeals([...meals, { name: newMealName, items: [] }]);
    setCurrentMealIndex(meals.length);
  };

  // Add food to the current meal
  const handleAddToMeal = () => {
    if (selectedFood && currentMealIndex !== null) {
      const newEntry = {
        name: selectedFood.description,
        quantity: quantity,
        calories: parseFloat(getNutrientValue("Energy")),
        protein: parseFloat(getNutrientValue("Protein")),
        carbohydrates: parseFloat(
          getNutrientValue("Carbohydrate, by difference")
        ),
        cholesterol: parseFloat(getNutrientValue("Cholesterol")),
        sugars: parseFloat(getNutrientValue("Total Sugars")),
        fiber: parseFloat(getNutrientValue("Fiber, total dietary")),
      };

      // Add food to the active meal
      const updatedMeals = [...meals];
      updatedMeals[currentMealIndex].items.push(newEntry);
      setMeals(updatedMeals);

      // Reset inputs after adding
      setSelectedFood(null);
      setSelectedFoodIndex(null);
      setQuantity("");
      setFoodQuery("");
    }
  };

  // Remove an item from a specific meal
  const handleRemoveFromMeal = (mealIndex, itemIndex) => {
    const updatedMeals = [...meals];
    updatedMeals[mealIndex].items.splice(itemIndex, 1);
    setMeals(updatedMeals);
  };

  // Calculate totals for a specific meal or all meals combined
  const calculateTotalsForMeal = (meal) => {
    let totalCalories = 0;
    let totalProtein = 0;
    let totalCarbohydrates = 0;
    let totalCholesterol = 0;
    let totalSugars = 0;
    let totalFiber = 0;

    meal.items.forEach((item) => {
      totalCalories += item.calories;
      totalProtein += item.protein;
      totalCarbohydrates += item.carbohydrates;
      totalCholesterol += item.cholesterol;
      totalSugars += item.sugars;
      totalFiber += item.fiber;
    });

    return {
      calories: totalCalories.toFixed(2),
      protein: totalProtein.toFixed(2),
      carbohydrates: totalCarbohydrates.toFixed(2),
      cholesterol: totalCholesterol.toFixed(2),
      sugars: totalSugars.toFixed(2),
      fiber: totalFiber.toFixed(2),
    };
  };

  const calculateTotalsForIndividualItems = () => {
    let totals = {
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      cholesterol: 0,
      sugars: 0,
      fiber: 0,
    };

    totalNutrition.forEach((item) => {
      totals.calories += parseFloat(item.calories);
      totals.protein += parseFloat(item.protein);
      totals.carbohydrates += parseFloat(item.carbohydrates);
      totals.cholesterol += parseFloat(item.cholesterol);
      totals.sugars += parseFloat(item.sugars);
      totals.fiber += parseFloat(item.fiber);
    });

    return {
      calories: totals.calories.toFixed(2),
      protein: totals.protein.toFixed(2),
      carbohydrates: totals.carbohydrates.toFixed(2),
      cholesterol: totals.cholesterol.toFixed(2),
      sugars: totals.sugars.toFixed(2),
      fiber: totals.fiber.toFixed(2),
    };
  };

  // Calculate overall totals for all meals combined
  const calculateOverallTotals = () => {
    let overallTotals = {
      calories: 0,
      protein: 0,
      carbohydrates: 0,
      cholesterol: 0,
      sugars: 0,
      fiber: 0,
    };

    meals.forEach((meal) => {
      const mealTotals = calculateTotalsForMeal(meal);
      overallTotals.calories += parseFloat(mealTotals.calories);
      overallTotals.protein += parseFloat(mealTotals.protein);
      overallTotals.carbohydrates += parseFloat(mealTotals.carbohydrates);
      overallTotals.cholesterol += parseFloat(mealTotals.cholesterol);
      overallTotals.sugars += parseFloat(mealTotals.sugars);
      overallTotals.fiber += parseFloat(mealTotals.fiber);
    });

    totalNutrition.forEach((item) => {
      overallTotals.calories += parseFloat(item.calories);
      overallTotals.protein += parseFloat(item.protein);
      overallTotals.carbohydrates += parseFloat(item.carbohydrates);
      overallTotals.cholesterol += parseFloat(item.cholesterol);
      overallTotals.sugars += parseFloat(item.sugars);
      overallTotals.fiber += parseFloat(item.fiber);
    });

    return {
      calories: overallTotals.calories.toFixed(2),
      protein: overallTotals.protein.toFixed(2),
      carbohydrates: overallTotals.carbohydrates.toFixed(2),
      cholesterol: overallTotals.cholesterol.toFixed(2),
      sugars: overallTotals.sugars.toFixed(2),
      fiber: overallTotals.fiber.toFixed(2),
    };
  };

  const overallTotals = calculateOverallTotals();

  // Function to handle deleting a meal
  const handleDeleteMeal = (mealIndex) => {
    const updatedMeals = [...meals];
    updatedMeals.splice(mealIndex, 1); // Remove the meal at mealIndex

    // Update meal names to maintain sequential order
    const renumberedMeals = updatedMeals.map((meal, index) => ({
      ...meal,
      name: `Meal ${index + 1}`,
    }));

    setMeals(renumberedMeals); // Set the updated meals
    setCurrentMealIndex(null); // Reset current meal index
  };

  if (loading) return <p>Loading goals...</p>;

  return (
    <div id="progress-container" className="progress-container">
      <div className="progress-navbar-spacer"></div>
      <div className="main-content-wrapper">
        {/* Food Section */}
        <div className="food-section">
          {/* Food Calorie Search */}
          <div className="food-search">
            {/* Existing search inputs and buttons remain unchanged */}
            <h3>Check Nutritional Value</h3>
            <button className="meal-btn" onClick={handleAddMeal}>
              Add Meal
            </button>

            <input
              type="text"
              placeholder="Search food (e.g., banana)"
              value={foodQuery}
              onChange={(e) => setFoodQuery(e.target.value)}
            />
            <input
              type="number"
              min="0"
              placeholder="Enter quantity (g)"
              value={quantity}
              onChange={handleChange}
            />
            {quantityError && (
              <p className="quantity-error" style={{ color: "red" }}>
                {quantityError}
              </p>
            )}
            <button onClick={fetchFoodData} disabled={!!quantityError}>
              Search
            </button>
            {apiError && <p className="error">{apiError}</p>}

            {/* Food Results List */}
            {foodResults.length > 0 && (
              <ul className="food-results">
                {foodResults.map((food, index) => (
                  <li
                    key={index}
                    onClick={() => handleFoodSelect(food, index)}
                    className={index === selectedFoodIndex ? "selected" : ""}
                  >
                    {food.description}
                  </li>
                ))}
              </ul>
            )}

            {/* Add as Individual Button */}
            <button
              onClick={() => {
                if (!selectedFood) {
                  alert(
                    "Error: Please search for a food before adding as an individual item."
                  );
                } else {
                  handleAddToTotal();
                }
              }}
            >
              Add as Individual
            </button>

            {/* Add to Meal Button */}
            <button
              onClick={() => {
                if (!selectedFood) {
                  alert(
                    "Error: Please search for a food before adding to a meal."
                  );
                } else if (currentMealIndex === null) {
                  alert("Error: Please select or create a meal first.");
                } else {
                  handleAddToMeal();
                }
              }}
            >
              Add to Meal{" "}
              {currentMealIndex !== null ? `(${currentMealIndex + 1})` : ""}
            </button>
          </div>

          {/* Updated Nutrition Table with Meal Support */}
          <div className="total-nutrition">
            <h3>Nutrition Composition</h3>
            <table>
              <thead>
                <tr>
                  <th>Meal/Ingredient</th>
                  <th>Quantity (g)</th>
                  <th>Calories</th>
                  <th>Protein</th>
                  <th>Carbs</th>
                  <th>Cholesterol</th>
                  <th>Sugars</th>
                  <th>Fiber</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {meals.map((meal, mealIndex) => (
                  <React.Fragment key={`meal-fragment-${mealIndex}`}>
                    {/* Meal Header */}
                    <tr key={`meal-${mealIndex}`} className="meal-header">
                      <td colSpan="9">
                        🍴 {meal.name} ({meal.items.length} items)
                        <button
                          onClick={() => setCurrentMealIndex(mealIndex)}
                          disabled={currentMealIndex === mealIndex}
                        >
                          Edit
                        </button>
                        {/* Delete Meal Button */}
                        <button onClick={() => handleDeleteMeal(mealIndex)}>
                          Delete Meal
                        </button>
                      </td>
                    </tr>

                    {/* Meal Items */}
                    {meal.items.map((item, itemIndex) => (
                      <tr key={`${mealIndex}-${itemIndex}`}>
                        <td>{item.name}</td>
                        <td>{item.quantity}</td>
                        <td>{item.calories}</td>
                        <td>{item.protein}</td>
                        <td>{item.carbohydrates}</td>
                        <td>{item.cholesterol}</td>
                        <td>{item.sugars}</td>
                        <td>{item.fiber}</td>
                        <td>
                          <button
                            onClick={() =>
                              handleRemoveFromMeal(mealIndex, itemIndex)
                            }
                            className="remove-btn"
                          >
                            🗑️
                          </button>
                        </td>
                      </tr>
                    ))}

                    {/* Meal Subtotal */}
                    <tr className="meal-subtotal">
                      <td>Meal Total</td>
                      <td></td>
                      {Object.values(calculateTotalsForMeal(meal)).map(
                        (value, idx) => (
                          <td key={idx}>
                            <strong>{value}</strong>
                          </td>
                        )
                      )}
                      <td></td>
                    </tr>
                  </React.Fragment>
                ))}

                {/*Individual Item Display*/}
                <td colSpan="9">
                  <strong>🍴 Individual Food Items</strong>
                </td>

                {totalNutrition.map((item, index) => (
                  <tr key={`total-${index}`}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>{item.calories}</td>
                    <td>{item.protein}</td>
                    <td>{item.carbohydrates}</td>
                    <td>{item.cholesterol}</td>
                    <td>{item.sugars}</td>
                    <td>{item.fiber}</td>
                    <td>
                      <button
                        onClick={() => handleRemoveFromTotal(index)}
                        className="remove-btn"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}

                {/* Individual Food Items Totals */}
                {totalNutrition.length > 0 && (
                  <tr className="individual-totals">
                    <td>
                      <strong>Individual Totals</strong>
                    </td>
                    <td></td>
                    {Object.values(calculateTotalsForIndividualItems()).map(
                      (value, idx) => (
                        <td key={idx}>
                          <strong>{value}</strong>
                        </td>
                      )
                    )}
                  </tr>
                )}

                {/* Overall Total */}
                {meals.length > 0 || totalNutrition.length > 0 ? (
                  <tr className="overall-total">
                    <td>📊 Daily Total</td>
                    <td></td>
                    {Object.values(calculateOverallTotals()).map(
                      (value, idx) => (
                        <td key={idx}>
                          <strong>{value}</strong>
                        </td>
                      )
                    )}
                    <td></td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        </div>
        {/* Workout Section */}
        <div className="workout-section">
          <h3 className="date-display">
            Today is:{" "}
            {currentDate.toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </h3>
          <div className="add-workout">
            <button
              onClick={handleLogWorkout}
              ref={workoutButtonRef}
              disabled={workoutLoggedToday}
              className={workoutLoggedToday ? "disabled-button" : ""}
            >
              Log Workout +
            </button>
            {workoutLoggedToday && (
              <p className="error">
                You have already logged your workout for today!
              </p>
            )}
          </div>
          <div className="workout-streak">
            {workoutStreak === 0 ? (
              <p className="message-workout">Time to get started!</p>
            ) : (
              <p className="message-workout">
                Number of days you have consistently worked out for:
              </p>
            )}
            <p className="workout-streak-number">{workoutStreak}</p>
          </div>
          {logError && <p className="error-message">{logError}</p>}
        </div>

        {/* Goals Section */}
        <div className="goals-section">
          <h3>Current Goals</h3>
          <div className="add-goal">
            <input
              type="text"
              placeholder="Add a goal"
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
            />
            <button onClick={handleAddGoal}>Add Goal +</button>
          </div>
          <ul className="goals-list">
            {currentGoals.map((goal, index) => (
              <li key={index} className="goal-item">
                <span className="goal-text">{goal}</span>
                <div className="goal-actions">
                  <button onClick={() => handleCompleteGoal(index)}>✔️</button>
                  <button onClick={() => handleRemoveGoal(index)}>🗑️</button>
                </div>
              </li>
            ))}
          </ul>

          <h3>Achieved Goals</h3>
          <ul className="goals-list">
            {achievedGoals.map((goal, index) => (
              <li key={index} className="goal-item achieved">
                <span className="goal-text">{goal}</span>
                <div className="goal-actions">
                  <button
                    className="achieved-bin-button"
                    onClick={() => handleRemoveGoal(index, true)}
                  >
                    🗑️
                  </button>
                </div>
              </li>
            ))}
          </ul>

          {/* Confirmation Modal */}
          {showConfirmation.show && (
            <div className="confirmation-modal">
              <div className="modal-content">
                <p>Are you sure you want to remove this goal?</p>
                <div className="modal-buttons">
                  <button className="yes-btn" onClick={confirmRemoveGoal}>
                    Yes
                  </button>
                  <button className="no-btn" onClick={cancelRemoveGoal}>
                    No
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Progress;
