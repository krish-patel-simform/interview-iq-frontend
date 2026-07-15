import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import {
  InterviewHeader,
  ChatContainer,
  MessageBubble,
  MessageInput,
  TypingIndicator,
  LoadingState,
  ErrorState,
  type MessageRole,
} from "../components";
import { API_SERVICES } from "../services";
import type { InterviewConfig } from "./SetupPage";

interface Message {
  role: MessageRole;
  content: string;
  timestamp: string;
}

function InterviewPage() {
  const location = useLocation();
  const navigate = useNavigate();

  // Retrieve config passed from SetupPage; redirect if missing
  const config: InterviewConfig | undefined = location.state?.config;

  const [messages, setMessages] = useState<Message[]>([
    {
      role: "model",
      content:
        "Hello! I am your AI interviewer. Are you ready to begin our session today?",
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [status, setStatus] = useState<"loading" | "error" | "ready">("ready");

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const timeInfo = {
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setMessages((prev) => [
      ...prev,
      { role: "user" as const, content: inputValue, ...timeInfo },
    ]);
    setInputValue("");
    setIsTyping(true);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}${API_SERVICES.getAIResponse}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            answer: inputValue,
            sessionId: "123",
          }),
        },
      );
      if (!response.ok) throw new Error("Failed to fetch AI response");
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
      console.error("Error fetching AI response:", error);
    } finally {
      setIsTyping(false);
    }
  };

  // If no config, redirect back to setup
  if (!config) {
    navigate("/");
    return null;
  }

  if (status === "loading") return <LoadingState />;
  if (status === "error") {
    return <ErrorState fullScreen onRetry={() => setStatus("ready")} />;
  }

  // Build a human-readable header label from config
  const domainLabel =
    config.domain.charAt(0).toUpperCase() + config.domain.slice(1);
  const levelLabel =
    config.level.charAt(0).toUpperCase() + config.level.slice(1);
  const headerRole = `${domainLabel} Interview — ${levelLabel} · ${config.duration} min`;

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute top-[-120px] left-[-80px] w-[420px] h-[420px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-60px] w-[380px] h-[380px] bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      <InterviewHeader
        role={headerRole}
        duration={`${String(config.duration).padStart(2, "0")}:00`}
        isConnected={true}
      />

      <ChatContainer className="relative z-10">
        <div className="flex flex-col space-y-6 pb-24">
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
        <div className="fixed bottom-0 left-0 right-0 z-20">
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

export default InterviewPage;
