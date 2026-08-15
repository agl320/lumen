import { useState } from "react";

import { ManagePage } from "./pages/ManagePage";
import { StudyPage } from "./pages/StudyPage";

type View = "study" | "manage";

function App() {
  const [view, setView] = useState<View>("study");

  return (
    <main className="w-full min-h-screen space-y-4 p-4 bg-zinc-200">
      <nav className="flex gap-2 max-w-3xl mx-auto">
        <h1 className="text-xl">Lumen</h1>
        <button
          type="button"
          className="bg-white rounded-lg px-3 py-1 text-zinc-700 text-sm"
          onClick={() => setView("study")}
        >
          Study
        </button>
        <button
          type="button"
          className="bg-white rounded-lg px-3 py-1 text-zinc-700 text-sm"
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
