import { useState } from "react";

import type { Card } from "../types";

interface StudyCardProps {
  card: Card;
  onReview: (result: "correct" | "incorrect") => Promise<void>;
  onSkip: () => Promise<void>;
}

export function StudyCard({ card, onReview, onSkip }: StudyCardProps) {
  const [showAnswer, setShowAnswer] = useState(false);

  return (
    <section className="space-y-3 border p-4">
      <div>
        <p className="text-sm">Question</p>
        <div dangerouslySetInnerHTML={{ __html: card.front }} />
      </div>

      {showAnswer ? (
        <div>
          <p className="text-sm">Answer</p>
          <div dangerouslySetInnerHTML={{ __html: card.back }} />
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setShowAnswer((value) => !value)}
          className="border px-3 py-1"
        >
          {showAnswer ? "Hide answer" : "Show answer"}
        </button>
        <button
          type="button"
          onClick={() => void onReview("correct")}
          className="border px-3 py-1"
        >
          Correct
        </button>
        <button
          type="button"
          onClick={() => void onReview("incorrect")}
          className="border px-3 py-1"
        >
          Incorrect
        </button>
        <button
          type="button"
          onClick={() => void onSkip()}
          className="border px-3 py-1"
        >
          Skip
        </button>
      </div>
      <p className="text-sm">Score: {card.score}</p>
    </section>
  );
}
