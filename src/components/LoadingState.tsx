import React from "react";
import { cn } from "../lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingStateProps {
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = "Loading interview environment…",
  fullScreen = true,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center p-8",
        fullScreen
          ? "fixed inset-0 z-50 min-h-screen bg-slate-950"
          : "w-full py-16",
        className,
      )}
    >
      {/* Ambient blobs */}
      {fullScreen && (
        <>
          <div className="absolute top-[-120px] left-[-80px] w-[420px] h-[420px] bg-indigo-600/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute bottom-[-100px] right-[-60px] w-[380px] h-[380px] bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />
        </>
      )}

      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 bg-indigo-500/20 rounded-full animate-ping opacity-75" />
        <div className="relative flex items-center justify-center w-16 h-16 bg-gradient-to-br from-indigo-500/20 to-purple-600/20 rounded-2xl border border-white/10 backdrop-blur-sm">
          <Loader2 className="h-7 w-7 text-indigo-400 animate-spin" />
        </div>
      </div>

      <h3 className="mt-7 text-base font-semibold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
        {message}
      </h3>
      <p className="mt-2 text-sm text-white/30 font-medium">Please wait a moment</p>
    </div>
  );
};
