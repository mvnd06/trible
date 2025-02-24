import { useState } from "react";
import ChatView from "./components/ChatView";
import Sidebar from "./components/Sidebar";

export default function App() {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [activeModule, setActiveModule] = useState(0);
    const [activeScenario, setActiveScenario] = useState(0);
    const [scenarioId, setScenarioId] = useState(null);
    const [scenarioName, setScenarioName] = useState(""); 
    const [currentStep, setCurrentStep] = useState(1);  // ✅ Track the current step properly

    const sendMessage = async () => {
        if (!input.trim() || !scenarioId) return;

        const userMessage = { sender: "user", text: input };
        setMessages((prev) => [...prev, userMessage]);

        try {
            const response = await fetch(`https://trible-production.up.railway.app/chat/${scenarioId}/step/${currentStep}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input })
            });

            if (!response.ok) throw new Error("Failed to process response");

            const data = await response.json();
            console.log("AI Validation Response:", data);
            console.log(data)

            // ✅ If AI returns "correct", move to the next step
            if (data.correct_answer) {
                setCurrentStep(() => data.next_step_id);
                console.log(`✅ Step ${currentStep} completed. Moving to next step...`)
            }
            // Show AI response
            setMessages((prev) => [...prev, { sender: "bot", text: data.message }]);

        } catch (error) {
            console.error("Error processing user response:", error);
        }

        setInput(""); // ✅ Clear input after sending
    };

    return (
        <div className="flex h-screen bg-gray-900 text-white">
            <Sidebar
                activeModule={activeModule}
                setActiveModule={setActiveModule}
                activeScenario={activeScenario}
                setActiveScenario={setActiveScenario}
                setMessages={setMessages}
                setScenarioId={setScenarioId}
                setScenarioName={setScenarioName}
                setCurrentStep={setCurrentStep}  // ✅ Reset step when switching scenarios
            />
            <ChatView
                messages={messages}
                input={input}
                setInput={setInput}
                sendMessage={sendMessage}
                activeModule={activeModule}
                activeScenario={activeScenario}
                scenarioId={scenarioId}
                scenarioName={scenarioName}
            />
        </div>
    );
}
