from __future__ import annotations

import random
from typing import Any

from fastapi import FastAPI, HTTPException, Response
from fastapi.middleware.cors import CORSMiddleware

from .db import get_connection, init_db
from .schemas import Card, CardCreate, CardUpdate, ReviewResult

app = FastAPI(title="Lumen Flashcards")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    init_db()


def row_to_card(row: Any) -> Card:
    return Card(**dict(row))


def card_weight(score: int) -> int:
    # Lower scores represent weaker cards and therefore higher sampling priority.
    return max(1, 4 + (-2 * score))


@app.get("/health")
def health() -> dict[str, bool]:
    return {"ok": True}


@app.get("/cards", response_model=list[Card])
def list_cards(shuffle: bool = False) -> list[Card]:
    query = "SELECT * FROM cards"
    query += " ORDER BY RANDOM()" if shuffle else " ORDER BY id ASC"

    with get_connection() as connection:
        rows = connection.execute(query).fetchall()

    return [row_to_card(row) for row in rows]


@app.get("/cards/next", response_model=Card | None)
def next_card() -> Card | None:
    with get_connection() as connection:
        rows = connection.execute("SELECT * FROM cards").fetchall()

    if not rows:
        return None

    weights = [card_weight(row["score"]) for row in rows]
    selected = random.choices(rows, weights=weights, k=1)[0]
    return row_to_card(selected)


@app.post("/cards", response_model=Card, status_code=201)
def create_card(payload: CardCreate) -> Card:
    with get_connection() as connection:
        cursor = connection.execute(
            "INSERT INTO cards(front, back) VALUES(?, ?)",
            (payload.front.strip(), payload.back.strip()),
        )
        connection.commit()

        row = connection.execute(
            "SELECT * FROM cards WHERE id = ?",
            (cursor.lastrowid,),
        ).fetchone()

    if row is None:
        raise HTTPException(status_code=500, detail="Failed to create card")

    return row_to_card(row)


@app.put("/cards/{card_id}", response_model=Card)
def update_card(card_id: int, payload: CardUpdate) -> Card:
    with get_connection() as connection:
        cursor = connection.execute(
            """
            UPDATE cards
            SET front = ?, back = ?, updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            """,
            (payload.front.strip(), payload.back.strip(), card_id),
        )
        connection.commit()

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Card not found")

        row = connection.execute(
            "SELECT * FROM cards WHERE id = ?", (card_id,)
        ).fetchone()

    if row is None:
        raise HTTPException(status_code=404, detail="Card not found")

    return row_to_card(row)


@app.delete("/cards/{card_id}", status_code=204, response_class=Response)
def delete_card(card_id: int) -> Response:
    with get_connection() as connection:
        cursor = connection.execute("DELETE FROM cards WHERE id = ?", (card_id,))
        connection.commit()

    if cursor.rowcount == 0:
        raise HTTPException(status_code=404, detail="Card not found")

    return Response(status_code=204)


@app.post("/cards/{card_id}/review", response_model=Card)
def review_card(card_id: int, payload: ReviewResult) -> Card:
    if payload.result == "correct":
        score_delta = 1
        correct_delta = 1
        incorrect_delta = 0
    else:
        score_delta = -2
        correct_delta = 0
        incorrect_delta = 1

    with get_connection() as connection:
        cursor = connection.execute(
            """
            UPDATE cards
            SET score = score + ?,
                correct_count = correct_count + ?,
                incorrect_count = incorrect_count + ?,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = ?
            """,
            (score_delta, correct_delta, incorrect_delta, card_id),
        )
        connection.commit()

        if cursor.rowcount == 0:
            raise HTTPException(status_code=404, detail="Card not found")

        row = connection.execute(
            "SELECT * FROM cards WHERE id = ?", (card_id,)
        ).fetchone()

    if row is None:
        raise HTTPException(status_code=404, detail="Card not found")

    return row_to_card(row)
