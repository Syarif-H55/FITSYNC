import React, { useState } from 'react';
import { validateProfile } from '@/lib/validation';

const ProfileStep = ({ data, onNext, onPrevious, isFirst, isLast }) => {
  const [formData, setFormData] = useState({
    name: data.name || '',
    age: data.age || '',
    gender: data.gender || '',
    height: data.height || '',
    weight: data.weight || '',
  });
  
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const { valid, errors: validationErrors } = validateProfile({
      ...formData,
      age: parseInt(formData.age),
      height: parseInt(formData.height),
      weight: parseFloat(formData.weight),
    });
    
    if (valid) {
      onNext({
        ...formData,
        age: parseInt(formData.age),
        height: parseInt(formData.height),
        weight: parseFloat(formData.weight),
      });
    } else {
      setErrors(validationErrors);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-[#E6EDF3]">Tell us about yourself</h2>
      <p className="text-[#8B949E]">This information helps us create a personalized fitness plan for you.</p>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#E6EDF3] mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] text-[#E6EDF3] rounded-xl focus:ring-2 focus:ring-[#00C48C] focus:border-transparent ${
              errors.name ? 'border-red-500' : ''
            }`}
            placeholder="Enter your name"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#E6EDF3] mb-1">Age</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] text-[#E6EDF3] rounded-xl focus:ring-2 focus:ring-[#00C48C] focus:border-transparent ${
                errors.age ? 'border-red-500' : ''
              }`}
              placeholder="Years"
            />
            {errors.age && <p className="text-red-500 text-sm mt-1">{errors.age}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#E6EDF3] mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] text-[#E6EDF3] rounded-xl focus:ring-2 focus:ring-[#00C48C] focus:border-transparent ${
                errors.gender ? 'border-red-500' : ''
              }`}
            >
              <option value="" className="bg-[#0D1117] text-[#E6EDF3]">Select</option>
              <option value="male" className="bg-[#0D1117] text-[#E6EDF3]">Male</option>
              <option value="female" className="bg-[#0D1117] text-[#E6EDF3]">Female</option>
              <option value="non-binary" className="bg-[#0D1117] text-[#E6EDF3]">Non-binary</option>
              <option value="prefer-not-to-say" className="bg-[#0D1117] text-[#E6EDF3]">Prefer not to say</option>
            </select>
            {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
          </div>
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-[#E6EDF3] mb-1">Height (cm)</label>
            <input
              type="number"
              name="height"
              value={formData.height}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] text-[#E6EDF3] rounded-xl focus:ring-2 focus:ring-[#00C48C] focus:border-transparent ${
                errors.height ? 'border-red-500' : ''
              }`}
              placeholder="cm"
            />
            {errors.height && <p className="text-red-500 text-sm mt-1">{errors.height}</p>}
          </div>
          
          <div>
            <label className="block text-sm font-medium text-[#E6EDF3] mb-1">Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              name="weight"
              value={formData.weight}
              onChange={handleChange}
              className={`w-full px-4 py-2 bg-[#0D1117] border border-[#30363D] text-[#E6EDF3] rounded-xl focus:ring-2 focus:ring-[#00C48C] focus:border-transparent ${
                errors.weight ? 'border-red-500' : ''
              }`}
              placeholder="kg"
            />
            {errors.weight && <p className="text-red-500 text-sm mt-1">{errors.weight}</p>}
          </div>
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
            Next
          </button>
        </div>
      </div>
    </form>
  );
};

export default ProfileStep;