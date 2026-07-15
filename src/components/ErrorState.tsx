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
        fullScreen
          ? "fixed inset-0 z-50 min-h-screen bg-slate-950"
          : "w-full py-16 bg-white/5 rounded-2xl border border-white/10",
        className,
      )}
    >
      {/* Ambient blobs for fullscreen */}
      {fullScreen && (
        <>
          <div className="absolute top-[-120px] left-[-80px] w-[420px] h-[420px] bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-[-100px] right-[-60px] w-[380px] h-[380px] bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />
        </>
      )}

      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-500/15 border border-rose-500/30 mb-6">
        <div className="absolute inset-0 bg-rose-500/10 rounded-2xl animate-pulse" />
        <AlertCircle className="h-7 w-7 text-rose-400 relative z-10" />
      </div>

      <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
      <p className="max-w-md text-[15px] leading-relaxed text-white/40 mb-8">{message}</p>

      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-white/8 hover:bg-white/12 text-white/80 hover:text-white border border-white/12 rounded-full font-medium transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>
      )}
    </div>
  );
};
