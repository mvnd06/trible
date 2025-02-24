const API_BASE_URL = "http://127.0.0.1:8000"; // Backend FastAPI URL

const modules = [
    { name: "Lattice Scenarios", scenarios: [ 
        { id: "lattice_adp", name: "Lattice / ADP Integration" },
        { id: "lattice_trinet", name: "Lattice / TriNet Integration" },
        { id: "lattice_gusto", name: "Lattice / Gusto Integration" },
        { id: "lattice_greenhouse", name: "Lattice / Greenhouse Integration" }
    ]},
    { name: "Future Scenarios", scenarios: []},
];

export default function Sidebar({ activeModule, setActiveModule, activeScenario, setActiveScenario, setMessages, setScenarioId }) {
    const fetchFirstStep = async (scenarioId) => {
        try {
            setMessages([]); // Clear previous messages immediately
    
            const response = await fetch(`${API_BASE_URL}/chat/${scenarioId}/step/1`);
            if (!response.ok) throw new Error("Failed to fetch step");
            
            const data = await response.json();
            setMessages([{ sender: "bot", text: data.customer_prompt }]);
            setScenarioId(scenarioId); // Store the selected scenario ID
        } catch (error) {
            console.error("Error fetching step:", error);
        }
    };

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
                                setMessages([]); // Reset chat
                                fetchFirstStep(scenario.id);
                            }}
                        >
                            {scenario.name}
                        </button>
                    ))}
                </div>
            ))}
        </div>
    );
}
