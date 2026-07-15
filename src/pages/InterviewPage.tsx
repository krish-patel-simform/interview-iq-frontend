import { useCallback, useEffect, useState } from "react";
import { useBlocker, useLocation, useNavigate, useParams } from "react-router";
import {
  InterviewHeader,
  ChatContainer,
  MessageBubble,
  MessageInput,
  TypingIndicator,
  LoadingState,
  ErrorState,
} from "../components";
import { API_SERVICES } from "../services";
import type { InterviewConfig } from "./SetupPage";
import { formatTime } from "../utils";
import type { Message } from "../types";

function InterviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = useParams();

  // Retrieve config passed from SetupPage; redirect if missing
  const config: InterviewConfig | undefined = location.state?.config;

  const totalSeconds = (config?.duration ?? 0) * 60;
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
  const [isEnding, setIsEnding] = useState(false);
  const [status, setStatus] = useState<"loading" | "error" | "ready">("ready");
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [interviewActive, setInterviewActive] = useState(true);

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
            userId,
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

  const cleanupAndExit = useCallback(async () => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}${API_SERVICES.removeCandidate}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        },
      );

      if (!response.ok) throw new Error("Fail to remove the candidate");
      const jsonRes = await response.json();
      console.log(jsonRes.feedback);
    } catch (error) {
      console.error("Error removing candidate session:", error);
    } finally {
      setInterviewActive(false);
      navigate("/");
    }
  }, [navigate, userId]);

  // Intentional end (button / timer)
  const handleEndInterview = useCallback(async () => {
    if (isEnding) return;
    setIsEnding(true);
    await cleanupAndExit();
  }, [cleanupAndExit, isEnding]);

  const blocker = useBlocker(interviewActive);

  // useEffect for the prevent the unIntentionally leave the page
  useEffect(() => {
    // 1. beforeunload: tab close / refresh / external navigation
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!interviewActive) return;
      e.preventDefault();
      // sendBeacon survives page unload; fetch would be cancelled
      navigator.sendBeacon(
        `${import.meta.env.VITE_BACKEND_URL}${API_SERVICES.removeCandidate}`,
        JSON.stringify({ userId }),
      );
    };

    // 2. useBlocker: intercept in-app route navigation
    function handleBlocker() {
      if (blocker.state === "blocked") {
        const confirmed = window.confirm(
          "Are you sure you want to leave? Your interview session will be ended and your progress will be lost.",
        );

        if (confirmed) {
          handleEndInterview();
          blocker.proceed();
        } else {
          blocker.reset();
        }
      }
    }

    window.addEventListener("beforeunload", handleBeforeUnload);
    handleBlocker();
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [blocker, interviewActive, userId, handleEndInterview]);

  // Use Efefct for the countdown
  useEffect(() => {
    if (!config) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleEndInterview();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  // Timer turns red in the last 60 seconds
  const isLowTime = timeLeft <= 60;

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 relative overflow-hidden">
      {/* Ambient blobs */}
      <div className="absolute top-[-120px] left-[-80px] w-[420px] h-[420px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-60px] w-[380px] h-[380px] bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

      <InterviewHeader
        role={headerRole}
        duration={formatTime(timeLeft)}
        isLowTime={isLowTime}
        isConnected={true}
        onEndInterview={handleEndInterview}
        isEnding={isEnding}
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
