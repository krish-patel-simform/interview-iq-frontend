export type MessageRole = "model" | "user";

export interface Message {
  role: MessageRole;
  content: string;
  timestamp: string;
}
