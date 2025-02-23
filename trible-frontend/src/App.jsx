import { useState, useEffect, useRef } from "react";
import ChatView from "./components/ChatView";
import Sidebar from "./components/Sidebar";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [activeModule, setActiveModule] = useState(0);
  const [activeScenario, setActiveScenario] = useState(0);
  const socket = useRef(null);

  useEffect(() => {
    socket.current = new WebSocket("ws://localhost:8000/ws");

    socket.current.onopen = () => {
      console.log("✅ Connected to WebSocket server");
    };

    socket.current.onmessage = (event) => {
      const botMessage = { sender: "bot", text: event.data };
      setMessages((prev) => [...prev, botMessage]);
    };

    socket.current.onerror = (error) => {
      console.error("WebSocket Error:", error);
    };

    socket.current.onclose = () => {
      console.log("❌ Disconnected from WebSocket server");
    };

    return () => {
      socket.current.close();
    };
  }, []);

  const sendMessage = () => {
    if (!input.trim() || !socket.current) return;
    const userMessage = { sender: "user", text: input };
    setMessages([...messages, userMessage]);
    socket.current.send(input);
    setInput("");
  };

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <Sidebar
        activeModule={activeModule}
        setActiveModule={setActiveModule}
        activeScenario={activeScenario}
        setActiveScenario={setActiveScenario}
        setMessages={setMessages}
      />
      <ChatView
        messages={messages}
        input={input}
        setInput={setInput}
        sendMessage={sendMessage}
        activeModule={activeModule}
        activeScenario={activeScenario}
      />
    </div>
  );
}