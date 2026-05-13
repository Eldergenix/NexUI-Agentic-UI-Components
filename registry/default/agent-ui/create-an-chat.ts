import { Chat } from "@ai-sdk/react";
import { DefaultChatTransport, type UIMessage } from "ai";
import type { CreateAgentChatOptions } from "./types";

const DEFAULT_API_URL = "https://relay.an.dev";

/** Fetch + cache tokens from a tokenUrl endpoint */
function createTokenFetcher(tokenUrl: string, agent: string) {
  let cache: { token: string; expiresAt: number } | null = null;

  return async (): Promise<string> => {
    if (cache && cache.expiresAt > Date.now() + 60_000) {
      return cache.token;
    }
    const res = await fetch(tokenUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ agent }),
    });
    if (!res.ok) {
      throw new Error(`Failed to fetch token: ${res.status}`);
    }
    const data = await res.json();
    cache = {
      token: data.token,
      expiresAt: new Date(data.expiresAt).getTime(),
    };
    return data.token;
  };
}

/** Create an AI SDK Chat instance pointed at the relay API */
export function createAgentChat(
  options: CreateAgentChatOptions,
): Chat<UIMessage> {
  const {
    agent,
    tokenUrl,
    getToken: getTokenFn,
    apiUrl = DEFAULT_API_URL,
    sandboxId,
    threadId,
    onFinish,
    onError,
  } = options;

  const getToken =
    getTokenFn || (tokenUrl ? createTokenFetcher(tokenUrl, agent) : null);
  if (!getToken) {
    throw new Error("createAgentChat: provide either tokenUrl or getToken");
  }

  return new Chat({
    id: sandboxId || `sandbox-${agent}`,
    transport: new DefaultChatTransport({
      api: `${apiUrl}/v1/chat/${agent}`,
      headers: async () => {
        const token = await getToken();
        return { Authorization: `Bearer ${token}` };
      },
      body: {
        ...(sandboxId && { sandboxId }),
        ...(threadId && { threadId }),
      },
    }),
    onFinish,
    onError,
  });
}

// Legacy factory alias kept for compatibility.
export const createAnChat = createAgentChat;
