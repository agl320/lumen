from __future__ import annotations

from typing import Literal

from pydantic import BaseModel, Field


class CardBase(BaseModel):
    front: str = Field(min_length=1)
    back: str = Field(min_length=1)


class CardCreate(CardBase):
    pass


class CardUpdate(CardBase):
    pass


class Card(CardBase):
    id: int
    score: int
    correct_count: int
    incorrect_count: int
    created_at: str
    updated_at: str


class ReviewResult(BaseModel):
    result: Literal["correct", "incorrect"]
