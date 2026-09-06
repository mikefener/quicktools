"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import Link from "next/link";
import {
  useWebLLM,
  Message,
  ModelTier,
  MODEL_OPTIONS,
} from "@/hooks/useWebLLM";

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  updatedAt: number;
}

function InlineText({ text }: { text: string }) {
  const parts = text.split(/(`[^`]+`|\*\*[^*]+\*\*)/g);
  return (
    <>
      {parts.map((part, i) => {
        if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
          return (
            <code
              key={i}
              className="px-1.5 py-0.5 mx-0.5 rounded bg-[#282a2c] text-amber-300 font-mono text-[12px] border border-neutral-700/50"
            >
              {part.slice(1, -1)}
            </code>
          );
        }
        if (part.startsWith("**") && part.endsWith("**") && part.length >= 4) {
          return (
            <strong key={i} className="font-semibold text-white">
              {part.slice(2, -2)}
            </strong>
          );
        }
        return <span key={i}>{part}</span>;
      })}
    </>
  );
}

function CodeBlock({ code, lang }: { code: string; lang: string }) {
  const [copied, setCopied] = useState(false);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-3 rounded-xl overflow-hidden border border-neutral-800 bg-[#0d0d0e] font-mono text-xs shadow-lg">
      <div className="flex items-center justify-between px-4 py-2 bg-[#1e1f20] border-b border-neutral-800 text-neutral-400">
        <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-300">
          {lang || "code"}
        </span>
        <button
          onClick={copyCode}
          className="flex items-center gap-1.5 text-[11px] text-neutral-400 hover:text-white transition-colors"
        >
          {copied ? (
            <>
              <svg
                className="w-3.5 h-3.5 text-emerald-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span className="text-emerald-400">Copied!</span>
            </>
          ) : (
            <>
              <svg
                className="w-3.5 h-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                />
              </svg>
              <span>Copy code</span>
            </>
          )}
        </button>
      </div>
      <pre className="p-4 overflow-x-auto text-neutral-200 leading-relaxed scrollbar-thin">
        <code>{code}</code>
      </pre>
    </div>
  );
}

function MarkdownRenderer({ content }: { content: string }) {
  if (!content) return null;

  const segments = content.split(/(```[\w-]*\n[\s\S]*?(?:```|$))/g);

  return (
    <div className="flex flex-col gap-2 text-sm leading-relaxed text-neutral-200">
      {segments.map((segment, index) => {
        if (segment.startsWith("```")) {
          const match = segment.match(/^```(\w+)?\n([\s\S]*?)(?:```)?$/);
          const lang = match?.[1] || "";
          const code = (
            match?.[2] ??
            segment.replace(/^```\w*\n?/, "").replace(/```$/, "")
          ).trimEnd();
          return <CodeBlock key={index} code={code} lang={lang} />;
        }

        const lines = segment.split("\n");
        return (
          <div key={index} className="flex flex-col gap-1.5">
            {lines.map((line, lineIdx) => {
              const trimmed = line.trim();
              if (!trimmed) return <div key={lineIdx} className="h-1" />;

              if (trimmed.startsWith("### ")) {
                return (
                  <h4
                    key={lineIdx}
                    className="text-sm font-semibold text-white mt-2 mb-0.5"
                  >
                    <InlineText text={trimmed.slice(4)} />
                  </h4>
                );
              }
              if (trimmed.startsWith("## ")) {
                return (
                  <h3
                    key={lineIdx}
                    className="text-base font-semibold text-white mt-2.5 mb-1"
                  >
                    <InlineText text={trimmed.slice(3)} />
                  </h3>
                );
              }
              if (trimmed.startsWith("# ")) {
                return (
                  <h2
                    key={lineIdx}
                    className="text-lg font-bold text-white mt-3 mb-1"
                  >
                    <InlineText text={trimmed.slice(2)} />
                  </h2>
                );
              }

              if (trimmed.startsWith("- ") || trimmed.startsWith("* ")) {
                return (
                  <div key={lineIdx} className="flex items-start gap-2 pl-2">
                    <span className="text-amber-400 mt-1.5 text-[8px] leading-none">
                      •
                    </span>
                    <div className="flex-1">
                      <InlineText text={trimmed.slice(2)} />
                    </div>
                  </div>
                );
              }

              const numMatch = trimmed.match(/^(\d+)\.\s+(.*)/);
              if (numMatch) {
                return (
                  <div key={lineIdx} className="flex items-start gap-2 pl-2">
                    <span className="text-amber-400 font-mono text-xs shrink-0 mt-0.5">
                      {numMatch[1]}.
                    </span>
                    <div className="flex-1">
                      <InlineText text={numMatch[2]} />
                    </div>
                  </div>
                );
              }

              return (
                <p key={lineIdx} className="leading-relaxed">
                  <InlineText text={line} />
                </p>
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

export default function LocalAIPage() {
  const {
    status,
    progress,
    messages,
    selectedTier,
    activeTier,
    setMessages,
    setSelectedTier,
    switchModel,
    loadModel,
    sendMessage,
    clearChat,
  } = useWebLLM();

  const [input, setInput] = useState("");
  const [attachedContext, setAttachedContext] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("quicktools_localai_sessions");
      if (saved) {
        const parsed: ChatSession[] = JSON.parse(saved);
        setSessions(parsed);
      }
    } catch (e) {
      console.error("Could not load chat sessions:", e);
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (messages.length === 0) return;

    setSessions((prevSessions) => {
      const now = Date.now();
      const firstUserMsg =
        messages.find((m) => m.role === "user")?.content || "New Conversation";
      const title =
        firstUserMsg.length > 32
          ? `${firstUserMsg.slice(0, 32)}...`
          : firstUserMsg;

      let updated: ChatSession[];
      if (activeSessionId) {
        updated = prevSessions.map((s) =>
          s.id === activeSessionId ? { ...s, messages, updatedAt: now } : s
        );
      } else {
        const newId = `session_${now}`;
        setActiveSessionId(newId);
        updated = [
          { id: newId, title, messages, updatedAt: now },
          ...prevSessions,
        ];
      }

      try {
        localStorage.setItem(
          "quicktools_localai_sessions",
          JSON.stringify(updated)
        );
      } catch (e) {
        console.error("Failed to save sessions:", e);
      }
      return updated;
    });
  }, [messages, activeSessionId]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleStartNewChat = () => {
    clearChat();
    setActiveSessionId(null);
    setAttachedContext(null);
    setFileName(null);
    setInput("");
  };

  const handleSelectSession = (session: ChatSession) => {
    setActiveSessionId(session.id);
    setMessages(session.messages);
    setAttachedContext(null);
    setFileName(null);
  };

  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const updated = sessions.filter((s) => s.id !== sessionId);
    setSessions(updated);
    try {
      localStorage.setItem(
        "quicktools_localai_sessions",
        JSON.stringify(updated)
      );
    } catch (err) {
      console.error(err);
    }
    if (activeSessionId === sessionId) {
      handleStartNewChat();
    }
  };

  const handleSend = (textToSend?: string) => {
    const prompt = (textToSend ?? input).trim();
    if (!prompt && !attachedContext) return;

    let finalPrompt = prompt;
    if (attachedContext) {
      finalPrompt = `Context document (${fileName}):\n"""\n${attachedContext}\n"""\n\nTask: ${prompt}`;
    }

    sendMessage(finalPrompt);
    setInput("");
    setAttachedContext(null);
    setFileName(null);
  };

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setAttachedContext(content);
      setFileName(file.name);
    };
    reader.readAsText(file);
  };

  const copyToClipboard = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  const activeOption =
    MODEL_OPTIONS.find((m) => m.tier === selectedTier) ?? MODEL_OPTIONS[1];

  return (
    <div className="flex h-[calc(100dvh-57px)] w-full overflow-hidden bg-[#131314] text-neutral-100 font-sans">
      {/* Left Sidebar */}
      <aside
        className={`flex flex-col justify-between bg-[#1e1f20] border-r border-neutral-800 transition-all duration-300 z-20 ${
          sidebarOpen ? "w-64 min-w-[16rem]" : "w-0 min-w-0 -translate-x-full"
        }`}
      >
        <div className="p-3 flex flex-col gap-3 overflow-hidden">
          <div className="flex items-center justify-between px-2 pt-1">
            <button
              onClick={handleStartNewChat}
              className="flex items-center gap-3 w-full bg-[#282a2c] hover:bg-[#333538] text-neutral-200 text-xs font-medium py-2.5 px-3 rounded-full border border-neutral-700/50 transition-all shadow-sm group"
            >
              <svg
                className="w-4 h-4 text-neutral-300 group-hover:rotate-90 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4v16m8-8H4"
                />
              </svg>
              <span>New chat</span>
            </button>
          </div>

          <div className="mt-4 flex flex-col flex-1 overflow-y-auto max-h-[calc(100vh-280px)]">
            <span className="text-[11px] font-semibold text-neutral-400 px-3 pb-2 uppercase tracking-wider">
              Recent
            </span>
            <div className="flex flex-col gap-1 pr-1">
              {sessions.length === 0 ? (
                <p className="text-xs text-neutral-500 px-3 py-2">
                  No local chats yet
                </p>
              ) : (
                sessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => handleSelectSession(session)}
                    className={`group flex items-center justify-between px-3 py-2 rounded-full cursor-pointer text-xs transition-colors ${
                      activeSessionId === session.id
                        ? "bg-[#282a2c] text-white font-medium"
                        : "text-neutral-400 hover:bg-[#282a2c]/60 hover:text-neutral-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <svg
                        className="w-3.5 h-3.5 text-neutral-400 shrink-0"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                        />
                      </svg>
                      <span className="truncate">{session.title}</span>
                    </div>
                    <button
                      onClick={(e) => handleDeleteSession(session.id, e)}
                      className="opacity-0 group-hover:opacity-100 hover:text-red-400 text-neutral-500 transition-opacity p-0.5"
                      title="Delete chat"
                    >
                      &times;
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="p-3 border-t border-neutral-800/80 flex flex-col gap-2">
          <div className="flex items-center gap-2.5 px-2 py-1.5 rounded-lg bg-neutral-900/40 border border-neutral-800">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <div className="flex flex-col text-[11px] leading-tight">
              <span className="text-neutral-300 font-medium">Hardware Isolated</span>
              <span className="text-neutral-500">
                {activeTier ? `${activeTier} in VRAM` : "0% Cloud Bandwidth"}
              </span>
            </div>
          </div>
          <Link
            href="/"
            className="text-[11px] text-neutral-400 hover:text-neutral-200 px-2 py-1 transition-colors"
          >
            &larr; Back to Tools Grid
          </Link>
        </div>
      </aside>

      {/* Main Canvas Area */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Header with Model Selector */}
        <header className="h-12 flex items-center justify-between px-4 border-b border-neutral-800/40 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
              title="Toggle sidebar"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>

            <div className="flex items-center gap-2">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"
                  fill="url(#gemini_grad)"
                />
                <defs>
                  <linearGradient
                    id="gemini_grad"
                    x1="2"
                    y1="2"
                    x2="22"
                    y2="22"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#4b90ff" />
                    <stop offset="0.5" stopColor="#d96570" />
                    <stop offset="1" stopColor="#fec76f" />
                  </linearGradient>
                </defs>
              </svg>

              {/* Model Tier Selector Dropdown */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-[#1e1f20] hover:bg-[#282a2c] border border-neutral-700/60 text-xs text-neutral-200 transition-colors"
                >
                  <span className="font-semibold text-white">
                    {activeOption.label}
                  </span>
                  <span className="text-[10px] text-neutral-400 font-mono">
                    {activeOption.size}
                  </span>
                  <svg
                    className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${
                      dropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {dropdownOpen && (
                  <div className="absolute left-0 mt-2 w-72 p-1.5 rounded-2xl bg-[#1e1f20] border border-neutral-700/80 shadow-2xl z-50 flex flex-col gap-1">
                    {MODEL_OPTIONS.map((opt) => (
                      <button
                        key={opt.tier}
                        onClick={() => {
                          setDropdownOpen(false);
                          if (status === "ready") {
                            switchModel(opt.tier);
                          } else {
                            setSelectedTier(opt.tier);
                          }
                        }}
                        className={`w-full text-left p-2.5 rounded-xl transition-colors flex flex-col gap-0.5 ${
                          selectedTier === opt.tier
                            ? "bg-[#282a2c] border border-neutral-700"
                            : "hover:bg-[#282a2c]/60"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-semibold text-white">
                            {opt.label}
                          </span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-amber-400/10 text-amber-300 font-mono border border-amber-400/20">
                            {opt.size}
                          </span>
                        </div>
                        <span className="text-[11px] text-neutral-400">
                          {opt.recommendedFor}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {status === "ready" && (
            <button
              onClick={handleStartNewChat}
              className="text-xs text-neutral-400 hover:text-neutral-200 px-2 py-1"
            >
              Reset Session
            </button>
          )}
        </header>

        {/* Content Body */}
        <div
          className="flex-1 overflow-y-auto flex flex-col justify-between"
          ref={chatContainerRef}
        >
          {status === "unsupported" && (
            <div className="m-auto max-w-md p-6 rounded-2xl bg-[#1e1f20] border border-red-800/80 text-center">
              <h2 className="text-base font-semibold text-red-300">
                WebGPU is Not Enabled
              </h2>
              <p className="text-xs text-neutral-400 mt-2">
                Your browser or graphics driver currently lacks WebGPU support.
                Please use desktop Chrome, Edge, or Brave with graphics
                acceleration enabled.
              </p>
            </div>
          )}

          {(status === "idle" || status === "loading" || status === "error") && (
            <div className="m-auto max-w-lg w-full p-8 flex flex-col items-center text-center">
              <svg className="w-12 h-12 mb-4" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z"
                  fill="url(#gemini_grad_large)"
                />
                <defs>
                  <linearGradient
                    id="gemini_grad_large"
                    x1="2"
                    y1="2"
                    x2="22"
                    y2="22"
                    gradientUnits="userSpaceOnUse"
                  >
                    <stop stopColor="#4b90ff" />
                    <stop offset="0.5" stopColor="#d96570" />
                    <stop offset="1" stopColor="#fec76f" />
                  </linearGradient>
                </defs>
              </svg>
              <h2 className="text-2xl font-semibold text-white tracking-tight">
                Private In-Browser Intelligence
              </h2>
              <p className="text-xs text-neutral-400 mt-2 max-w-sm">
                Runs completely on your graphics card via WebGPU. Ready to load{" "}
                <span className="text-amber-300 font-semibold">
                  {activeOption.label} ({activeOption.size})
                </span>
                .
              </p>

              {status === "loading" ? (
                <div className="w-full mt-6 flex flex-col gap-2">
                  <div className="w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-amber-400 animate-pulse w-full" />
                  </div>
                  <p className="text-xs text-amber-300 font-mono mt-1 break-words">
                    {progress || "Compiling local shaders..."}
                  </p>
                </div>
              ) : status === "error" ? (
                <div className="mt-4 flex flex-col gap-3">
                  <p className="text-xs text-red-400 bg-red-950/30 p-2.5 rounded-lg border border-red-900/60">
                    {progress || "Initialization failed."}
                  </p>
                  <button
                    onClick={() => loadModel()}
                    className="px-6 py-2.5 rounded-full bg-white text-black text-xs font-semibold hover:bg-neutral-200 transition-all"
                  >
                    Retry Initialization
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => loadModel()}
                  className="mt-6 px-7 py-3 rounded-full bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition-all shadow-xl hover:scale-105 duration-200"
                >
                  Load {activeOption.label} to GPU
                </button>
              )}
            </div>
          )}

          {(status === "ready" || status === "generating") && (
            <div className="w-full max-w-3xl mx-auto px-4 py-6 flex flex-col gap-6">
              {messages.length === 0 ? (
                <div className="my-auto py-12 flex flex-col gap-6">
                  <div>
                    <h2 className="text-4xl sm:text-5xl font-medium tracking-tight bg-gradient-to-r from-[#4b90ff] via-[#d96570] to-[#fec76f] bg-clip-text text-transparent">
                      Hello, Builder
                    </h2>
                    <h3 className="text-3xl sm:text-4xl font-medium text-neutral-500 mt-1">
                      {activeTier} model loaded. How can I assist?
                    </h3>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    {[
                      {
                        title: "Audit text for secrets",
                        desc: "Scan code or logs for private keys and credentials",
                        prompt:
                          "Audit the following text for private keys, API tokens, passwords, or leaked credentials:",
                      },
                      {
                        title: "3-Bullet Summary",
                        desc: "Condense long documents into concise takeaways",
                        prompt:
                          "Summarize the main points of this document into 3 clear, concise bullets:",
                      },
                      {
                        title: "Debug & Explain Code",
                        desc: "Step through logic and isolate syntax defects",
                        prompt:
                          "Review this snippet step-by-step, find any logic or performance bugs, and suggest fixes:",
                      },
                      {
                        title: "Rewrite for Conciseness",
                        desc: "Polish phrasing while retaining core intent",
                        prompt:
                          "Rewrite this text to be clear, professional, and punchy without unnecessary fluff:",
                      },
                    ].map((card, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(card.prompt)}
                        className="flex flex-col text-left p-4 rounded-2xl bg-[#1e1f20] hover:bg-[#282a2c] border border-neutral-800 transition-all"
                      >
                        <span className="text-xs font-semibold text-neutral-200">
                          {card.title}
                        </span>
                        <span className="text-[11px] text-neutral-400 mt-1">
                          {card.desc}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`flex gap-3 text-sm leading-relaxed ${
                      msg.role === "user" ? "justify-end" : "justify-start"
                    }`}
                  >
                    {msg.role === "assistant" && (
                      <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-amber-400 flex items-center justify-center shrink-0 mt-0.5 shadow-sm">
                        <svg
                          className="w-4 h-4 text-white"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                        >
                          <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" />
                        </svg>
                      </div>
                    )}
                    <div
                      className={`group relative max-w-[85%] ${
                        msg.role === "user"
                          ? "bg-[#282a2c] text-neutral-100 px-4 py-2.5 rounded-3xl"
                          : "text-neutral-200 py-1 w-full"
                      }`}
                    >
                      {msg.role === "user" ? (
                        <p className="whitespace-pre-wrap">{msg.content}</p>
                      ) : msg.content ? (
                        <MarkdownRenderer content={msg.content} />
                      ) : (
                        <span className="animate-pulse text-neutral-500">
                          Thinking...
                        </span>
                      )}

                      {msg.role === "assistant" && msg.content && (
                        <div className="mt-2 flex items-center gap-2">
                          <button
                            onClick={() => copyToClipboard(msg.content, index)}
                            className="text-[11px] text-neutral-500 hover:text-neutral-300 transition-colors flex items-center gap-1"
                          >
                            <svg
                              className="w-3.5 h-3.5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                              />
                            </svg>
                            {copiedIndex === index ? "Copied" : "Copy text"}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Floating Pill Input Bar */}
          <div className="w-full max-w-3xl mx-auto px-4 pb-4">
            {attachedContext && (
              <div className="mb-2 inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#1e1f20] border border-neutral-700 text-xs text-amber-300">
                <span>📎 {fileName}</span>
                <button
                  onClick={() => {
                    setAttachedContext(null);
                    setFileName(null);
                  }}
                  className="text-neutral-400 hover:text-white ml-1 font-bold"
                >
                  &times;
                </button>
              </div>
            )}

            <div className="relative flex items-center bg-[#1e1f20] border border-neutral-700/60 focus-within:border-neutral-500 rounded-[28px] p-2 shadow-2xl transition-all">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".txt,.md,.json,.js,.ts,.tsx,.csv,.py"
                className="hidden"
              />
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-neutral-400 hover:text-white rounded-full hover:bg-neutral-800 transition-colors"
                title="Attach local file"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13"
                  />
                </svg>
              </button>

              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask anything or process confidential code..."
                disabled={status !== "ready"}
                className="flex-1 bg-transparent px-3 text-sm text-neutral-100 placeholder-neutral-500 focus:outline-none disabled:opacity-50"
              />

              <button
                onClick={() => handleSend()}
                disabled={
                  status !== "ready" || (!input.trim() && !attachedContext)
                }
                className="w-9 h-9 flex items-center justify-center rounded-full bg-white text-black disabled:opacity-20 hover:bg-neutral-200 transition-all shrink-0"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M5 10l7-7m0 0l7 7m-7-7v18"
                  />
                </svg>
              </button>
            </div>

            <p className="text-center text-[11px] text-neutral-500 mt-2">
              Runs 100% in browser memory via WebGPU. No prompts or data leave your machine.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}