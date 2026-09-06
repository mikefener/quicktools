import { WebWorkerMLCEngineHandler } from "@mlc-ai/web-llm";

// Instantiate the official WebWorker handler for browser-based LLM inference
const handler = new WebWorkerMLCEngineHandler();

self.onmessage = (msg: MessageEvent) => {
  handler.onmessage(msg);
};