// lib/mealData.js
// Meal data functions

// Function to get today's planned meals from localStorage
const getPlannedMeals = () => {
  if (typeof window === 'undefined') return {};
  
  const planned = localStorage.getItem('fitsync-planned-meals');
  return planned ? JSON.parse(planned) : {
    breakfast: null,
    lunch: null,
    dinner: null,
    snack: null
  };
};

// Function to save planned meals
const savePlannedMeals = (meals) => {
  if (typeof window === 'undefined') return;
  
  localStorage.setItem('fitsync-planned-meals', JSON.stringify(meals));
};

export {
  getPlannedMeals,
  savePlannedMeals
};