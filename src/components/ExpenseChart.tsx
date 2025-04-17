
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
  const data = [
    { name: 'Transportation', value: expenses.transportation },
    { name: 'Accommodation', value: expenses.accommodation },
    { name: 'Food', value: expenses.food },
    { name: 'Activities', value: expenses.activities },
    { name: 'Other', value: expenses.other },
  ];

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
          <Tooltip formatter={(value) => `${value}%`} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ExpenseChart;
