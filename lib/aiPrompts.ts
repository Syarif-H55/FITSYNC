// lib/aiPrompts.ts
interface UserData {
  name?: string;
  age?: number;
  level?: number;
  xp?: number;
  streak?: number;
  steps?: number;
  calories?: number;
  goalSteps?: number;
  recentActivity?: string;
  fitnessGoal?: 'weight_loss' | 'muscle_gain' | 'endurance' | 'maintain_weight';
  duration?: number;
  equipment?: string[];
  dietaryRestrictions?: string[];
  foodPreferences?: string[];
  activityLevel?: number;
  sleep?: number;
  weight?: number;
  height?: number;
  gender?: string;
}

export const prompts = {
  workoutPlan: (user: Partial<UserData>): string => `
You are FitSync AI Workout Coach. Create a personalized workout plan that aligns with these details:
- User level: ${user.level || 'beginner'}
- Available time: ${user.duration || 30} minutes
- Fitness goal: ${user.fitnessGoal || 'general fitness'}
- Equipment available: ${user.equipment ? user.equipment.join(', ') : 'none (bodyweight only)'}
- Recent activity: ${user.recentActivity || 'not specified'}
- Age: ${user.age || 'not specified'}

Return ONLY the JSON with this exact structure, with no additional text before or after:
{
  "title": string,
  "duration_minutes": number,
  "intensity_level": "low"|"moderate"|"high",
  "exercises": [
    {
      "name": string,
      "type": "strength"|"cardio"|"flexibility",
      "sets": number,
      "reps_or_time": string,
      "rest_seconds": number,
      "notes": string
    }
  ],
  "estimated_calories": number
}
  `,

  mealPlan: (user: Partial<UserData>): string => `
You are FitSync Nutrition Advisor. Create a personalized daily meal plan with these details:
- Calorie target: ${user.calories || 2000} kcal
- Protein goal: ${Math.round((user.calories || 2000) * 0.3 / 4)}g (30% of calories)
- Carbs goal: ${Math.round((user.calories || 2000) * 0.45 / 4)}g (45% of calories) 
- Fat goal: ${Math.round((user.calories || 2000) * 0.25 / 9)}g (25% of calories)
- Dietary restrictions: ${user.dietaryRestrictions?.join(', ') || 'none'}
- Food preferences: ${user.foodPreferences?.join(', ') || 'no specific preferences'}
- Activity level: ${user.activityLevel || 'moderate'}

Return ONLY the JSON with this exact structure, with no additional text before or after:
{
  "meals": [
    {
      "mealType": "Breakfast"|"Lunch"|"Dinner"|"Snack",
      "name": string,
      "calories": number,
      "protein_g": number,
      "carbs_g": number,
      "fat_g": number,
      "recipe_short": string
    }
  ],
  "total_calories": number
}
  `,

  motivationalShort: (user: Partial<UserData>): string => `
You are a friendly fitness coach. Create one short, personalized motivational sentence (max 120 characters) for user named "${user.name || 'User'}".
Reference these data points:
- Steps today: ${user.steps || 0} (${user.goalSteps ? `goal: ${user.goalSteps}` : 'no goal'})
- XP earned: ${user.xp || 0}
- Current streak: ${user.streak || 0} days

Keep the tone upbeat, encouraging, and personal.
  `,

  weeklySummary: (user: Partial<UserData>, datapoints: any): string => `
You are FitSync weekly reporter. Based on this week's data:
${JSON.stringify(datapoints, null, 2)}

Create a summary for user "${user.name || 'User'}" with:
- Fitness level: ${user.level || 'beginner'}
- Goal: ${user.fitnessGoal || 'general fitness'}

Return ONLY the JSON with this exact structure, with no additional text before or after:
{
  "summary": [string, string, string], // 3 bullet points about performance
  "suggestions": [string, string]      // 2 personalized suggestions for next week
}
  `,

  // Generic fitness question prompt
  generalFitness: (userQuestion: string, user: Partial<UserData>): string => `
You are an expert fitness and wellness coach. Provide helpful advice for this question: "${userQuestion}"

Consider the user's profile:
- Fitness level: ${user.level || 'not specified'}
- Goal: ${user.fitnessGoal || 'not specified'}
- Age: ${user.age || 'not specified'}
- Recent activity: ${user.recentActivity || 'not specified'}

Keep your response practical, evidence-based, and encouraging.
  `
};