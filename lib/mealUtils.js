// Utility functions for meal data processing and calculations

// Function to calculate total nutrition from meal history
export function calculateDailyNutrition(mealHistory) {
  if (!Array.isArray(mealHistory) || mealHistory.length === 0) {
    return {
      totalCalories: 0,
      totalProtein: 0,
      totalCarbs: 0,
      totalFat: 0
    };
  }

  return mealHistory.reduce((totals, meal) => {
    return {
      totalCalories: totals.totalCalories + (meal.calories || 0),
      totalProtein: totals.totalProtein + (meal.protein || 0),
      totalCarbs: totals.totalCarbs + (meal.carbs || 0),
      totalFat: totals.totalFat + (meal.fat || 0)
    };
  }, {
    totalCalories: 0,
    totalProtein: 0,
    totalCarbs: 0,
    totalFat: 0
  });
}

// Function to format nutrition values for display
export function formatNutritionValues(nutrition) {
  return {
    calories: Math.round(nutrition.calories || 0),
    protein: Math.round(nutrition.protein || 0),
    carbs: Math.round(nutrition.carbs || 0),
    fat: Math.round(nutrition.fat || 0)
  };
}

// Function to validate meal data
export function validateMealData(mealData) {
  if (!mealData || typeof mealData !== 'object') {
    return {
      isValid: false,
      errors: ['Meal data is required and must be an object']
    };
  }

  const requiredFields = ['calories', 'protein', 'carbs', 'fat', 'mealName'];
  const errors = [];

  for (const field of requiredFields) {
    if (mealData[field] === undefined || mealData[field] === null) {
      errors.push(`${field} is required`);
    } else if (typeof mealData[field] === 'number') {
      if (mealData[field] < 0) {
        errors.push(`${field} cannot be negative`);
      } else if (field === 'calories' && mealData[field] > 10000) {
        errors.push(`${field} value seems unrealistic (>10000)`);
      } else if ((field === 'protein' || field === 'carbs' || field === 'fat') && mealData[field] > 500) {
        errors.push(`${field} value seems unrealistic (>500g)`);
      }
    } else if (field === 'mealName' && typeof mealData[field] !== 'string') {
      errors.push(`${field} must be a string`);
    }
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

// Function to generate a unique ID for meals
export function generateMealId() {
  return `meal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

// Function to get today's date in YYYY-MM-DD format
export function getTodayDate() {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

// Function to group meals by date
export function groupMealsByDate(mealHistory) {
  return mealHistory.reduce((grouped, meal) => {
    const date = meal.date ? new Date(meal.date).toISOString().split('T')[0] : getTodayDate();
    if (!grouped[date]) {
      grouped[date] = [];
    }
    grouped[date].push(meal);
    return grouped;
  }, {});
}

// Function to calculate nutrition progress percentage
export function calculateNutritionProgress(current, target) {
  if (target <= 0) return 0;
  return Math.min(100, (current / target) * 100);
}