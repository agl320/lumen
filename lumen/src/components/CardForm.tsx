import { useState } from "react";
import { RichTextEditor } from "./RichTextEditor";

import type { Card, CardPayload } from "../types";

interface CardFormProps {
  initial?: Card;
  onSubmit: (payload: CardPayload) => Promise<void>;
  onCancel?: () => void;
}

export function CardForm({ initial, onSubmit, onCancel }: CardFormProps) {
  const [front, setFront] = useState(initial?.front ?? "");
  const [back, setBack] = useState(initial?.back ?? "");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const trimmedFront = front.trim();
    const trimmedBack = back.trim();

    if (!trimmedFront || !trimmedBack) {
      return;
    }

    setIsSaving(true);
    try {
      await onSubmit({ front: trimmedFront, back: trimmedBack });
      if (!initial) {
        setFront("");
        setBack("");
      }
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 border p-3">
      <div className="space-y-1">
        <label htmlFor="front" className="block text-sm">
          Front
        </label>
        <RichTextEditor content={front} onChange={setFront} />
      </div>
      <div className="space-y-1">
        <label htmlFor="back" className="block text-sm">
          Back
        </label>
        <RichTextEditor content={back} onChange={setBack} />
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={isSaving} className="border px-3 py-1">
          {initial ? "Save" : "Add"}
        </button>
        {onCancel ? (
          <button type="button" onClick={onCancel} className="border px-3 py-1">
            Cancel
          </button>
        ) : null}
      </div>
    </form>
  );
}
