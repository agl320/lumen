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
    <section className="space-y-3 p-8 bg-zinc-100 rounded-lg">
      <div>
        <p className="text-md text-zinc-500">Question</p>
        <div
          className="card-content text-2xl text-zinc-700"
          dangerouslySetInnerHTML={{ __html: card.front }}
        />
      </div>

      {showAnswer ? (
        <div>
          <p className="text-md text-zinc-500">Answer</p>
          <div
            className="card-content text-zinc-700"
            dangerouslySetInnerHTML={{ __html: card.back }}
          />
        </div>
      ) : null}

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setShowAnswer((value) => !value)}
          className=" px-3 py-1 bg-orange-400 text-white rounded text-sm"
        >
          {showAnswer ? "Hide answer" : "Show answer"}
        </button>
        <button
          type="button"
          onClick={() => void onReview("correct")}
          className=" px-3 py-1 bg-orange-400 text-white rounded text-sm"
        >
          Correct
        </button>
        <button
          type="button"
          onClick={() => void onReview("incorrect")}
          className=" px-3 py-1 bg-orange-400 text-white rounded text-sm"
        >
          Incorrect
        </button>
        <button
          type="button"
          onClick={() => void onSkip()}
          className="px-3 py-1 bg-orange-400 text-white rounded text-sm"
        >
          Skip
        </button>
      </div>
      <p className="text-sm text-zinc-500">
        +{card.correct_count} / -{card.incorrect_count}
      </p>
    </section>
  );
}
