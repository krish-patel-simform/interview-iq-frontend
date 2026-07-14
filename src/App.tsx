import { useState } from "react";
import {
  InterviewHeader,
  ChatContainer,
  MessageBubble,
  MessageInput,
  TypingIndicator,
  LoadingState,
  ErrorState,
  type MessageRole,
} from "./components";

interface Message {
  role: MessageRole;
  content: string;
  timestamp: string;
}

function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      content:
        "Hello! I am your AI interviewer. Are you ready to begin our session today?",
      timestamp: "10:00 AM",
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [status, setStatus] = useState<"loading" | "error" | "ready">("ready");

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const userMsg = {
      role: "user" as const,
      content: inputValue,
    };

    const timeInfo = {
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [...prev, { ...userMsg, ...timeInfo }]);
    setInputValue("");
    setIsTyping(true);

    // Simulate AI response

    try {
      const response = await fetch(
        "http://localhost:4000/api/ai/get-ai-response",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            answer: inputValue,
            sessionId: "123",
          }),
        },
      );
      if (!response.ok) throw new Error("Fail to fetch the get ai reponse api");
      const data = await response.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "model",
          content: data.answer,
          timestamp: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
        },
      ]);
    } catch (error) {
      console.log("Error in fetching the get Ai Response : ", error);
    } finally {
      setIsTyping(false);
    }
  };

  if (status === "loading") {
    return <LoadingState />;
  }

  if (status === "error") {
    return <ErrorState fullScreen onRetry={() => setStatus("ready")} />;
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50/50">
      <InterviewHeader
        role="Senior React Engineer Interview"
        duration="14:32"
        isConnected={true}
      />

      <ChatContainer>
        <div className="flex flex-col space-y-6 pb-20">
          {messages.map((msg, index) => (
            <MessageBubble
              key={index}
              role={msg.role}
              content={msg.content}
              timestamp={msg.timestamp}
            />
          ))}
          {isTyping && <TypingIndicator />}
        </div>
        <div className="fixed bottom-0 left-0 right-0">
          <MessageInput
            value={inputValue}
            onChange={setInputValue}
            onSend={handleSend}
            isLoading={isTyping}
          />
        </div>
      </ChatContainer>
    </div>
  );
}

export default App;
