import React, { useState } from "react";
import { useNavigate } from "react-router";
import {
  Bot,
  Briefcase,
  ChevronRight,
  Clock,
  Code2,
  Layers,
  Loader2,
  Sparkles,
  Target,
} from "lucide-react";
import { API_SERVICES } from "../services";

export interface InterviewConfig {
  domain: string;
  experience: string;
  level: string;
  duration: number; // minutes
}

const domains = [
  { value: "react", label: "React" },
  { value: "typescript", label: "TypeScript" },
  { value: "javascript", label: "JavaScript" },
  { value: "nodejs", label: "Node.js" },
  { value: "python", label: "Python" },
];

const experiences = [
  { value: "fresher", label: "Fresher (0 – 1 yr)" },
  { value: "junior", label: "Junior (1 – 3 yrs)" },
  { value: "mid", label: "Mid-level (3 – 5 yrs)" },
  { value: "senior", label: "Senior (5+ yrs)" },
];

const levels = [
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

const durations = [15, 20, 30, 45, 60];

const SetupPage: React.FC = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState<InterviewConfig>({
    domain: "",
    experience: "",
    level: "",
    duration: 30,
  });
  const [isLoading, setIsLoading] = useState(false);

  const isValid = form.domain && form.experience && form.level && form.duration;

  const handleStart = async () => {
    if (!isValid || isLoading) return;
    setIsLoading(true);
    try {
      const userId = crypto.randomUUID();
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}${API_SERVICES.setupCandidateInterview}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ ...form, userId }),
        },
      );
      if (!response.ok) throw new Error("Response is not successed");
      const jsonRes = await response.json();

      if (jsonRes.success) {
        navigate(`/interview/${userId}`, { state: { config: form } });
      }
    } catch (error) {
      console.log("Error in the setup page : ", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Ambient background blobs */}
      <div className="absolute top-[-120px] left-[-80px] w-[420px] h-[420px] bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-60px] w-[380px] h-[380px] bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-900/10 rounded-full blur-3xl pointer-events-none" />

      {/* Card */}
      <div className="relative w-full max-w-xl bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl shadow-2xl p-8 flex flex-col gap-7">
        {/* Header */}
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/30">
            <Bot className="w-8 h-8 text-white" />
            <Sparkles className="w-4 h-4 text-yellow-300 absolute -top-1.5 -right-1.5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              AI Interview IQ
            </h1>
            <p className="text-sm text-white/50 mt-1">
              Configure your session and let's get started
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="h-px bg-gradient-to-r from-transparent via-white/15 to-transparent" />

        {/* Domain */}
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/40">
            <Code2 className="w-3.5 h-3.5" />
            Domain
          </label>
          <div className="relative">
            <select
              id="domain-select"
              value={form.domain}
              onChange={(e) =>
                setForm((p) => ({ ...p, domain: e.target.value }))
              }
              className="w-full appearance-none border border-white/12 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <option value="" disabled style={{ background: "#1e1b4b" }}>
                Select a domain…
              </option>
              {domains.map((d) => (
                <option
                  key={d.value}
                  value={d.value}
                  style={{ background: "#1e1b4b" }}
                >
                  {d.label}
                </option>
              ))}
            </select>
            <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 w-4 h-4 text-white/30 pointer-events-none" />
          </div>
        </div>

        {/* Experience */}
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/40">
            <Briefcase className="w-3.5 h-3.5" />
            Experience
          </label>
          <div className="relative">
            <select
              id="experience-select"
              value={form.experience}
              onChange={(e) =>
                setForm((p) => ({ ...p, experience: e.target.value }))
              }
              className="w-full appearance-none border border-white/12 text-white rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer"
              style={{ background: "rgba(255,255,255,0.06)" }}
            >
              <option value="" disabled style={{ background: "#1e1b4b" }}>
                Select experience level…
              </option>
              {experiences.map((e) => (
                <option
                  key={e.value}
                  value={e.value}
                  style={{ background: "#1e1b4b" }}
                >
                  {e.label}
                </option>
              ))}
            </select>
            <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 rotate-90 w-4 h-4 text-white/30 pointer-events-none" />
          </div>
        </div>

        {/* Interview Level */}
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/40">
            <Layers className="w-3.5 h-3.5" />
            Difficulty Level
          </label>
          <div className="grid grid-cols-3 gap-3">
            {levels.map((lvl) => (
              <button
                key={lvl.value}
                id={`level-${lvl.value}`}
                type="button"
                onClick={() => setForm((p) => ({ ...p, level: lvl.value }))}
                className={`relative flex flex-col items-center gap-1.5 py-3.5 px-2 rounded-xl border transition-all duration-200 focus:outline-none focus:ring-2 ${lvl.ring} ${
                  form.level === lvl.value
                    ? `${lvl.bg} ${lvl.border} ring-2`
                    : "border-white/10 hover:bg-white/10"
                }`}
                style={{
                  background:
                    form.level === lvl.value
                      ? undefined
                      : "rgba(255,255,255,0.05)",
                }}
              >
                <span
                  className={`w-2.5 h-2.5 rounded-full bg-gradient-to-br ${lvl.color}`}
                />
                <span
                  className={`text-sm font-semibold ${
                    form.level === lvl.value ? lvl.text : "text-white/70"
                  }`}
                >
                  {lvl.label}
                </span>
                <span
                  className={`text-[10px] text-center leading-tight ${
                    form.level === lvl.value ? lvl.text : "text-white/35"
                  }`}
                >
                  {lvl.desc}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Duration */}
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-white/40">
            <Clock className="w-3.5 h-3.5" />
            Duration —{" "}
            <span className="text-indigo-400 normal-case font-semibold">
              {form.duration} min
            </span>
          </label>
          <div className="flex gap-2 flex-wrap">
            {durations.map((d) => (
              <button
                key={d}
                id={`duration-${d}`}
                type="button"
                onClick={() => setForm((p) => ({ ...p, duration: d }))}
                className={`flex-1 min-w-[48px] py-2.5 rounded-xl text-sm font-semibold border transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  form.duration === d
                    ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-500/30"
                    : "border-white/10 text-white/60 hover:bg-white/10 hover:text-white"
                }`}
                style={{
                  background:
                    form.duration === d ? undefined : "rgba(255,255,255,0.05)",
                }}
              >
                {d}m
              </button>
            ))}
          </div>
        </div>

        {/* Start Button */}
        <button
          id="start-interview-btn"
          type="button"
          disabled={!isValid || isLoading}
          onClick={handleStart}
          className="relative flex items-center justify-center gap-2 w-full py-4 rounded-2xl font-bold text-base text-white transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed group overflow-hidden"
          style={{
            background:
              isValid && !isLoading
                ? "linear-gradient(135deg, #6366f1, #8b5cf6)"
                : "rgba(255,255,255,0.08)",
            boxShadow:
              isValid && !isLoading
                ? "0 10px 40px -10px rgba(99,102,241,0.7)"
                : "none",
          }}
        >
          {isValid && !isLoading && (
            <span className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
          )}
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Setting up your interview…
            </>
          ) : (
            <>
              <Target className="w-5 h-5" />
              Start Interview
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default SetupPage;
