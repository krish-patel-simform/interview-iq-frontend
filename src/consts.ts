import type { CodingLanguage, ConsoleLine } from "./types";

export const CONSOLE_COLORS: Record<ConsoleLine["type"], string> = {
  info: "text-blue-300",
  success: "text-emerald-400",
  error: "text-rose-400",
  stdout: "text-white/80",
};

// ─── Language display helpers ─────────────────────────────────────────────────
export const LANGUAGE_LABELS: Record<CodingLanguage, string> = {
  javascript: "JavaScript",
  typescript: "TypeScript",
  python: "Python",
  java: "Java",
  cpp: "C++",
};

export const LANGUAGE_COLORS: Record<CodingLanguage, string> = {
  javascript: "bg-yellow-500/15 text-yellow-300 border-yellow-500/30",
  typescript: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  python: "bg-green-500/15 text-green-300 border-green-500/30",
  java: "bg-orange-500/15 text-orange-300 border-orange-500/30",
  cpp: "bg-purple-500/15 text-purple-300 border-purple-500/30",
};

export const STARTER_CODE: Record<CodingLanguage, string> = {
  javascript: `// Write your solution here\nfunction solution() {\n  \n}\n`,
  typescript: `// Write your solution here\nfunction solution(): void {\n  \n}\n`,
  python: `# Write your solution here\ndef solution():\n    pass\n`,
  java: `// Write your solution here\nclass Solution {\n    public void solution() {\n        \n    }\n}\n`,
  cpp: `// Write your solution here\n#include <iostream>\nusing namespace std;\n\nvoid solution() {\n    \n}\n`,
};

export const DOMAINS = [
  { value: "javascript", label: "React" },
  { value: "typescript", label: "TypeScript" },
  { value: "javascript", label: "JavaScript" },
  { value: "javascript", label: "Node.js" },
  { value: "python", label: "Python" },
];

export const EXPERIENCE = [
  { value: "fresher", label: "Fresher (0 – 1 yr)" },
  { value: "junior", label: "Junior (1 – 3 yrs)" },
  { value: "mid", label: "Mid-level (3 – 5 yrs)" },
  { value: "senior", label: "Senior (5+ yrs)" },
];

export const LEVELS = [
  {
    value: "easy",
    label: "Easy",
    desc: "Fundamentals & basics",
    color: "from-emerald-500 to-teal-400",
    ring: "ring-emerald-300",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    border: "border-emerald-200",
  },
  {
    value: "medium",
    label: "Medium",
    desc: "Real-world scenarios",
    color: "from-amber-500 to-orange-400",
    ring: "ring-amber-300",
    bg: "bg-amber-50",
    text: "text-amber-700",
    border: "border-amber-200",
  },
  {
    value: "hard",
    label: "Hard",
    desc: "Advanced deep-dives",
    color: "from-rose-500 to-pink-500",
    ring: "ring-rose-300",
    bg: "bg-rose-50",
    text: "text-rose-700",
    border: "border-rose-200",
  },
];

export const DURATIONS = [15, 20, 30, 45, 60];
