import { useState } from "react";

import { ManagePage } from "./pages/ManagePage";
import { StudyPage } from "./pages/StudyPage";

type View = "study" | "manage";

function App() {
  const [view, setView] = useState<View>("study");

  return (
    <main className="mx-auto max-w-3xl space-y-4 p-4">
      <h1 className="text-xl">Flashcards</h1>
      <nav className="flex gap-2">
        <button
          type="button"
          className="border px-3 py-1"
          onClick={() => setView("study")}
        >
          Study
        </button>
        <button
          type="button"
          className="border px-3 py-1"
          onClick={() => setView("manage")}
        >
          Manage
        </button>
      </nav>
      {view === "study" ? <StudyPage /> : <ManagePage />}
    </main>
  );
}

export default App;
