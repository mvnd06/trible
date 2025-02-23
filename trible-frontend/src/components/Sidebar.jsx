const modules = [
    { name: "Module 1", scenarios: ["Scenario 1", "Scenario 2", "Scenario 3", "Scenario 4"] },
    { name: "Module 2", scenarios: [] },
    { name: "Module 3", scenarios: [] },
    { name: "Module 4", scenarios: [] },
  ];
  
  export default function Sidebar({ activeModule, setActiveModule, activeScenario, setActiveScenario, setMessages }) {
    return (
      <div className="w-64 bg-blue-900 p-4 flex flex-col">
        <h1 className="text-lg font-bold mb-4">trible.ai</h1>
        {modules.map((module, moduleIndex) => (
          <div key={moduleIndex} className="mb-4">
            <h2 className="text-md font-semibold mb-2">{module.name}</h2>
            {module.scenarios.map((scenario, scenarioIndex) => (
              <button
                key={scenarioIndex}
                className={`block w-full text-left px-2 py-1 rounded-md mb-1 transition-all ${
                  activeScenario === scenarioIndex && activeModule === moduleIndex ? "bg-blue-700" : "hover:bg-blue-800"
                }`}
                onClick={() => {
                  setActiveModule(moduleIndex);
                  setActiveScenario(scenarioIndex);
                  setMessages([]); // Reset chat for new scenario
                }}
              >
                {scenario}
              </button>
            ))}
          </div>
        ))}
      </div>
    );
  }
  