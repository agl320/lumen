import { useEffect, useState } from "react";

import { api } from "../api/client";
import { StudyCard } from "../components/StudyCard";
import type { Card, ReviewResult } from "../types";

export function StudyPage() {
  const [card, setCard] = useState<Card | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadNextCard() {
    setIsLoading(true);
    setError(null);
    try {
      const next = await api.nextCard();
      setCard(next);
    } catch (loadError) {
      setError(
        loadError instanceof Error ? loadError.message : "Failed to load card",
      );
    } finally {
      setIsLoading(false);
    }
  }

  async function review(result: ReviewResult) {
    if (!card) {
      return;
    }
    await api.reviewCard(card.id, result);
    await loadNextCard();
  }

  useEffect(() => {
    queueMicrotask(() => {
      void loadNextCard();
    });
  }, []);

  return (
    <section className="space-y-4">
      <h2 className="text-lg">Study</h2>
      <button
        type="button"
        className="border px-3 py-1"
        onClick={() => void loadNextCard()}
      >
        New Card
      </button>
      {isLoading ? <p>Loading...</p> : null}
      {error ? <p>{error}</p> : null}
      {!isLoading && !error && !card ? (
        <p>No cards yet. Add one in Manage.</p>
      ) : null}
      {!isLoading && !error && card ? (
        <StudyCard
          card={card}
          onReview={(result) => review(result)}
          onSkip={loadNextCard}
        />
      ) : null}
    </section>
  );
}
