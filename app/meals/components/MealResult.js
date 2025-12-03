'use client';

import { motion } from 'framer-motion';

export default function MealResult({ result }) {
  if (!result) return null;

  const { mealName, calories, protein, carbs, fat } = result;

  return (
    <div className="bg-[#1C2431] rounded-xl p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold">AI Analysis Result</h2>
        <div className="bg-[#00C48C] text-black text-xs px-2 py-1 rounded-full font-bold">
          AI ANALYZED
        </div>
      </div>

      <div className="mb-4">
        <h3 className="text-lg font-medium mb-2">{mealName || 'Meal'}</h3>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {/* Calories */}
        <motion.div 
          className="bg-[#0E141B] p-4 rounded-lg text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="text-2xl font-bold text-[#FF6B6B]">{Math.round(calories)}</div>
          <div className="text-sm text-gray-400">Calories</div>
        </motion.div>

        {/* Protein */}
        <motion.div 
          className="bg-[#0E141B] p-4 rounded-lg text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
        >
          <div className="text-2xl font-bold text-[#4FB3FF]">{Math.round(protein)}g</div>
          <div className="text-sm text-gray-400">Protein</div>
        </motion.div>

        {/* Carbs */}
        <motion.div 
          className="bg-[#0E141B] p-4 rounded-lg text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.3 }}
        >
          <div className="text-2xl font-bold text-[#00C48C]">{Math.round(carbs)}g</div>
          <div className="text-sm text-gray-400">Carbs</div>
        </motion.div>

        {/* Fat */}
        <motion.div 
          className="bg-[#0E141B] p-4 rounded-lg text-center"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
        >
          <div className="text-2xl font-bold text-[#FFA726]">{Math.round(fat)}g</div>
          <div className="text-sm text-gray-400">Fat</div>
        </motion.div>
      </div>

      {/* Summary */}
      <div className="bg-[#0E141B]/50 p-4 rounded-lg">
        <h4 className="font-medium mb-2">Nutrition Summary</h4>
        <p className="text-sm text-gray-300">
          This meal contains approximately {Math.round(calories)} calories with 
          {Math.round(protein)}g of protein, {Math.round(carbs)}g of carbohydrates, 
          and {Math.round(fat)}g of fat. This represents a 
          {calories > 0 && calories < 300 ? ' light' : calories >= 300 && calories < 600 ? ' moderate' : ' substantial'} 
          {calories > 0 ? ' meal portion.' : ' portion.'}
        </p>
      </div>
    </div>
  );
}