import { useState } from "react";

import type { Card } from "../types";
import { CardForm } from "./CardForm";

interface CardListProps {
  cards: Card[];
  onDelete: (id: number) => Promise<void>;
  onEdit: (id: number, front: string, back: string) => Promise<void>;
}

export function CardList({ cards, onDelete, onEdit }: CardListProps) {
  const [editingId, setEditingId] = useState<number | null>(null);

  return (
    <ul className="space-y-2">
      {cards.map((card) => (
        <li key={card.id} className="border p-3">
          {editingId === card.id ? (
            <CardForm
              initial={card}
              onSubmit={async (payload) => {
                await onEdit(card.id, payload.front, payload.back);
                setEditingId(null);
              }}
              onCancel={() => setEditingId(null)}
            />
          ) : (
            <div className="space-y-2">
              <p>
                <strong className="opacity-50">Front:</strong>{" "}
                <div
                  className="card-content"
                  dangerouslySetInnerHTML={{ __html: card.front }}
                />
              </p>
              <p>
                <strong className="opacity-50">Back: </strong>{" "}
                <div
                  className="card-content"
                  dangerouslySetInnerHTML={{ __html: card.back }}
                />
              </p>
              <p className="text-sm">
                Score: {card.score} | Correct: {card.correct_count} | Incorrect:{" "}
                {card.incorrect_count}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingId(card.id)}
                  className="border px-3 py-1"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => void onDelete(card.id)}
                  className="border px-3 py-1"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
