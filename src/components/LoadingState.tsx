import React from "react";
import { cn } from "../lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Loading interview environment...",
  fullScreen = true,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8",
        fullScreen ? "fixed inset-0 bg-white/95 backdrop-blur-sm z-50 min-h-screen" : "w-full py-16",
        className
      )}
    >
      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 bg-indigo-100 rounded-full animate-ping opacity-75"></div>
        <div className="relative bg-white p-4 rounded-full shadow-lg border border-indigo-50">
          <Loader2 className="h-8 w-8 text-indigo-600 animate-spin" />
        </div>
      </div>
      <h3 className="mt-6 text-lg font-semibold text-gray-800 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
        {message}
      </h3>
      <p className="mt-2 text-sm text-gray-500 font-medium">Please wait a moment</p>
    </div>
  );
};
