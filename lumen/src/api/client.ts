import type { Card, CardPayload, ReviewResult } from "../types";

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "http://127.0.0.1:8000";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `Request failed: ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export const api = {
  listCards(shuffle = false): Promise<Card[]> {
    return request<Card[]>(`/cards?shuffle=${shuffle}`);
  },
  nextCard(): Promise<Card | null> {
    return request<Card | null>("/cards/next");
  },
  createCard(payload: CardPayload): Promise<Card> {
    return request<Card>("/cards", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },
  updateCard(id: number, payload: CardPayload): Promise<Card> {
    return request<Card>(`/cards/${id}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },
  deleteCard(id: number): Promise<void> {
    return request<void>(`/cards/${id}`, { method: "DELETE" });
  },
  reviewCard(id: number, result: ReviewResult): Promise<Card> {
    return request<Card>(`/cards/${id}/review`, {
      method: "POST",
      body: JSON.stringify({ result }),
    });
  },
};
