import React from "react";
import { createPortal } from "react-dom";
import { CheckCircle2 } from "lucide-react";

interface FeedbackModalProps {
  feedback: string;
  onDone: () => void;
}

export const FeedbackModal: React.FC<FeedbackModalProps> = ({
  feedback,
  onDone,
}) => {
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm animate-in fade-in duration-300"
      aria-modal="true"
      role="dialog"
      aria-labelledby="feedback-modal-title"
    >
      <div className="relative w-full max-w-lg mx-4 rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900 to-slate-950 shadow-2xl shadow-black/60 animate-in slide-in-from-bottom-4 duration-300">
        {/* Header */}
        <div className="flex flex-col items-center gap-3 px-8 pt-8 pb-4 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-500/15 border border-emerald-500/30">
            <CheckCircle2 className="h-7 w-7 text-emerald-400" />
          </div>
          <h2
            id="feedback-modal-title"
            className="text-xl font-bold text-white tracking-tight"
          >
            Interview Complete
          </h2>
          <p className="text-sm text-white/45 font-medium">
            Here's your AI interviewer's feedback
          </p>
        </div>

        {/* Divider */}
        <div className="h-px mx-8 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Feedback body */}
        <div
          className="px-8 py-5 max-h-72 overflow-y-auto text-sm leading-relaxed text-white/80 whitespace-pre-wrap"
          style={{
            scrollbarWidth: "thin",
            scrollbarColor: "rgba(99,102,241,0.3) transparent",
          }}
        >
          {feedback || "Thank you for completing the interview. No specific feedback was provided."}
        </div>

        {/* Divider */}
        <div className="h-px mx-8 bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Footer */}
        <div className="flex justify-center px-8 py-5">
          <button
            id="feedback-done-btn"
            type="button"
            onClick={onDone}
            className="flex items-center gap-2 px-8 py-2.5 rounded-xl text-sm font-semibold text-white transition-all duration-200 hover:opacity-90 active:scale-95 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-slate-900"
            style={{
              background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
              boxShadow: "0 8px 32px -8px rgba(99,102,241,0.6)",
            }}
          >
            <CheckCircle2 className="h-4 w-4" />
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
};
