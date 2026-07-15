import {
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Code2,
  Play,
  RotateCcw,
  Terminal,
} from "lucide-react";
import type { CodingLanguage, ConsoleLine } from "../types";
import { cn } from "../lib/utils";
import { CONSOLE_COLORS, LANGUAGE_COLORS, LANGUAGE_LABELS } from "../consts";
import { CodeEditor } from ".";

// ─── Editor panel (right) ─────────────────────────────────────────────────────
interface EditorPanelProps {
  language: CodingLanguage;
  code: string;
  onCodeChange: (c: string) => void;
  onSubmit: () => void;
  onReset: () => void;
  isProcessing: boolean;
  consoleLines: ConsoleLine[];
  consoleOpen: boolean;
  onToggleConsole: () => void;
}

const EditorPanel: React.FC<EditorPanelProps> = ({
  language,
  code,
  onCodeChange,
  onSubmit,
  onReset,
  isProcessing,
  consoleLines,
  consoleOpen,
  onToggleConsole,
}) => {
  const CONSOLE_HEIGHT = 160;

  return (
    <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-900/80 border-b border-white/8 shrink-0">
        {/* Language badge */}
        <div className="flex items-center gap-2.5">
          <Code2 className="w-4 h-4 text-white/40" />
          <span
            className={cn(
              "px-2.5 py-1 rounded-lg text-xs font-semibold border font-mono",
              LANGUAGE_COLORS[language],
            )}
          >
            {LANGUAGE_LABELS[language]}
          </span>
          <span className="text-[10px] text-white/25 font-medium tracking-wide uppercase">
            Locked
          </span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Reset */}
          <button
            id="editor-reset-btn"
            type="button"
            onClick={onReset}
            title="Reset to starter code"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border border-white/10 text-white/50 hover:text-white/80 hover:bg-white/8 transition-all duration-150"
            style={{ background: "rgba(255,255,255,0.04)" }}
          >
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </button>

          {/* Submit Code — calls same handleSend as chat */}
          <button
            id="editor-submit-btn"
            type="button"
            onClick={onSubmit}
            disabled={isProcessing}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold border border-violet-500/40 bg-violet-600/20 text-violet-300 hover:bg-violet-600/30 hover:text-violet-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150 shadow-sm shadow-violet-500/10"
          >
            {isProcessing ? (
              <>
                <Play className="w-3.5 h-3.5 animate-pulse" />
                Submitting…
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                Submit Code
              </>
            )}
          </button>
        </div>
      </div>

      {/* Monaco editor */}
      <div
        className="flex-1 min-h-0 overflow-hidden"
        style={{
          height: consoleOpen
            ? `calc(100% - ${CONSOLE_HEIGHT + 40}px)`
            : "100%",
        }}
      >
        <CodeEditor value={code} onChange={onCodeChange} language={language} />
      </div>

      {/* Console panel */}
      <div
        className="shrink-0 border-t border-white/8 bg-slate-950/90 transition-all duration-300"
        style={{ height: consoleOpen ? CONSOLE_HEIGHT : 40 }}
      >
        {/* Console header */}
        <button
          id="console-toggle-btn"
          type="button"
          onClick={onToggleConsole}
          className="w-full flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white/40 hover:text-white/70 transition-colors duration-150"
        >
          <Terminal className="w-3.5 h-3.5" />
          Console
          {consoleLines.length > 0 && (
            <span className="ml-1 px-1.5 py-0.5 rounded-full bg-violet-500/20 text-violet-300 text-[10px] font-bold">
              {consoleLines.length}
            </span>
          )}
          <span className="ml-auto">
            {consoleOpen ? (
              <ChevronDown className="w-3.5 h-3.5" />
            ) : (
              <ChevronUp className="w-3.5 h-3.5" />
            )}
          </span>
        </button>

        {/* Console output */}
        {consoleOpen && (
          <div
            className="px-4 pb-3 overflow-y-auto font-mono text-[12px] leading-relaxed space-y-0.5"
            style={{
              height: CONSOLE_HEIGHT - 40,
              scrollbarWidth: "thin",
              scrollbarColor: "rgba(99,102,241,0.2) transparent",
            }}
          >
            {consoleLines.length === 0 ? (
              <p className="text-white/20 italic">
                No output yet. Submit your code to see results.
              </p>
            ) : (
              consoleLines.map((line, i) => (
                <p key={i} className={CONSOLE_COLORS[line.type]}>
                  {line.type === "success" && "✓ "}
                  {line.type === "error" && "✗ "}
                  {line.text}
                </p>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorPanel;
