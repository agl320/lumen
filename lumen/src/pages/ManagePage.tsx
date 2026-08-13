import { useEffect, useState } from "react";

import { api } from "../api/client";
import { CardForm } from "../components/CardForm";
import { CardList } from "../components/CardList";
import type { Card } from "../types";

export function ManagePage() {
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadCards() {
    setIsLoading(true);
    setError(null);
    try {
      const nextCards = await api.listCards();
      setCards(nextCards);
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Failed to load cards",
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    queueMicrotask(() => {
      void loadCards();
    });
  }, []);

  return (
    <section className="space-y-4">
      <h2 className="text-lg">Manage Cards</h2>
      <CardForm
        onSubmit={async (payload) => {
          await api.createCard(payload);
          await loadCards();
        }}
      />

      <div className="flex gap-2">
        <button
          type="button"
          className="border px-3 py-1"
          onClick={() => void loadCards()}
        >
          Refresh
        </button>
      </div>

      {isLoading ? <p>Loading...</p> : null}
      {error ? <p>{error}</p> : null}
      {!isLoading && !error ? (
        <CardList
          cards={cards}
          onDelete={async (id) => {
            await api.deleteCard(id);
            await loadCards();
          }}
          onEdit={async (id, front, back) => {
            await api.updateCard(id, { front, back });
            await loadCards();
          }}
        />
      ) : null}
    </section>
  );
}
