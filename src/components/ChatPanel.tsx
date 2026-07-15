import { useEffect, useRef } from "react";
import { MessageBubble, MessageInput, TypingIndicator } from ".";
import type { Message } from "../types";
import { cn } from "../lib/utils";

// ─── Chat panel (left) ────────────────────────────────────────────────────────
interface ChatPanelProps {
  messages: Message[];
  isTyping: boolean;
  inputValue: string;
  onChange: (v: string) => void;
  onSend: () => void;
  isCoding: boolean;
}

const ChatPanel: React.FC<ChatPanelProps> = ({
  messages,
  isTyping,
  inputValue,
  onChange,
  onSend,
  isCoding,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  return (
    <div
      className={cn(
        "flex flex-col bg-slate-950/60 border-r border-white/8",
        isCoding ? "w-[42%] shrink-0" : "flex-1",
      )}
    >
      {/* Messages scroll area */}
      <div
        className="flex-1 overflow-y-auto p-5 space-y-5"
        style={{
          scrollbarWidth: "thin",
          scrollbarColor: "rgba(99,102,241,0.3) transparent",
        }}
      >
        {messages.map((msg, i) => (
          <MessageBubble
            key={i}
            role={msg.role}
            content={msg.content}
            timestamp={msg.timestamp}
          />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <MessageInput
        value={inputValue}
        onChange={onChange}
        onSend={onSend}
        isLoading={isTyping}
      />
    </div>
  );
};
export default ChatPanel;
