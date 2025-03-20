import React from "react";
import { RefreshCw, TrendingUp } from "lucide-react";

const MonthlyScoreChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div className="h-64 w-full flex items-center justify-center border border-dashed border-gray-300 rounded-lg">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const highestScore = Math.max(...data.map((d) => d.score));
  const average = (data.reduce((acc, item) => acc + item.score, 0) / data.length).toFixed(1);

  return (
    <div className="h-64 w-full p-4">
      <div className="relative w-full h-48 flex items-end gap-2 border-b border-gray-300">
        {data.map((entry, index) => (
          <div
            key={index}
            className={`flex-1 bg-blue-400 rounded-t-md transition-all duration-300 ${
              entry.score === highestScore ? "bg-blue-600" : "bg-blue-400"
            }`}
            style={{ height: `${(entry.score / highestScore) * 100}%` }}
            title={`${entry.month}: ${entry.score}`}
          ></div>
        ))}
      </div>
      <div className="flex justify-between mt-2 text-sm text-gray-500">
        {data.map((entry, index) => (
          <span key={index} className="text-center w-full">
            {entry.month}
          </span>
        ))}
      </div>
      <div className="flex justify-between items-center mt-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <RefreshCw size={16} />
          <span>6-Month Average: {average}</span>
        </div>
        <div className="flex items-center gap-2">
          <TrendingUp size={16} className="text-blue-500" />
          <span className="text-sm text-gray-500">Monthly Score</span>
        </div>
      </div>
    </div>
  );
};

const defaultData = [
  { month: "Jan", score: 65 },
  { month: "Feb", score: 59 },
  { month: "Mar", score: 80 },
  { month: "Apr", score: 81 },
  { month: "May", score: 56 },
  { month: "Jun", score: 55 },
];

export default function Demo() {
  return <MonthlyScoreChart data={defaultData} />;
}
