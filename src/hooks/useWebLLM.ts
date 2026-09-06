"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import {
  CreateWebWorkerMLCEngine,
  type MLCEngineInterface,
  type InitProgressReport,
} from "@mlc-ai/web-llm";

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export type LLMStatus =
  | "checking"
  | "unsupported"
  | "idle"
  | "loading"
  | "ready"
  | "generating"
  | "error";

export function useWebLLM() {
  const [status, setStatus] = useState<LLMStatus>("checking");
  const [progress, setProgress] = useState<string>("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const engineRef = useRef<MLCEngineInterface | null>(null);
  const workerRef = useRef<Worker | null>(null);

  useEffect(() => {
    // Check WebGPU availability in the browser
    if (typeof window !== "undefined") {
      if (!("gpu" in navigator)) {
        setStatus("unsupported");
        return;
      }
      setStatus("idle");
    }

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
      }
    };
  }, []);

  const loadModel = useCallback(
    async (modelName: string = "Llama-3.2-1B-Instruct-q4f16_1-MLC") => {
      try {
        setStatus("loading");
        setProgress("Initializing Web Worker...");

        const worker = new Worker(
          new URL("../workers/llm.worker.ts", import.meta.url),
          { type: "module" }
        );
        workerRef.current = worker;

        const engine = await CreateWebWorkerMLCEngine(worker, modelName, {
          initProgressCallback: (report: InitProgressReport) => {
            setProgress(report.text);
          },
        });

        engineRef.current = engine;
        setStatus("ready");
        setProgress("");
      } catch (err: any) {
        console.error("Failed to load model:", err);
        setStatus("error");
        setProgress(err?.message || "Failed to initialize WebGPU engine.");
      }
    },
    []
  );

  const sendMessage = useCallback(
    async (content: string) => {
      if (!engineRef.current || status !== "ready" || !content.trim()) return;

      const userMessage: ChatMessage = { role: "user", content };
      const nextMessages = [...messages, userMessage];

      setMessages(nextMessages);
      setStatus("generating");

      try {
        // Initialize an empty assistant response in the list
        setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

        const chunks = await engineRef.current.chat.completions.create({
          messages: nextMessages,
          stream: true,
        });

        let fullAssistantReply = "";
        for await (const chunk of chunks) {
          const delta = chunk.choices[0]?.delta?.content || "";
          fullAssistantReply += delta;

          setMessages((prev) => {
            const updated = [...prev];
            const lastIndex = updated.length - 1;
            if (lastIndex >= 0 && updated[lastIndex].role === "assistant") {
              updated[lastIndex] = {
                role: "assistant",
                content: fullAssistantReply,
              };
            }
            return updated;
          });
        }

        setStatus("ready");
      } catch (err: any) {
        console.error("Inference failed:", err);
        setStatus("error");
        setProgress("Error during text generation.");
      }
    },
    [messages, status]
  );

  const clearChat = useCallback(() => {
    setMessages([]);
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