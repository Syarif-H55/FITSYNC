import React, { useState } from 'react';
import { validateGoal } from '@/lib/validation';

const GoalStep = ({ data, onNext, onPrevious, isFirst, isLast }) => {
  const [goalType, setGoalType] = useState(data.goalType || '');
  const [targetWeight, setTargetWeight] = useState(data.targetWeight || '');
  const [targetDuration, setTargetDuration] = useState(data.targetDuration || '');
  const [errors, setErrors] = useState({});

  const handleGoalTypeChange = (type) => {
    setGoalType(type);
    if (errors.goalType) {
      setErrors(prev => ({ ...prev, goalType: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const goalData = {
      goalType,
      targetWeight: parseFloat(targetWeight),
      targetDuration: parseInt(targetDuration),
    };

    const { valid, errors: validationErrors } = validateGoal(goalData, data.weight);

    if (valid) {
      onNext({
        ...goalData,
        targetWeight: parseFloat(targetWeight),
        targetDuration: parseInt(targetDuration),
      });
    } else {
      setErrors(validationErrors);
    }
  };

  const getGoalTitle = () => {
    switch(goalType) {
      case 'lose': return 'Lose Weight';
      case 'gain': return 'Gain Weight';
      case 'maintain': return 'Maintain Weight';
      default: return 'Select a Goal';
    }
  };

  const getGoalIcon = () => {
    switch(goalType) {
      case 'lose': return '📉';
      case 'gain': return '📈';
      case 'maintain': return '⚖️';
      default: return '🎯';
    }
  };

  const getGoalDescription = () => {
    switch(goalType) {
      case 'lose': return 'Create a calorie deficit to lose weight safely';
      case 'gain': return 'Build muscle and gain healthy weight';
      case 'maintain': return 'Keep your current weight stable';
      default: return 'Choose a goal to start your journey';
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-[#E6EDF3]">Your Fitness Goal</h2>
      <p className="text-[#8B949E]">Set your goal to help us create a personalized plan for you.</p>
      
      <div className="grid grid-cols-3 gap-3">
        {[
          { id: 'lose', label: 'Lose', icon: '📉' },
          { id: 'gain', label: 'Gain', icon: '📈' },
          { id: 'maintain', label: 'Maintain', icon: '⚖️' },
        ].map((goal) => (
          <button
            key={goal.id}
            type="button"
            onClick={() => handleGoalTypeChange(goal.id)}
            className={`p-4 border rounded-xl text-center transition-all ${
              goalType === goal.id
                ? 'border-[#00C48C] bg-[#1C232B]'
                : 'border-[#30363D] hover:border-[#4484FF]'
            }`}
          >
            <div className="text-2xl mb-1">{goal.icon}</div>
            <div className="font-medium text-[#E6EDF3]">{goal.label}</div>
          </button>
        ))}
      </div>

      {errors.goalType && <p className="text-red-500 text-sm">{errors.goalType}</p>}
      
      {goalType && (
        <div className="border-t pt-6 border-[#30363D]">
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-3">{getGoalIcon()}</span>
            <div>
              <h3 className="font-semibold text-[#E6EDF3]">{getGoalTitle()}</h3>
              <p className="text-sm text-[#8B949E]">{getGoalDescription()}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[#E6EDF3] mb-1">
                Target Weight (kg)
              </label>
              <input
                type="number"
                step="0.1"
                value={targetWeight}
                onChange={(e) => {
                  setTargetWeight(e.target.value);
                  if (errors.targetWeight) {
                    setErrors(prev => ({ ...prev, targetWeight: '' }));
                  }
                }}
                className={`w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] text-[#E6EDF3] rounded-xl focus:ring-2 focus:ring-[#00C48C] focus:border-transparent ${
                  errors.targetWeight ? 'border-red-500' : ''
                }`}
                placeholder={`e.g., ${goalType === 'lose' ? data.weight - 5 : goalType === 'gain' ? data.weight + 5 : data.weight}`}
              />
              {errors.targetWeight && <p className="text-red-500 text-sm mt-1">{errors.targetWeight}</p>}
              <p className="text-xs text-[#6E7681] mt-1">
                Current: {data.weight}kg | 
                {goalType === 'lose' && targetWeight && ` You want to lose ${data.weight - parseFloat(targetWeight)}kg`}
                {goalType === 'gain' && targetWeight && ` You want to gain ${parseFloat(targetWeight) - data.weight}kg`}
                {goalType === 'maintain' && targetWeight && ` You want to maintain ${targetWeight}kg`}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-[#E6EDF3] mb-1">
                Target Duration (weeks)
              </label>
              <input
                type="number"
                value={targetDuration}
                onChange={(e) => {
                  setTargetDuration(e.target.value);
                  if (errors.targetDuration) {
                    setErrors(prev => ({ ...prev, targetDuration: '' }));
                  }
                }}
                className={`w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] text-[#E6EDF3] rounded-xl focus:ring-2 focus:ring-[#00C48C] focus:border-transparent ${
                  errors.targetDuration ? 'border-red-500' : ''
                }`}
                placeholder="e.g., 12 weeks"
              />
              {errors.targetDuration && <p className="text-red-500 text-sm mt-1">{errors.targetDuration}</p>}
              <p className="text-xs text-[#6E7681] mt-1">
                We recommend 1-2 lbs (0.45-0.9kg) per week for healthy changes
              </p>
            </div>
          </div>
        </div>
      )}
      
      <div className="flex justify-between pt-4">
        {!isFirst && (
          <button
            type="button"
            onClick={onPrevious}
            className="px-6 py-2 text-[#E6EDF3] font-medium rounded-xl border border-[#30363D] hover:bg-[#0D1117] transition-colors"
          >
            Back
          </button>
        )}
        <div className="ml-auto">
          <button
            type="submit"
            disabled={!goalType || !targetWeight || !targetDuration}
            className={`px-6 py-2 font-medium rounded-xl transition-all ${
              goalType && targetWeight && targetDuration
                ? 'bg-gradient-to-r from-[#00C48C] to-[#4FB3FF] text-white hover:from-[#00B07F] hover:to-[#43A0FF]'
                : 'bg-[#0D1117] border border-[#30363D] text-[#8B949E] cursor-not-allowed'
            }`}
          >
            Next
          </button>
        </div>
      </div>
    </form>
  );
};

export default GoalStep;