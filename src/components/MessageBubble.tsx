import React from "react";
import { cn } from "../lib/utils";
import { Bot, User } from "lucide-react";

export type MessageRole = "model" | "user";

interface MessageBubbleProps {
  role: MessageRole;
  content: string;
  timestamp?: string;
  className?: string;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  role,
  content,
  timestamp,
  className,
}) => {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex w-full animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out",
        isUser ? "justify-end" : "justify-start",
        className,
      )}
    >
      <div
        className={cn(
          "flex max-w-[85%] sm:max-w-[75%] gap-3",
          isUser ? "flex-row-reverse" : "flex-row",
        )}
      >
        {/* Avatar */}
        <div
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border",
            isUser
              ? "bg-gradient-to-br from-indigo-500/20 to-indigo-600/30 border-indigo-500/30 text-indigo-300"
              : "bg-gradient-to-br from-purple-500/20 to-purple-600/30 border-purple-500/30 text-purple-300",
          )}
        >
          {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
        </div>

        {/* Bubble */}
        <div
          className={cn(
            "flex flex-col gap-1.5",
            isUser ? "items-end" : "items-start",
          )}
        >
          <div
            className={cn(
              "px-4 py-3 rounded-2xl text-[14.5px] leading-relaxed",
              isUser
                ? "bg-indigo-600/80 text-white rounded-tr-sm border border-indigo-500/40 shadow-lg shadow-indigo-500/20"
                : "bg-white/6 border border-white/10 text-white/90 rounded-tl-sm backdrop-blur-sm",
            )}
          >
            <p className="whitespace-pre-wrap break-words">{content}</p>
          </div>
          {timestamp && (
            <span className="text-[10px] font-medium text-white/25 px-1">
              {timestamp}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
