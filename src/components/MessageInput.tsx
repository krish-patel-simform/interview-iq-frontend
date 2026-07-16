import React, { useRef, useEffect } from "react";
import { cn } from "../lib/utils";
import { SendHorizontal, Mic, MicOff } from "lucide-react";
import { useSpeechToText } from "../hooks/useSpeechToText";

interface MessageInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isLoading?: boolean;
  placeholder?: string;
  className?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  value,
  onChange,
  onSend,
  isLoading = false,
  placeholder = "Type or speak your answer here...",
  className,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { isListening, isSupported, toggleListening, stopListening } =
    useSpeechToText({
      onTranscriptChange: onChange,
    });

  // Auto-resize textarea based on content
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 200)}px`;
    }
  }, [value]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (value.trim() && !isLoading) {
        // Stop the mic before submitting so the silence timer is also cleared
        if (isListening) stopListening();
        onSend();
      }
    }
  };

  const handleMicClick = () => {
    toggleListening(value);
  };

  return (
    <div
      className={cn(
        "p-4 bg-slate-950/80 backdrop-blur-xl border-t border-white/8",
        className,
      )}
    >
      {/* Input row */}
      <div className="max-w-4xl mx-auto flex items-end gap-3 bg-white/5 rounded-2xl p-2 pl-4 border border-white/10 transition-all focus-within:border-indigo-500/50 focus-within:bg-white/8 focus-within:shadow-[0_0_0_3px_rgba(99,102,241,0.12)]">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? "Listening…" : placeholder}
          disabled={isLoading}
          rows={1}
          className="w-full max-h-[200px] bg-transparent resize-none outline-none py-3 text-[14.5px] text-white/90 placeholder:text-white/25 disabled:opacity-50"
          style={{ scrollbarWidth: "none" }}
        />

        {isSupported && (
          <button
            onClick={handleMicClick}
            disabled={isLoading}
            className={cn(
              "shrink-0 p-3 rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:cursor-not-allowed",
              isListening
                ? "bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 focus:ring-rose-500/50 animate-pulse border border-rose-500/30"
                : "bg-white/5 text-white/40 hover:bg-white/10 hover:text-white/70 focus:ring-white/20 border border-white/8",
            )}
            aria-label={isListening ? "Stop listening" : "Start listening"}
            title={isListening ? "Stop listening" : "Start listening"}
          >
            {isListening ? (
              <MicOff className="h-4 w-4" />
            ) : (
              <Mic className="h-4 w-4" />
            )}
          </button>
        )}

        <button
          onClick={() => {
            // Stop the mic before submitting so the silence timer is also cleared
            if (isListening) stopListening();
            onSend();
          }}
          disabled={!value.trim() || isLoading}
          className="shrink-0 p-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-white/5 disabled:text-white/20 text-white rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 disabled:cursor-not-allowed shadow-lg shadow-indigo-500/20 disabled:shadow-none group border border-indigo-500/30 disabled:border-white/8"
          aria-label="Send message"
        >
          <SendHorizontal className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>

      {/* Hint */}
      <div className="max-w-4xl mx-auto mt-2 text-center">
        <p className="text-[10px] text-white/20 font-medium">
          Press{" "}
          <kbd className="font-mono bg-white/8 px-1 py-0.5 rounded border border-white/10 text-white/30">
            Enter
          </kbd>{" "}
          to send,{" "}
          <kbd className="font-mono bg-white/8 px-1 py-0.5 rounded border border-white/10 text-white/30">
            Shift + Enter
          </kbd>{" "}
          for new line
        </p>
      </div>
    </div>
  );
};
