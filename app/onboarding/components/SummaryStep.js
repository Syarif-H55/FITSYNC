import React from 'react';

const SummaryStep = ({ data, onNext, onPrevious, onEditStep, isFirst, isLast }) => {
  const calculateBMI = (weight, height) => {
    const heightInMeters = height / 100;
    return (weight / (heightInMeters * heightInMeters)).toFixed(1);
  };

  const getGoalLabel = (goalType) => {
    switch(goalType) {
      case 'lose': return 'Lose Weight';
      case 'gain': return 'Gain Weight';
      case 'maintain': return 'Maintain Weight';
      default: return '';
    }
  };

  const getActivityLabel = (activityLevel) => {
    switch(activityLevel) {
      case 'sedentary': return 'Sedentary';
      case 'light': return 'Light';
      case 'moderate': return 'Moderate';
      case 'active': return 'Active';
      case 'very-active': return 'Very Active';
      default: return '';
    }
  };

  const getWeightChange = (currentWeight, targetWeight, goalType) => {
    if (!currentWeight || !targetWeight) return '';
    
    const diff = Math.abs(targetWeight - currentWeight);
    if (goalType === 'lose') {
      return `Lose ${diff}kg`;
    } else if (goalType === 'gain') {
      return `Gain ${diff}kg`;
    } else {
      return `Maintain ${targetWeight}kg`;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-[#E6EDF3]">Review Your Profile</h2>
      <p className="text-[#8B949E]">Please review your information before we create your personalized plan.</p>
      
      <div className="bg-[#161B22] rounded-xl p-5 space-y-4 border border-[#30363D]">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-[#E6EDF3]">Name</h3>
            <p className="text-[#8B949E]">{data.name}</p>
          </div>
          <div>
            <h3 className="font-medium text-[#E6EDF3]">Age</h3>
            <p className="text-[#8B949E]">{data.age} years</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-[#E6EDF3]">Height</h3>
            <p className="text-[#8B949E]">{data.height} cm</p>
          </div>
          <div>
            <h3 className="font-medium text-[#E6EDF3]">Weight</h3>
            <p className="text-[#8B949E]">{data.weight} kg</p>
          </div>
        </div>
        
        <div className="pt-2">
          <h3 className="font-medium text-[#E6EDF3]">BMI</h3>
          <p className="text-[#8B949E]">{calculateBMI(data.weight, data.height)} - {data.weight < 18.5 ? 'Underweight' : data.weight < 25 ? 'Normal' : data.weight < 30 ? 'Overweight' : 'Obese'}</p>
        </div>
        
        <div className="pt-2">
          <h3 className="font-medium text-[#E6EDF3]">Activity Level</h3>
          <p className="text-[#8B949E] flex items-center">
            {data.activityLevel === 'sedentary' && '🛋️ '}
            {data.activityLevel === 'light' && '🚶 '}
            {data.activityLevel === 'moderate' && '🏃 '}
            {data.activityLevel === 'active' && '💪 '}
            {data.activityLevel === 'very-active' && '🏋️ '}
            {getActivityLabel(data.activityLevel)}
          </p>
        </div>
        
        <div className="pt-2">
          <h3 className="font-medium text-[#E6EDF3]">Goal</h3>
          <p className="text-[#8B949E] flex items-center">
            {data.goalType === 'lose' && '📉 '}
            {data.goalType === 'gain' && '📈 '}
            {data.goalType === 'maintain' && '⚖️ '}
            {getGoalLabel(data.goalType)}
          </p>
          <p className="text-[#8B949E] ml-6 text-sm">
            {getWeightChange(data.weight, data.targetWeight, data.goalType)} in {data.targetDuration} weeks
          </p>
        </div>
      </div>
      
      <div className="pt-4">
        <div className="flex justify-between space-x-3">
          <button
            type="button"
            onClick={() => onEditStep(1)}
            className="flex-1 px-4 py-2 text-[#E6EDF3] font-medium rounded-xl border border-[#30363D] hover:bg-[#0D1117] transition-colors"
          >
            Edit Profile
          </button>
          <button
            type="button"
            onClick={() => onEditStep(2)}
            className="flex-1 px-4 py-2 text-[#E6EDF3] font-medium rounded-xl border border-[#30363D] hover:bg-[#0D1117] transition-colors"
          >
            Edit Activity
          </button>
          <button
            type="button"
            onClick={() => onEditStep(3)}
            className="flex-1 px-4 py-2 text-[#E6EDF3] font-medium rounded-xl border border-[#30363D] hover:bg-[#0D1117] transition-colors"
          >
            Edit Goal
          </button>
        </div>
      </div>
      
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
            className="px-6 py-2 bg-gradient-to-r from-[#00C48C] to-[#4FB3FF] text-white font-medium rounded-xl hover:from-[#00B07F] hover:to-[#43A0FF] transition-all"
          >
            Get Started!
          </button>
        </div>
      </div>
    </form>
  );
};

export default SummaryStep;