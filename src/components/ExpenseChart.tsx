
import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface ExpenseChartProps {
  expenses: {
    transportation: number;
    accommodation: number;
    food: number;
    activities: number;
    other: number;
  };
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#9271F6'];

const ExpenseChart: React.FC<ExpenseChartProps> = ({ expenses }) => {
  // Convert expenses object to array for the pie chart
  const data = Object.entries(expenses).map(([name, value], index) => ({
    name: name.charAt(0).toUpperCase() + name.slice(1),
    value: Number(value),
  }));

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            formatter={(value, name) => [`${value}`, name]}
            contentStyle={{ backgroundColor: 'white', borderRadius: '8px' }}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseChart;
