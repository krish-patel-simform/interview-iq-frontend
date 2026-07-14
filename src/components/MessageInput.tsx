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

  const { isListening, isSupported, toggleListening } = useSpeechToText({
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
        "p-4 bg-white/80 backdrop-blur-md border-t border-gray-200/50",
        className
      )}
    >
      <div className="max-w-4xl mx-auto flex items-end gap-3 bg-white rounded-3xl p-2 pl-4 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-100 transition-all focus-within:shadow-[0_8px_30px_rgb(0,0,0,0.12)] focus-within:border-indigo-200">
        <textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={isListening ? "Listening..." : placeholder}
          disabled={isLoading}
          rows={1}
          className="w-full max-h-[200px] bg-transparent resize-none outline-none py-3 text-[15px] text-gray-800 placeholder:text-gray-400 disabled:opacity-50 scrollbar-hide"
        />
        
        {isSupported && (
          <button
            onClick={handleMicClick}
            disabled={isLoading}
            className={cn(
              "shrink-0 p-3.5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed",
              isListening
                ? "bg-rose-100 text-rose-600 hover:bg-rose-200 focus:ring-rose-500 animate-pulse"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200 focus:ring-gray-500"
            )}
            aria-label={isListening ? "Stop listening" : "Start listening"}
            title={isListening ? "Stop listening" : "Start listening"}
          >
            {isListening ? (
              <MicOff className="h-5 w-5" />
            ) : (
              <Mic className="h-5 w-5" />
            )}
          </button>
        )}

        <button
          onClick={onSend}
          disabled={!value.trim() || isLoading}
          className="shrink-0 p-3.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-100 disabled:text-gray-400 text-white rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed group shadow-sm"
          aria-label="Send message"
        >
          <SendHorizontal className="h-5 w-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
        </button>
      </div>
      <div className="max-w-4xl mx-auto mt-2 text-center">
        <p className="text-[11px] text-gray-400 font-medium">
          Press <kbd className="font-mono bg-gray-100 px-1 py-0.5 rounded border border-gray-200 text-gray-500">Enter</kbd> to send, <kbd className="font-mono bg-gray-100 px-1 py-0.5 rounded border border-gray-200 text-gray-500">Shift + Enter</kbd> for new line
        </p>
      </div>
    </div>
  );
};
