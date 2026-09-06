"use client";

import { useState, useRef, useEffect, ChangeEvent } from "react";
import Link from "next/link";
import { useWebLLM } from "@/hooks/useWebLLM";

export default function LocalAIPage() {
  const { status, progress, messages, loadModel, sendMessage, clearChat } =
    useWebLLM();

  const [input, setInput] = useState("");
  const [attachedContext, setAttachedContext] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const chatBottomRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll on incoming stream tokens
  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() && !attachedContext) return;

    let finalPrompt = input.trim();
    if (attachedContext) {
      finalPrompt = `Context document (${fileName}):\n"""\n${attachedContext}\n"""\n\nTask: ${finalPrompt}`;
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

  return (
    <main className="min-h-screen bg-[#0d0d0d] text-neutral-200 px-4 py-8 flex flex-col items-center">
      <div className="w-full max-w-4xl flex flex-col gap-6">
        {/* Navigation & Header */}
        <div>
          <Link
            href="/"
            className="text-xs text-neutral-400 hover:text-white transition-colors"
          >
            &larr; Back to all tools
          </Link>
          <div className="mt-2 flex items-center justify-between flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-amber-400 flex items-center gap-2">
                Local AI Copilot
                <span className="text-xs px-2 py-0.5 rounded bg-amber-400/10 text-amber-300 border border-amber-400/20">
                  100% In-Browser / WebGPU
                </span>
              </h1>
              <p className="text-xs text-neutral-400 mt-1">
                Zero cloud processing. Model runs directly on your local GPU via
                browser memory.
              </p>
            </div>

            {status === "ready" && (
              <button
                onClick={clearChat}
                className="text-xs px-3 py-1.5 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 transition-colors"
              >
                Clear Session
              </button>
            )}
          </div>
        </div>

        {/* Status: Unsupported Browser */}
        {status === "unsupported" && (
          <div className="p-4 rounded-lg bg-red-950/40 border border-red-800 text-red-300 text-sm">
            <p className="font-semibold">WebGPU is not supported or enabled</p>
            <p className="text-xs mt-1 text-red-400">
              Please use the latest version of Chrome, Brave, Edge, or Arc on desktop.
              If using Brave, ensure hardware acceleration is active.
            </p>
          </div>
        )}

        {/* Status: First-time Model Initialization Gate */}
        {(status === "idle" || status === "loading") && (
          <div className="p-6 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col items-center text-center gap-4">
            <div className="max-w-md">
              <h2 className="text-lg font-semibold text-white">
                Initialize Local Engine
              </h2>
              <p className="text-xs text-neutral-400 mt-1">
                Downloads Llama 3.2 (1B Quantized) into your browser's local
                IndexedDB cache (~850 MB). You only download this once; future
                visits run instantly offline.
              </p>
            </div>

            {status === "loading" ? (
              <div className="w-full max-w-md flex flex-col gap-2">
                <div className="w-full h-2 bg-neutral-800 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-400 animate-pulse w-full" />
                </div>
                <p className="text-xs text-amber-300 font-mono break-words">
                  {progress || "Compiling WebGPU shaders..."}
                </p>
              </div>
            ) : (
              <button
                onClick={() => loadModel()}
                className="px-6 py-2.5 rounded-lg bg-amber-400 text-neutral-950 font-semibold text-sm hover:bg-amber-300 transition-all shadow-lg shadow-amber-400/10"
              >
                Load Model to Local GPU
              </button>
            )}
          </div>
        )}

        {/* Chat Feed */}
        {(status === "ready" || status === "generating") && (
          <div className="flex flex-col gap-4">
            <div className="min-h-[380px] max-h-[550px] overflow-y-auto p-4 rounded-xl bg-neutral-900 border border-neutral-800 flex flex-col gap-3">
              {messages.length === 0 ? (
                <div className="m-auto text-center text-neutral-500 text-xs max-w-sm">
                  Model is live in VRAM. Type a message below or attach a code/text
                  file to analyze privately.
                </div>
              ) : (
                messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-3 rounded-lg text-sm max-w-[85%] whitespace-pre-wrap leading-relaxed ${
                      msg.role === "user"
                        ? "bg-amber-400/10 border border-amber-400/20 text-amber-200 self-end"
                        : "bg-neutral-800/80 border border-neutral-700/60 text-neutral-200 self-start"
                    }`}
                  >
                    <p className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                      {msg.role === "user" ? "You" : "Llama 3.2 (Local)"}
                    </p>
                    {msg.content || (
                      <span className="animate-pulse text-neutral-400">...</span>
                    )}
                  </div>
                ))
              )}
              <div ref={chatBottomRef} />
            </div>

            {/* Quick Action Pills */}
            <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
              <button
                onClick={() =>
                  setInput("Audit this text for private keys, passwords, or leaked secrets:")
                }
                className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 whitespace-nowrap"
              >
                🛡️ Secret/PII Leak Audit
              </button>
              <button
                onClick={() =>
                  setInput("Summarize the main points into 3 concise bullet points:")
                }
                className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 whitespace-nowrap"
              >
                📝 3-Bullet Summary
              </button>
              <button
                onClick={() =>
                  setInput("Explain this code step-by-step and identify bugs:")
                }
                className="px-2.5 py-1 rounded bg-neutral-800 hover:bg-neutral-700 text-neutral-300 border border-neutral-700 whitespace-nowrap"
              >
                🐞 Code Bug Analysis
              </button>
            </div>

            {/* Attached Context Indicator */}
            {attachedContext && (
              <div className="flex items-center justify-between p-2 rounded bg-neutral-800/70 border border-neutral-700 text-xs">
                <span className="text-amber-300 truncate">
                  📎 Attached: {fileName} ({Math.round(attachedContext.length / 1024)} KB)
                </span>
                <button
                  onClick={() => {
                    setAttachedContext(null);
                    setFileName(null);
                  }}
                  className="text-neutral-400 hover:text-white ml-2"
                >
                  Remove
                </button>
              </div>
            )}

            {/* Input Bar */}
            <div className="flex gap-2">
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
                className="px-3 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 border border-neutral-700 text-neutral-300 text-xs"
                title="Attach local text/code/csv file"
              >
                📎
              </button>
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                placeholder="Ask anything confidential (prompts stay in RAM)..."
                disabled={status === "generating"}
                className="flex-1 px-4 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-sm text-white focus:outline-none focus:border-amber-400 disabled:opacity-50"
              />
              <button
                onClick={handleSend}
                disabled={status === "generating" || (!input.trim() && !attachedContext)}
                className="px-5 py-2 rounded-lg bg-amber-400 hover:bg-amber-300 text-neutral-950 font-semibold text-sm disabled:opacity-40 transition-colors"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}