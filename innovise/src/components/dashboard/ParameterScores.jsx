// components/dashboard/ParameterScores.jsx
import { Progress } from "@/components/ui/progress";

const ParameterScores = ({ parameters }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {parameters.map((param, index) => {
        // Calculate a color based on the score (0-10)
        let color;
        if (param.score >= 8) color = "bg-green-500";
        else if (param.score >= 6) color = "bg-blue-500";
        else if (param.score >= 4) color = "bg-amber-500";
        else color = "bg-red-500";
        
        return (
          <div key={index} className="p-4 border rounded-lg">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">{param.name}</h3>
              <div className="flex items-center gap-2">
                <span className={`text-lg font-bold ${param.score >= 6 ? 'text-green-600' : 'text-amber-600'}`}>{param.score}</span>
                <span className="text-sm text-gray-500">/10</span>
              </div>
            </div>
            
            <Progress 
              value={param.score * 10} 
              className="h-2 mb-4"
              indicatorcolor={color}
            />
            
            <div className="text-sm text-gray-700">
              <span className="font-medium">Recommendation:</span> {param.recommendation}
            </div>
          </div>
        );
      })}
    </div>
  );
};

// Add this progress component override
// You'll need to add this to override the default Progress component
// to accept custom colors
const ProgressWithCustomColor = ({ value, className, indicatorcolor }) => {
  return (
    <div className={`relative h-2 w-full overflow-hidden rounded-full bg-gray-200 ${className}`}>
      <div
        className={`h-full ${indicatorcolor || 'bg-primary'} transition-all`}
        style={{ width: `${value}%` }}
      />
    </div>
  );
};

// Override the original Progress component
Progress.defaultProps = {
  ...Progress.defaultProps,
  render: ProgressWithCustomColor
};

export default ParameterScores;