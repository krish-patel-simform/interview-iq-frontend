import Editor from "@monaco-editor/react";
import React from "react";
import { cn } from "../lib/utils";
import type { CodingLanguage } from "../types";

interface CodeEditorProps {
  value: string;
  onChange: (code: string) => void;
  language: CodingLanguage;
  className?: string;
}

const monacoLanguageMap: Record<CodingLanguage, string> = {
  javascript: "javascript",
  typescript: "typescript",
  python: "python",
  java: "java",
  cpp: "cpp",
};

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  language,
  className,
}) => {
  return (
    <div className={cn("h-full w-full overflow-hidden", className)}>
      <Editor
        height="100%"
        language={monacoLanguageMap[language]}
        value={value}
        onChange={(val) => onChange(val ?? "")}
        theme="vs-dark"
        options={{
          fontSize: 14,
          fontFamily:
            "'JetBrains Mono', 'Fira Code', 'Cascadia Code', monospace",
          fontLigatures: true,
          minimap: { enabled: false },
          scrollBeyondLastLine: false,
          lineNumbers: "on",
          renderLineHighlight: "line",
          tabSize: 2,
          insertSpaces: true,
          wordWrap: "on",
          smoothScrolling: true,
          cursorBlinking: "smooth",
          cursorSmoothCaretAnimation: "on",
          padding: { top: 16, bottom: 16 },
          scrollbar: {
            verticalScrollbarSize: 6,
            horizontalScrollbarSize: 6,
          },
          bracketPairColorization: { enabled: true },
          guides: { bracketPairs: "active" },
          overviewRulerLanes: 0,
          hideCursorInOverviewRuler: true,
          overviewRulerBorder: false,
        }}
      />
    </div>
  );
};
