'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useXp } from '@/context/XpContext'; // Import XP context

export default function AddActivityForm({ onAddActivity }) {
  const [formData, setFormData] = useState({
    type: 'walking',
    duration: '',
    intensity: 'moderate',
    notes: ''
  });
  
  const [preview, setPreview] = useState(null);
  const [errors, setErrors] = useState({});
  
  const { updateXp } = useXp(); // Use XP context

  const activityTypes = [
    { value: 'walking', label: 'Walking', icon: '🚶' },
    { value: 'running', label: 'Running', icon: '🏃' },
    { value: 'cycling', label: 'Cycling', icon: '🚴' },
    { value: 'workout', label: 'Workout', icon: '💪' },
    { value: 'yoga', label: 'Yoga', icon: '🧘' },
    { value: 'swimming', label: 'Swimming', icon: '🏊' }
  ];

  const intensityMultipliers = {
    low: 1,
    moderate: 2,
    high: 3
  };

  const activityCalorieRates = {
    walking: 4,      // 4 cal/min
    running: 10,     // 10 cal/min  
    cycling: 8,      // 8 cal/min
    workout: 7,      // 7 cal/min average
    yoga: 3,         // 3 cal/min
    swimming: 9      // 9 cal/min
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.duration || parseInt(formData.duration) <= 0) {
      newErrors.duration = 'Please enter a valid duration';
    }
    if (parseInt(formData.duration) > 300) {
      newErrors.duration = 'Duration should be less than 300 minutes';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field, value) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);

    // Calculate preview
    if (updatedData.duration && updatedData.intensity && updatedData.type) {
      const duration = parseInt(updatedData.duration) || 0;
      const calorieRate = activityCalorieRates[updatedData.type] || 5;
      const intensityMultiplier = intensityMultipliers[updatedData.intensity] || 1;
      
      const calories = Math.round(duration * calorieRate);
      const xp = Math.round((duration / 5) * intensityMultiplier); // 1 XP per 5 min at base intensity

      setPreview({ 
        calories, 
        xp,
        duration: duration
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const activity = {
      ...formData,
      duration: parseInt(formData.duration),
      calories: preview?.calories || 0,
      xp: preview?.xp || 0,
      date: new Date().toISOString(),
      id: Date.now().toString()
    };

    // Call the onAddActivity function passed as prop
    onAddActivity(activity);

    // Update XP system
    if (preview?.xp) {
      updateXp(preview.xp, `activity_${formData.type}`);
    }

    // Reset form
    setFormData({
      type: 'walking',
      duration: '',
      intensity: 'moderate',
      notes: ''
    });
    setPreview(null);
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-4">Log New Activity</h2>
      
      {/* Activity Type */}
      <div>
        <label className="block text-sm font-medium text-[#8B949E] mb-2">Activity Type</label>
        <div className="grid grid-cols-3 gap-2">
          {activityTypes.map((activity) => (
            <button
              key={activity.value}
              type="button"
              onClick={() => handleInputChange('type', activity.value)}
              className={`p-3 rounded-lg border transition-colors ${
                formData.type === activity.value
                  ? 'bg-[#00C48C]/20 border-[#00C48C] text-[#E6EDF3]'
                  : 'bg-[#0D1117] border-[#30363D] text-[#8B949E] hover:bg-[#161B22]'
              }`}
            >
              <div className="text-lg">{activity.icon}</div>
              <div className="text-sm">{activity.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Duration */}
      <div>
        <label className="block text-sm font-medium text-[#8B949E] mb-2">Duration (minutes)</label>
        <input
          type="number"
          value={formData.duration}
          onChange={(e) => handleInputChange('duration', e.target.value)}
          className={`w-full p-3 bg-[#0D1117] border ${
            errors.duration ? 'border-red-500' : 'border-[#30363D]'
          } rounded-lg text-[#E6EDF3] focus:ring-2 focus:ring-[#00C48C] focus:border-transparent`}
          placeholder="Enter duration in minutes"
          min="1"
          max="300"
          required
        />
        {errors.duration && <p className="text-red-400 text-sm mt-1">{errors.duration}</p>}
      </div>

      {/* Intensity */}
      <div>
        <label className="block text-sm font-medium text-[#8B949E] mb-2">Intensity</label>
        <div className="grid grid-cols-3 gap-2">
          {Object.entries(intensityMultipliers).map(([level, multiplier]) => (
            <button
              key={level}
              type="button"
              onClick={() => handleInputChange('intensity', level)}
              className={`p-3 rounded-lg border transition-colors ${
                formData.intensity === level
                  ? level === 'low' 
                    ? 'bg-[#00C48C]/30 border-[#00C48C] text-[#E6EDF3]'
                    : level === 'moderate' 
                    ? 'bg-[#FFA726]/30 border-[#FFA726] text-[#E6EDF3]'
                    : 'bg-[#FF6B6B]/30 border-[#FF6B6B] text-[#E6EDF3]'
                  : 'bg-[#0D1117] border-[#30363D] text-[#8B949E] hover:bg-[#161B22]'
              }`}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium text-[#8B949E] mb-2">Notes (optional)</label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          className="w-full p-3 bg-[#0D1117] border border-[#30363D] rounded-lg text-[#E6EDF3] focus:ring-2 focus:ring-[#00C48C] focus:border-transparent"
          placeholder="Any additional notes about your activity..."
          rows="2"
        />
      </div>

      {/* Preview */}
      <AnimatePresence>
        {preview && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="p-4 bg-[#0D1117] rounded-lg border border-[#30363D]"
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-[#8B949E]">Estimated:</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-2 bg-[#00C48C]/10 rounded">
                <div className="text-lg font-bold text-[#00C48C]">{preview.calories}</div>
                <div className="text-xs text-[#8B949E]">calories</div>
              </div>
              <div className="text-center p-2 bg-[#4FB3FF]/10 rounded">
                <div className="text-lg font-bold text-[#4FB3FF]">{preview.xp}</div>
                <div className="text-xs text-[#8B949E]">XP</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-3 bg-gradient-to-r from-[#00C48C] to-[#4FB3FF] hover:from-[#00B07F] hover:to-[#43A0FF] rounded-lg text-white font-semibold transition-all"
      >
        Add Activity & Earn XP
      </button>
    </form>
  );
}