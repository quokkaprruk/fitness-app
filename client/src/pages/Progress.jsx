import React, { useState, useEffect } from "react";
import "./styles/Progress.css";
import Navbar from "../components/Navbar.jsx";

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

  // Food search states
  const [foodQuery, setFoodQuery] = useState("");
  const [quantity, setQuantity] = useState("");
  const [foodResults, setFoodResults] = useState([]);
  const [selectedFood, setSelectedFood] = useState(null);
  // New state to keep track of the index of the selected food item
  const [selectedFoodIndex, setSelectedFoodIndex] = useState(null);
  const [apiError, setApiError] = useState(null);
  const [quantityError, setQuantityError] = useState("");

  // Total nutrition states
  const [totalNutrition, setTotalNutrition] = useState([]);

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    setLoading(true);
    setError(null);
    try {
      // Mock API call to fetch goals
      setTimeout(() => {
        const mockGoals = {
          currentGoals: ["Exercise for 30 minutes", "Eat a healthy meal"],
          achievedGoals: ["Drink 8 glasses of water"],
        };
        setCurrentGoals(mockGoals.currentGoals);
        setAchievedGoals(mockGoals.achievedGoals);
        setLoading(false);
      }, 500);
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
      setTimeout(() => {
        console.log("Goals updated:", updatedGoals);
        setLoading(false);
      }, 500);
    } catch (err) {
      setError("Error updating goals: " + err.message);
      setLoading(false);
    }
  };

  // Fetch food data from API
  const fetchFoodData = async () => {
    if (!foodQuery.trim()) return;
    setApiError(null);
    setFoodResults([]);
    setSelectedFood(null);
    setSelectedFoodIndex(null); // Reset selected index when fetching new data

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
      setSelectedFood(null); // Clear selected food after adding to total
      setSelectedFoodIndex(null); // Also clear the selected index
      setQuantity(""); // Clear quantity field after adding to total
      setFoodQuery(""); // Clear search field after adding to total
    }
  };

  const handleFoodSelect = (food, index) => {
    setSelectedFood(food);
    setSelectedFoodIndex(index); // Store the index of the selected food
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

  if (loading) return <p>Loading goals...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div id="progress-container" className="progress-container">
      <Navbar isLoggedIn={true} />
      <div className="progress-navbar-spacer"></div>
      <div className="main-content-wrapper">
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
                  <button onClick={() => handleRemoveGoal(index, true)}>
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
                  <button onClick={confirmRemoveGoal}>Yes</button>
                  <button onClick={cancelRemoveGoal}>No</button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Food Section */}
        <div className="food-section">
          {/* Food Calorie Search */}
          <div className="food-search">
            <h3>Check Nutritional Value</h3>
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
              <p className="quantity-error" style={{ color: "red" }}>{quantityError}</p>
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
            <button onClick={handleAddToTotal} disabled={!selectedFood}>
              Add to Total
            </button>
          </div>

          {/* Total Nutrition Composition */}
          <div className="total-nutrition">
            <h3>Total Nutrition Composition</h3>
            <table>
              <thead>
                <tr>
                  <th>Ingredient</th>
                  <th>Quantity (g)</th>
                  <th>Calories (kcal)</th>
                  <th>Protein (g)</th>
                  <th>Carbs (g)</th>
                  <th>Cholesterol (mg)</th>
                  <th>Sugars (g)</th>
                  <th>Fiber (g)</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {totalNutrition.map((item, index) => (
                  <tr key={index}>
                    <td>{item.name}</td>
                    <td>{item.quantity}</td>
                    <td>{item.calories}</td>
                    <td>{item.protein}</td>
                    <td>{item.carbohydrates}</td>
                    <td>{item.cholesterol}</td>
                    <td>{item.sugars}</td>
                    <td>{item.fiber}</td>
                    <td>
                      <button onClick={() => handleRemoveFromTotal(index)}>
                        X
                      </button>
                    </td>
                  </tr>
                ))}
                <tr>
                  <th>Total</th>
                  <th></th>
                  <th>{totals.calories}</th>
                  <th>{totals.protein}</th>
                  <th>{totals.carbohydrates}</th>
                  <th>{totals.cholesterol}</th>
                  <th>{totals.sugars}</th>
                  <th>{totals.fiber}</th>
                  <th></th>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Progress;
