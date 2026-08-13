export type ReviewResult = "correct" | "incorrect";

export interface Card {
  id: number;
  front: string;
  back: string;
  score: number;
  correct_count: number;
  incorrect_count: number;
  created_at: string;
  updated_at: string;
}

export interface CardPayload {
  front: string;
  back: string;
}
