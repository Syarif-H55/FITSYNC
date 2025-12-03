'use client'

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

export default function StepsChart({ data = [] }) {
  // Default data if none provided
  const chartData = data.length > 0 ? data : [
    { day: 'Mon', steps: 7200 },
    { day: 'Tue', steps: 8420 },
    { day: 'Wed', steps: 6500 },
    { day: 'Thu', steps: 9800 },
    { day: 'Fri', steps: 10200 },
    { day: 'Sat', steps: 5600 },
    { day: 'Sun', steps: 7800 },
  ]

  return (
    <div className="w-full h-80">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="day" />
          <YAxis />
          <Tooltip 
            formatter={(value) => [value.toLocaleString(), 'Steps']}
            labelFormatter={(label) => `Day: ${label}`}
          />
          <Legend />
          <Bar 
            dataKey="steps" 
            name="Steps" 
            fill="#00C48C" 
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}