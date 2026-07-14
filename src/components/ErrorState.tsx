import React from "react";
import { cn } from "../lib/utils";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  fullScreen?: boolean;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = "Something went wrong",
  message = "We couldn't connect to the interview server. Please check your connection and try again.",
  onRetry,
  fullScreen = false,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8 text-center",
        fullScreen ? "fixed inset-0 bg-gray-50/95 backdrop-blur-sm z-50 min-h-screen" : "w-full py-16 bg-gray-50 rounded-2xl border border-gray-100",
        className
      )}
    >
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 shadow-sm border border-rose-200 mb-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-rose-200/50 animate-pulse"></div>
        <AlertCircle className="h-8 w-8 relative z-10" />
      </div>
      
      <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
      <p className="max-w-md text-[15px] leading-relaxed text-gray-500 mb-8">{message}</p>
      
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded-full font-medium transition-all active:scale-95 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-offset-2"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      )}
    </div>
  );
};
