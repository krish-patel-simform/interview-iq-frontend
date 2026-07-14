import React from "react";
import { cn } from "../lib/utils";
import { Clock, Monitor } from "lucide-react";

interface InterviewHeaderProps {
  role?: string;
  duration?: string;
  isConnected?: boolean;
  className?: string;
}

export const InterviewHeader: React.FC<InterviewHeaderProps> = ({
  role = "Software Engineer Interview",
  duration = "00:00",
  isConnected = true,
  className,
}) => {
  return (
    <header
      className={cn(
        "flex items-center justify-between px-6 py-4 bg-white/80 backdrop-blur-md border-b border-gray-200/50 shadow-sm sticky top-0 z-50",
        className,
      )}
    >
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-md">
          <Monitor className="h-6 w-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600">
            {role}
          </h1>
          <div className="flex items-center gap-2 text-sm text-gray-500 font-medium mt-0.5">
            <span className="flex items-center gap-1.5">
              <span
                className={cn(
                  "relative flex h-2.5 w-2.5",
                  isConnected ? "text-emerald-500" : "text-rose-500",
                )}
              >
                {isConnected && (
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75"></span>
                )}
                <span
                  className={cn(
                    "relative inline-flex h-2.5 w-2.5 rounded-full",
                    isConnected ? "bg-emerald-500" : "bg-rose-500",
                  )}
                ></span>
              </span>
              {isConnected ? "Connected to AI" : "Disconnected"}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 px-4 py-2 bg-indigo-50/50 rounded-lg border border-indigo-100/50 shadow-inner">
        <Clock className="h-4 w-4 text-indigo-600" />
        <span className="font-mono text-indigo-900 font-semibold tracking-wide">
          {duration}
        </span>
      </div>
    </header>
  );
};
