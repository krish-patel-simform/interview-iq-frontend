import { useCallback, useEffect, useState } from "react";
import { useBlocker, useLocation, useNavigate, useParams } from "react-router";
import { InterviewHeader, LoadingState, ErrorState } from "../components";
import { API_SERVICES } from "../services";
import { formatTime } from "../utils";
import type {
  CodingLanguage,
  ConsoleLine,
  InterviewConfig,
  Message,
} from "../types";

import EditorPanel from "../components/EditorPanel";
import ChatPanel from "../components/ChatPanel";
import { LANGUAGE_LABELS, STARTER_CODE } from "../consts";

function InterviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId } = useParams();

  // Retrieve config passed from SetupPage; redirect if missing
  const config: InterviewConfig | undefined = location.state?.config;

  const isCoding = config?.type === "coding";
  const language = (config?.language ?? "javascript") as CodingLanguage;

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

  // Coding editor state
  const [code, setCode] = useState(STARTER_CODE[language]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [consoleLines, setConsoleLines] = useState<ConsoleLine[]>([]);
  const [consoleOpen, setConsoleOpen] = useState(false);

  // ── handleSend (shared by chat input AND editor submit) ───────────────────
  const handleSend = useCallback(
    async (overrideMessage?: string) => {
      const message = overrideMessage ?? inputValue;
      if (!message.trim()) return;

      const timeInfo = {
        timestamp: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setMessages((prev) => [
        ...prev,
        { role: "user" as const, content: message, ...timeInfo },
      ]);

      // Only clear the chat input when it's a text message (not a code submission)
      if (!overrideMessage) setInputValue("");
      setIsTyping(true);

      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}${API_SERVICES.getAIResponse}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              answer: message,
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
    },
    [inputValue, userId],
  );

  // ── Submit Code: wraps code in a readable message then calls handleSend ───
  const handleSubmitCode = useCallback(async () => {
    if (isSubmitting || !code.trim()) return;
    setIsSubmitting(true);
    setConsoleOpen(true);
    setConsoleLines([
      { type: "info", text: "Submitting code to AI interviewer…" },
    ]);

    const codeMessage = `Here is my ${LANGUAGE_LABELS[language]} solution:\n\`\`\`${language}\n${code}\n\`\`\``;

    try {
      await handleSend(codeMessage);
      setConsoleLines((prev) => [
        ...prev,
        {
          type: "success",
          text: "Code submitted successfully. Check the chat for AI feedback.",
        },
      ]);
    } catch {
      setConsoleLines((prev) => [
        ...prev,
        { type: "error", text: "Submission failed. Please try again." },
      ]);
    } finally {
      setIsSubmitting(false);
    }
  }, [code, handleSend, isSubmitting, language]);

  // ── Reset editor to starter code
  const handleResetCode = useCallback(() => {
    setCode(STARTER_CODE[language]);
    setConsoleLines([]);
  }, [language]);

  // ── Cleanup & exit
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

  // Prevent unintentional page leave
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (!interviewActive) return;
      e.preventDefault();
      navigator.sendBeacon(
        `${import.meta.env.VITE_BACKEND_URL}${API_SERVICES.removeCandidate}`,
        JSON.stringify({ userId }),
      );
    };

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

  // Countdown timer
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
  const headerRole = isCoding
    ? `${domainLabel} Coding Interview — ${levelLabel} · ${config.duration} min`
    : `${domainLabel} Interview — ${levelLabel} · ${config.duration} min`;

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

      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <div className="flex flex-1 min-h-0 relative z-10">
        {/* LEFT: Chat panel (always shown) */}
        <ChatPanel
          messages={messages}
          isTyping={isTyping}
          inputValue={inputValue}
          onChange={setInputValue}
          onSend={handleSend}
          isCoding={isCoding}
        />

        {/* RIGHT: Monaco editor (only for coding interview) */}
        {isCoding && (
          <>
            {/* Divider */}
            <div className="w-px bg-white/8 shrink-0" />

            <EditorPanel
              language={language}
              code={code}
              onCodeChange={setCode}
              onSubmit={handleSubmitCode}
              onReset={handleResetCode}
              isSubmitting={isSubmitting}
              consoleLines={consoleLines}
              consoleOpen={consoleOpen}
              onToggleConsole={() => setConsoleOpen((o) => !o)}
            />
          </>
        )}
      </div>
    </div>
  );
}

export default InterviewPage;
