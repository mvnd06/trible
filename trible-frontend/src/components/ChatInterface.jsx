import { useState, useEffect, useRef } from "react";
import { Input } from "./ui/input.jsx";
import { Button } from "./ui/button.jsx";
import { Card, CardContent } from "./ui/card.jsx";
import { motion } from "framer-motion";

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socket = useRef(null);

  useEffect(() => {
    // Establish WebSocket connection
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 text-white p-6">
      <Card className="w-full max-w-2xl">
        <CardContent className="space-y-4 p-4 h-96 overflow-y-auto">
          {messages.map((msg, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`p-2 rounded-lg max-w-xs ${msg.sender === "user" ? "bg-blue-600 ml-auto" : "bg-gray-700"}`}
            >
              {msg.text}
            </motion.div>
          ))}
        </CardContent>
      </Card>
      <div className="mt-4 flex w-full max-w-2xl">
        <Input
          className="flex-1 p-2 text-black"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <Button className="ml-2" onClick={sendMessage}>
          Send
        </Button>
      </div>
    </div>
  );
}
