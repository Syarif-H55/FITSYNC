'use client';

import { useState, useEffect } from 'react';
import { useXp } from '@/context/XpContext'; // Import XP context
import { getSession } from '@/lib/session';

export default function StepsTracker({ className = '' }) {
  const [dailySteps, setDailySteps] = useState(0);
  const [stepGoal, setStepGoal] = useState(10000);
  const { updateXp } = useXp(); // Use XP context

  useEffect(() => {
    // Load saved steps from localStorage
    try {
      // Try to get from the general steps storage first, then fallback
      const generalSteps = parseInt(localStorage.getItem('steps') || '0');
      const savedStepsData = JSON.parse(localStorage.getItem('dailySteps') || '{"steps": 0, "goal": 10000}');
      
      // Use the higher of the two values to maintain consistency
      const stepsToUse = Math.max(generalSteps, savedStepsData.steps);
      
      setDailySteps(stepsToUse);
      setStepGoal(savedStepsData.goal);
    } catch (error) {
      console.error('Error loading steps data:', error);
      setDailySteps(0);
      setStepGoal(10000);
    }
  }, []);

  const handleUpdateSteps = (newSteps) => {
    try {
      if (newSteps >= 0) {
        setDailySteps(newSteps);
        
        // Update both storage locations for compatibility
        localStorage.setItem('steps', newSteps.toString());
        localStorage.setItem('dailySteps', JSON.stringify({ 
          steps: newSteps, 
          goal: stepGoal 
        }));
        
        // Also store steps for today's date for insights
        const today = new Date().toISOString().split('T')[0];
        localStorage.setItem(`steps-${today}`, newSteps.toString());
        
        // Update XP based on steps taken (1 XP per 200 steps)
        const xpGained = Math.floor(newSteps / 200);
        updateXp(xpGained, 'steps');
        
        // Dispatch storage event to update dashboard in real-time
        window.dispatchEvent(new StorageEvent('storage', {
          key: 'steps',
          newValue: newSteps.toString()
        }));
      }
    } catch (error) {
      console.error('Error updating steps:', error);
    }
  };

  const handleSimulateSteps = () => {
    try {
      const randomSteps = Math.floor(Math.random() * 2000) + 500;
      const newSteps = dailySteps + randomSteps;
      setDailySteps(newSteps);
      
      // Update both storage locations for compatibility
      localStorage.setItem('steps', newSteps.toString());
      localStorage.setItem('dailySteps', JSON.stringify({ 
        steps: newSteps, 
        goal: stepGoal 
      }));
      
      // Also store steps for today's date for insights
      const today = new Date().toISOString().split('T')[0];
      localStorage.setItem(`steps-${today}`, newSteps.toString());
      
      // Update XP based on steps taken
      const xpGained = Math.floor(newSteps / 200);
      updateXp(xpGained, 'steps');
      
      // Dispatch storage event to update dashboard in real-time
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'steps',
        newValue: newSteps.toString()
      }));
    } catch (error) {
      console.error('Error simulating steps:', error);
    }
  };

  const completionPercentage = Math.min((dailySteps / stepGoal) * 100, 100);

  return (
    <div className={`bg-[#161B22] border border-[#30363D] rounded-2xl p-6 ${className}`}>
      <h2 className="text-xl font-semibold mb-4">Daily Steps</h2>
      
      {/* Steps Progress Circle */}
      <div className="flex flex-col items-center justify-center mb-4">
        <div className="relative w-40 h-40">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold text-[#E6EDF3]">{dailySteps.toLocaleString()}</div>
              <div className="text-sm text-[#8B949E]">steps</div>
            </div>
          </div>
          <svg className="w-full h-full" viewBox="0 0 100 100">
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#2D3748"
              strokeWidth="8"
            />
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke={dailySteps >= stepGoal ? "#00C48C" : dailySteps / stepGoal > 0.7 ? "#FFA726" : "#4FB3FF"}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={283} // Circumference
              strokeDashoffset={283 - (283 * completionPercentage) / 100}
              transform="rotate(-90 50 50)"
              className="transition-all duration-500 ease-out"
            />
          </svg>
        </div>
      </div>

      <div className="text-center mb-4">
        <div className="text-sm text-[#8B949E]">Goal: {stepGoal.toLocaleString()} steps</div>
        <div className={`text-sm ${dailySteps >= stepGoal ? 'text-[#00C48C]' : 'text-[#8B949E]'}`}>
          {dailySteps >= stepGoal ? 'Goal achieved! 🎉' : `${(stepGoal - dailySteps).toLocaleString()} steps to go`}
        </div>
      </div>

      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="number"
            value={dailySteps}
            onChange={(e) => handleUpdateSteps(Number(e.target.value))}
            className="flex-1 p-3 bg-[#0D1117] border border-[#30363D] rounded-lg text-[#E6EDF3] focus:ring-2 focus:ring-[#00C48C] focus:border-transparent"
            placeholder="Enter steps"
            min="0"
          />
          <button
            onClick={handleSimulateSteps}
            className="px-4 py-3 bg-[#0D1117] hover:bg-[#161B22] border border-[#30363D] rounded-lg text-[#E6EDF3] transition-colors"
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}