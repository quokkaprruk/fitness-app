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

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    setLoading(true);
    setError(null);
    try {
      // Mock API call to fetch goals based on userId
      setTimeout(() => {
        const mockGoals = {
          currentGoals: ["Goal 1: Exercise for 30 minutes", "Goal 2: Eat a healthy meal"],
          achievedGoals: ["Goal 3: Drink 8 glasses of water"],
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
    updateGoals({ currentGoals: updatedCurrentGoals, achievedGoals: updatedAchievedGoals });
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
      // Mock API call to update goals
      setTimeout(() => {
        console.log("Goals updated:", updatedGoals);
        setLoading(false);
      }, 500);
    } catch (err) {
      setError("Error updating goals: " + err.message);
      setLoading(false);
    }
  };

  if (loading) {
    return <p>Loading goals...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div id="progress-container" className="progress-container">
      <Navbar isLoggedIn={true} />
      <div className="navbar-spacer"></div>

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
                <button onClick={() => handleRemoveGoal(index, true)}>🗑️</button>
              </div>
            </li>
          ))}
        </ul>
      </div>

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
  );
};

export default Progress;
