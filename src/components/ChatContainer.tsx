import React from "react";
import { cn } from "../lib/utils";

interface ChatContainerProps {
  children?: React.ReactNode;
  className?: string;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  children,
  className,
}) => {
  return (
    <div
      className={cn(
        "flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth w-full max-w-4xl mx-auto",
        className,
      )}
      style={{
        scrollbarWidth: "thin",
        scrollbarColor: "rgba(99,102,241,0.3) transparent",
      }}
    >
      {children}
    </div>
  );
};
