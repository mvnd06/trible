import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const Input = (props) => <input className="border p-2 rounded-md focus:ring focus:ring-blue-400 w-full bg-white text-black" {...props} />;
const Button = ({ children, ...props }) => (
  <button className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md transition-all" {...props}>
    {children}
  </button>
);
const Card = ({ children }) => <div className="bg-gray-800 p-4 rounded-lg shadow-md w-full flex flex-col h-[80vh]">{children}</div>;
const CardContent = ({ children, innerRef }) => (
  <div ref={innerRef} className="p-4 flex-1 overflow-y-auto custom-scrollbar flex flex-col">
    {children}
  </div>
);

export default function ChatView({ messages, input, setInput, sendMessage, activeModule, activeScenario, scenarioId }) {
  const modules = [
    { name: "Module 1", scenarios: [{ id: "lattice_adp_troubleshooting", name: "Lattice ADP Integration" }] },
    { name: "Module 2", scenarios: [] },
    { name: "Module 3", scenarios: [] },
    { name: "Module 4", scenarios: [] },
  ];

  const messagesEndRef = useRef(null);

  // Ensure chat scrolls to the bottom when messages update
  useEffect(() => {
    console.log("ChatView updated. Messages:", messages);
    if (messagesEndRef.current) {
        messagesEndRef.current.scrollTop = messagesEndRef.current.scrollHeight;
    }
}, [messages]);

  return (
    <div className="flex-1 flex flex-col items-center justify-between p-6 h-screen">
      <h2 className="text-xl font-bold mb-4">
        {scenarioId ? modules[activeModule].scenarios[activeScenario]?.name || "Select a Scenario" : "Select a Scenario"}
      </h2>
      <Card className="w-full max-w-2xl shadow-lg border border-gray-700 rounded-2xl overflow-hidden">
        <CardContent innerRef={messagesEndRef}>
          {messages.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="p-3 rounded-xl max-w-xs text-sm bg-gray-700 text-gray-200 shadow-md"
            >
              Select a scenario to begin troubleshooting.
            </motion.div>
          ) : (
            messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className={`p-3 rounded-xl max-w-xs text-sm ${
                  msg.sender === "user" ? "bg-blue-600 ml-auto text-white shadow-md" : "bg-gray-700 text-gray-200 shadow-md"
                }`}
              >
                {msg.text}
              </motion.div>
            ))
          )}
          <div ref={messagesEndRef}></div>
        </CardContent>
      </Card>
      <div className="mt-4 flex w-full max-w-2xl sticky bottom-4 bg-gray-900 p-4 rounded-lg">
        <Input
          placeholder={scenarioId ? "Type your message here..." : "Select a scenario first"}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          disabled={!scenarioId}
        />
        <Button className="ml-3" onClick={sendMessage} disabled={!scenarioId}>
          Send
        </Button>
      </div>
    </div>
  );
}
