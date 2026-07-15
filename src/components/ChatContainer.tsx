import React, { useEffect, useRef } from "react";
import { cn } from "../lib/utils";

interface ChatContainerProps {
  children: React.ReactNode;
  className?: string;
  autoScroll?: boolean;
}

export const ChatContainer: React.FC<ChatContainerProps> = ({
  children,
  className,
  autoScroll = true,
}) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (autoScroll && scrollRef.current) {
      const scrollElement = scrollRef.current;
      scrollElement.scrollTo({
        top: scrollElement.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [children, autoScroll]);

  return (
    <div
      ref={scrollRef}
      className={cn(
        "flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth w-full max-w-4xl mx-auto custom-scrollbar",
        className,
      )}
      style={{
        // Adding custom scrollbar styling via inline style for tailwind independent consistency
        scrollbarWidth: "thin",
        scrollbarColor: "#cbd5e1 transparent",
      }}
    >
      {children}
    </div>
  );
};

//
