import React from "react";
import { cn } from "../lib/utils";
import { Bot } from "lucide-react";

interface TypingIndicatorProps {
  className?: string;
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({
  className,
}) => {
  return (
    <div
      className={cn(
        "flex w-full justify-start animate-in fade-in slide-in-from-bottom-2 duration-300 ease-out",
        className,
      )}
    >
      <div className="flex max-w-[85%] sm:max-w-[75%] gap-3 flex-row">
        {/* Avatar */}
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-500/20 to-purple-600/30 border border-purple-500/30 text-purple-300">
          <Bot className="h-4 w-4" />
        </div>

        {/* Bubble */}
        <div className="flex flex-col items-start gap-1.5 justify-center">
          <div className="px-4 py-3 rounded-2xl rounded-tl-sm bg-white/6 border border-white/10 backdrop-blur-sm h-[46px] flex items-center min-w-[72px]">
            <div className="flex gap-1.5 items-center">
              <div className="h-1.5 w-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.3s]" />
              <div className="h-1.5 w-1.5 bg-indigo-400 rounded-full animate-bounce [animation-delay:-0.15s]" />
              <div className="h-1.5 w-1.5 bg-indigo-400 rounded-full animate-bounce" />
            </div>
          </div>
          <span className="text-[10px] font-medium text-white/25 px-1 animate-pulse">
            AI is thinking…
          </span>
        </div>
      </div>
    </div>
  );
};
