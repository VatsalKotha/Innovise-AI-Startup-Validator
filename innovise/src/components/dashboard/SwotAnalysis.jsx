// components/dashboard/SwotAnalysis.jsx
const SwotAnalysis = ({ data }) => {
    const sections = [
      { title: "Strengths", items: data.strengths, color: "bg-green-100 border-green-300" },
      { title: "Weaknesses", items: data.weaknesses, color: "bg-red-100 border-red-300" },
      { title: "Opportunities", items: data.opportunities, color: "bg-blue-100 border-blue-300" },
      { title: "Threats", items: data.threats, color: "bg-amber-100 border-amber-300" }
    ];
    
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {sections.map((section, index) => (
          <div key={index} className={`p-4 rounded-lg border ${section.color}`}>
            <h3 className="font-bold mb-3">{section.title}</h3>
            <ul className="space-y-2">
              {section.items.map((item, itemIndex) => (
                <li key={itemIndex} className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  };
  
  export default SwotAnalysis;