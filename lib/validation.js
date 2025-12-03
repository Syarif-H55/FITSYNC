export const validateProfile = (data) => {
  const errors = {};
  
  if (!data.age || data.age < 15 || data.age > 100) {
    errors.age = "Enter a valid age (15–100)";
  }
  
  if (!data.height || data.height < 100 || data.height > 250) {
    errors.height = "Enter valid height (cm)";
  }
  
  if (!data.weight || data.weight < 30 || data.weight > 300) {
    errors.weight = "Enter valid weight (kg)";
  }
  
  return { valid: Object.keys(errors).length === 0, errors };
};

export const validateGoal = (goalData, currentWeight) => {
  const errors = {};
  
  if (!goalData.goalType || !['lose', 'gain', 'maintain'].includes(goalData.goalType)) {
    errors.goalType = "Please select a goal type";
  }
  
  if (!goalData.targetWeight || goalData.targetWeight < 30 || goalData.targetWeight > 300) {
    errors.targetWeight = "Please enter a valid target weight (30-300 kg)";
  } else if (goalData.goalType === 'lose' && goalData.targetWeight >= currentWeight) {
    errors.targetWeight = "Target weight must be less than current weight";
  } else if (goalData.goalType === 'gain' && goalData.targetWeight <= currentWeight) {
    errors.targetWeight = "Target weight must be greater than current weight";
  }
  
  if (!goalData.targetDuration || goalData.targetDuration < 1 || goalData.targetDuration > 52) {
    errors.targetDuration = "Please enter a valid duration (1-52 weeks)";
  }
  
  return { valid: Object.keys(errors).length === 0, errors };
};

export const validateActivityLevel = (activityData) => {
  const errors = {};
  
  if (!activityData.activityLevel) {
    errors.activityLevel = "Please select your activity level";
  } else if (!['sedentary', 'light', 'moderate', 'active', 'very-active'].includes(activityData.activityLevel)) {
    errors.activityLevel = "Please select a valid activity level";
  }
  
  return { valid: Object.keys(errors).length === 0, errors };
};