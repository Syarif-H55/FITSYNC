Implement Phase 8 of FitSync Web — Data Science Insight Module.

Tasks:

1. Create a new dashboard section `/app/insights/page.js`:
   - Title: “Weekly Progress Insights”
   - Subsections:
     a. XP Trend (Line Chart)
     b. Calories Burned Trend (Bar Chart)
     c. Sleep Duration Trend (Area Chart)
     d. AI Weekly Summary (text box)

2. Create a new file `/lib/dataAggregator.js`:
   - Aggregate workout, meal, and sleep data by week.
   - Compute daily totals for XP, calories, and sleep hours.
   - Return data arrays compatible with Recharts.

3. Chart Implementation:
   - Use Recharts for XP, calories, and sleep charts.
   - Display 7-day trend with tooltips and legends.
   - Responsive design with Tailwind (grid layout, soft shadows).

4. AI Insight Integration:
   - Create `/app/api/insight/route.js`
     → POST endpoint that sends weekly data to OpenAI or Claude API.
   - Use a pre-defined system prompt:
       “You are FitSync AI Coach. Analyze the user’s week and generate a 2–3 sentence motivational summary.”
   - Display result inside a `Card` component in `/app/insights/page.js`.
   - Add “Generate New Insight” button for manual refresh.

5. Data source:
   - Pull data from localStorage or mockData if unavailable.
   - Example data structure:
     {
       day: "Mon",
       xp: 120,
       calories: 450,
       sleep: 7.5
     }

6. Testing:
   - Ensure all charts render correctly with sample data.
   - Verify AI summary appears correctly after pressing the generate button.
   - Handle missing data gracefully (show “No data available this week”).

Output files:
- `/app/insights/page.js`
- `/lib/dataAggregator.js`
- `/app/api/insight/route.js`
- Updated `/components/Navbar.js` → add “Insights” menu link.
