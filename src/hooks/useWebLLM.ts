"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { CreateWebWorkerMLCEngine, MLCEngineInterface } from "@mlc-ai/web-llm";

export interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

export type EngineStatus =
  | "idle"
  | "loading"
  | "ready"
  | "generating"
  | "unsupported"
  | "error";

export type ModelTier = "0.5B" | "1.5B" | "3B";

export interface ModelOption {
  tier: ModelTier;
  label: string;
  sublabel: string;
  size: string;
  recommendedFor: string;
}

export interface EngineSettings {
  systemPrompt: string;
  temperature: number;
}

export const MODEL_OPTIONS: ModelOption[] = [
  {
    tier: "0.5B",
    label: "0.5B Fast",
    sublabel: "Ultra-compact",
    size: "~350 MB",
    recommendedFor: "Instant loading, low VRAM, grammar, basic summaries",
  },
  {
    tier: "1.5B",
    label: "1.5B Balanced",
    sublabel: "Recommended",
    size: "~900 MB",
    recommendedFor: "JSON audits, credential leak scans, solid code reasoning",
  },
  {
    tier: "3B",
    label: "3B Deep Reasoning",
    sublabel: "High Precision",
    size: "~1.8 GB",
    recommendedFor: "Complex multi-step refactors and full vulnerability analysis",
  },
];

export const DEFAULT_SYSTEM_PROMPT =
  "You are a helpful, precise local AI copilot running completely client-side in browser RAM via WebGPU. Prioritize structured, secure, and concise answers.";

export function useWebLLM() {
  const [status, setStatus] = useState<EngineStatus>("idle");
  const [progress, setProgress] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedTier, setSelectedTier] = useState<ModelTier>("1.5B");
  const [activeTier, setActiveTier] = useState<ModelTier | null>(null);
  const [storageUsageMB, setStorageUsageMB] = useState<number | null>(null);

  const [settings, setSettings] = useState<EngineSettings>({
    systemPrompt: DEFAULT_SYSTEM_PROMPT,
    temperature: 0.6,
  });

  const engineRef = useRef<MLCEngineInterface | null>(null);
  const workerRef = useRef<Worker | null>(null);

  const updateStorageEstimate = useCallback(async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.storage?.estimate) {
        const estimate = await navigator.storage.estimate();
        if (estimate.usage !== undefined) {
          setStorageUsageMB(Math.round(estimate.usage / (1024 * 1024)));
        }
      }
    } catch (e) {
      console.error("Storage estimation error:", e);
    }
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && !(navigator as any).gpu) {
      setStatus("unsupported");
    }
    updateStorageEstimate();

    return () => {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
    };
  }, [updateStorageEstimate]);

  const resolveModelId = (tier: ModelTier, hasF16: boolean): string => {
    switch (tier) {
      case "0.5B":
        return hasF16
          ? "Qwen2.5-0.5B-Instruct-q4f16_1-MLC"
          : "Qwen2.5-0.5B-Instruct-q4f32_1-MLC";
      case "1.5B":
        return hasF16
          ? "Llama-3.2-1B-Instruct-q4f16_1-MLC"
          : "Qwen2.5-1.5B-Instruct-q4f32_1-MLC";
      case "3B":
        return hasF16
          ? "Llama-3.2-3B-Instruct-q4f16_1-MLC"
          : "Llama-3.2-3B-Instruct-q4f32_1-MLC";
    }
  };

  const loadModel = useCallback(
    async (tierToLoad?: ModelTier) => {
      const targetTier = tierToLoad ?? selectedTier;

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

        const hasF16 = adapter.features?.has?.("shader-f16") ?? false;
        const modelId = resolveModelId(targetTier, hasF16);

        setProgress(
          `Initializing ${targetTier} model (${hasF16 ? "f16 shaders" : "universal f32"})...`
        );

        workerRef.current = new Worker(
          new URL("../workers/llm.worker.ts", import.meta.url),
          { type: "module" }
        );

        const engine = await CreateWebWorkerMLCEngine(
          workerRef.current,
          modelId,
          {
            initProgressCallback: (report) => {
              setProgress(report.text);
            },
          }
        );

        engineRef.current = engine;
        setSelectedTier(targetTier);
        setActiveTier(targetTier);
        setStatus("ready");
        setProgress("");
        updateStorageEstimate();
      } catch (err: any) {
        console.error("Failed to load model:", err);
        if (workerRef.current) {
          workerRef.current.terminate();
          workerRef.current = null;
        }
        setStatus("error");
        setProgress(err?.message || "Engine initialization failed.");
      }
    },
    [selectedTier, updateStorageEstimate]
  );

  const switchModel = useCallback(
    async (newTier: ModelTier) => {
      setSelectedTier(newTier);
      if (status === "ready" || status === "loading") {
        await loadModel(newTier);
      }
    },
    [status, loadModel]
  );

  const purgeCache = useCallback(async () => {
    try {
      if (workerRef.current) {
        workerRef.current.terminate();
        workerRef.current = null;
      }
      engineRef.current = null;

      if (typeof window !== "undefined" && "caches" in window) {
        const cacheKeys = await caches.keys();
        for (const key of cacheKeys) {
          if (key.includes("webllm")) {
            await caches.delete(key);
          }
        }
      }

      if (typeof window !== "undefined" && window.indexedDB?.databases) {
        const dbs = await window.indexedDB.databases();
        for (const db of dbs) {
          if (db.name && db.name.includes("webllm")) {
            window.indexedDB.deleteDatabase(db.name);
          }
        }
      }

      setStatus("idle");
      setActiveTier(null);
      setProgress("Local model cache purged successfully.");
      await updateStorageEstimate();
    } catch (err: any) {
      console.error("Purge cache error:", err);
      setProgress("Failed to fully clear cache: " + (err?.message || err));
    }
  }, [updateStorageEstimate]);

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
        const payloadMessages: Message[] = [];
        if (settings.systemPrompt.trim()) {
          payloadMessages.push({
            role: "system",
            content: settings.systemPrompt.trim(),
          });
        }
        for (const m of updatedMessages.slice(0, -1)) {
          payloadMessages.push({ role: m.role, content: m.content });
        }

        const stream = await engineRef.current.chat.completions.create({
          messages: payloadMessages,
          temperature: settings.temperature,
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
    [messages, settings]
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
    selectedTier,
    activeTier,
    settings,
    storageUsageMB,
    setMessages,
    setSelectedTier,
    setSettings,
    switchModel,
    loadModel,
    sendMessage,
    clearChat,
    purgeCache,
    updateStorageEstimate,
  };
}