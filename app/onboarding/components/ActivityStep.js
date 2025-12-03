import React from 'react';

const ActivityStep = ({ data, onNext, onPrevious, isFirst, isLast }) => {
  const [selectedActivity, setSelectedActivity] = React.useState(data.activityLevel || '');

  const activityLevels = [
    {
      id: 'sedentary',
      title: 'Sedentary',
      description: 'Little or no exercise',
      emoji: '🛋️',
      detail: 'Office job, little physical activity'
    },
    {
      id: 'light',
      title: 'Light',
      description: 'Exercise 1-3 days/week',
      emoji: '🚶',
      detail: 'Light exercise or sports 1-3 days/week'
    },
    {
      id: 'moderate',
      title: 'Moderate',
      description: 'Exercise 3-5 days/week',
      emoji: '🏃',
      detail: 'Moderate exercise or sports 3-5 days/week'
    },
    {
      id: 'active',
      title: 'Active',
      description: 'Exercise 6-7 days/week',
      emoji: '💪',
      detail: 'Hard exercise every day'
    },
    {
      id: 'very-active',
      title: 'Very Active',
      description: 'Intense exercise daily',
      emoji: '🏋️',
      detail: 'Athlete, very physically demanding job'
    }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedActivity) {
      onNext({ activityLevel: selectedActivity });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-2xl font-bold text-[#E6EDF3]">Activity Level</h2>
      <p className="text-[#8B949E]">Select your current activity level to help us customize your fitness plan.</p>
      
      <div className="space-y-3">
        {activityLevels.map((activity) => (
          <div
            key={activity.id}
            onClick={() => setSelectedActivity(activity.id)}
            className={`p-4 border rounded-xl cursor-pointer transition-all ${
              selectedActivity === activity.id
                ? 'border-[#00C48C] bg-[#1C232B]'
                : 'border-[#30363D] hover:border-[#4484FF]'
            }`}
          >
            <div className="flex items-center">
              <span className="text-2xl mr-3">{activity.emoji}</span>
              <div className="flex-1">
                <div className="flex items-center">
                  <h3 className="font-semibold text-[#E6EDF3]">{activity.title}</h3>
                  {selectedActivity === activity.id && (
                    <span className="ml-2 px-2 py-1 bg-[#00C48C]/20 text-[#00C48C] text-xs font-medium rounded-full">
                      Selected
                    </span>
                  )}
                </div>
                <p className="text-sm text-[#8B949E]">{activity.description}</p>
                <p className="text-xs text-[#6E7681] mt-1">{activity.detail}</p>
              </div>
            </div>
          </div>
        ))}
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
            disabled={!selectedActivity}
            className={`px-6 py-2 font-medium rounded-xl transition-all ${
              selectedActivity
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

export default ActivityStep;