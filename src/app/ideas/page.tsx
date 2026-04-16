"use client";

import { useEffect, useState } from "react";
import IdeasDatabase from "@/components/IdeasDatabaseDynamic";
import type { StartupIdea } from "@/types";

export default function IdeasPage() {
  const [ideas, setIdeas] = useState<StartupIdea[]>([]); // start with mock
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/ideas")
      .then((r) => r.json())
      .then((d: { ideas?: StartupIdea[] }) => {
        if (d.ideas && d.ideas.length > 0) setIdeas(d.ideas);
      })
      .catch(() => {}) // keep mock on error
      .finally(() => setLoading(false));
  }, []);

  return (
    <div
      className="min-h-screen px-4 py-6 sm:px-6 sm:py-8"
      style={{ backgroundColor: "#0A0A0B" }}
    >
      <h1
        className="text-xl sm:text-2xl font-semibold mb-1"
        style={{ color: "rgba(255,255,255,0.95)" }}
      >
        Ideas Database
      </h1>
      {loading && (
        <div
          className="mb-5 text-[11px]"
          style={{ color: "rgba(255,255,255,0.3)" }}
        >
          Syncing from database…
        </div>
      )}
      {!loading && <div className="mb-6" />}
      <IdeasDatabase ideas={ideas} />
    </div>
  );
}
