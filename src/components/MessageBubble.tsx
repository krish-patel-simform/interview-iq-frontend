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
          "flex max-w-[85%] sm:max-w-[75%] gap-4",
          isUser ? "flex-row-reverse" : "flex-row",
        )}
      >
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-full shadow-sm border",
            isUser
              ? "bg-gradient-to-br from-indigo-100 to-indigo-200 border-indigo-300 text-indigo-700"
              : "bg-gradient-to-br from-purple-100 to-purple-200 border-purple-300 text-purple-700",
          )}
        >
          {isUser ? <User className="h-5 w-5" /> : <Bot className="h-5 w-5" />}
        </div>

        <div
          className={cn(
            "flex flex-col gap-1.5",
            isUser ? "items-end" : "items-start",
          )}
        >
          <div
            className={cn(
              "px-5 py-3.5 rounded-2xl shadow-sm text-[15px] leading-relaxed",
              isUser
                ? "bg-indigo-600 text-white rounded-tr-sm"
                : "bg-white border border-gray-100 text-gray-800 rounded-tl-sm shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)]",
            )}
          >
            <p className="whitespace-pre-wrap break-words">{content}</p>
          </div>
          {timestamp && (
            <span className="text-[11px] font-medium text-gray-400 px-1">
              {timestamp}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
