"use client";

import { Search } from "lucide-react";
import { useState } from "react";

export default function SearchPage() {
  const [query, setQuery] = useState("");

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1
        className="text-2xl font-semibold mb-2"
        style={{ color: "rgba(255,255,255,0.95)" }}
      >
        Search
      </h1>
      <p className="text-sm mb-6" style={{ color: "rgba(255,255,255,0.45)" }}>
        Search across ideas, failures, and patterns
      </p>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          background: "#111113",
          border: "1px solid rgba(255,255,255,0.12)",
          borderRadius: 12,
          padding: "12px 16px",
        }}
      >
        <Search
          size={16}
          style={{ color: "rgba(255,255,255,0.4)", flexShrink: 0 }}
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search ideas, companies, failure modes..."
          style={{
            background: "transparent",
            border: "none",
            outline: "none",
            color: "rgba(255,255,255,0.9)",
            fontSize: 14,
            width: "100%",
          }}
        />
      </div>
      <p
        className="text-sm mt-8 text-center"
        style={{ color: "rgba(255,255,255,0.25)" }}
      >
        Full search coming soon — ideas and failures database will be searchable
        here.
      </p>
    </div>
  );
}
