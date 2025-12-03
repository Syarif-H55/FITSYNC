import React from 'react';

const ProgressStepper = ({ currentStep, totalSteps }) => {
  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <span className="text-sm font-medium text-[#8B949E]">
          Step {currentStep} of {totalSteps}
        </span>
        <span className="text-sm font-medium text-[#8B949E]">
          {Math.round((currentStep / totalSteps) * 100)}% Complete
        </span>
      </div>
      <div className="w-full bg-[#0D1117] rounded-full h-2">
        <div 
          className="bg-gradient-to-r from-[#00C48C] to-[#4FB3FF] h-2 rounded-full transition-all duration-500 ease-in-out" 
          style={{ width: `${(currentStep / totalSteps) * 100}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between mt-4">
        {[...Array(totalSteps)].map((_, index) => (
          <div key={index} className="flex flex-col items-center">
            <div 
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index + 1 <= currentStep 
                  ? 'bg-gradient-to-r from-[#00C48C] to-[#4FB3FF] text-white' 
                  : 'bg-[#0D1117] border border-[#30363D] text-[#8B949E]'
              }`}
            >
              {index + 1}
            </div>
            <span 
              className={`text-xs mt-1 ${
                index + 1 <= currentStep ? 'text-[#E6EDF3] font-medium' : 'text-[#8B949E]'
              }`}
            >
              {index + 1 === 1 && 'Profile'}
              {index + 1 === 2 && 'Activity'}
              {index + 1 === 3 && 'Goal'}
              {index + 1 === 4 && 'Summary'}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressStepper;