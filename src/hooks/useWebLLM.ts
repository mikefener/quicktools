"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { CreateWebWorkerMLCEngine, MLCEngineInterface } from "@mlc-ai/web-llm";

export interface Message {
  role: "user" | "assistant";
  content: string;
}

export type EngineStatus =
  | "idle"
  | "loading"
  | "ready"
  | "generating"
  | "unsupported"
  | "error";

export function useWebLLM() {
  const [status, setStatus] = useState<EngineStatus>("idle");
  const [progress, setProgress] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const engineRef = useRef<MLCEngineInterface | null>(null);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && !(navigator as any).gpu) {
      setStatus("unsupported");
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, []);

  const loadModel = useCallback(async () => {
    try {
      const nav = typeof window !== "undefined" ? (navigator as any) : null;
      if (!nav?.gpu) {
        setStatus("unsupported");
        return;
      }

      setStatus("loading");
      setProgress("Detecting GPU adapter capabilities...");

      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }

      const adapter = await nav.gpu.requestAdapter();
      if (!adapter) {
        throw new Error("No compatible GPU adapter found.");
      }

      // Detect f16 hardware extension support.
      // If unsupported (e.g. Linux Mesa/Vulkan), fallback to lightweight 0.5B f32 (~350MB) to prevent CDN cache drops.
      const hasF16 = adapter.features?.has?.("shader-f16") ?? false;
      const selectedModel = hasF16
        ? "Llama-3.2-1B-Instruct-q4f16_1-MLC"
        : "Qwen2.5-0.5B-Instruct-q4f32_1-MLC";

      setProgress(
        hasF16
          ? "Hardware supports f16. Initializing Llama 3.2 (q4f16)..."
          : "Hardware lacks f16 shaders. Initializing universal Qwen 2.5 0.5B (q4f32)..."
      );

      workerRef.current = new Worker(
        new URL("../workers/llm.worker.ts", import.meta.url),
        { type: "module" }
      );

      const engine = await CreateWebWorkerMLCEngine(
        workerRef.current,
        selectedModel,
        {
          initProgressCallback: (report) => {
            setProgress(report.text);
          },
        }
      );

      engineRef.current = engine;
      setStatus("ready");
      setProgress("");
    } catch (err: any) {
      console.error("Failed to load model:", err);
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
      setStatus("error");
      setProgress(err?.message || "Engine initialization failed.");
    }
  }, []);

  const sendMessage = useCallback(
    async (userInput: string) => {
      if (!engineRef.current || !userInput.trim()) return;

      const updatedMessages: Message[] = [
        ...messages,
        { role: "user", content: userInput },
        { role: "assistant", content: "" },
      ];

      setMessages(updatedMessages);
      setStatus("generating");

      try {
        const stream = await engineRef.current.chat.completions.create({
          messages: updatedMessages.slice(0, -1).map((m) => ({
            role: m.role,
            content: m.content,
          })),
          stream: true,
        });

        let fullReply = "";
        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta?.content || "";
          fullReply += delta;
          setMessages((prev) => {
            const next = [...prev];
            next[next.length - 1] = {
              role: "assistant",
              content: fullReply,
            };
            return next;
          });
        }

        setStatus("ready");
      } catch (err: any) {
        console.error("Inference error:", err);
        setMessages((prev) => {
          const next = [...prev];
          next[next.length - 1] = {
            role: "assistant",
            content: `Error generating response: ${err?.message || err}`,
          };
          return next;
        });
        setStatus("ready");
      }
    },
    [messages]
  );

  const clearChat = useCallback(() => {
    setMessages([]);
    if (engineRef.current) {
      engineRef.current.resetChat();
    }
  }, []);

  return {
    status,
    progress,
    messages,
    loadModel,
    sendMessage,
    clearChat,
  };
}