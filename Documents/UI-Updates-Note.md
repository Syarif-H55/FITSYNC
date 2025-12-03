You are a front-end developer using Next.js + Tailwind + shadcn/ui. 
Create a dark-themed responsive dashboard layout inspired by the attached image. 
Keep the structure vertically scrollable and adapt it for the fitness app's existing features.

Main layout sections (from top to bottom):
1. Header: Greeting, date/time, user avatar.
2. Daily Steps Card: circular progress indicator, step count, target progress.
3. Today’s Workout Card: background image, workout title, duration/level info, and a large “Start Workout” button.
4. AI Insights Card: short text summary dynamically loaded from data.
5. Weekly Trends Card: mini chart (XP, calories, sleep duration).
6. Additional cards: reminders, goals, or meal suggestions (optional).

Styling rules:
- Dark background (#121212 or #1A1A1A)
- Accent color: purple/teal gradient (#7C3AED – #06B6D4)
- Rounded cards, subtle shadows, smooth hover animations.
- Use flex and grid layout for responsiveness.
- Typography: ‘Poppins’ or ‘Inter’

Implement with reusable components:
- `<Header />`, `<StepsProgress />`, `<WorkoutCard />`, `<InsightCard />`, `<WeeklyChart />`
Each component should be visually consistent with the reference dashboard and optimized for both mobile and desktop.

Finally, ensure accessibility (ARIA labels) and smooth transition animations using Framer Motion.
