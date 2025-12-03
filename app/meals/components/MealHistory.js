'use client';

import { formatNutritionValues, groupMealsByDate, getTodayDate } from '../../../lib/mealUtils';

export default function MealHistory({ history }) {
  if (!Array.isArray(history) || history.length === 0) {
    return (
      <div className="bg-[#1C2431] rounded-xl p-6 shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Meal History</h2>
        <div className="text-center py-8 text-gray-400">
          <p>No meals logged yet. Upload a photo or describe your meal 🍲.</p>
        </div>
      </div>
    );
  }

  // Group meals by date
  const groupedMeals = groupMealsByDate(history);
  const today = getTodayDate();

  return (
    <div className="bg-[#1C2431] rounded-xl p-6 shadow-lg">
      <h2 className="text-xl font-semibold mb-4">Meal History</h2>
      
      {/* Today's Summary */}
      {groupedMeals[today] && (
        <div className="mb-6 p-4 bg-[#0E141B]/50 rounded-lg">
          <h3 className="font-medium text-lg mb-2">Today's Nutrition</h3>
          {(() => {
            const todayMeals = groupedMeals[today];
            const dailySummary = todayMeals.reduce((sum, meal) => {
              sum.calories += meal.calories || 0;
              sum.protein += meal.protein || 0;
              sum.carbs += meal.carbs || 0;
              sum.fat += meal.fat || 0;
              return sum;
            }, { calories: 0, protein: 0, carbs: 0, fat: 0 });
            
            return (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <div className="text-sm text-gray-400">Calories</div>
                  <div className="text-lg font-semibold text-[#FF6B6B]">{Math.round(dailySummary.calories)}</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Protein</div>
                  <div className="text-lg font-semibold text-[#4FB3FF]">{Math.round(dailySummary.protein)}g</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Carbs</div>
                  <div className="text-lg font-semibold text-[#00C48C]">{Math.round(dailySummary.carbs)}g</div>
                </div>
                <div>
                  <div className="text-sm text-gray-400">Fat</div>
                  <div className="text-lg font-semibold text-[#FFA726]">{Math.round(dailySummary.fat)}g</div>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Historical Meals */}
      <div className="space-y-4">
        {Object.entries(groupedMeals).map(([date, meals]) => (
          <div key={date} className="border-b border-gray-700 pb-4 last:border-0 last:pb-0">
            <h3 className="font-medium mb-2 text-gray-300">
              {date === today ? 'Today' : new Date(date).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h3>
            
            <div className="space-y-3">
              {meals.map((meal) => (
                <div key={meal.id} className="bg-[#0E141B] p-3 rounded-lg flex justify-between items-center">
                  <div>
                    <div className="font-medium">{meal.mealName || 'Meal'}</div>
                    <div className="text-sm text-gray-400">
                      {new Date(meal.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <div className="font-semibold text-[#FF6B6B]">{Math.round(meal.calories || 0)} cal</div>
                    <div className="text-xs text-gray-400">
                      P: {Math.round(meal.protein || 0)}g | C: {Math.round(meal.carbs || 0)}g | F: {Math.round(meal.fat || 0)}g
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}