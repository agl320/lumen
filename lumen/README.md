# Lumen Flashcards

Minimal flashcards app with:

- React + TypeScript + Tailwind (barebones UI)
- FastAPI backend
- SQLite persistence
- Weighted review frequency based on correctness

## Features

- Add, edit, delete cards
- Shuffle card list on the manage page
- Study page with answer reveal
- Correct/incorrect tracking per card
- Frequency boost for weaker cards

## Weighted Frequency Logic

Each card stores a `score`.

- Correct answer: `score += 1`
- Incorrect answer: `score -= 2`

The next study card is selected by weighted random where lower score means higher weight. This makes frequently missed cards appear more often.

## Run

1. Frontend dependencies:

   ```bash
   npm install
   ```

2. Python dependencies:

   ```bash
   pip install -r server/requirements.txt
   ```

3. Optional manual DB setup (FastAPI startup also initializes automatically):

   ```bash
   python src/data/table_setup.py
   ```

4. Start backend:

   ```bash
   npm run dev:api
   ```

5. Start frontend:

   ```bash
   npm run dev
   ```

Frontend runs on `http://localhost:5173` and backend on `http://127.0.0.1:8000`.
