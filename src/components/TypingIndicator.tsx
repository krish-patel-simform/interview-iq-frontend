import React from "react";
import { cn } from "../lib/utils";
import { Bot } from "lucide-react";

interface TypingIndicatorProps {
  className?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ className }) => {
  return (
    <div
      className={cn(
        "flex w-full justify-start animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out",
        className
      )}
    >
      <div className="flex max-w-[85%] sm:max-w-[75%] gap-4 flex-row">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-100 to-purple-200 border border-purple-300 text-purple-700 shadow-sm">
          <Bot className="h-5 w-5" />
        </div>

        <div className="flex flex-col items-start gap-1.5 justify-center">
          <div className="px-5 py-4 rounded-2xl rounded-tl-sm bg-white border border-gray-100 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] h-[46px] flex items-center justify-center min-w-[72px]">
            <div className="flex gap-1.5 items-center">
              <div className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce"></div>
            </div>
          </div>
          <span className="text-[11px] font-medium text-gray-400 px-1 animate-pulse">
            AI is thinking...
          </span>
        </div>
      </div>
    </div>
  );
};
