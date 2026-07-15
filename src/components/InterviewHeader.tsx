import React from "react";
import { cn } from "../lib/utils";
import { Clock, Monitor, PhoneOff } from "lucide-react";

interface InterviewHeaderProps {
  role?: string;
  duration?: string;
  isConnected?: boolean;
  onEndInterview?: () => void;
  isEnding?: boolean;
  isLowTime?: boolean;
  className?: string;
}

export const InterviewHeader: React.FC<InterviewHeaderProps> = ({
  role = "Software Engineer Interview",
  duration = "00:00",
  isConnected = true,
  onEndInterview,
  isEnding = false,
  isLowTime = false,
  className,
}) => {
  return (
    <header
      className={cn(
        "flex items-center justify-between px-6 py-4 sticky top-0 z-50",
        "bg-slate-950/80 backdrop-blur-xl border-b border-white/8",
        className,
      )}
    >
      {/* Left — brand + session info */}
      <div className="flex items-center gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/25">
          <Monitor className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-base font-bold text-white leading-tight">
            {role}
          </h1>
          <div className="flex items-center gap-2 mt-0.5">
            <span
              className={cn(
                "relative flex h-2 w-2",
                isConnected ? "text-emerald-400" : "text-rose-400",
              )}
            >
              {isConnected && (
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              )}
              <span
                className={cn(
                  "relative inline-flex h-2 w-2 rounded-full",
                  isConnected ? "bg-emerald-400" : "bg-rose-400",
                )}
              />
            </span>
            <span className="text-xs font-medium text-white/40">
              {isConnected ? "Connected to AI" : "Disconnected"}
            </span>
          </div>
        </div>
      </div>

      {/* Right — timer + end button */}
      <div className="flex items-center gap-3">
        <div
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl border shadow-inner transition-colors duration-500",
            isLowTime
              ? "bg-rose-500/15 border-rose-500/30"
              : "bg-white/5 border-white/10",
          )}
        >
          <Clock
            className={cn(
              "h-4 w-4 transition-colors duration-500",
              isLowTime ? "text-rose-400 animate-pulse" : "text-indigo-400",
            )}
          />
          <span
            className={cn(
              "font-mono text-sm font-semibold tracking-widest transition-colors duration-500",
              isLowTime ? "text-rose-300" : "text-indigo-300",
            )}
          >
            {duration}
          </span>
        </div>

        {onEndInterview && (
          <button
            id="end-interview-btn"
            type="button"
            onClick={onEndInterview}
            disabled={isEnding}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-rose-500/50 disabled:opacity-50 disabled:cursor-not-allowed border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 hover:text-rose-300"
          >
            <PhoneOff className={cn("h-4 w-4", isEnding && "animate-pulse")} />
            {isEnding ? "Ending…" : "End Interview"}
          </button>
        )}
      </div>
    </header>
  );
};
