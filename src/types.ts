export type MessageRole = "model" | "user";

export interface Message {
  role: MessageRole;
  content: string;
  timestamp: string;
}

export interface ConsoleLine {
  type: "info" | "success" | "error" | "stdout";
  text: string;
}

// ─── Coding Interview Types ───────────────────────────────────────────────────

export type CodingLanguage =
  | "javascript"
  | "typescript"
  | "python"
  | "java"
  | "cpp";

export interface InterviewConfig {
  domain: string;
  experience: string;
  level: string;
  duration: number; // minutes
  type?: "qa" | "coding";
  language?: CodingLanguage;
}
